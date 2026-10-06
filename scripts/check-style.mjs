// @ts-check
// 扫描站内文案的文风红线：破折号（——）、工程黑话禁词、「不是A而是B」句式堆叠。命中即失败。
// 豁免：src/content/notes 是定稿论文笔记，体例单独约定不进本扫描；
//      《书名号》整段剥除后再扫（论文标题等引用自带原文用词，如标题含「赋能」）。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const roots = ['src/content', 'src/pages', 'src/components', 'src/layouts'];
const exts = new Set(['.md', '.mdx', '.astro']);
const exemptDirs = new Set(['src/content/notes']);

/** @type {[RegExp, string][]} */
const hardPatterns = [
  [/——+/g, '破折号（——）：改冒号、逗号或句号（单个连接号 — 不拦）'],
  [/闭环/g, '工程黑话「闭环」：改「流程」「走完」等平实说法'],
  [/中台/g, '工程黑话「中台」'],
  [/赋能/g, '工程黑话「赋能」'],
  [/抓手/g, '工程黑话「抓手」'],
  [/底层逻辑/g, '工程黑话「底层逻辑」：改「原理」「思路」'],
  [/沉淀/g, '工程黑话「沉淀」：改「收录」「留得下来」等平实说法'],
  [/颗粒度/g, '工程黑话「颗粒度」：技术语境用「粒度」'],
];
/* 「不是A，而是B」偶一处是自然转折，同文件堆叠（超过 1 处）才算 AI 腔 */
const stackPattern = /不是[^。\n]{1,24}(，而是|而是|，是)/g;
const STACK_LIMIT = 1;

/** 对一段文本跑文风红线，返回违规列表（line + label + snippet）。纯函数，gates 测试消费。
 * @param {string} rawContent
 * @param {boolean} isMd
 * @returns {{ line: number, label: string, snippet?: string }[]} */
export function scanStyle(rawContent, isMd) {
  /** @type {{ line: number, label: string, snippet?: string }[]} */
  const issues = [];
  /* frontmatter 体例：.md 首行必须是标准三连字符（六连字符等变体会破坏按行解析的脚本；兼容 CRLF） */
  if (isMd && rawContent.split(/\r?\n/, 1)[0] !== '---') {
    issues.push({ line: 1, label: 'frontmatter 首行必须是 ---' });
  }
  /* 书名号引用先剥除：标题是别人的文本，不替别人改稿 */
  const content = rawContent.replace(/《[^》]*》/g, (m) => '·'.repeat(m.length));
  for (const [re, label] of hardPatterns) {
    for (const hit of content.matchAll(re)) {
      issues.push({ line: content.slice(0, hit.index).split('\n').length, label, snippet: hit[0].slice(0, 16) });
    }
  }
  const stacks = [...content.matchAll(stackPattern)];
  if (stacks.length > STACK_LIMIT) {
    for (const hit of stacks) {
      issues.push({
        line: content.slice(0, hit.index).split('\n').length,
        label: `「不是…而是」句式堆叠（${stacks.length} 处）`,
      });
    }
  }
  return issues;
}

function main() {
  /** @type {string[]} */
  const files = [];
  /** @param {string} dir */
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
    const raw = readFileSync(file, 'utf8');
    for (const issue of scanStyle(raw, extname(file) === '.md')) {
      console.error(`${issue.label}: ${file}:${issue.line}${issue.snippet ? `（${issue.snippet}…）` : ''}`);
      hits++;
    }
  }
  if (hits > 0) { process.exit(1); }
  console.log(`文风红线扫描通过：${files.length} 个文件无命中。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
