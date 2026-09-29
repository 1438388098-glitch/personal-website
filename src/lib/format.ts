/** 内容日期统一按 UTC 语义格式化（frontmatter 存 ISO 日期字符串） */
export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
}
