import type { AnyPost } from './posts';

/** 标签计数：多的在前，同级按拼音序，方便扫读与查找。 */
export function countTags(posts: AnyPost[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'));
}

/** 按标签分桶（供标签详情页建静态路径）。 */
export function groupByTag(posts: AnyPost[]): Map<string, AnyPost[]> {
  const byTag = new Map<string, AnyPost[]>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      const bucket = byTag.get(t);
      if (bucket) bucket.push(p);
      else byTag.set(t, [p]);
    }
  }
  return byTag;
}
