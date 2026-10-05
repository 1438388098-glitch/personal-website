import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import { byDateDesc } from '../lib/sort';
import { isPublished } from '../lib/publish';

/** @param {import('astro').APIContext} context */
export async function GET(context) {
  const posts = (await getCollection('posts', isPublished))
    .sort(byDateDesc((p) => p.data.pubDate));
  const latest = posts[0]?.data.pubDate;
  /* 自引用链接用站点 URL 拼绝对地址，与 site: context.site 同源 */
  const selfUrl = new URL('feed.xml', context.site).href;
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    /* atom:link 自引用需先声明命名空间；@astrojs/rss 的 xmlns 选项挂在 <rss> 根元素上 */
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    /* RSS 标准字段：语言、自引用、构建时间。库不产出 lastBuildDate，用最新一篇的 pubDate */
    customData: [
      '<language>zh-CN</language>',
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
      ...(latest ? [`<lastBuildDate>${latest.toUTCString()}</lastBuildDate>`] : [])
    ].join(''),
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      /* 栏目与标签随条目输出，订阅器可按分类过滤 */
      categories: [p.data.category, ...p.data.tags]
    }))
  });
}
