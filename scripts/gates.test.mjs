// 门禁脚本纯函数的行为锁定：解析改坏会静默放行红线，这里把关键分支钉死。
// 注意：测试内的假密钥一律运行期拼接构造，源码字面量不得匹配任何扫描正则。
import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseLinks, decodeLink, linkTargetExists } from './check-links.mjs';
import { scanSecrets } from './check-secrets.mjs';

describe('parseLinks 站内链接提取', () => {
  it('提取 href/src 的站内绝对路径，剔掉锚点与查询串', () => {
    const html = '<a href="/blog/foo/">x</a><img src="/a.png"><link href="/p/?q=1#frag">';
    expect(parseLinks(html)).toEqual(['/blog/foo/', '/a.png', '/p/']);
  });
  it('不匹配 data-href 前缀属性与外链', () => {
    const html = '<div data-href="/x/"></div><a href="https://example.com/">y</a>';
    expect(parseLinks(html)).toEqual([]);
  });
});

describe('decodeLink 百分号解码', () => {
  it('正常序列解码为中文', () => {
    expect(decodeLink('/%E5%8D%9A%E5%AE%A2/')).toBe('/博客/');
  });
  it('畸形序列返回 null 而不抛错', () => {
    expect(decodeLink('/%E4%BD%')).toBeNull();
  });
  it('无编码的普通路径原样返回', () => {
    expect(decodeLink('/plain/')).toBe('/plain/');
  });
});

describe('linkTargetExists 目标判定', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'gates-'));
  writeFileSync(join(tmp, 'page.html'), 'x');
  mkdirSync(join(tmp, 'sub'));
  writeFileSync(join(tmp, 'sub', 'index.html'), 'x');

  it('文件命中', () => {
    expect(linkTargetExists(tmp, '/page.html')).toBe(true);
  });
  it('目录以 index.html 命中', () => {
    expect(linkTargetExists(tmp, '/sub')).toBe(true);
  });
  it('不存在判死链', () => {
    expect(linkTargetExists(tmp, '/missing')).toBe(false);
  });
});

describe('scanSecrets 红线命中', () => {
  it('命中个人信息红线：手机号与身份证', () => {
    const phone = '138' + '12345678';
    const idcard = '110101' + '19900101' + '001' + 'X';
    const hits = scanSecrets(`电话 ${phone}，证号 ${idcard}`);
    const labels = hits.map((h) => h.label).join();
    expect(labels).toContain('手机号');
    expect(labels).toContain('身份证号');
  });
  it('命中密钥特征：sk- 前缀与 AKIA 与明文赋值', () => {
    const sk = 'sk-' + 'a'.repeat(24);
    const akia = 'AKIA' + 'B2CD4F6H8J1L3N5P';
    const assign = "api_key: '" + 'x'.repeat(12) + "'";
    const labels = scanSecrets(`${sk} ${akia} ${assign}`).map((h) => h.label).join();
    expect(labels).toContain('LLM API Key');
    expect(labels).toContain('AWS');
    expect(labels).toContain('api key');
  });
  it('长数字串与千分位不误报', () => {
    expect(scanSecrets('订单 11381234567812 与合计 14,212 条')).toEqual([]);
    expect(scanSecrets('这是普通中文句子，没有任何红线。')).toEqual([]);
  });
  it('17 位数字差一位凑不成身份证，不误报', () => {
    expect(scanSecrets('编号 12345678901234567（17 位数字）')).toEqual([]);
  });
});
