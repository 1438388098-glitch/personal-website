import { describe, it, expect } from 'vitest';
import { isPublished } from './publish';

const entry = (draft: boolean, pubDate: string) => ({
  data: { draft, pubDate: new Date(pubDate) },
});

describe('isPublished 定时发布谓词', () => {
  it('草稿不发布，即使已过发布时间', () => {
    expect(isPublished(entry(true, '2020-01-01'))).toBe(false);
  });

  it('未到 pubDate 的文章不发布', () => {
    expect(isPublished(entry(false, '9999-12-31'))).toBe(false);
  });

  it('已到 pubDate 的非草稿发布', () => {
    expect(isPublished(entry(false, '2020-01-01'))).toBe(true);
  });
});
