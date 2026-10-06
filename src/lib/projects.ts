import { getCollection, type CollectionEntry } from 'astro:content';
import { isVisible } from './publish';
import type { Lang } from './i18n';

export type Project = CollectionEntry<'projects'>;
export type ProjectEn = CollectionEntry<'projectsEn'>;
export type AnyProject = Project | ProjectEn;

/** 全量项目按 order 升序（列表页、首页精选、搜索索引共用同一口径） */
export async function getProjects(lang: Lang = 'zh'): Promise<AnyProject[]> {
  const items =
    lang === 'en'
      ? await getCollection('projectsEn', isVisible)
      : await getCollection('projects', isVisible);
  return items.sort((a, b) => a.data.order - b.data.order);
}
