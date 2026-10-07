/* 边缘缓存 Worker：让 HTML 与 search-index.json 真正进入 CF 边缘缓存（免费版默认不缓存这两类）。
   原理：源站 nginx 已按资源类型发好 Cache-Control（HTML max-age=60+swr、search-index 300s、
   _astro immutable、动态路径与 sw.js no-cache）——本 Worker 只对「源站明确允许缓存」的
   GET 响应做 caches.default 存取，其余一律原样透传，不改变任何语义。
   命中与回源状态通过 x-edge-cache 响应头暴露，便于线上验证。
   部署：wrangler deploy（route 绑定见 wrangler.toml）；回退：wrangler delete 或删 route 即恢复原状。 */

/* 动态/代理路径前缀：一律透传，绝不缓存（与 nginx 主站 conf 的 location 划分一致） */
const PASS_PREFIXES = [
  '/law', '/v1', '/api', '/hub', '/wx', '/agent-mail', '/sentiment',
  '/daka', '/jev', '/dazi', '/flc1', '/ideology', '/poems', '/shuati',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    /* 非 GET/HEAD 与动态路径：直接回源，Worker 不掺手。
       /sw.js 是旧站 SW 的退场文件，浏览器每次导航都要校验，必须绕开边缘缓存逐次回源。 */
    if (request.method !== 'GET' && request.method !== 'HEAD') return fetch(request);
    if (url.pathname === '/sw.js') return fetch(request);
    if (PASS_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'))) {
      return fetch(request);
    }

    const cache = caches.default;
    const hit = await cache.match(request);
    if (hit) {
      const res = new Response(hit.body, hit);
      res.headers.set('x-edge-cache', 'hit');
      return res;
    }

    const origin = await fetch(request);
    const cc = origin.headers.get('cache-control') || '';
    /* 源站给了正的 max-age 才存边缘缓存（no-cache / max-age=0 / 无头一律不存） */
    if (/max-age=[1-9]/.test(cc)) {
      ctx.waitUntil(cache.put(request, origin.clone()));
    }
    const res = new Response(origin.body, origin);
    res.headers.set('x-edge-cache', 'miss');
    return res;
  },
};
