/* 定时发布统一谓词：草稿与未到 pubDate 的文章不进任何出口（列表、详情、RSS 口径一致）。
   注意：getStaticPaths 虽被提升到独立作用域，但 lib 层导入可用，frontmatter 顶层变量不可用。 */
export const isPublished = (p: { data: { draft: boolean; pubDate: Date } }): boolean =>
  !p.data.draft && p.data.pubDate.valueOf() <= Date.now();
