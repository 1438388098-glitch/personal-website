/* 旧站（缓存名 wei-site-v5）的 cache-first Service Worker 已随旧站下线。
   老访客浏览器里注册的它会在每次导航时后台重新拉取本文件——本文件只负责让它平稳退场：
   清掉全部旧缓存 → 注销 SW → 之后所有请求回归网络直连，新站内容即时可见。
   新站不使用 Service Worker；本文件退场使命完成后即可择机删除。 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});

/* 已被接管的页面在本生命周期内仍经过此 Worker，直接透传网络，不碰缓存 */
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
