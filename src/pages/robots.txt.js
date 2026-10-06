import { SITE } from '../lib/site';

/** 站点根 robots：从 SITE.url 生成，避免与 public/robots.txt 两条内容各自漂移。
    本站是静态站，没有后台路径要藏；Sitemap 指向 @astrojs/sitemap 产出的索引。 */
export function GET() {
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE.url}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
