// @ts-check
// 双语内容门禁（定制翻译检验）：en 内容与 zh 内容的结构对齐与质量红线。
// 五类检查，命中即失败：
//   1. 配对完整：每个 en 文件必有同名 zh 原稿；projects/toolbox/now 三集合还要求 zh→en 双向全覆盖。
//   2. 元数据对齐：日期、分类/分组、tags、relatedPosts、links.url 逐字段相同
//      （frontmatter 的中文枚举 ID 按设计保留，不判违规；toolbox 的 related 回链指向 /en/ 属有意差异，不查）。
//   3. 数字保真：zh 正文的全部数字（≥2 位阿拉伯数、小数、万/亿量级、汉字数字条号）必须可寻于 en 正文。
//   4. 汉字渗漏：en 正文与 frontmatter 散文字段不得出现汉字（《》书名号内豁免；枚举 ID 行豁免）。
//   5. 长度比：en 词数 / zh 汉字数在 [0.3, 1.6]，异常偏离说明漏译或掺水。
// 纯函数导出供 gates 测试消费；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ZH = 'src/content';
const EN = 'src/content-en';
/** zh→en 要求双向全覆盖的集合；posts 只要求 en⊆zh（只译代表作子集） */
const FULL_PAIR_DIRS = ['projects', 'toolbox', 'now'];
const PAIR_DIRS = [...FULL_PAIR_DIRS, 'posts'];

/** 剥 frontmatter：返回 { frontmatter, body }。首行必须是 ---（与 check-style 同一约定）。 */
export function stripFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { frontmatter: '', body: text };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { end = i; break; }
  }
  if (end < 0) return { frontmatter: '', body: text };
  return { frontmatter: lines.slice(1, end).join('\n'), body: lines.slice(end + 1).join('\n') };
}

/** 汉字数字（零一...十百千）转阿拉伯数：法条号「第一百三十三条」→ 133。非汉字数字串返回 null。 */
export function chineseNumeralsToInt(s) {
  if (!/^[零一二两三四五六七八九十百千]+$/.test(s)) return null;
  const digit = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  let total = 0, section = 0, num = 0;
  for (const ch of s) {
    if (ch in digit) { num = digit[ch]; continue; }
    if (ch === '十') { section += (num || 1) * 10; num = 0; }
    else if (ch === '百') { section += (num || 1) * 100; num = 0; }
    else if (ch === '千') { section += (num || 1) * 1000; num = 0; }
  }
  total = section + num;
  return total > 0 ? total : null;
}

/** zh 正文的「重要数字」集合：≥2 位阿拉伯数（逗号容错）、小数、万/亿量级、汉字数字条号。
    个位纯数不取（编号、序号在译文里写法自由，取了全是误报）。
    后瞻排除三类量词：万/亿走量级归一（50 万 ↔ 500k），「N 月」是月份（en 译作月名，不保留数字）。 */
export function extractZhNumbers(zhBody) {
  const nums = new Set();
  const add = (n) => { if (Number.isFinite(n)) nums.add(String(Math.round(n))); };
  /* (?!\d) 阻断回溯：否则「200 万」会被退火成「20」命中 */
  for (const m of zhBody.matchAll(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d+|\d{2,}(?!\d)(?![ \t]*(?:万|亿|月))/g)) {
    add(parseFloat(m[0].replace(/,/g, '')));
  }
  /* 量级词：50 万 → 500000；1.6 亿 → 160000000。与 en 的 500k / 160M 归一到绝对值再比对 */
  for (const m of zhBody.matchAll(/(\d+(?:\.\d+)?)\s*万/g)) add(parseFloat(m[1]) * 1e4);
  for (const m of zhBody.matchAll(/(\d+(?:\.\d+)?)\s*亿/g)) add(parseFloat(m[1]) * 1e8);
  for (const m of zhBody.matchAll(/第([零一二两三四五六七八九十百千]+)条/g)) {
    const n = chineseNumeralsToInt(m[1]);
    if (n !== null) nums.add(String(n));
  }
  return nums;
}

/** en 正文数字集合：阿拉伯数（含小数）压平，k/M/B 量级词归一到绝对值，供与 zh 比对。 */
export function extractEnNumbers(enBody) {
  const nums = new Set();
  const add = (n) => { if (Number.isFinite(n)) nums.add(String(Math.round(n))); };
  for (const m of enBody.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    add(parseFloat(m[0].replace(/,/g, '')));
  }
  /* k/M/B 与数字之间允许空格或连字符（500k、100-million、1.2M 都要命中） */
  for (const m of enBody.matchAll(/(\d+(?:\.\d+)?)[ \t-]*(?:k\b|thousand)/gi)) add(parseFloat(m[1]) * 1e3);
  for (const m of enBody.matchAll(/(\d+(?:\.\d+)?)[ \t-]*(?:m\b|million)/gi)) add(parseFloat(m[1]) * 1e6);
  for (const m of enBody.matchAll(/(\d+(?:\.\d+)?)[ \t-]*(?:b\b|billion)/gi)) add(parseFloat(m[1]) * 1e9);
  return nums;
}

/** zh 数字是否在 en 正文可寻：精确相等，或 en 含等值小数形态（92 命中 92.0）。 */
export function numberPresent(num, enNums) {
  if (enNums.has(num)) return true;
  if (/^\d+$/.test(num)) {
    for (const e of enNums) {
      if (e.startsWith(num + '.')) return true;
    }
  }
  return false;
}

/** en 正文里的汉字渗漏：《》书名号内豁免（按约定保留原文名），其余汉字逐处报违规。 */
export function cjkViolations(enBody) {
  const stripped = enBody.replace(/《[^》]*》/g, '');
  return [...stripped.matchAll(/[\u4e00-\u9fff]+/g)].map((m) => m[0].slice(0, 20));
}

/** frontmatter 单值字段（key: value 行） */
export function fmField(frontmatter, field) {
  const m = new RegExp(`^${field}:[ \\t]*(.*)$`, 'm').exec(frontmatter);
  return m ? m[1].trim() : null;
}

/** frontmatter 列表字段：行内 [a, b] 与块式 "- item" 两种形态。
    块式读到第一个非 "- " 行为止（frontmatter 内不会再有别的缩进列表语义）。 */
export function fmList(frontmatter, field) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^${field}:[ \\t]`).test(l) || l === `${field}:`);
  if (start < 0) return [];
  const inline = lines[start].slice(field.length + 1).trim();
  if (inline !== '') {
    const m = /^\[(.*)\]$/.exec(inline);
    return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [inline];
  }
  const items = [];
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^[ \t]*-[ \t]+(.+)$/.exec(lines[i]);
    if (!m) break;
    items.push(m[1].trim());
  }
  return items;
}

/** en 正文汉字白名单：字面量是代码/产物格式的一部分，译掉反而失真。
    legal-job-tracker 的三个词是日期解析代码匹配的原始字符串；
    pdf-legal-zh-translator 的「中文 (English)」是该工具术语回填的输出格式本身。 */
const CJK_ALLOWLIST = {
  'projects/legal-job-tracker.md': ['截止', '报名', '申请'],
  'projects/pdf-legal-zh-translator.md': ['中文'],
};

/** links 字段块内的 url 集合：只在 links: 行到下一个顶层键之间找，避免误吞 toolbox 的 related 回链
    （related 指向 /en/ 是有意的语言内回链，不参与比对）。 */
export function linksUrls(frontmatter) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((l) => l === 'links:' || /^links:[ \t]/.test(l));
  if (start < 0) return [];
  const zone = [lines[start]];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^[A-Za-z_]/.test(lines[i])) break;
    zone.push(lines[i]);
  }
  return [...zone.join('\n').matchAll(/url:\s*(\S+)/g)].map((m) => m[1]);
}

/** 对一对同名 zh/en 文件做全部检查，返回违规说明列表。 */
export function checkPair(name, zhText, enText) {
  const issues = [];
  const zh = stripFrontmatter(zhText);
  const en = stripFrontmatter(enText);

  /* 元数据对齐：日期与受控 ID 逐字段相同（字段缺失视为「两侧都没有」，只有一侧有才报） */
  for (const field of ['pubDate', 'date', 'category', 'group']) {
    const a = fmField(zh.frontmatter, field);
    const b = fmField(en.frontmatter, field);
    if ((a ?? '') !== (b ?? '')) issues.push(`${name}: ${field} 不一致 zh=${a ?? '∅'} en=${b ?? '∅'}`);
  }
  const zhTags = fmList(zh.frontmatter, 'tags').join('|');
  const enTags = fmList(en.frontmatter, 'tags').join('|');
  if (zhTags !== enTags) issues.push(`${name}: tags 不一致 zh=[${zhTags}] en=[${enTags}]`);
  const zhRel = fmList(zh.frontmatter, 'relatedPosts').join('|');
  const enRel = fmList(en.frontmatter, 'relatedPosts').join('|');
  if (zhRel !== enRel) issues.push(`${name}: relatedPosts 不一致 zh=[${zhRel}] en=[${enRel}]`);
  /* links 只比 URL（label 理应翻译）；related 回链指向 /en/ 属有意差异，不查 */
  const zhUrls = linksUrls(zh.frontmatter).join('|');
  const enUrls = linksUrls(en.frontmatter).join('|');
  if (zhUrls !== enUrls) issues.push(`${name}: links.url 不一致 zh=[${zhUrls}] en=[${enUrls}]`);

  /* 汉字渗漏：正文全查（白名单字面量豁免）；frontmatter 剥掉枚举/列表行后查散文 */
  const allowed = CJK_ALLOWLIST[name] ?? [];
  for (const v of cjkViolations(en.body)) {
    if (!allowed.includes(v)) issues.push(`${name}: en 正文汉字渗漏「${v}」`);
  }
  const enFmProse = en.frontmatter
    .replace(/^[ \t]*(group|category|tags|relatedPosts|related|type|status|topics):.*$/gm, '')
    .replace(/^[ \t]*-.*$/gm, '');
  for (const v of cjkViolations(enFmProse)) {
    if (!allowed.includes(v)) issues.push(`${name}: en frontmatter 汉字渗漏「${v}」`);
  }

  /* 数字保真：zh 的每个重要数字都要能在 en 正文寻到 */
  const zhNums = extractZhNumbers(zh.body);
  const enNums = extractEnNumbers(en.body);
  for (const n of zhNums) {
    if (!numberPresent(n, enNums)) issues.push(`${name}: 数字 ${n} 在 en 正文缺失`);
  }

  /* 长度比：en 词数 / zh 汉字数 ∈ [0.3, 1.6] */
  const zhHan = (zh.body.match(/[\u4e00-\u9fff]/g) || []).length;
  const enWords = (en.body.match(/[A-Za-z0-9']+/g) || []).length;
  if (zhHan > 0) {
    const ratio = enWords / zhHan;
    if (ratio < 0.3 || ratio > 1.6) {
      issues.push(`${name}: 长度比异常 ${ratio.toFixed(2)}（en ${enWords} 词 / zh ${zhHan} 字）`);
    }
  }
  return issues;
}

function listMd(base) {
  if (!existsSync(base)) return [];
  return readdirSync(base).filter((n) => n.endsWith('.md')).sort();
}

function main() {
  const issues = [];
  for (const dir of PAIR_DIRS) {
    const zhBase = join(ZH, dir);
    const enBase = join(EN, dir);
    const enFiles = listMd(enBase);
    if (enFiles.length === 0) {
      issues.push(`${dir}: en 集合为空（src/content-en/${dir}/）`);
      continue;
    }
    for (const f of enFiles) {
      const zhPath = join(zhBase, f);
      if (!existsSync(zhPath)) {
        issues.push(`${dir}/${f}: en 文件没有同名 zh 原稿（孤儿译文）`);
        continue;
      }
      issues.push(...checkPair(`${dir}/${f}`, readFileSync(zhPath, 'utf8'), readFileSync(join(enBase, f), 'utf8')));
    }
    if (FULL_PAIR_DIRS.includes(dir)) {
      for (const f of listMd(zhBase)) {
        if (!enFiles.includes(f)) issues.push(`${dir}/${f}: zh 有稿而 en 缺译文（全集集合要求双向覆盖）`);
      }
    }
  }
  if (issues.length > 0) {
    console.error(`check-i18n 失败，${issues.length} 处违规：`);
    for (const i of issues) console.error('  ' + i);
    process.exit(1);
  }
  console.log('check-i18n 通过：配对、元数据、数字、汉字渗漏、长度比全部达标。');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
