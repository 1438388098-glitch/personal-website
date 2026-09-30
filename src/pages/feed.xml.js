import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import { byDateDesc } from '../lib/sort';
import { isPublished } from '../lib/publish';

/** @param {import('astro').APIContext} context */
export async function GET(context) {
  const posts = (await getCollection('posts', isPublished))
    .sort(byDateDesc((p) => p.data.pubDate));
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
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
