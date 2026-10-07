// @ts-check
// 金标 C：中文产物零回归。对比基线 dist 与当前 dist 的全部 zh 页面。
// 比较口径：剥 <head> 与 script/style 后的「可见文本」+ 站内链接集合。
// 白名单（i18n 改造的有意增量）：
//   - 语言切换器 <a class="lang-switch">…</a>（新增元素，先剥再比）
//   - href 指向 /en… 的链接（切换器/配对链接带出）
// 用法：node scripts/verify-zh-dist.mjs <baselineDist> [currentDist]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const baselineDir = resolve(process.argv[2] ?? '../site-i18n-baseline/dist');
const currentDir = resolve(process.argv[3] ?? 'dist');

/** 相对路径 → html 的全量映射（只收 .html） */
export function collectHtml(root) {
  const map = {};
  (function walk(dir) {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const rel = p.slice(root.length).replaceAll('\\', '/');
        if (!rel.startsWith('/en/')) map[rel] = readFileSync(p, 'utf8');
      }
    }
  })(root);
  return map;
}

/** 可见文本：剥 head/script/style/全部标签，压缩空白 */
export function visibleText(html) {
  const body = html.replace(/<head[\s\S]*?<\/head>/i, '');
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<a class="lang-switch"[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 站内链接集合：只看 body（head 里的 _astro 哈希资源每轮构建都变，属构建噪声）；
    href/src 以 / 开头；剥锚点查询；过滤 /en 前缀（切换器带出，属有意增量）与 /_astro/ 资源。 */
export function internalLinks(html) {
  const body = html
    .replace(/<head[\s\S]*?<\/head>/i, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  const out = new Set();
  for (const m of body.matchAll(/\s(?:href|src)="(\/[^"#?]*)[^"]*"/g)) {
    if (m[1].startsWith('/en') || m[1].startsWith('/_astro/')) continue;
    out.add(m[1]);
  }
  return out;
}

/** 首处可见文本分歧的位置与前后文（调试定位用） */
export function firstDivergence(a, b) {
  const ia = visibleText(a);
  const ib = visibleText(b);
  const n = Math.min(ia.length, ib.length);
  for (let i = 0; i < n; i++) {
    if (ia[i] !== ib[i]) return `基线「…${ib.slice(Math.max(0, i - 25), i + 25)}」vs 当前「…${ia.slice(Math.max(0, i - 25), i + 25)}」`;
  }
  return ia.length !== ib.length
    ? `长度差：基线 ${ib.length} vs 当前 ${ia.length}；基线尾部「${ib.slice(n, n + 40)}」vs 当前尾部「${ia.slice(n, n + 40)}」`
    : null;
}

function main() {
  const base = collectHtml(baselineDir);
  const curr = collectHtml(currentDir);
  const issues = [];
  let same = 0;
  for (const [rel, html] of Object.entries(curr)) {
    if (!(rel in base)) { issues.push(`${rel}: 基线没有此页（新增页面，需人工确认属预期）`); continue; }
    const tDiff = visibleText(html) !== visibleText(base[rel]);
    const lDiff = [...internalLinks(html)].sort().join('|') !== [...internalLinks(base[rel])].sort().join('|');
    if (tDiff || lDiff) {
      const detail = tDiff ? '文本 ' + firstDivergence(base[rel], html) : '';
      issues.push(`${rel}: ${tDiff ? '可见文本有差异' : ''}${tDiff && lDiff ? ' + ' : ''}${lDiff ? '链接集有差异' : ''}${detail ? ' | ' + detail : ''}`);
    } else {
      same++;
    }
  }
  for (const rel of Object.keys(base)) {
    if (!(rel in curr)) issues.push(`${rel}: 当前产物缺页（中文页面被删？）`);
  }
  if (issues.length > 0) {
    console.error(`金标 C 失败，${issues.length} 处（相同 ${same} 页）：`);
    for (const i of issues) console.error('  ' + i);
    process.exit(1);
  }
  console.log(`金标 C 通过：zh 页面 ${same} 页可见文本与链接集逐字节平齐（基线 ${Object.keys(base).length} 页）。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
