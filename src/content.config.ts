import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { POST_CATEGORIES, TAG_VOCAB } from './lib/categories';

/* schema 先抽成常量：zh 集合与 en 集合逐字段共用同一份定义。
   en 集合（src/content-en/）存英文译文，文件名与 zh 同名配对；
   分类/标签/分组等受控枚举值在 en frontmatter 里保持中文 ID，展示层经 i18n 字典映射英文。 */

const projectsSchema = z.object({
  title: z.string(),
  summary: z.string().max(160),
  group: z.enum(['法律主线', '法律工具', '工程侧证', '实验']),
  date: z.coerce.date(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string(), detail: z.string().optional() }))
    .default([]),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  /* 相关博文：存 post 的 id（去掉 .md 的文件名），由详情页映射为 /blog/${id}/。
     不用 links 存相对路径：links.url 走 z.string().url()（astro:content 的 z 是 zod 3，没有 z.url()），站内相对路径过不了校验。 */
  relatedPosts: z.array(z.string()).default([]),
  disclaimer: z.string().default('本项目仅用于技术研究，输出不构成法律意见。')
});

const postsSchema = z.object({
  title: z.string(),
  description: z.string().max(120),
  category: z.enum(POST_CATEGORIES),
  tags: z.array(z.enum(TAG_VOCAB)).max(4).default([]),
  pubDate: z.coerce.date(),
  draft: z.boolean().default(false),
  /* 社交分享图（站内绝对路径如 /og-my-post.png）；缺省用全站默认 og 图 */
  image: z.string().optional()
});

const exam = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exam' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    type: z.enum(['方法论', '错题笔记', '周记']),
    date: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    category: z.enum(['课程论文', '文献研读', '读书笔记']),
    date: z.coerce.date(),
    status: z.enum(['已完成', '写作中', '在读']).default('已完成'),
    draft: z.boolean().default(false)
  })
});

const nowSchema = z.object({
  period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'period 必须是合法的 YYYY-MM 月份'),
  updated: z.coerce.date(),
  /* 首页动态卡展示的话题：结构化数据走 frontmatter，正文不再被按行切割取标题 */
  topics: z.array(z.string()).max(3).default([])
});

const toolboxSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  category: z.enum(['法律工具', '工程小件']),
  /** 站内回链：同名项目案例页与相关博文，避免两个栏目互为孤岛 */
  related: z
    .array(z.object({ label: z.string(), url: z.string().refine((u) => u.startsWith('/'), '站内回链必须以 / 开头') }))
    .default([])
});

/* zh 集合（根路径内容，字节不动） */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectsSchema
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postsSchema
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
  schema: nowSchema
});

const toolbox = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/toolbox' }),
  schema: toolboxSchema
});

/* en 集合：目录、文件名与 zh 一一同名配对（check-i18n 门禁强制） */
const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/projects' }),
  schema: projectsSchema
});

const postsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/posts' }),
  schema: postsSchema
});

const nowEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/now' }),
  schema: nowSchema
});

const toolboxEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/toolbox' }),
  schema: toolboxSchema
});

export const collections = { projects, posts, exam, notes, now, toolbox, projectsEn, postsEn, nowEn, toolboxEn };
