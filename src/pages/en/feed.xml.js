import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';
import { getPublishedPosts } from '../../lib/posts';

/** 英文订阅源：只收英文集合（postsEn/projectsEn/toolboxEn），exam/notes 不译不进。
    @param {import('astro').APIContext} context */
export async function GET(context) {
  const [posts, projects] = await Promise.all([
    getPublishedPosts('en'),
    getCollection('projectsEn'),
    getCollection('toolboxEn')
  ]);
  const items = [
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/en/blog/${p.id}/`,
      categories: p.data.tags
    })),
    ...projects.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      link: `/en/projects/${p.id}/`
    }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  const latest = items[0]?.pubDate;
  const selfUrl = new URL('feed.xml', context.site).href;
  return rss({
    title: SITE.titleEn,
    description: SITE.descriptionEn,
    site: context.site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      '<language>en</language>',
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
      ...(latest ? [`<lastBuildDate>${latest.toUTCString()}</lastBuildDate>`] : [])
    ].join(''),
    items
  });
}
