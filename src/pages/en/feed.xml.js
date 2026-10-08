import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';
import { getPublishedPosts } from '../../lib/posts';
import { isVisible } from '../../lib/publish';
import { EN_CATEGORY, EN_EXAM_TYPE, EN_TAG } from '../../lib/i18n';

/** 英文订阅源：口径与中文版一致（posts + exam + notes）——项目/工具箱是指向仓库与案例的
    索引页，没有可订阅的正文，不进（旧版把 projects 混进来，与 zh 口径相悖，已对齐）。
    frontmatter 里的中文枚举 ID（category/tags/type）在出口处映射成英文对照。
    @param {import('astro').APIContext} context */
export async function GET(context) {
  const [posts, exam, notes] = await Promise.all([
    getPublishedPosts('en'),
    getCollection('examEn', isVisible),
    getCollection('notesEn', isVisible)
  ]);
  const items = [
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/en/blog/${p.id}/`,
      /* 栏目与标签随条目输出，订阅器可按分类过滤 */
      categories: [EN_CATEGORY[p.data.category] ?? p.data.category, ...p.data.tags.map((t) => EN_TAG[t] ?? t)]
    })),
    ...exam.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/en/exam/${e.id}/`,
      categories: [EN_EXAM_TYPE[e.data.type] ?? e.data.type]
    })),
    ...notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.date,
      link: `/en/notes/${n.id}/`,
      categories: [EN_CATEGORY[n.data.category] ?? n.data.category]
    }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  const latest = items[0]?.pubDate;
  /* 自引用与频道链接都必须落在 /en/ 下：旧版漏了前缀，频道链接指向中文站根、self 指到 zh feed */
  const selfUrl = new URL('en/feed.xml', context.site).href;
  return rss({
    title: SITE.titleEn,
    description: SITE.descriptionEn,
    site: new URL('en/', context.site),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      '<language>en</language>',
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
      ...(latest ? [`<lastBuildDate>${latest.toUTCString()}</lastBuildDate>`] : [])
    ].join(''),
    items
  });
}
