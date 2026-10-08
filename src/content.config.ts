import { defineCollection } from 'astro:content';
/* z 从 astro/zod 取：astro:content 的 re-export 在 Astro 7 已废弃，8 将移除 */
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { EXAM_TYPES, NOTE_CATEGORIES, NOTE_STATUS, POST_CATEGORIES, PROJECT_GROUPS, TAG_VOCAB, TOOLBOX_CATEGORIES } from './lib/categories';

/* schema 先抽成常量：zh 集合与 en 集合逐字段共用同一份定义。
   en 集合（src/content-en/）存英文译文，文件名与 zh 同名配对；
   分类/标签/分组等受控枚举值在 en frontmatter 里保持中文 ID，展示层经 i18n 字典映射英文。 */

const projectsSchema = z.object({
  title: z.string(),
  summary: z.string().max(160),
  group: z.enum(PROJECT_GROUPS),
  date: z.coerce.date(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string(), detail: z.string().optional() }))
    .default([]),
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  /* 相关博文：存 post 的 id（去掉 .md 的文件名），由详情页映射为 /blog/${id}/。
     不用 links 存相对路径：links.url 走 z.url()（绝对 URL 校验），站内相对路径过不了校验。 */
  relatedPosts: z.array(z.string()).default([]),
  disclaimer: z.string().default('本项目仅用于技术研究，输出不构成法律意见。')
});

const postsSchema = z.object({
  title: z.string(),
  /* 上限 300：zh 稿全部 ≤120 全角字符；en 同语义约需两倍半角字符（中文 120 字 ≈ 卡片上
     240 个拉丁半角宽度），cap 必须容纳 en 的完整转述——否则会逼出截短版 description
     （2026-10-07 曾因此把 4 篇 en 简介截出语义损失）。zh 稿不受影响。 */
  description: z.string().max(300),
  category: z.enum(POST_CATEGORIES),
  tags: z.array(z.enum(TAG_VOCAB)).max(4).default([]),
  pubDate: z.coerce.date(),
  draft: z.boolean().default(false),
  /* 社交分享图（站内绝对路径如 /og-my-post.png）；缺省用全站默认 og 图 */
  image: z.string().optional()
});

const examSchema = z.object({
  title: z.string(),
  /* 上限口径同 postsSchema.description：en 完整转述约需 zh 的两倍字符数 */
  description: z.string().max(300),
  type: z.enum(EXAM_TYPES),
  date: z.coerce.date(),
  draft: z.boolean().default(false)
});

const notesSchema = z.object({
  title: z.string(),
  description: z.string().max(300),
  category: z.enum(NOTE_CATEGORIES),
  date: z.coerce.date(),
  status: z.enum(NOTE_STATUS).default('已完成'),
  draft: z.boolean().default(false)
});

const exam = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exam' }),
  schema: examSchema
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: notesSchema
});

const nowSchema = z.object({
  period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'period 必须是合法的 YYYY-MM 月份'),
  updated: z.coerce.date(),
  /* 首页动态卡展示的话题：结构化数据走 frontmatter，正文不再被按行切割取标题 */
  topics: z.array(z.string()).max(3).default([])
});

const toolboxSchema = z.object({
  name: z.string(),
  url: z.url(),
  description: z.string(),
  category: z.enum(TOOLBOX_CATEGORIES),
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

const examEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/exam' }),
  schema: examSchema
});

const notesEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content-en/notes' }),
  schema: notesSchema
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

export const collections = { projects, posts, exam, notes, now, toolbox, projectsEn, postsEn, examEn, notesEn, nowEn, toolboxEn };
