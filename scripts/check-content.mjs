// @ts-check
// 内容一致性门禁：文件名日期前缀必须等于 frontmatter 日期。
// posts 校验 pubDate（定时发布机制由它驱动，slug 说谎比死链更伤可信度）；exam 校验 date。
// notes 按 README 约定不吃日期前缀（存量 4 篇均为 slug 名），故只比对带前缀的文件，不强制前缀。
// 纯函数导出供 gates 测试消费；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const rules = [
  { dir: 'src/content/posts', dateField: 'pubDate', requirePrefix: true },
  { dir: 'src/content/exam', dateField: 'date', requirePrefix: true },
  { dir: 'src/content/notes', dateField: 'date', requirePrefix: false },
];

/** 文件名前缀日期：YYYY-MM-DD-slug.md -> 'YYYY-MM-DD'；无前缀返回 null
 * @param {string} filename
 * @returns {string | null} */
export function slugDate(filename) {
  const m = /^(\d{4}-\d{2}-\d{2})-/.exec(filename);
  return m ? m[1] : null;
}

/** 从 frontmatter 文本提取日期字段的 YYYY-MM-DD；引号包裹的日期同样识别
 * @param {string} content
 * @param {string} field
 * @returns {string | null} */
export function frontDate(content, field) {
  const m = new RegExp(`^${field}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(content);
  return m ? m[1] : null;
}

/** 对一组 {name, content} 跑一致性检查，返回违规说明列表。
    requirePrefix=true 时，.md 漏写 YYYY-MM-DD- 前缀直接判违规（不再静默跳过）；
    非 .md（.gitkeep 等）一律忽略。
 * @param {{ name: string, content: string }[]} entries
 * @param {string} dateField
 * @param {boolean} [requirePrefix]
 * @returns {string[]} */
export function checkEntries(entries, dateField, requirePrefix = true) {
  const bad = [];
  for (const { name, content } of entries) {
    if (!name.endsWith('.md')) continue; /* .gitkeep 等非内容文件忽略 */
    const slug = slugDate(name);
    if (!slug) {
      if (requirePrefix) bad.push(`${name}: 文件名必须以 YYYY-MM-DD- 开头`);
      continue;
    }
    const front = frontDate(content, dateField);
    if (front === null) bad.push(`${name}: frontmatter 缺 ${dateField}`);
    else if (front !== slug) bad.push(`${name}: 文件名前缀 ${slug} ≠ ${dateField} ${front}`);
  }
  return bad;
}

function main() {
  const bad = [];
  for (const { dir, dateField, requirePrefix } of rules) {
    const entries = readdirSync(dir)
      .filter((n) => n.endsWith('.md'))
      .map((n) => ({ name: n, content: readFileSync(join(dir, n), 'utf8') }));
    bad.push(...checkEntries(entries, dateField, requirePrefix).map((msg) => `${dir}/${msg}`));
  }
  if (bad.length > 0) {
    console.error(`内容日期一致性违规 ${bad.length} 处：\n${bad.join('\n')}`);
    process.exit(1);
  }
  console.log('内容日期一致性通过：posts/exam 文件名前缀与 frontmatter 日期一致（notes 仅比对带前缀项）。');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
