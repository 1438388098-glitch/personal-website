import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    group: z.enum(['法律主线', '工程侧证', '实验']),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    metrics: z
      .array(z.object({ label: z.string(), value: z.string(), detail: z.string().optional() }))
      .default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    disclaimer: z.string().default('本项目仅用于技术研究，输出不构成法律意见。')
  })
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['法学随笔', '技术笔记', '工程方法论']),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

const exam = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exam' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.string().optional(),
    type: z.enum(['方法论', '错题笔记', '周记']),
    date: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['课程论文', '文献研读', '读书笔记']),
    date: z.coerce.date(),
    status: z.enum(['已完成', '写作中', '在读']).default('已完成'),
    draft: z.boolean().default(false)
  })
});

export const collections = { projects, posts, exam, notes };
