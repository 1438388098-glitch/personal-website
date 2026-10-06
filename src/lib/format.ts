import type { Lang } from './i18n';

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

/** 内容日期按语言格式化（frontmatter 存 ISO 日期字符串，统一按 UTC 语义取年月日）：
    zh 维持「2026 年 10 月 6 日」原样（存量产物零回归），en 用「October 6, 2026」。 */
export function formatDate(date: Date, lang: Lang = 'zh'): string {
  if (lang === 'en') {
    return `${EN_MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  }
  return `${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
}
