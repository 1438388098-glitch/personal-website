// 扫描站内文案的文风红线：破折号（——）、工程黑话禁词、「不是A而是B」句式堆叠。命中即失败。
// 豁免：src/content/notes 是定稿论文笔记，体例单独约定不进本扫描；
//      《书名号》整段剥除后再扫（论文标题等引用自带原文用词，如标题含「赋能」）。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const roots = ['src/content', 'src/pages', 'src/components', 'src/layouts'];
const exts = new Set(['.md', '.mdx', '.astro']);
const exemptDirs = new Set(['src/content/notes']);

const hardPatterns = [
  [/——+/g, '破折号（——）：改冒号、逗号或句号（单个连接号 — 不拦）'],
  [/闭环/g, '工程黑话「闭环」：改「流程」「走完」等平实说法'],
  [/中台/g, '工程黑话「中台」'],
  [/赋能/g, '工程黑话「赋能」'],
  [/抓手/g, '工程黑话「抓手」'],
];
/* 「不是A，而是B」偶一处是自然转折，同文件堆叠（超过 1 处）才算 AI 腔 */
const stackPattern = /不是[^。\n]{1,24}(，而是|而是|，是)/g;
const STACK_LIMIT = 1;

const files = [];
function walk(dir) {
  if (exemptDirs.has(dir.replace(/\\/g, '/'))) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(name))) files.push(p);
  }
}
roots.forEach((r) => walk(r));

let hits = 0;
for (const file of files) {
  /* frontmatter 体例：.md 首行必须是标准三连字符（六连字符等变体会破坏按行解析的脚本；兼容 CRLF） */
  if (extname(file) === '.md' && readFileSync(file, 'utf8').split(/\r?\n/, 1)[0] !== '---') {
    console.error(`frontmatter 首行必须是 ---: ${file}`);
    hits++;
  }
  /* 书名号引用先剥除：标题是别人的文本，不替别人改稿 */
  const content = readFileSync(file, 'utf8').replace(/《[^》]*》/g, (m) => '·'.repeat(m.length));
  for (const [re, label] of hardPatterns) {
    for (const hit of content.matchAll(re)) {
      const line = content.slice(0, hit.index).split('\n').length;
      const snippet = hit[0].slice(0, 16);
      console.error(`${label}: ${file}:${line}（${snippet}…）`);
      hits++;
    }
  }
  const stacks = [...content.matchAll(stackPattern)];
  if (stacks.length > STACK_LIMIT) {
    for (const hit of stacks) {
      const line = content.slice(0, hit.index).split('\n').length;
      console.error(`「不是…而是」句式堆叠（${stacks.length} 处）: ${file}:${line}`);
      hits++;
    }
  }
}
if (hits > 0) { process.exit(1); }
console.log(`文风红线扫描通过：${files.length} 个文件无命中。`);
