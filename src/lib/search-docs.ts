/* 搜索索引的**服务端**装配：把各内容集合映射成客户端检索用的扁平条目。
   仅供 Astro 端点（src/pages/search-index.json.js）在构建期导入——绝不能被客户端脚本导入，
   否则 astro:content 会被打进浏览器包，全量正文也会回到页面里。

   口径与旧的内嵌实现逐位一致：posts/exam/notes 用正文压纯文本（toText），
   projects 用 summary、toolbox 用 description；kind 分别为 博客/法考/笔记/项目/工具。 */
import { getCollection } from 'astro:content';
import { getPublishedPosts } from './posts';
import { isVisible } from './publish';

/** 一条可检索文档：字段与 src/lib/search.ts 的 SearchDoc 对齐，另带 url 与来源 kind。 */
export interface SearchDocEntry {
  url: string;
  title: string;
  description: string;
  tags: string[];
  text: string;
  kind: '博客' | '法考' | '笔记' | '项目' | '工具';
}

/** 正文压成纯文本：剥代码块、图片、链接语法与行内标记，限长避免索引虚胖 */
const toText = (md: string | undefined): string =>
  (md ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    /* snippet 只展示正负 200 字，4 千字外的正文命中价值极低：cap 控制索引体积 */
    .slice(0, 4000);

/** 收集全站已发布内容的检索条目。发布口径统一走 getPublishedPosts / isVisible，不在此另起一套。 */
export async function collectSearchDocs(): Promise<SearchDocEntry[]> {
  return [
    ...(await getPublishedPosts()).map((p): SearchDocEntry => ({
      url: `/blog/${p.id}/`, title: p.data.title, description: p.data.description, tags: p.data.tags, text: toText(p.body), kind: '博客',
    })),
    ...(await getCollection('exam', isVisible)).map((e): SearchDocEntry => ({
      url: `/exam/${e.id}/`, title: e.data.title, description: e.data.description, tags: [], text: toText(e.body), kind: '法考',
    })),
    ...(await getCollection('notes', isVisible)).map((n): SearchDocEntry => ({
      url: `/notes/${n.id}/`, title: n.data.title, description: n.data.description, tags: [], text: toText(n.body), kind: '笔记',
    })),
    ...((await getCollection('projects')).sort((a, b) => a.data.order - b.data.order)).map((p): SearchDocEntry => ({
      url: `/projects/${p.id}/`, title: p.data.title, description: p.data.summary, tags: [p.data.group], text: p.data.summary, kind: '项目',
    })),
    ...(await getCollection('toolbox')).map((t): SearchDocEntry => ({
      url: `/toolbox/#${t.id}`, title: t.data.name, description: t.data.description, tags: [t.data.category], text: t.data.description, kind: '工具',
    })),
  ];
}
