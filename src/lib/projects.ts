import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type Project = CollectionEntry<'projects'>;
export type ProjectEn = CollectionEntry<'projectsEn'>;
export type AnyProject = Project | ProjectEn;

/** 全量项目按 order 升序（列表页、首页精选、搜索索引共用同一口径）。
    项目 schema 无 draft 字段，不过滤（zh 原实现即如此，行为不变）。 */
export async function getProjects(lang: Lang = 'zh'): Promise<AnyProject[]> {
  /* 先赋给 AnyProject[] 再排序，理由同 posts.ts：联合数组直接 .sort 会因逆变失配 */
  const list: AnyProject[] =
    lang === 'en'
      ? await getCollection('projectsEn')
      : await getCollection('projects');
  return list.sort((a, b) => a.data.order - b.data.order);
}
