// 内容一致性门禁：文件名日期前缀必须等于 frontmatter 日期。
// posts 校验 pubDate（定时发布机制由它驱动，slug 说谎比死链更伤可信度）；exam/notes 校验 date。
// 纯函数导出供 gates 测试消费；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const rules = [
  { dir: 'src/content/posts', dateField: 'pubDate' },
  { dir: 'src/content/exam', dateField: 'date' },
  { dir: 'src/content/notes', dateField: 'date' },
];

/** 文件名前缀日期：YYYY-MM-DD-slug.md -> 'YYYY-MM-DD'；无前缀返回 null */
export function slugDate(filename) {
  const m = /^(\d{4}-\d{2}-\d{2})-/.exec(filename);
  return m ? m[1] : null;
}

/** 从 frontmatter 文本提取日期字段的 YYYY-MM-DD */
export function frontDate(content, field) {
  const m = new RegExp(`^${field}:\\s*(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(content);
  return m ? m[1] : null;
}

/** 对一组 {name, content} 跑一致性检查，返回违规说明列表 */
export function checkEntries(entries, dateField) {
  const bad = [];
  for (const { name, content } of entries) {
    const slug = slugDate(name);
    if (!slug) continue; /* 无日期前缀的文件不管（如 .gitkeep） */
    const front = frontDate(content, dateField);
    if (front === null) bad.push(`${name}: frontmatter 缺 ${dateField}`);
    else if (front !== slug) bad.push(`${name}: 文件名前缀 ${slug} ≠ ${dateField} ${front}`);
  }
  return bad;
}

function main() {
  const bad = [];
  for (const { dir, dateField } of rules) {
    const entries = readdirSync(dir)
      .filter((n) => n.endsWith('.md'))
      .map((n) => ({ name: n, content: readFileSync(join(dir, n), 'utf8') }));
    bad.push(...checkEntries(entries, dateField).map((msg) => `${dir}/${msg}`));
  }
  if (bad.length > 0) {
    console.error(`内容日期一致性违规 ${bad.length} 处：\n${bad.join('\n')}`);
    process.exit(1);
  }
  console.log('内容日期一致性通过：posts/exam/notes 文件名前缀与 frontmatter 日期全部一致。');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
