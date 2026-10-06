import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './publish';
import { byDateDesc } from './sort';
import type { Lang } from './i18n';

export type Post = CollectionEntry<'posts'>;
export type PostEn = CollectionEntry<'postsEn'>;
/** 双语通用形状：schema 同源，zh/en 条目都满足同一结构，卡片与列表按此消费 */
export type AnyPost = Post | PostEn;

/** 已发布文章（非草稿且已到 pubDate），按发布时间降序。
    列表、详情、RSS、标签、搜索等所有出口统一走这里，避免同一条发布口径散落多处而漂移。
    lang='en' 时取英文集合（译文子集），口径与 zh 完全一致。 */
export async function getPublishedPosts(lang: Lang = 'zh'): Promise<AnyPost[]> {
  const posts =
    lang === 'en'
      ? await getCollection('postsEn', isPublished)
      : await getCollection('posts', isPublished);
  return posts.sort(byDateDesc((p) => p.data.pubDate));
}

/** 相邻文章（较新 / 较旧），基于已按时间降序排列的列表；任一侧不存在则为 undefined。
    en 列表只在自己的子集里相邻（en 上下篇不会跳去 zh 页面）。 */
export function getAdjacent(sorted: AnyPost[], id: string): { newer?: AnyPost; older?: AnyPost } {
  const i = sorted.findIndex((p) => p.id === id);
  if (i < 0) return {};
  return { newer: sorted[i - 1], older: sorted[i + 1] };
}
