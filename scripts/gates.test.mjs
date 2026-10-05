// 门禁脚本纯函数的行为锁定：解析改坏会静默放行红线，这里把关键分支钉死。
// 注意：测试内的假密钥一律运行期拼接构造，源码字面量不得匹配任何扫描正则。
import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseLinks, decodeLink, linkTargetExists } from './check-links.mjs';
import { scanSecrets } from './check-secrets.mjs';
import { scanStyle } from './check-style.mjs';
import { slugDate, frontDate, checkEntries } from './check-content.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('门禁脚本导入安全', () => {
  /* 少了 import 守卫，import 本身就会跑一遍 CLI：仓库恰好干净时静默通过，
     一旦有红线就 process.exit 把测试文件的加载带崩。这里在子进程里只做 import，
     退出码与 stderr 都必须干净，才证明扫描没有在导入时发生。 */
  for (const name of ['check-style.mjs', 'check-links.mjs', 'check-secrets.mjs']) {
    it(`${name} 被 import 时不执行扫描`, () => {
      const target = pathToFileURL(join(repoRoot, 'scripts', name)).href;
      const r = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(target)})`], {
        cwd: repoRoot,
        encoding: 'utf8'
      });
      expect(r.status, `${name} 导入时退出码非 0，stderr：${r.stderr}`).toBe(0);
      expect(r.stderr).toBe('');
    });
  }
});

describe('frontDate 日期解析', () => {
  it('不带引号的日期解析成功', () => {
    expect(frontDate('---\npubDate: 2026-01-01\n---', 'pubDate')).toBe('2026-01-01');
  });
  it('双引号与单引号包裹的日期解析成功（假阳性回归）', () => {
    expect(frontDate('pubDate: "2026-01-01"', 'pubDate')).toBe('2026-01-01');
    expect(frontDate("pubDate: '2026-01-01'", 'pubDate')).toBe('2026-01-01');
  });
  it('字段缺失返回 null', () => {
    expect(frontDate('title: x', 'pubDate')).toBeNull();
  });
});

describe('slugDate 文件名前缀', () => {
  it('带 YYYY-MM-DD- 前缀提取成功', () => {
    expect(slugDate('2026-01-01-slug.md')).toBe('2026-01-01');
  });
  it('无前缀返回 null', () => {
    expect(slugDate('plain.md')).toBeNull();
    expect(slugDate('.gitkeep')).toBeNull();
  });
});

describe('checkEntries 内容日期一致性', () => {
  it('前缀与 frontmatter 日期一致时无违规（带引号日期也算通过）', () => {
    const entries = [{ name: '2026-01-01-ok.md', content: 'pubDate: "2026-01-01"' }];
    expect(checkEntries(entries, 'pubDate')).toEqual([]);
  });
  it('前缀与日期不一致时违规', () => {
    const entries = [{ name: '2026-01-01-bad.md', content: 'pubDate: 2026-02-02' }];
    expect(checkEntries(entries, 'pubDate').join()).toContain('≠');
  });
  it('无日期前缀的 .md 判定为不合规而非静默跳过', () => {
    const bad = checkEntries([{ name: 'plain.md', content: 'date: 2026-01-01' }], 'date');
    expect(bad.length).toBe(1);
    expect(bad[0]).toContain('YYYY-MM-DD-');
  });
  it('.gitkeep 等非 .md 文件被忽略', () => {
    expect(checkEntries([{ name: '.gitkeep', content: '' }], 'date')).toEqual([]);
    expect(checkEntries([{ name: 'notes.txt', content: '' }], 'date')).toEqual([]);
  });
  it('requirePrefix=false 时不强制前缀（notes 约定），带前缀仍须与日期一致', () => {
    expect(checkEntries([{ name: 'plain.md', content: 'date: 2026-01-01' }], 'date', false)).toEqual([]);
    const bad = checkEntries([{ name: '2026-01-01-bad.md', content: 'date: 2026-02-02' }], 'date', false);
    expect(bad.join()).toContain('≠');
  });
});

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

describe('scanStyle 文风红线', () => {
  it('命中破折号与禁词并报行号', () => {
    const issues = scanStyle('第一行正常。\n这里用了——破折号和闭环写法', false);
    expect(issues.map((i) => i.label).join()).toContain('破折号');
    expect(issues.map((i) => i.label).join()).toContain('闭环');
    expect(issues[0].line).toBe(2);
  });
  it('《书名号》内的禁词豁免（标题是别人的文本）', () => {
    expect(scanStyle('《去中心化自治组织对公司治理的赋能与创新》是论文标题', false)).toEqual([]);
  });
  it('单个「不是A，是B」放行，堆叠两处才拦', () => {
    expect(scanStyle('问题不是没钱，是没人排。', false)).toEqual([]);
    const stacked = '不是A，是B。不是C，是D。';
    expect(scanStyle(stacked, false).length).toBe(2);
  });
  it('md 首行必须是三连字符（兼容 CRLF）', () => {
    expect(scanStyle('---\r\ntitle: t\r\n', true)).toEqual([]);
    expect(scanStyle('------\ntitle: t\n', true).map((i) => i.label).join()).toContain('---');
    expect(scanStyle('正文没有frontmatter', true).length).toBe(1);
  });
  it('非 md 文件不查首行', () => {
    expect(scanStyle('const x = 1; // astro 里没有 frontmatter 首行要求', false)).toEqual([]);
  });
  it('新增禁词（底层逻辑/沉淀/颗粒度）生效', () => {
    const labels = scanStyle('底层逻辑、沉淀、颗粒度', false).map((i) => i.label).join();
    expect(labels).toContain('底层逻辑');
    expect(labels).toContain('沉淀');
    expect(labels).toContain('颗粒度');
  });
});
