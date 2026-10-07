// @ts-check
/* 构建后处理：把 dist/_astro 下的 webfont 按「站内实际用到的字符」做子集化。
 *
 * 为什么必须做：Noto Sans SC 的 120 个 unicode-range 分片按码位切分，每片 45–77KB。
 * 而汉字的分布极散——一个博文页会命中二十多个分片，首访要为约 1.4MB 字体买单，
 * 首页光「胡圣炜」三个字就要拉三个分片（167KB）。站点实际用到的字符不到 2100 个，
 * 把每片压到「该片范围内站内真的用到的字」之后，同样的分片结构还在（按需加载不变），
 * 但每片的字节数随命中字形数走。
 *
 * 口径：语料取 dist 下全部文本类文件的**原始字节**（不剥标签、不剥 <script>）。
 * 宁可多留几个只出现在脚本里的字形，也不能漏掉浏览器会渲染的字符——
 * 多留的代价是几十字节，漏掉的代价是正文掉进系统字体、版面变形。
 *
 * 顺序：astro build → trim-dist → 本脚本。必须在 trim-dist 之后跑，
 * 否则会子集化即将被删掉的非 CJK 切片（白做且报数不准）。
 */
import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import subsetFont from 'subset-font';

const dist = resolve('dist');
const astroDir = join(dist, '_astro');

/* 语料只吃文本类文件：字体/图片是二进制，读进来只会污染码位集合 */
const TEXT_EXT = ['.html', '.json', '.xml', '.txt', '.css', '.js', '.mjs', '.webmanifest', '.svg'];

/** 递归列出 root 下全部文件
 * @param {string} root
 * @returns {string[]} */
function walkFiles(root) {
  /** @type {string[]} */
  const out = [];
  (function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(p);
    }
  })(root);
  return out;
}

/** 站内实际会出现的全部码位（保守口径：dist 文本文件的原始字符，不剥标签不剥脚本）
 * @param {string[]} files
 * @returns {Set<number>} */
export function collectUsedCodePoints(files) {
  const used = new Set();
  for (const f of files) {
    if (!TEXT_EXT.some((e) => f.endsWith(e))) continue;
    /* 只统计码位，不构造字符串——单文件几十万字符时逐字符 push 会明显拖慢构建 */
    for (const ch of readFileSync(f, 'utf8')) used.add(ch.codePointAt(0) ?? 0);
  }
  return used;
}

/** 只取可见文本（剥 script/style 与标签），仅用于报数，不参与口径 
 * @param {string} html
 * @returns {string} */
export function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

/** 解析 unicode-range 值成 [lo, hi] 区间数组
 * @param {string} value
 * @returns {[number, number][]} */
export function parseUnicodeRange(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((r) => {
      const [a, z] = r.replace(/^U\+/i, '').split('-');
      const lo = parseInt(a, 16);
      return /** @type {[number, number]} */ ([lo, z ? parseInt(z, 16) : lo]);
    });
}

/** 把码位集合压成 unicode-range 文本（连续段合并成 U+a-b），空集返回 ''
 * @param {Iterable<number>} cps
 * @returns {string} */
export function formatUnicodeRange(cps) {
  const sorted = [...cps].sort((a, b) => a - b);
  /** @type {string[]} */
  const parts = [];
  let start = -1;
  let prev = -1;
  for (const c of sorted) {
    if (start < 0) { start = c; prev = c; continue; }
    if (c === prev + 1) { prev = c; continue; }
    parts.push(start === prev ? `U+${start.toString(16)}` : `U+${start.toString(16)}-${prev.toString(16)}`);
    start = c;
    prev = c;
  }
  if (start >= 0) parts.push(start === prev ? `U+${start.toString(16)}` : `U+${start.toString(16)}-${prev.toString(16)}`);
  return parts.join(',');
}

/** 取 [lo,hi] 区间集合里、同时也在 used 中的码位
 * @param {[number, number][]} ranges
 * @param {Set<number>} used
 * @returns {number[]} */
export function intersect(ranges, used) {
  const out = [];
  for (const c of used) {
    if (ranges.some(([lo, hi]) => c >= lo && c <= hi)) out.push(c);
  }
  return out;
}

const FACE_RE = /@font-face\s*\{([^}]*)\}/g;

/** 从 CSS 文本里取全部 @font-face 块（含起止下标，便于原地替换）
 * @param {string} css
 * @returns {{body: string, start: number, end: number, url: string | null, ranges: [number, number][]}[]} */
export function parseFaces(css) {
  const out = [];
  for (const m of css.matchAll(FACE_RE)) {
    const body = m[1];
    /* 只处理本地字体文件：外链字体不归本站部署管线管 */
    const url = /url\((['"]?)(\/_astro\/[^'")]+\.woff2)\1\)/.exec(body)?.[2] ?? null;
    const rangeText = /unicode-range:\s*([^;}]+)/.exec(body)?.[1] ?? '';
    out.push({
      body,
      start: m.index ?? 0,
      end: (m.index ?? 0) + m[0].length,
      url,
      ranges: parseUnicodeRange(rangeText),
    });
  }
  return out;
}

async function main() {
  const files = walkFiles(dist);
  const used = collectUsedCodePoints(files);

  const htmlFiles = files.filter((f) => f.endsWith('.html'));
  const visible = new Set();
  for (const f of htmlFiles) for (const ch of visibleText(readFileSync(f, 'utf8'))) visible.add(ch.codePointAt(0) ?? 0);

  /* 采样对照：可见文本码位数应显著小于原始字节口径，两者差得离谱说明口径写歪了 */
  console.log(
    `subset-fonts: 语料口径 ${used.size} 个码位（其中可见文本 ${visible.size} 个），扫描 ${files.length} 个产物文件。`,
  );

  const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith('.css')).map((f) => join(astroDir, f));
  /** @type {Map<string, {path: string, blocks: {start: number, end: number}[], ranges: [number, number][]}>} */
  const byFile = new Map();
  /** @type {Map<string, string>} */
  const cssText = new Map();

  for (const cssPath of cssFiles) {
    const css = readFileSync(cssPath, 'utf8');
    cssText.set(cssPath, css);
    for (const face of parseFaces(css)) {
      if (!face.url) continue;
      const abs = join(dist, face.url);
      const entry = byFile.get(abs) ?? { path: abs, blocks: [], ranges: [] };
      /* 同一文件可能被多个 @font-face 引用（不同 weight/style 声明）：range 取并集，块逐个记录 */
      entry.blocks.push({ start: face.start, end: face.end });
      entry.ranges.push(...face.ranges);
      byFile.set(abs, entry);
    }
  }

  if (byFile.size === 0) {
    console.error('subset-fonts: 没有找到任何本地 @font-face 声明，字体管线口径变了，请核对');
    process.exit(1);
  }

  let kept = 0;
  let removed = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;
  /** @type {Map<string, number[]>} */
  const retainedByFile = new Map();

  for (const [abs, entry] of byFile) {
    if (!statSync(abs, { throwIfNoEntry: false })) {
      console.error(`subset-fonts: CSS 引用的字体文件不存在：${abs}`);
      process.exit(1);
    }
    bytesBefore += statSync(abs).size;
    const keep = intersect(entry.ranges, used);
    if (keep.length === 0) {
      /* 整片站内一个字符都不用：删文件 + 稍后连 @font-face 块一起抹掉 */
      unlinkSync(abs);
      retainedByFile.set(abs, []);
      removed++;
      continue;
    }
    const subset = await subsetFont(readFileSync(abs), String.fromCodePoint(...keep), { targetFormat: 'woff2' });
    writeFileSync(abs, subset);
    retainedByFile.set(abs, keep);
    bytesAfter += subset.length;
    kept++;
  }

  /* 回写 CSS：保留的块把 unicode-range 收窄到实际保留的码位（避免为一个已经没有字形覆盖的
     字符去下载该分片），整片删掉的块直接移除。 */
  let cssRewritten = 0;
  for (const [cssPath, css] of cssText) {
    const faces = parseFaces(css);
    if (faces.length === 0) continue;
    /** @type {{start: number, end: number, text: string}[]} */
    const edits = [];
    for (const face of faces) {
      if (!face.url) continue;
      const keep = retainedByFile.get(join(dist, face.url));
      if (keep === undefined) continue;
      if (keep.length === 0) {
        edits.push({ start: face.start, end: face.end, text: '' });
        continue;
      }
      const next = face.body.replace(
        /unicode-range:\s*[^;}]+/,
        `unicode-range:${formatUnicodeRange(keep)}`,
      );
      if (next === face.body) continue; /* 区间未变则不动，减少无谓改写 */
      edits.push({ start: face.start, end: face.end, text: `@font-face{${next}}` });
    }
    if (edits.length === 0) continue;
    let out = css;
    for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    writeFileSync(cssPath, out);
    cssRewritten++;
  }

  /** @param {number} n */
  const kb = (n) => Math.round(n / 1024) + 'KB';
  console.log(
    `subset-fonts: 子集化 ${kept} 个字体文件（删掉 ${removed} 个零命中分片），` +
      `字体总量 ${kb(bytesBefore)} → ${kb(bytesAfter)}，改写 ${cssRewritten} 个 CSS。`,
  );
  if (removed === 0) {
    /* 一个空分片都没有，通常说明 unicode-range 解析失败了（口径静默失效） */
    console.warn('subset-fonts: 没有任何零命中分片被删除，请确认 unicode-range 解析是否正确。');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
