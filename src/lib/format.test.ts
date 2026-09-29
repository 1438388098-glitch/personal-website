import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('按 UTC 语义格式化 ISO 日期，不受本机时区影响', () => {
    expect(formatDate(new Date('2026-09-29'))).toBe('2026 年 9 月 29 日');
    expect(formatDate(new Date(Date.UTC(2026, 0, 5)))).toBe('2026 年 1 月 5 日');
  });
});
