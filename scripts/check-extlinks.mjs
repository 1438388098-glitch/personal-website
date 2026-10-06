// @ts-check
// 扫描 dist/**/*.html 里的站外 http(s) 链接，逐个探活（HEAD，405/501 时降级 GET），非 2xx/3xx 即失败。
// 网络门禁有抖动，刻意不进 CI：作为定期手动巡检（建议每月）与发布前自查，见 README。
// 反爬站点（微信/知乎等 403 拦机器人）走 ALLOWLIST 豁免，必须写明理由。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
/* 域名唯一事实源：从 src/lib/site.ts 提取（.mjs 不能直接 import .ts） */
const siteTs = readFileSync(resolve('src/lib/site.ts'), 'utf8');
const siteMatch = /url:\s*'([^']+)'/.exec(siteTs);
if (!siteMatch) {
  console.error('无法从 src/lib/site.ts 提取站点域名');
  process.exit(1);
}
const SITE_ORIGIN = siteMatch[1];

/** 豁免清单：URL 前缀精确匹配，必须写明理由
 * @type {{ prefix: string, reason: string }[]} */
const ALLOWLIST = [
  // { prefix: 'https://mp.weixin.qq.com/', reason: '微信反爬对机器人恒 403，人工月检' },
];

const extRe = /\shref="(https?:\/\/[^"]+)"/g;

/** @returns {string[]} */
function collectLinks() {
  /** @type {Set<string>} */
  const urls = new Set();
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const html = readFileSync(p, 'utf8');
        for (const m of html.matchAll(extRe)) {
          const u = m[1];
          if (!u.startsWith(SITE_ORIGIN)) urls.add(u);
        }
      }
    }
  })(dist);
  return [...urls];
}

/** @typedef {{ url: string, ok: boolean, status: number | string }} ProbeResult */

/** HEAD 探活，405/501 降级 GET；网络异常重试一次后按失败返回。
 * @param {string} url
 * @returns {Promise<ProbeResult>} */
async function probe(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(10_000),
        headers: { 'user-agent': 'site-link-check/1.0' },
      });
      if (res.status < 400) return { url, ok: true, status: res.status };
      /* 不少站点不支持 HEAD，降级 GET 再试 */
      if (res.status === 405 || res.status === 501) {
        const get = await fetch(url, {
          signal: AbortSignal.timeout(10_000),
          headers: { 'user-agent': 'site-link-check/1.0 (+https://iweistoicqc5.top)' },
        });
        if (get.status < 400) return { url, ok: true, status: get.status };
        return { url, ok: false, status: get.status };
      }
      return { url, ok: false, status: res.status };
    } catch (err) {
      if (attempt === 2) {
        const e = /** @type {{ cause?: { code?: string }, name?: string }} */ (err);
        return { url, ok: false, status: String(e.cause?.code ?? e.name ?? err) };
      }
    }
  }
  /* 循环必然在 attempt===2 返回；此行仅为类型穷尽，运行时不可达 */
  return { url, ok: false, status: 'unreachable' };
}

async function main() {
  const urls = collectLinks();
  const results = await Promise.all(urls.map(probe));
  const bad = results.filter((r) => !r.ok && !ALLOWLIST.some((a) => r.url.startsWith(a.prefix)));
  const skipped = results.filter((r) => !r.ok && ALLOWLIST.some((a) => r.url.startsWith(a.prefix)));
  for (const r of bad) console.error(`外链失活（${r.status}）: ${r.url}`);
  for (const r of skipped) console.warn(`外链失活（${r.status}，已在豁免清单）: ${r.url}`);
  if (bad.length > 0) process.exit(1);
  console.log(`外链探活通过：${results.length} 个站外链接（豁免 ${skipped.length} 个）。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
