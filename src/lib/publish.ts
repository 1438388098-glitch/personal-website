/* 可见性统一谓词：非草稿即可见（notes / exam / 项目等无 pubDate 的集合用它）。 */
export const isVisible = (x: { data: { draft?: boolean } }): boolean => !x.data.draft;

/* 定时发布统一谓词：草稿与未到 pubDate 的文章不进任何出口（列表、详情、RSS 口径一致）。
   注意：getStaticPaths 虽被提升到独立作用域，但 lib 层导入可用，frontmatter 顶层变量不可用。 */
export const isPublished = (p: { data: { draft: boolean; pubDate: Date } }): boolean =>
  isVisible(p) && p.data.pubDate.valueOf() <= Date.now();
