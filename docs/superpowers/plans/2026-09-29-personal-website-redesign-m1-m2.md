# 个人网站重做（M1+M2）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把纯简历单页重做为「法律×AI」多栏目个人站，本计划交付 M1（Astro 骨架 + 首页/关于页 + 布局系统）与 M2（项目案例引擎 + 博客 + 种子内容 + RSS + 质检脚本），产出可构建、可预览、内容充实的完整站点。

**Architecture:** Astro 5 静态站 + 内容集合（zod schema 构建期校验）。所有栏目内容为 Markdown；设计令牌集中在 global.css；站点常量与首页真实指标集中在 `src/lib/`。视觉遵循 design-taste-frontend skill：单一强调色（朱砂红，呼应印章/法律语境）、高密度低动效、无 AI 套路（无紫渐变、无居中 hero、眉标限量、站内文案禁用 em-dash）。

**Tech Stack:** Astro 5、TypeScript strict、@astrojs/rss、@astrojs/sitemap、Vitest（纯函数单测）、Node 脚本（死链/密钥检查）。

**范围声明:** 本计划只做 M1+M2。M3（法考/notes/now/toolbox 栏目）与 M4（双语/Pagefind/上线替换）见后续计划。设计文档：`docs/superpowers/specs/2026-09-29-personal-website-redesign-design.md`。

**约定（全计划通用）:**
- 工作目录：`D:\Claudeworkspace\个人网站`（已有 git 仓库，main 分支，设计文档已提交）。
- 每个任务以「构建/测试全绿 + 中文提交信息」结束；提交信息格式 `类型: 做了什么（为什么）`。
- 站内一切可见文案禁用 em-dash（`—`/`–`），用句号、逗号或括号替代。
- 项目素材仓库在 `D:\Claudeworkspace\<repo>\`（statute-rag、cn-judbench、fakao-grader、zhuma-fakao-review、clause-scope），写案例时读各自 `README.md`。

---

### Task 1: 工程脚手架与首次构建

**Files:**
- Create: `package.json`、`tsconfig.json`、`astro.config.mjs`、`src/pages/index.astro`（临时占位，Task 8 替换）
- Modify: `.gitignore`（补充 dist/.astro）
- Create: `README.md`（初版）

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "hu-shengwei-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

若 `npm install` 报某版本不存在，把该依赖改为 `npm install <pkg>@latest -D` 安装并以实际锁定的版本回填 package.json。

- [ ] **Step 2: 写 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: 写 astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iweistoicqc5.top',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' }
    }
  }
});
```

- [ ] **Step 4: 临时首页（保证可构建，Task 8 替换）**

`src/pages/index.astro`:

```astro
---
---
<!doctype html>
<html lang="zh-CN">
  <head><meta charset="utf-8" /><title>脚手架</title></head>
  <body><p>scaffold ok</p></body>
</html>
```

- [ ] **Step 5: 补 .gitignore**

在现有 `.gitignore` 末尾追加（若无则新建）：

```
node_modules/
dist/
.astro/
```

- [ ] **Step 6: 安装依赖并首次构建**

Run: `npm install`
Expected: 依赖装完，无 ERESOLVE 错误。
Run: `npm run build`
Expected: `build complete`，生成 `dist/`。

- [ ] **Step 7: README 初版**

```markdown
# 胡圣炜的个人网站

「法律 × AI」个人品牌站：项目案例、技术写作、法考备考、读书笔记。
设计文档见 docs/superpowers/specs/，实施计划见 docs/superpowers/plans/。

## 如何运行
    npm install
    npm run dev      # 本地开发 http://localhost:4321
    npm run build    # 产出 dist/
    npm run preview  # 本地预览构建产物

## 如何测试
    npm test         # Vitest 单测（纯函数）
    npm run check    # astro check 类型检查

## 如何写内容
    src/content/projects/  项目案例（.md，frontmatter 见 src/content.config.ts）
    src/content/posts/     博客文章（.md）
（本节随 M3 各栏目上线扩充）
```

- [ ] **Step 8: 提交**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs src/ .gitignore README.md
git commit -m "chore: Astro 5 工程脚手架与首次构建通过"
```

---

### Task 2: 测试基建与 formatDate（TDD）

**Files:**
- Create: `src/lib/format.ts`、`src/lib/format.test.ts`

- [ ] **Step 1: 先写失败测试**

`src/lib/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('按 UTC 语义格式化 ISO 日期，不受本机时区影响', () => {
    expect(formatDate(new Date('2026-09-29'))).toBe('2026 年 9 月 29 日');
    expect(formatDate(new Date(Date.UTC(2026, 0, 5)))).toBe('2026 年 1 月 5 日');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm test`
Expected: FAIL，`Cannot find module './format'`。

- [ ] **Step 3: 最小实现**

`src/lib/format.ts`:

```ts
/** 内容日期统一按 UTC 语义格式化（frontmatter 存 ISO 日期字符串） */
export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npm test`
Expected: `1 passed`。

- [ ] **Step 5: 提交**

```bash
git add src/lib/format.ts src/lib/format.test.ts
git commit -m "test: 搭建 Vitest 基建并以 TDD 实现 formatDate"
```

---

### Task 3: 内容集合 Schema（含校验行为验证）

**Files:**
- Create: `src/content.config.ts`、`src/content/projects/.gitkeep`、`src/content/posts/.gitkeep`

- [ ] **Step 1: 定义集合**

`src/content.config.ts`:

```ts
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

export const collections = { projects, posts };
```

- [ ] **Step 2: 验证 schema 有牙齿（负向验证）**

临时创建 `src/content/posts/_bad.md`：

```markdown
---
title: 坏例子
category: 不存在的分类
pubDate: 2026-09-29
---
```

Run: `npm run build`
Expected: FAIL，报 `category` 枚举校验错误（这就是内容的第一道测试）。
删除 `_bad.md`，再跑 `npm run build`，Expected: PASS。
（`.gitkeep` 让空目录进 git。）

- [ ] **Step 3: 提交**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: 定义 projects/posts 内容集合 schema，构建期校验 frontmatter"
```

---

### Task 4: 设计系统 global.css 与站点常量

**Files:**
- Create: `src/styles/global.css`、`src/lib/site.ts`

- [ ] **Step 1: 设计令牌与基础样式**

`src/styles/global.css`（完整文件）：

```css
/* 设计令牌：纸面 + 墨色 + 朱砂。呼应语境：墨（书写）、朱砂（印章/法律）。 */
:root {
  --bg: #faf9f7;
  --bg-soft: #f2f0ec;
  --text: #201f1d;
  --text-muted: #6f6b64;
  --accent: #b3402a;
  --accent-soft: #f4e3de;
  --border: #e4e1da;
  --code-bg: #f4f2ee;
  --maxw: 72rem;
}
html[data-theme='dark'] {
  --bg: #151413;
  --bg-soft: #1d1c1a;
  --text: #e8e6e1;
  --text-muted: #9b968d;
  --accent: #d4694f;
  --accent-soft: #3a2621;
  --border: #2c2a27;
  --code-bg: #201e1c;
}

* { box-sizing: border-box; }
html { color-scheme: light; scroll-behavior: smooth; }
html[data-theme='dark'] { color-scheme: dark; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
  line-height: 1.75;
  font-size: 1rem;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
img { max-width: 100%; height: auto; }
h1, h2, h3 { line-height: 1.25; letter-spacing: -0.01em; }
h1 { font-size: clamp(1.9rem, 4vw, 2.8rem); }
h2 { font-size: clamp(1.4rem, 2.5vw, 1.8rem); }

.container { max-width: var(--maxw); margin-inline: auto; padding-inline: 1.25rem; }
.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--accent); color: #fff; padding: 0.5rem 1rem; z-index: 100;
}
.skip-link:focus { left: 0; }

/* 文章正文 */
.prose { max-width: 68ch; }
.prose p { margin: 1.1em 0; }
.prose h2 { margin-top: 2em; }
.prose h3 { margin-top: 1.6em; }
.prose blockquote {
  margin: 1.4em 0; padding: 0.2em 1.1em;
  border-left: 3px solid var(--accent);
  background: var(--bg-soft); color: var(--text-muted);
}
.prose code {
  background: var(--code-bg); border: 1px solid var(--border);
  border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.9em;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
.prose pre {
  background: var(--code-bg); border: 1px solid var(--border);
  border-radius: 8px; padding: 1rem; overflow-x: auto;
}
.prose pre code { background: none; border: none; padding: 0; }
.prose table { border-collapse: collapse; width: 100%; margin: 1.4em 0; }
.prose th, .prose td { border: 1px solid var(--border); padding: 0.5em 0.8em; text-align: left; }
.prose th { background: var(--bg-soft); }

/* Shiki 双主题（astro.config 里 themes 配置的 dark 变量） */
html[data-theme='dark'] .astro-code,
html[data-theme='dark'] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: 站点常量**

`src/lib/site.ts`:

```ts
export const SITE = {
  title: '胡圣炜 · Stoic',
  description:
    '胡圣炜（Stoic）：中南财经政法大学法学在读，自学工程师。给法律场景造可复核、可评估、懂边界的 AI 工具。',
  url: 'https://iweistoicqc5.top',
  author: '胡圣炜',
  github: 'https://github.com/1438388098-glitch',
  poems: 'https://iweistoicqc5.top/poems/',
  /** 执行时处理：从旧站页面提取知乎主页链接（curl 首页 grep zhihu）；提取不到则置空 */
  zhihu: '',
  /** 执行时向用户确认可公开的展示邮箱；确认前保持空串，页脚不渲染邮箱项 */
  email: ''
} as const;

export const NAV = [
  { label: '项目', href: '/projects/' },
  { label: '博客', href: '/blog/' },
  { label: '关于', href: '/about/' }
] as const;
```

- [ ] **Step 3: 构建 + 提交**

Run: `npm run build`，Expected: PASS。
（css 尚未被引用，属预期；Task 5 接入。）

```bash
git add src/styles/global.css src/lib/site.ts
git commit -m "feat: 设计令牌（纸墨朱砂）与站点常量，暗色变量就绪"
```

---

### Task 5: 布局骨架（BaseHead/Header/Footer/BaseLayout + 暗色切换）

**Files:**
- Create: `src/components/BaseHead.astro`、`src/components/Header.astro`、`src/components/Footer.astro`、`src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`（接入 BaseLayout）

- [ ] **Step 1: BaseHead（SEO 头 + 防 FOUC 主题预置）**

```astro
---
import { SITE } from '../lib/site';
interface Props { title: string; description?: string; }
const { title, description = SITE.description } = Astro.props;
const pageTitle = title.includes(SITE.author) ? title : `${title} · ${SITE.title}`;
---
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<meta name="generator" content={Astro.generator} />
<title>{pageTitle}</title>
<meta name="description" content={description} />
<meta name="author" content={SITE.author} />
<link rel="canonical" href={new URL(Astro.url.pathname, SITE.url)} />
<meta property="og:type" content="website" />
<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={new URL(Astro.url.pathname, SITE.url)} />
<meta name="twitter:card" content="summary" />
<script is:inline>
  (function () {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
</script>
```

- [ ] **Step 2: Header（单行导航，M3 栏目上线时只改 site.ts 的 NAV）**

```astro
---
import { NAV, SITE } from '../lib/site';
const { pathname } = Astro.url;
const isActive = (href: string) => pathname === href || pathname.startsWith(href);
---
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">{SITE.author}</a>
    <nav aria-label="主导航">
      {NAV.map((item) => (
        <a class:list={['nav-link', { active: isActive(item.href) }]} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
    <button id="theme-toggle" type="button" aria-label="切换明暗主题">◐</button>
  </div>
</header>
<script>
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
</script>
<style>
  .site-header { border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .header-inner { display: flex; align-items: center; gap: 1.5rem; height: 64px; }
  .brand { font-weight: 700; color: var(--text); }
  nav { display: flex; gap: 1rem; margin-left: auto; }
  .nav-link { color: var(--text-muted); }
  .nav-link.active, .nav-link:hover { color: var(--accent); text-decoration: none; }
  #theme-toggle { background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--text); cursor: pointer; padding: 0.2rem 0.55rem; }
</style>
```

- [ ] **Step 3: Footer**

```astro
---
import { SITE } from '../lib/site';
const socials = [
  { label: 'GitHub', href: SITE.github },
  ...(SITE.zhihu ? [{ label: '知乎', href: SITE.zhihu }] : []),
  ...(SITE.email ? [{ label: 'Email', href: `mailto:${SITE.email}` }] : [])
];
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container footer-inner">
    <p>© {year} {SITE.author} · <a href={SITE.poems} target="_blank" rel="noopener">诗集《陌生的你》</a> · <a href="/feed.xml">RSS</a></p>
    <p class="socials">{socials.map((s) => <a href={s.href} target="_blank" rel="noopener">{s.label}</a>)}</p>
  </div>
</footer>
<style>
  .site-footer { border-top: 1px solid var(--border); margin-top: 4rem; padding: 2rem 0 3rem; color: var(--text-muted); font-size: 0.9rem; }
  .footer-inner { display: flex; flex-wrap: wrap; gap: 0.5rem 2rem; justify-content: space-between; }
  .footer-inner p { margin: 0; }
  .socials { display: flex; gap: 1rem; }
</style>
```

- [ ] **Step 4: BaseLayout**

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
interface Props { title: string; description?: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <BaseHead title={title} description={description} />
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <Header />
    <main id="main" class="container">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: 临时首页接入布局并构建**

`src/pages/index.astro` 暂改为：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="胡圣炜 · Stoic">
  <h1>scaffold ok</h1>
</BaseLayout>
```

同时创建 `public/favicon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#b3402a"/><text x="50" y="66" font-size="48" text-anchor="middle" fill="#faf9f7" font-family="serif">炜</text></svg>
```

Run: `npm run build`，Expected: PASS；`npm run dev` 打开首页可见导航与主题切换（点 ◐ 切换暗色，刷新后保持）。

- [ ] **Step 6: 提交**

```bash
git add src/components/ src/layouts/ src/pages/index.astro public/favicon.svg
git commit -m "feat: 全局布局骨架，SEO 头与明暗主题切换"
```

---

### Task 6: 首页真实数字条（MetricStrip + metrics 数据）

**Files:**
- Create: `src/lib/metrics.ts`、`src/lib/metrics.test.ts`、`src/components/MetricStrip.astro`

- [ ] **Step 1: 指标数据（全部为可审计的真实数字）**

`src/lib/metrics.ts`:

```ts
export interface Metric {
  label: string;
  value: string;
  detail: string;
  source: string;
}

/** 首页数字条：每个数字必须能在对应项目案例页溯源。更新数字时同步更新 METRICS_AS_OF。 */
export const HOME_METRICS: Metric[] = [
  { label: '法条语料', value: '14,212', detail: '条，条/款/项结构化入库', source: 'statute-rag' },
  { label: '评测金标', value: '323', detail: '题，12 个评测包，机检判分', source: 'cn-judbench' },
  { label: '检索 Recall@5', value: '98.9%', detail: '混合检索，较 FTS5 基线 +21.5pt', source: 'statute-rag' }
];

export const METRICS_AS_OF = '2026-09';
```

- [ ] **Step 2: 先写测试**

`src/lib/metrics.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { HOME_METRICS, METRICS_AS_OF } from './metrics';

describe('HOME_METRICS', () => {
  it('每条指标都可溯源且不含 em-dash', () => {
    expect(HOME_METRICS.length).toBeGreaterThanOrEqual(3);
    for (const m of HOME_METRICS) {
      expect(m.source.length).toBeGreaterThan(0);
      expect(m.value).not.toMatch(/[—–]/);
      expect(m.detail).not.toMatch(/[—–]/);
    }
  });
  it('数据截至日期为 YYYY-MM 格式', () => {
    expect(METRICS_AS_OF).toMatch(/^\d{4}-\d{2}$/);
  });
});
```

- [ ] **Step 3: 跑测试**

Run: `npm test`
Expected: 全部 PASS（formatDate 1 + metrics 2）。

- [ ] **Step 4: MetricStrip 组件**

```astro
---
import { HOME_METRICS, METRICS_AS_OF } from '../lib/metrics';
---
<section class="metric-strip" aria-label="关键指标">
  <div class="metrics">
    {HOME_METRICS.map((m) => (
      <div class="metric">
        <span class="value">{m.value}</span>
        <span class="label">{m.label}</span>
        <span class="detail">{m.detail}</span>
        <span class="source">来源：{m.source}</span>
      </div>
    ))}
  </div>
  <p class="as-of">数据截至 {METRICS_AS_OF}，逐项可溯源至对应项目案例页。</p>
</section>
<style>
  .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .metric { background: var(--bg); padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.15rem; }
  .value { font-size: 1.9rem; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
  .label { font-weight: 600; }
  .detail, .source { color: var(--text-muted); font-size: 0.85rem; }
  .as-of { color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 0; }
  @media (max-width: 720px) { .metrics { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 5: 提交**

```bash
git add src/lib/metrics.ts src/lib/metrics.test.ts src/components/MetricStrip.astro
git commit -m "feat: 首页真实数字条，指标可溯源并含 em-dash 防线测试"
```

---

### Task 7: 卡片组件（ProjectCard / PostCard）

**Files:**
- Create: `src/components/ProjectCard.astro`、`src/components/PostCard.astro`

- [ ] **Step 1: ProjectCard**

```astro
---
import { formatDate } from '../lib/format';
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const { title, summary, metrics, date, group } = project.data;
---
<article class="project-card">
  <p class="meta">{group} · {formatDate(date)}</p>
  <h3><a href={`/projects/${project.id}/`}>{title}</a></h3>
  <p class="summary">{summary}</p>
  {metrics.length > 0 && (
    <ul class="metrics">
      {metrics.slice(0, 2).map((m) => (
        <li><strong>{m.value}</strong> {m.label}</li>
      ))}
    </ul>
  )}
</article>
<style>
  .project-card { border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem 1.4rem; background: var(--bg); }
  .meta { color: var(--text-muted); font-size: 0.85rem; margin: 0 0 0.4rem; }
  h3 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  h3 a { color: var(--text); }
  h3 a:hover { color: var(--accent); text-decoration: none; }
  .summary { color: var(--text-muted); margin: 0 0 0.75rem; }
  .metrics { list-style: none; display: flex; gap: 1.25rem; margin: 0; padding: 0.75rem 0 0; border-top: 1px solid var(--border); }
  .metrics li { font-size: 0.9rem; color: var(--text-muted); }
  .metrics strong { color: var(--accent); font-variant-numeric: tabular-nums; }
</style>
```

- [ ] **Step 2: PostCard**

```astro
---
import { formatDate } from '../lib/format';
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const { title, description, category, pubDate, tags } = post.data;
---
<article class="post-card">
  <p class="meta">{category} · {formatDate(pubDate)}</p>
  <h3><a href={`/blog/${post.id}/`}>{title}</a></h3>
  <p class="desc">{description}</p>
  {tags.length > 0 && <p class="tags">{tags.map((t) => `#${t}`).join(' ')}</p>}
</article>
<style>
  .post-card { padding: 1.1rem 0; border-top: 1px solid var(--border); }
  .meta { color: var(--text-muted); font-size: 0.85rem; margin: 0 0 0.3rem; }
  h3 { margin: 0 0 0.35rem; font-size: 1.15rem; }
  h3 a { color: var(--text); }
  h3 a:hover { color: var(--accent); text-decoration: none; }
  .desc { color: var(--text-muted); margin: 0 0 0.4rem; }
  .tags { color: var(--text-muted); font-size: 0.85rem; margin: 0; }
</style>
```

- [ ] **Step 3: 构建与提交**

Run: `npm run build`，Expected: PASS。

```bash
git add src/components/ProjectCard.astro src/components/PostCard.astro
git commit -m "feat: 项目卡与文章卡组件"
```

---

### Task 8: 首页完整版

**Files:**
- Modify: `src/pages/index.astro`（整文件替换）

- [ ] **Step 1: 写完整首页**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import MetricStrip from '../components/MetricStrip.astro';
import ProjectCard from '../components/ProjectCard.astro';
import PostCard from '../components/PostCard.astro';
import { SITE } from '../lib/site';

const projects = (await getCollection('projects'))
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);
const posts = (await getCollection('posts', (p) => !p.data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 4);
---
<BaseLayout title={SITE.title}>
  <section class="hero">
    <h1>{SITE.author}</h1>
    <p class="tagline">法律在读 × 自学工程师。我在给法律场景造可复核、可评估、懂边界的 AI 工具。</p>
    <p class="status">备考法考中 · 武汉</p>
    <p class="ctas">
      <a class="btn primary" href="/projects/">看项目</a>
      <a class="btn" href="/about/">关于我</a>
    </p>
  </section>

  <MetricStrip />

  {projects.length > 0 && (
    <section>
      <div class="section-head"><h2>精选项目</h2><a href="/projects/">全部项目</a></div>
      <div class="featured-grid">
        {projects.map((p, i) => (
          <div class:list={['cell', { wide: i === 0 }]}><ProjectCard project={p} /></div>
        ))}
      </div>
    </section>
  )}

  {posts.length > 0 && (
    <section>
      <div class="section-head"><h2>最近写作</h2><a href="/blog/">全部文章</a></div>
      {posts.map((p) => <PostCard post={p} />)}
    </section>
  )}
</BaseLayout>

<style>
  .hero { padding: 3.5rem 0 2.5rem; max-width: 46rem; }
  .hero h1 { margin: 0 0 0.75rem; }
  .tagline { font-size: 1.15rem; margin: 0 0 0.4rem; max-width: 40rem; }
  .status { color: var(--text-muted); margin: 0 0 1.25rem; font-size: 0.95rem; }
  .ctas { display: flex; gap: 0.75rem; margin: 0; }
  .btn { border: 1px solid var(--border); border-radius: 8px; padding: 0.45rem 1.1rem; color: var(--text); }
  .btn:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .btn.primary:hover { filter: brightness(1.08); color: #fff; }
  section { margin: 2.5rem 0; }
  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.75rem; }
  .section-head h2 { margin: 0; }
  .featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .cell.wide { grid-column: 1 / -1; }
  @media (max-width: 720px) { .featured-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: 构建验证（此时集合为空，首页应优雅降级只显示 hero + 数字条）**

Run: `npm run build`，Expected: PASS。
Run: `npm run dev`，检查：hero 不超一屏、CTA 可点、数字条三列、窄屏单列。

- [ ] **Step 3: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: 首页完整版，hero 与不对称精选网格"
```

---

### Task 9: 关于页与简历 PDF

**Files:**
- Create: `src/pages/about.astro`、`public/resume/hu-shengwei-resume.pdf`

- [ ] **Step 1: 找回旧站简历 PDF**

Run:
```bash
curl -sL https://iweistoicqc5.top/ -o /tmp/old-site.html && grep -oE 'href="[^"]+\.pdf"' /tmp/old-site.html
```
若命中（如 `/resume.pdf` 或 `/简历.pdf`）：
```bash
mkdir -p public/resume && curl -sL "https://iweistoicqc5.top/<命中的路径>" -o public/resume/hu-shengwei-resume.pdf
```
若旧站无 PDF（简历是 HTML 弹窗预览），创建 `public/resume/README.md` 记录「待用户提供简历 PDF，路径固定为 resume/hu-shengwei-resume.pdf」，关于页下载按钮仍指向该路径，M4 上线前向用户索取补齐。

- [ ] **Step 2: 关于页（迁移旧站真实简历内容）**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE } from '../lib/site';
---
<BaseLayout title={`关于 · ${SITE.title}`} description={`${SITE.author}的个人介绍与简历。`}>
  <h1>关于</h1>
  <div class="prose">
    <p>
      我是胡圣炜，广东韶关人，中南财经政法大学法学专业本科生（2023.09 - 2027.06）。
      成长于粤北多语言环境（普通话、粤语、客家话），这让我习惯在不同语境间准确转译，
      也让我对「表述精确」有职业级的执念。
    </p>
    <p>
      我的方向是法律与 AI 的交叉地带：法律文本的结构化、检索与评估。
      我相信法律场景的 AI 输出不能靠蒙，所以我的项目都围着同一件事转：
      让模型的每句话可复核、可评估、可追溯。工具上重度使用 Claude Code 等 AI 编码协作，
      并把工程纪律（测试、指标、失败案例）带进每一个法律项目。
    </p>
    <h2>教育背景</h2>
    <p>中南财经政法大学 · 法学本科 · 2023.09 - 2027.06（南湖校区）</p>
    <p>核心课程：民法总论、刑法总论、民诉、刑诉、行政法、商法、经济法、知识产权法、国际法、法律逻辑学</p>
    <h2>技能</h2>
    <ul>
      <li>法律：法律检索与研究、法律文书写作、案例分析、辩论口头表达、法律英语（CET-6）</li>
      <li>工程：Python、JavaScript/TypeScript、SQLite/FTS5、RAG 与评测管线、多 Agent 编排、Git/CI</li>
      <li>工具：北大法宝、中国裁判文书网、Westlaw、Office、XMind、VS Code</li>
    </ul>
    <h2>证书与语言</h2>
    <p>国家统一法律职业资格考试（备考中）· 大学英语六级 · 普通话 / 粤语 / 客家话（母语级）</p>
    <h2>联系我</h2>
    <p>
      <a href={SITE.github} target="_blank" rel="noopener">GitHub</a>
      {SITE.email && <> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></>}
      。正在寻找法律科技 / AI 应用方向的实习机会。
    </p>
    <p><a class="resume-btn" href="/resume/hu-shengwei-resume.pdf" download>下载简历 PDF</a></p>
    <!-- TODO(资产): 个人照片位，用户提供后插入（about 页顶部右侧，1:1，max-width 180px） -->
  </div>
</BaseLayout>
<style>
  .resume-btn { display: inline-block; border: 1px solid var(--accent); border-radius: 8px; padding: 0.45rem 1.1rem; }
  .resume-btn:hover { background: var(--accent-soft); text-decoration: none; }
</style>
```

- [ ] **Step 3: 构建 + 提交**

Run: `npm run build`，Expected: PASS。

```bash
git add src/pages/about.astro public/resume/
git commit -m "feat: 关于页迁移真实简历内容并提供 PDF 下载"
```

---

### Task 10: 项目列表页与案例页（用 statute-rag 打通）

**Files:**
- Create: `src/pages/projects/index.astro`、`src/pages/projects/[slug].astro`
- Create: `src/content/projects/statute-rag.md`

- [ ] **Step 1: 列表页**

`src/pages/projects/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order);
const groups = ['法律主线', '工程侧证', '实验'] as const;
---
<BaseLayout title="项目" description="法律场景 LLM 工具与评测基准：每个项目都有边界、机制与可验证的指标。">
  <h1>项目</h1>
  <p class="intro">每个项目固定四段式：问题、边界、机制、验证。数字都能溯源。</p>
  {groups.map((g) => {
    const items = projects.filter((p) => p.data.group === g);
    return items.length > 0 && (
      <section>
        <h2>{g}</h2>
        <div class="grid">{items.map((p) => <ProjectCard project={p} />)}</div>
      </section>
    );
  })}
</BaseLayout>
<style>
  .intro { color: var(--text-muted); }
  section { margin: 2rem 0; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: 案例页模板**

`src/pages/projects/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { formatDate } from '../../lib/format';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((p) => ({ params: { slug: p.id }, props: { project: p } }));
}
const { project } = Astro.props;
const { Content } = await render(project);
const { title, summary, group, date, metrics, links, disclaimer } = project.data;
---
<BaseLayout title={title} description={summary}>
  <article class="prose">
    <p class="meta">{group} · {formatDate(date)}</p>
    <h1>{title}</h1>
    <p class="summary"><strong>{summary}</strong></p>

    {metrics.length > 0 && (
      <table>
        <thead><tr><th>指标</th><th>数值</th><th>说明</th></tr></thead>
        <tbody>
          {metrics.map((m) => (
            <tr><td>{m.label}</td><td><strong>{m.value}</strong></td><td>{m.detail ?? ''}</td></tr>
          ))}
        </tbody>
      </table>
    )}

    <Content />

    {links.length > 0 && (
      <p class="links">
        {links.map((l) => <a href={l.url} target="_blank" rel="noopener">{l.label}</a>)}
      </p>
    )}
    <p class="disclaimer">{disclaimer}</p>
    <p><a href="/projects/">← 全部项目</a></p>
  </article>
</BaseLayout>
<style>
  .meta { color: var(--text-muted); }
  .links { display: flex; gap: 1rem; }
  .disclaimer { color: var(--text-muted); font-size: 0.9rem; border-top: 1px solid var(--border); padding-top: 1rem; }
</style>
```

- [ ] **Step 3: 第一篇案例 statute-rag（真实事实，执行时对照仓库 README 校对补充）**

`src/content/projects/statute-rag.md`:

````markdown
---
title: statute-rag：法条混合检索底座
summary: 把 14,212 条法条结构化入库，用 BM25+向量混合检索与强制条文引用，让法条问答可评测、可回跳。
group: 法律主线
date: 2026-09-01
featured: true
order: 1
metrics:
  - label: Recall@5
    value: '98.9%'
    detail: 合成金标 177 题，混合检索，较 FTS5 基线 +21.5pt
  - label: MRR
    value: '0.984'
    detail: 同一评测协议
  - label: 语料规模
    value: '14,212 条'
    detail: 质检导入，条/款/项结构化
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/statute-rag
---

## 问题与边界

法律问答的第一风险不是「答得慢」，是「引错条」。本项目的边界同样明确：
只做检索底座与引用溯源，不做端到端法律咨询；检索不到就拒答，比硬生成安全。

## 机制

法条按条/款/项结构化分块后入库，检索采用 LIKE 精确、BM25 关键词与向量召回的
RRF 混合三件套，输出强制携带条文 ID，供上游应用回跳校验。

## 验证

先建合成金标 177 题（题目对应标准条文 ID），按预注册协议评测：
混合检索 Recall@5 达到 98.9%，较 FTS5 基线提升 21.5 个百分点，MRR 0.984。
此前在真实问句小样本上 FTS5 基线为 44.7%，如实公开两种口径。

## 已知失败

真实口语化问句与合成问句存在分布差异，向量通道对未入库的新废止条文会失效；
这两点都写在仓库的失败文档里，是下一版本（接入真实问句金标）的主攻方向。
````

- [ ] **Step 4: 构建 + 视检 + 提交**

Run: `npm run build`，Expected: PASS。
Run: `npm run dev`，检查 `/projects/` 与 `/projects/statute-rag/`：指标表渲染、免责声明在页、返回链接可用。

```bash
git add src/pages/projects/ src/content/projects/statute-rag.md
git commit -m "feat: 项目案例引擎（列表+案例页）与 statute-rag 案例"
```

---

### Task 11: 博客列表页、文章页与 RSS

**Files:**
- Create: `src/pages/blog/index.astro`、`src/pages/blog/[slug].astro`、`src/pages/feed.xml.js`
- Create: `src/content/posts/2026-09-20-fakao-grader-agent.md`（第一篇种子，Task 13 再补两篇）

- [ ] **Step 1: 列表页**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('posts', (p) => !p.data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
const categories = ['工程方法论', '技术笔记', '法学随笔'] as const;
---
<BaseLayout title="博客" description="法律 × AI 的工程方法论、技术笔记与法学随笔。">
  <h1>博客</h1>
  {categories.map((c) => {
    const items = posts.filter((p) => p.data.category === c);
    return items.length > 0 && (
      <section>
        <h2>{c}</h2>
        {items.map((p) => <PostCard post={p} />)}
      </section>
    );
  })}
</BaseLayout>
<style>
  section { margin: 2rem 0; }
</style>
```

- [ ] **Step 2: 文章页**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { formatDate } from '../../lib/format';

export async function getStaticPaths() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.map((p) => ({ params: { slug: p.id }, props: { post: p } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
const { title, description, category, pubDate, tags } = post.data;
---
<BaseLayout title={title} description={description}>
  <article class="prose">
    <p class="meta">{category} · {formatDate(pubDate)}{tags.length > 0 && ` · ${tags.map((t) => `#${t}`).join(' ')}`}</p>
    <h1>{title}</h1>
    <Content />
    <p><a href="/blog/">← 全部文章</a></p>
  </article>
</BaseLayout>
<style>
  .meta { color: var(--text-muted); }
</style>
```

- [ ] **Step 3: RSS**

`src/pages/feed.xml.js`:

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

export async function GET(context) {
  const posts = (await getCollection('posts', (p) => !p.data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`
    }))
  });
}
```

- [ ] **Step 4: 第一篇文章种子（工程方法论）**

`src/content/posts/2026-09-20-fakao-grader-agent.md`:

```markdown
---
title: 为什么我给法考评分造了一个判分 Agent
description: 法考主观题的 AI 评分难点不在打分，在采分点对齐。 fakao-grader 的设计取舍：rubric 拆点、置信度分级与二次复核。
category: 工程方法论
tags: [法考, Agent, 评估]
pubDate: 2026-09-20
---

## 问题：AI 打分不可信，是因为它打的是总分

模型直接给一道主观题打分，分数本身不可复核。法考阅卷的真相是按采分点给分，
那么 AI 评分的正确形态也应该是逐点判断，而不是拍一个总数。

## 机制

fakao-grader 把官方采分点拆成逐点 rubric，配置采分点白名单与黑名单，
支持连锁失分规则；输出时给出置信度分级，低置信结果强制进入二次复核。
（机制细节与设计文档对照 fakao-grader 仓库 README。）

## 边界

只做评分辅助，不替代人工评卷；输出只算初稿，最终以官方评分规则与人工判断为准。

## 验证

建立小样本一致率评估：同一作答多次判分的一致性、与参考采分点的对齐情况，
数字与样例见仓库 examples/ 与评测说明。失败模式（如「理由通顺但采分点漏判」）
单独归档，作为下一步优化的输入。
```

- [ ] **Step 5: 构建 + 提交**

Run: `npm run build`，Expected: PASS。
Run: `curl -s http://localhost:4321/feed.xml | head -5`（dev 模式），Expected: 输出 XML 头。

```bash
git add src/pages/blog/ src/pages/feed.xml.js src/content/posts/
git commit -m "feat: 博客列表/文章页与 RSS，首发判分 Agent 方法论文章"
```

---

### Task 12: 种子内容：项目案例 ×4

**Files:**
- Create: `src/content/projects/cn-judbench.md`、`fakao-grader.md`、`zhuma-fakao-review.md`、`clause-scope.md`

- [ ] **Step 1: 逐仓读取 README 并写案例**

对下列每仓执行：读 `D:\Claudeworkspace\<repo>\README.md`，按 Task 10 statute-rag 案例的四段式结构（问题与边界/机制/验证/已知失败）撰写，frontmatter 沿用同一 schema。**正文事实以仓库 README 为准，下面的关键事实清单用于核对，禁止编造 README 里没有的数字：**

- `cn-judbench.md`：order 2、featured true、group 法律主线。关键事实：中国司法 LLM 评测基准；12 个评测包、323 题；机检判分；预注册统计协议；已发布 v0.6.0 技术报告。仓库 `D:\Claudeworkspace\cn-judbench`，链接 `https://github.com/1438388098-glitch/cn-judbench`。
- `fakao-grader.md`：order 3、featured true、group 法律主线。关键事实：法考主观题 AI 判分 Agent；官方采分点逐点判分；采分点白/黑名单、连锁失分、置信度分级。仓库 `D:\Claudeworkspace\fakao-grader`，链接对应 GitHub 仓库。
- `zhuma-fakao-review.md`：order 4、featured false、group 法律主线。关键事实：错题转可背诵笔记 PDF；多 Agent 六维审校管线；原子写、熔断、防注入、安全审计。仓库 `D:\Claudeworkspace\zhuma-fakao-review`。
- `clause-scope.md`：order 5、featured false、group 法律主线。关键事实：合同条款抽取与风险标记；规则引擎 11 类条款、span 回跳、三级风险；虚构标注评测分类/span/召回 100%、精确率 80%（假阳性来源已在仓库注明，案例中如实转述）；真实合同语料评测待补。仓库 `D:\Claudeworkspace\clause-scope`。

- [ ] **Step 2: 构建与检视**

Run: `npm run build`，Expected: PASS。
Run: `npm run dev`，检查 `/projects/`：法律主线分组下 5 张卡片，featured 顺序（statute-rag、cn-judbench、fakao-grader）出现在首页精选。

- [ ] **Step 3: 提交**

```bash
git add src/content/projects/
git commit -m "feat: 新增四个法律主线项目案例（judbench/grader/zhuma/clause-scope）"
```

---

### Task 13: 种子内容：文章 ×2 + 质检脚本（死链/密钥）

**Files:**
- Create: `src/content/posts/2026-09-25-statute-rag-recall.md`、`2026-09-28-github-portfolio-audit.md`
- Create: `scripts/check-links.mjs`、`scripts/check-secrets.mjs`
- Modify: `package.json`（scripts 增加 `check:links`、`check:secrets`）

- [ ] **Step 1: 第二篇文章（技术笔记）**

`src/content/posts/2026-09-25-statute-rag-recall.md`:

```markdown
---
title: 从 FTS5 到混合检索：法条底座召回率演进（44.7% 到 98.9%）
description: 一个法条检索底座的检索选型实录：FTS5 的真实边界、unicode61 中文分词的行为实证、BM25+向量混合的评测结果与口径说明。
category: 技术笔记
tags: [RAG, SQLite, 评测]
pubDate: 2026-09-25
---

## 起点：FTS5 是不是 RAG

legal-wisdom-app 时代我用 SQLite FTS5 做检索增强问答，一度被质疑「这不是 RAG」。
质疑是对的：无向量、无重排、无评测。但它也不是一无是处：条文号与明确术语的命中
上，FTS5 可控、可解释、可审计。问题出在我没有用数字说清它的边界。

## 实证：unicode61 对中文到底做了什么

SQLite unicode61 tokenizer 把连续 CJK 字符按空格与标点切分，整句会成为
超长 token，导致口语化问句召回崩坏。statute-rag 在真实问句小样本上测得
FTS5 基线 Recall@5 仅 44.7%，这个数字促成了混合检索的重写。

## 混合检索与评测

条/款/项结构分块，LIKE 精确、BM25 关键词、向量召回三路 RRF 融合，
合成金标 177 题、预注册协议评测：Recall@5 98.9%（+21.5pt），MRR 0.984。
合成金标与真实问句的口径差异在仓库 README 中如实标注，不混用。

## 下一步

真实问句金标集、中文 embedding 通道接入、引用 100% 可回跳校验。
```

- [ ] **Step 2: 第三篇文章（工程方法论，脱敏复盘）**

`src/content/posts/2026-09-28-github-portfolio-audit.md`:

```markdown
---
title: 我的 GitHub 作品集体检：一次全仓深度审计的复盘
description: 用三路并行调研给自己的 25 个仓库做了一次全面审计：安全红线、叙事一致性、可验证性三张清单，以及全部处置结果。
category: 工程方法论
tags: [作品集, 安全, 方法论]
pubDate: 2026-09-28
---

## 为什么审计自己

作品集的价值不在项目数量，在「可看、可测、可追问」。面试官的三连问
（检索用的什么、答错了谁负责、能给法务同事用吗）逼出了这次全仓体检。

## 三张清单

安全红线：泄漏的 API Key 当晚吊销、全历史 filter-repo 清除、敏感仓库转私有。
叙事一致性：README 宣称与仓库真实状态逐仓对账，「FTS5 检索增强」不再写成 RAG，
半成品撤出精选。可验证性：每个主推仓补齐三件套（可运行入口 + 指标表 + 已知失败案例）。

## 结果与教训

合计 85 例测试全绿、2 个 CI 上线、3 个真 bug 被顺手修掉；
statute-rag、clause-scope、legal-hallu-guard 三个新仓从缺口清单长出来。
最大的教训：包装之前先收口，指标先于功能，弱仓沉底强于硬凑门面。
```

- [ ] **Step 3: 死链检查脚本（TDD：先造坏链接验证会失败）**

`scripts/check-links.mjs`:

```js
// 扫描 dist/**/*.html 中的站内链接（href/src 以 / 开头），校验目标文件存在。
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const linkRe = /(?:href|src)="(\/[^"#?]*)[^"]*"/g;
const bad = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(linkRe)) {
    const path = decodeURIComponent(m[1]);
    const target = join(dist, path);
    const asFile = existsSync(target) && statSync(target).isFile();
    const asDir = existsSync(join(target, 'index.html'));
    if (!asFile && !asDir) bad.push(`${file}: ${m[1]}`);
  }
}
if (bad.length > 0) {
  console.error(`死链 ${bad.length} 个：\n${bad.join('\n')}`);
  process.exit(1);
}
console.log(`内链检查通过：${htmlFiles.length} 个页面，无死链。`);
```


验证：
1. 在某页面正文临时加 `<a href="/not-exist/">x</a>`，`npm run build && npm run check:links`，Expected: exit 1 并列出死链。
2. 移除临时链接，重跑，Expected: `内链检查通过`。

- [ ] **Step 4: 密钥扫描脚本**

`scripts/check-secrets.mjs`:

```js
// 扫描 dist 文本产物中的密钥特征串，命中即失败（内容红线，延续 P0 教训）。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const dist = resolve('dist');
const textExts = new Set(['.html', '.js', '.css', '.xml', '.svg', '.txt', '.json']);
const patterns = [
  [/sk-[A-Za-z0-9]{20,}/, '疑似 LLM API Key'],
  [/ghp_[A-Za-z0-9]{20,}/, '疑似 GitHub Token'],
  [/"?api[_-]?key"?\s*[:=]\s*["'][^"']{8,}["']/i, '疑似明文 api key 赋值']
];
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (textExts.has(extname(name))) files.push(p);
  }
})(dist);

let hits = 0;
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const [re, label] of patterns) {
    if (re.test(content)) { console.error(`${label}: ${file}`); hits++; }
  }
}
if (hits > 0) { process.exit(1); }
console.log(`密钥扫描通过：${files.length} 个文件无命中。`);
```

验证：在 `dist/index.html` 临时追加 `sk-test123456789012345678`，跑 `npm run check:secrets`，Expected: exit 1；还原后重跑 Expected: 通过。

- [ ] **Step 5: package.json scripts 追加**

```json
"check:links": "node scripts/check-links.mjs",
"check:secrets": "node scripts/check-secrets.mjs"
```

- [ ] **Step 6: 全量验证 + 提交**

Run: `npm run build && npm run check:links && npm run check:secrets && npm test`
Expected: 四连全绿。

```bash
git add src/content/posts/ scripts/ package.json
git commit -m "feat: 两篇种子文章与死链/密钥质检脚本，接入 npm scripts"
```

---

### Task 14: M2 验收（全绿基线）

**Files:**
- Modify: `README.md`（补「新增一篇项目案例/文章」操作指引）

- [ ] **Step 1: 完整验收命令序列**

Run（逐条，全绿才算过）:
```bash
npm run build        # 构建零错误
npm test             # 单测全绿（3 个用例）
npm run check        # astro check 零错误
npm run check:links  # 无死链
npm run check:secrets # 无密钥命中
```

- [ ] **Step 2: Lighthouse（移动端）**

Run: `npm run preview` 后另开终端：
```bash
npx lighthouse http://localhost:4321 --preset=perf --form-factor=mobile --screenEmulation.mobile --only-categories=performance,seo,accessibility,best-practices --view
```
Expected: 性能 ≥90、SEO ≥95、无障碍 ≥95。不达标则修（常见：图片尺寸、对比度、meta 描述缺失）后复测。

- [ ] **Step 3: 人工视检清单（明暗双模式各过一遍）**

首页 hero 一屏内且 CTA 不换行、数字条三列对齐、精选网格不对称（1 宽 2 窄）、案例页指标表完整、文章页代码块明暗两套配色正常、导航当前项高亮、页脚 RSS 与诗集链接可达。

- [ ] **Step 4: README 定稿 + 提交**

README 补两节：

```markdown
## 如何新增一篇项目案例
在 src/content/projects/ 建 <repo>.md，frontmatter 参照 statute-rag.md；
metrics 里的每个数字必须在正文「验证」一节可溯源。构建即校验，写错字段会构建失败。

## 如何新增一篇文章
在 src/content/posts/ 建 YYYY-MM-DD-<slug>.md，frontmatter 参照现有文章；
category 三选一（工程方法论/技术笔记/法学随笔）。发布前跑：
npm run build && npm run check:links && npm run check:secrets
```

```bash
git add README.md
git commit -m "docs: M2 验收通过，README 补内容维护指引"
```

---

## 自审记录（写计划后自检）

1. **Spec 覆盖**：M1（骨架/首页/关于/布局/部署链路的本地侧）→ Task 1-9；M2（案例引擎/种子内容/RSS/质检）→ Task 10-14。spec §7 的 Lighthouse、死链、密钥扫描、视觉验收都在 Task 14；§6 的 404 页与图片懒加载归入 M4（与双语、搜索同批），已在此声明。Pagefind 搜索 spec 归在 §5.3 功能但分期未明确指派，归 M4（内容量小，搜索暂无必要，YAGNI）。
2. **占位符**：站点常量里 `zhihu`/`email` 是「用户数据采集点」而非代码 TBD，Task 4/9 有明确执行动作；Task 12 案例正文以仓库 README 为事实源（计划已给关键事实清单与仓库路径）。
3. **类型一致性**：`Metric`（lib/metrics.ts，含 source）与 schema `metrics`（label/value/detail）是两处不同结构，组件各自取值无交叉；`formatDate` UTC 语义全站统一；NAV 三项与 M1/M2 实际存在的页面对应，M3 扩 NAV 不改组件。
