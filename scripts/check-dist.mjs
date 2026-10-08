// @ts-check
// 产物冒烟：运营必需资产存在 + 产物后处理确实发生。CI 在 build 之后、check:links 之前运行。
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFaces, visibleText } from './subset-fonts.mjs';

const dist = resolve('dist');

/* 字体总量预算（KB）：subset-fonts 把每个分片压到「站内真的用到的字」后约 690KB。
   留一倍余量：内容增长会推高它，但绝不该回到子集化之前的 4.4MB。
   上限的意义是「subset-fonts 没跑」这类静默失效——宽 range 一样能覆盖全站字符，
   覆盖断言看不出来，只有字节数会立刻爆表。 */
const FONT_BUDGET_KB = 1400;

  /* 必需资产：运营与分发依赖它们，构建成功不等于它们在 */
  const required = [
    'feed.xml',
    'sitemap-index.xml',
    '404.html',
    'og-default.png',
    'og-default-en.png',
    'search/index.html',
    /* robots.txt 由 src/pages/robots.txt.js 端点生成，仍落在 dist 根 */
    'robots.txt',
    'favicon.svg',
    'site.webmanifest',
    'apple-touch-icon.png',
    /* 搜索索引独立成端点后必须是非空 JSON 数组；空数组/字段漂移会让站点静默「搜不到东西」 */
    'search-index.json',
    /* en 版必需资产（双语骨架）：英文首页、英文订阅源、英文搜索索引，以及 exam/notes 两个板块的入口 */
    'en/index.html',
    'en/feed.xml',
    'en/search-index.json',
    'en/exam/index.html',
    'en/notes/index.html',
  ];

/* 字体管线断言：trim-dist 应把 dist/_astro 下的 .woff 全删（递归，含子目录）。
   产物里还有 .woff 说明 trim-dist 未生效或目录结构变了。 */
function countWoff() {
  const astro = join(dist, '_astro');
  if (!existsSync(astro)) return 0; /* 无 _astro 目录即无字体产物，交由 required 其余断言兜底 */
  let n = 0;
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.woff')) n++;
    }
  })(astro);
  return n;
}

/* 产物后处理断言：anchor-links 集成与 trim-dist 都是副作用，必须验证副作用真的发生 */
function countAnchors() {
  let n = 0;
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) n += (readFileSync(p, 'utf8').match(/class="anchor"/g) || []).length;
    }
  })(dist);
  return n;
}

/* 首页数字面板不得有空格：面板取数靠「项目 frontmatter 里的指标标签精确匹配」，
   标签一旦改写而页面没跟着改，那一行会静默渲染成空 span——构建照样成功、页面看不出来。 */
function emptyNumberRows() {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  return (html.match(/class="v mono"[^>]*>\s*<\/span>/g) || []).length;
}

/* 搜索索引门禁：索引是独立端点 /search-index.json，required 只能断言文件存在。
   若 collectSearchDocs 的集合过滤把全部文档滤掉，产物会是 []，构建与门禁都照常通过，
   站点静默变成「搜不到任何东西」。这里读产物 JSON，必须是非空数组。 */
function searchIndexCount() {
  const p = join(dist, 'search-index.json');
  if (!existsSync(p)) return -1; /* 缺失已由 required 报错，避免这里二次抛错 */
  const parsed = JSON.parse(readFileSync(p, 'utf8'));
  if (!Array.isArray(parsed) || parsed.length === 0) {
    console.error('搜索索引为空，检查 collectSearchDocs 的集合过滤（isPublished/isVisible）');
    return -1;
  }
  return parsed.length;
}

/* ---- 双语骨架断言：en 页面的语言属性与汉字渗漏 ----
   品牌名「胡圣炜」按 v3 设计在 en 页页头与 meta 里保留（双语品牌行），是唯一豁免词。
   正文里的代码字面量（legal-job-tracker 的日期关键词、pdf 翻译器的输出格式）与
   check-i18n 的 CJK_ALLOWLIST 同源豁免——两道网必须认同一批合法字面量，否则永远对不齐。 */
/** @type {[string, string[]][]} */
const EN_PAGE_CJK_ALLOW = [
  ['en/projects/legal-job-tracker/index.html', ['截止', '报名', '申请']],
  ['en/projects/pdf-legal-zh-translator/index.html', ['中文']],
];

/** 项目字体栈里没有任何 webfont 覆盖的字符：它们一直走系统字体回退，不是子集化造成的。
    已核对：Noto Sans SC(101 块) / Archivo(3) / Space Mono 400+700(各 3) 的全部 unicode-range
    都不含 U+0370–03FF，即 α/κ/γ 从未由 webfont 渲染过（项目页里的希腊字母沿用系统字体）。
    将来若引入带 Greek 的字族，这几条要从名单里删掉，让门禁重新接管。 */
const NO_WEBFONT_COVER = new Set(['α', 'β', 'γ', 'κ', 'μ', 'σ', 'λ', 'θ', 'π']);

/** 收集 dist/en 下全部 HTML（相对路径） */
function enHtmlFiles() {
  const base = join(dist, 'en');
  if (!existsSync(base)) return [];
  const out = [];
  (function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  })(base);
  return out;
}

/** en 页面检查：html lang=en、（有 hreflang 或 noindex）、可见文本无汉字渗漏。返回违规列表。
   扫描语义是「可见文本」：先剥 script/style（内联脚本注释随包发布但不可见）与全部标签
   （tag 页的 href 里的中文受控词 ID 是 URL，不是文本），再扫汉字。
 * @param {string} html
 * @param {string} relPath
 * @returns {string[]} */
export function checkEnPage(html, relPath) {
  const issues = [];
  if (!/<html lang="en"/.test(html)) issues.push(`${relPath}: html lang 不是 en`);
  const paired = /rel="alternate" hreflang=/.test(html);
  const noindex = /name="robots" content="noindex"/.test(html);
  if (!paired && !noindex) issues.push(`${relPath}: 无 hreflang 也不带 noindex（配对或豁免必须占一头）`);
  /** @type {string[]} */
  const allowed = EN_PAGE_CJK_ALLOW.find(([p]) => p === relPath.replaceAll('\\', '/'))?.[1] ?? [];
  /* 语言切换器按 i18n 惯例显示目标语言自称（en 页显示「中文」），先剥再扫；
     白名单字面量与 check-i18n 的 CJK_ALLOWLIST 同源（代码匹配串/输出格式），逐个剥除 */
  let visible = html
    .replace(/<a class="lang-switch"[\s\S]*?<\/a>/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/胡圣炜/g, '')
    .replace(/《[^》]*》/g, '');
  for (const w of allowed) visible = visible.replaceAll(w, '');
  const leak = /[\u4e00-\u9fff]+/.exec(visible);
  if (leak) issues.push(`${relPath}: en 页面汉字渗漏「${leak[0].slice(0, 20)}」`);
  return issues;
}

function enChecks() {
  const issues = [];
  const files = enHtmlFiles();
  if (files.length === 0) {
    issues.push('dist/en 不存在或没有 HTML：双语骨架未构建');
    return issues;
  }
  for (const f of files) {
    issues.push(...checkEnPage(readFileSync(f, 'utf8'), f.slice(dist.length + 1)));
  }
  /* en 搜索索引必须非空（zh 同款断言见 searchIndexCount） */
  const p = join(dist, 'en', 'search-index.json');
  if (existsSync(p)) {
    const parsed = JSON.parse(readFileSync(p, 'utf8'));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      issues.push('en 搜索索引为空：collectSearchDocsEn 的集合过滤失效');
    }
  }
  return issues;
}

/** 递归列出 root 下全部 .html
 * @param {string} root
 * @returns {string[]} */
function walkHtml(root) {
  /** @type {string[]} */
  const out = [];
  if (!existsSync(root)) return out;
  (function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  })(root);
  return out;
}

/** 字体门禁：① 每个 @font-face 指向的文件必须在产物里；② 页面可见文本的每个字符
    都要落在某个已发布字体的 unicode-range 内（NO_WEBFONT_COVER 除外）；③ 字体总量不超预算。
    子集化把 range 收窄到「站内实际用到的字」，所以 ② 是「收窄没有误伤」的独立复算：
    若哪天语料口径被改窄（例如漏扫某类产物），页面上的字就会掉出 range，这里立刻报错。
 * @returns {string[]} */
export function fontIssues() {
  const issues = [];
  const astroDir = join(dist, '_astro');
  if (!existsSync(astroDir)) return ['dist/_astro 不存在：字体管线未产出'];

  /** @type {[number, number][]} */
  const covered = [];
  let bytes = 0;
  let faces = 0;
  for (const name of readdirSync(astroDir)) {
    if (!name.endsWith('.css')) continue;
    for (const face of parseFaces(readFileSync(join(astroDir, name), 'utf8'))) {
      if (!face.url) continue;
      const abs = join(dist, face.url);
      if (!existsSync(abs)) {
        issues.push(`CSS 引用的字体文件缺失：${face.url}`);
        continue;
      }
      bytes += statSync(abs).size;
      covered.push(...face.ranges);
      faces++;
    }
  }
  if (faces === 0) issues.push('产物里没有任何本地 @font-face：字体管线口径变了');

  const kb = Math.round(bytes / 1024);
  if (kb > FONT_BUDGET_KB) {
    issues.push(`字体总量 ${kb}KB 超出预算 ${FONT_BUDGET_KB}KB：subset-fonts 可能没跑（构建脚本最后一步）`);
  }

  /** @param {number} c */
  const inCovered = (c) => covered.some(([lo, hi]) => c >= lo && c <= hi);
  const missed = new Map();
  for (const file of walkHtml(dist)) {
    const text = visibleText(readFileSync(file, 'utf8'));
    for (const ch of text) {
      /* 空白与 ASCII 不判：西文栈最外层还有系统字体兜底，判它们只会制造噪音 */
      const c = ch.codePointAt(0) ?? 0;
      if (c < 0x80 || /\s/.test(ch)) continue;
      if (NO_WEBFONT_COVER.has(ch)) continue;
      if (inCovered(c)) continue;
      const rel = file.slice(dist.length + 1);
      if (!missed.has(rel)) missed.set(rel, []);
      const list = missed.get(rel);
      if (list.length < 5 && !list.includes(ch)) list.push(ch);
    }
  }
  for (const [rel, chars] of missed) {
    issues.push(`${rel}: 有 ${chars.length >= 5 ? '多个' : ''}字符没有字体覆盖「${chars.join('')}」——子集化收窄误伤或内容新增了未入子集分片的字`);
  }
  return issues;
}

function main() {
  let errors = 0;
  for (const f of required) {
    if (!existsSync(join(dist, f))) {
      console.error(`缺产物: ${f}`);
      errors++;
    }
  }
  const docs = searchIndexCount();
  if (docs < 0) errors++;
  const anchors = countAnchors();
  if (anchors === 0) {
    console.error('标题锚链注入数为 0：anchor-links 集成未生效');
    errors++;
  }
  const empty = emptyNumberRows();
  if (empty > 0) {
    console.error(`首页数字面板有 ${empty} 行取值为空：检查 index.astro 的 metricOf 标签与项目 frontmatter 是否还对得上`);
    errors++;
  }
  const woff = countWoff();
  if (woff > 0) {
    console.error(`dist/_astro 下残留 ${woff} 个 .woff：trim-dist 未生效或字体管线回归`);
    errors++;
  }
  for (const issue of fontIssues()) {
    console.error(`字体门禁: ${issue}`);
    errors++;
  }
  for (const issue of enChecks()) {
    console.error(`en 门禁: ${issue}`);
    errors++;
  }
  if (errors > 0) process.exit(1);
  console.log(`产物冒烟通过：必需资产齐全，无 .woff 残留，锚链 ${anchors} 处，搜索索引 ${docs} 条，字体覆盖与预算通过，en 页 ${enHtmlFiles().length} 页双语断言通过。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
