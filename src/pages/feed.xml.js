import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import { byDateDesc } from '../lib/sort';

/** @param {import('astro').APIContext} context */
export async function GET(context) {
  /* 定时发布：未到 pubDate 的文章不进订阅源 */
  const posts = (await getCollection('posts', (p) => !p.data.draft && p.data.pubDate.valueOf() <= Date.now()))
    .sort(byDateDesc((p) => p.data.pubDate));
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`
    }))
  });
}
