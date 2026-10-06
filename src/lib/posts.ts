import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './publish';
import { byDateDesc } from './sort';

export type Post = CollectionEntry<'posts'>;

/** 已发布文章（非草稿且已到 pubDate），按发布时间降序。
    列表、详情、RSS、标签、搜索等所有出口统一走这里，避免同一条发布口径散落多处而漂移。 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isPublished);
  return posts.sort(byDateDesc((p) => p.data.pubDate));
}

/** 相邻文章（较新 / 较旧），基于已按时间降序排列的列表；任一侧不存在则为 undefined。 */
export function getAdjacent(sorted: Post[], id: string): { newer?: Post; older?: Post } {
  const i = sorted.findIndex((p) => p.id === id);
  if (i < 0) return {};
  return { newer: sorted[i - 1], older: sorted[i + 1] };
}
