// @ts-check
// 双语门禁纯函数测试：check-i18n 的提取/比对逻辑与 content-golden 的清单比对。
// 这些函数是定制翻译检验的机芯，锁住行为才敢让门禁拦人。
import { describe, expect, it } from 'vitest';
import {
  stripFrontmatter,
  chineseNumeralsToInt,
  extractZhNumbers,
  extractEnNumbers,
  numberPresent,
  cjkViolations,
  fmField,
  fmList,
  linksUrls,
  checkPair,
} from './check-i18n.mjs';
import { sha256, diffManifest } from './content-golden.mjs';

describe('check-i18n 纯函数', () => {
  it('stripFrontmatter 剥头并保留正文', () => {
    const r = stripFrontmatter('---\ntitle: x\n---\n\n正文');
    expect(r.frontmatter).toBe('title: x');
    expect(r.body).toBe('\n正文');
    expect(stripFrontmatter('无头文件').body).toBe('无头文件');
  });

  it('汉字数字条号转阿拉伯数', () => {
    expect(chineseNumeralsToInt('一百三十三')).toBe(133);
    expect(chineseNumeralsToInt('一千零二十四')).toBe(1024);
    expect(chineseNumeralsToInt('十')).toBe(10);
    expect(chineseNumeralsToInt('两')).toBe(2);
    expect(chineseNumeralsToInt('abc')).toBeNull();
    expect(chineseNumeralsToInt('123')).toBeNull();
  });

  it('zh 数字提取：量级归一、月份排除、回溯不裂', () => {
    const nums = extractZhNumbers('50 万个 token；200 万到 2 亿名；2026 年 10 月 1 日；第一百三十三条之一；25,987 条');
    expect(nums.has('500000')).toBe(true);   /* 50 万 */
    expect(nums.has('2000000')).toBe(true);  /* 200 万 */
    expect(nums.has('200000000')).toBe(true);/* 2 亿 */
    expect(nums.has('50')).toBe(false);      /* 不回溯成 50 */
    expect(nums.has('200')).toBe(false);     /* 不回溯成 200 */
    expect(nums.has('10')).toBe(false);      /* 10 月 是月份 */
    expect(nums.has('2026')).toBe(true);
    expect(nums.has('25987')).toBe(true);
    expect(nums.has('133')).toBe(true);      /* 汉字条号 */
  });

  it('en 数字提取：k/M 连字符与空格都命中', () => {
    const nums = extractEnNumbers('500k tokens, a 100-million-game plan, 1.2M rows, 2 billion');
    expect(nums.has('500000')).toBe(true);
    expect(nums.has('100000000')).toBe(true);
    expect(nums.has('1200000')).toBe(true);
    expect(nums.has('2000000000')).toBe(true);
  });

  it('numberPresent 等值与小数形态', () => {
    expect(numberPresent('92', new Set(['92.0', '71']))).toBe(true);
    expect(numberPresent('92.0', new Set(['92']))).toBe(false);
    expect(numberPresent('7', new Set(['7']))).toBe(true);
  });

  it('cjkViolations 豁免书名号', () => {
    expect(cjkViolations('pure english 《民法典》 only')).toEqual([]);
    expect(cjkViolations('has 汉字 leak')).toEqual(['汉字']);
  });

  it('fmList 支持行内数组与块式列表', () => {
    const fm = 'tags: [检索, 评测]\nrelatedPosts:\n  - 2026-07-28-a\n  - 2026-08-31-b\ndraft: false';
    expect(fmList(fm, 'tags')).toEqual(['检索', '评测']);
    expect(fmList(fm, 'relatedPosts')).toEqual(['2026-07-28-a', '2026-08-31-b']);
    expect(fmList(fm, 'missing')).toEqual([]);
  });

  it('fmField 取单值', () => {
    expect(fmField('pubDate: 2026-07-28\ntitle: x', 'pubDate')).toBe('2026-07-28');
    expect(fmField('title: x', 'pubDate')).toBeNull();
  });

  it('linksUrls 只收 links 块的 url，related 回链不误吞', () => {
    const fm = 'links:\n  - label: a\n    url: https://github.com/x/y\n  - label: b\n    url: https://github.com/x/z\ncategory: 法律工具\nrelated:\n  - label: 案例\n    url: /projects/x/';
    expect(linksUrls(fm)).toEqual(['https://github.com/x/y', 'https://github.com/x/z']);
    expect(linksUrls('category: 法律工具\nrelated:\n  - label: 案例\n    url: /projects/x/')).toEqual([]);
  });

  it('checkPair 抓元数据漂移、数字缺失、汉字渗漏', () => {
    const zh = '---\ntitle: t\ncategory: 技术笔记\ntags: [检索]\npubDate: 2026-07-28\n---\n\n花了 66.0% 与 25,987 条语料，见《民法典》。';
    const en = '---\ntitle: "t en"\ncategory: 技术笔记\ntags: [检索]\npubDate: 2026-07-28\n---\n\nSpent 66.0% over a 25,987-provision corpus, see the Civil Code.';
    expect(checkPair('posts/x.md', zh, en)).toEqual([]);

    const enBad = en.replace('pubDate: 2026-07-28', 'pubDate: 2026-07-29').replace('25,987', '25,988') + '\n\n含汉字。';
    const issues = checkPair('posts/x.md', zh, enBad);
    expect(issues.some((i) => i.includes('pubDate 不一致'))).toBe(true);
    expect(issues.some((i) => i.includes('数字 25987'))).toBe(true);
    expect(issues.some((i) => i.includes('汉字渗漏'))).toBe(true);
  });

  it('长度比红线：过短与过长都报', () => {
    const zh = '---\ntitle: t\n---\n\n' + '这是一段足够长的中文正文。'.repeat(10);
    const short = '---\ntitle: t\n---\n\nToo short.';
    const long = '---\ntitle: t\n---\n\n' + 'word '.repeat(400);
    expect(checkPair('p/x.md', zh, short).some((i) => i.includes('长度比'))).toBe(true);
    expect(checkPair('p/x.md', zh, long).some((i) => i.includes('长度比'))).toBe(true);
  });
});

describe('content-golden 纯函数', () => {
  it('sha256 稳定且区分内容', () => {
    expect(sha256('abc')).toBe(sha256('abc'));
    expect(sha256('abc')).not.toBe(sha256('abd'));
  });

  it('diffManifest 报新增/缺失/改动', () => {
    const manifest = { 'a.md': 'h1', 'b.md': 'h2' };
    expect(diffManifest({ 'a.md': 'h1', 'b.md': 'h2' }, manifest)).toEqual([]);
    expect(diffManifest({ 'a.md': 'h1x', 'b.md': 'h2' }, manifest)).toEqual(['a.md: 中文内容被改动（金标 A 失守）']);
    expect(diffManifest({ 'a.md': 'h1' }, manifest)).toEqual(['b.md: 中文文件被删除（金标 A 失守）']);
    expect(diffManifest({ 'a.md': 'h1', 'b.md': 'h2', 'c.md': 'h3' }, manifest)).toEqual(['c.md: 新文件不在金标清单（--update 再生）']);
  });
});
