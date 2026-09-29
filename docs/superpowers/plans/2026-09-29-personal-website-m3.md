# 个人网站重做（M3）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development to implement task-by-task. 用户已确立执行模式：子代理逐任务实现（不逐任务审查），全部任务完成后统一做 spec 合规 + 代码质量双重审查，再合并修复批次。

**Goal:** 在已上线的 M1+M2 站点（12 页）上增加 M3 四个纵深栏目：法考备考专栏 `/exam/`、论文与研读 `/notes/`、Now 页 `/now/`、工具箱 `/toolbox/`，并扩展导航与首页动态区。

**Architecture:** 复用 M1+M2 已建立的全部模式：内容集合（zod schema）+ glob loader、`[slug]` 案例页模板、卡片组件、设计令牌、死链/密钥质检脚本。新栏目全是「内容集合 + 索引页」的组合，无新依赖。数据红线不变：每个数字可溯源、站内文案禁 em-dash、第三方版权 PDF 绝不上站（只做导读清单）、不可证实的内容一律 `draft: true`。

**Tech Stack:** 不变（Astro 5 + TS + Vitest + Node 脚本）。

**范围声明:** 本计划只做 M3。M4（双语、Pagefind、404、og:image、简历 PDF 接入、公网替换）另出计划。

**约定（与 M1+M2 计划一致）:**
- 工作目录 `D:\Claudeworkspace\个人网站`；从 main 新建分支 `feat/site-m3`，完成后合并回 main。
- 提交信息中文 `类型: 做了什么（为什么）`，每任务收尾时构建/测试必须绿。
- 素材事实源：法考数据读 `D:\Claudeworkspace\zhuma-fakao-review\README.md` 实测规模表；论文标题读 `D:\Claudeworkspace\papers\` 目录；Now 内容读 `D:\Claudeworkspace\github-portfolio-todo.md` 执行状态总账。
- 既有代码范本（实现者可直接读仓库内文件）：页面模板 `src/pages/blog/[slug].astro`、索引页 `src/pages/blog/index.astro`、卡片 `src/components/PostCard.astro`、schema `src/content.config.ts`。

---

### Task 1: exam 集合与法考专栏引擎

**Files:**
- Create: 分支 `feat/site-m3`；`src/lib/exam-progress.ts`；`src/pages/exam/index.astro`；`src/pages/exam/[slug].astro`
- Modify: `src/content.config.ts`（追加 exam 集合）

- [ ] **Step 1: 从 zhuma README 提取真实法考数据**

读 `D:\Claudeworkspace\zhuma-fakao-review\README.md` 的「实测规模」相关段落。提取：科目数、单元数、错题总数、单轮耗时等真实数字。**若 README 有分科目/分单元错题数，逐项提取用于看板；若没有，看板只做聚合卡（科目/单元/错题总数三个大数字），绝不编造分科目数据。** 把采用的数据与出处段落记入报告。

- [ ] **Step 2: exam 数据模块**

`src/lib/exam-progress.ts`（数字以 Step 1 实测为准，下例为结构示意，`AGG` 四值必须替换为 README 实测值）：

```ts
export interface ExamAgg {
  subjects: number;
  units: number;
  wrongQuestions: number;
  minutesPerRound: number;
}

/** 法考错题规模：全部取自 zhuma-fakao-review README 实测规模表，更新时同步更新 EXAM_DATA_AS_OF。 */
export const EXAM_AGG: ExamAgg = {
  subjects: 0, // ← 替换为 README 实测值
  units: 0,
  wrongQuestions: 0,
  minutesPerRound: 0
};

export const EXAM_DATA_AS_OF = '2026-09';
```

- [ ] **Step 3: exam 集合 schema**

在 `src/content.config.ts` 追加（imports 不变，collections 导出加入 exam）：

```ts
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
```

创建 `src/content/exam/.gitkeep`。

- [ ] **Step 4: 专栏索引页** `src/pages/exam/index.astro`

结构（scoped style 风格对齐 `src/pages/projects/index.astro`）：h1「法考备考」→ 概况段（一句话：备战国家统一法律职业资格考试，以错题为驱动；数据截至 {EXAM_DATA_AS_OF}）→ 聚合卡行（复用 MetricStrip 的视觉语言：科目/单元/错题/单轮耗时 四个数字卡，实现为本页 scoped style，不强行复用组件）→ 该板块的 exam 文章列表（过滤 draft，按 date 降序，复用 PostCard——exam 条目结构与 PostCard 期望的 posts 字段不同，**不要硬塞 PostCard**，本页内联一个简单列表项样式即可）。空集合时文章区不渲染。

- [ ] **Step 5: 文章页** `src/pages/exam/[slug].astro`

以 `src/pages/blog/[slug].astro` 为模板逐字改三处：getStaticPaths 的集合名、frontmatter 解构字段（title/description/type/subject/date/draft，meta 行渲染 `{type}{subject && ` · ${subject}`} · {formatDate(date)}`）、返回链接 `/exam/`。draft 过滤必须保留。

- [ ] **Step 6: 验证 + 提交**

Run: `npm run build`（应含 /exam/ 页）与 `npm test` 全绿；`npm run dev` 后台 curl 验证 `/exam/` 含「法考备考」与聚合数字。提交：`feat: 法考专栏引擎（聚合看板+文章页），数据取自 zhuma 实测规模`。

---

### Task 2: exam 种子内容（方法论 ×1 + 板块说明）

**Files:**
- Create: `src/content/exam/2026-09-18-wrong-question-pipeline.md`

- [ ] **Step 1: 写方法论文章**

读 `D:\Claudeworkspace\zhuma-fakao-review\README.md` 的方法论/六维审查/质量保障段落，撰写（数字以 README 为准，框架如下，正文可润色但事实不得超出 README）：

```markdown
---
title: 错题怎么变成可背诵的笔记：我的复习管线
description: 1655 道错题、18 个科目、41 个单元，如何用一条多 Agent 审校管线变成 18 册可打印的背诵笔记 PDF。
subject: 备考方法
type: 方法论
date: 2026-09-18
draft: false
---

## 问题：错题的价值在复习，不在收藏

（正文：错题堆积问题；手工整理不可持续；目标是无人工干预的端到端管线）

## 机制

（正文：切分→生成→六维审查→P0 复审→PDF 装订的管线描述，对照 README；
原子写、熔断、防注入等工程保障一句带过，细节指向项目案例页 /projects/zhuma-fakao-review/）

## 验证

（正文：README 实测规模数字——18 科目、41 单元、1655 题错题、约 9 分钟/轮、
18 册 8.3MB + 129 页总册；22 例测试）

## 边界

（正文：只处理本人真实错题；输出是背诵笔记不是知识本身；审查规则覆盖面有限，
已知失败对照 README）
```

- [ ] **Step 2: 验证 + 提交**

`npm run build` 后 `/exam/` 列表出现该文；正文数字与 README 逐项对照记录在报告。提交：`feat: 法考专栏首篇方法论文章（错题管线）`。

---

### Task 3: notes 集合与种子（论文 draft ×3 + DAO 文献导读 ×1）

**Files:**
- Create: `src/content/notes/`（4 个 md）；Modify: `src/content.config.ts`、`src/pages/notes/index.astro`、`src/pages/notes/[slug].astro`

- [ ] **Step 1: schema**

```ts
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
```

- [ ] **Step 2: 页面引擎**

`src/pages/notes/index.astro`（按 category 分组列表，过滤 draft；组内条目渲染 title/status/date/description，风格对齐博客索引页）与 `src/pages/notes/[slug].astro`（模板对齐 exam 文章页，meta 行 `{category} · {status} · {formatDate(date)}`，返回链接 `/notes/`）。

- [ ] **Step 3: 种子内容（三条论文一律 draft: true，用户 M4 确认后才发布）**

- `bracton.md`：读 `D:\Claudeworkspace\papers\布雷克顿论文\` 目录名与文档标题，写课程论文条目（法律史方向，标题以论文实际标题为准；描述一句话；`category: 课程论文, draft: true`）。正文只写研究问题与方法概述（从文档目录/首页可见信息提取，**不复制论文正文上站**）。
- `non-compete.md`：同法处理 `D:\Claudeworkspace\papers\竞业限制论文\`（劳动法方向，draft: true）。
- `campus-history.md`：同法处理 `D:\Claudeworkspace\papers\校史论文\`（draft: true）。
- `dao-reading-list.md`：`category: 文献研读, draft: false`，标题「DAO 法律主体性：一份中英文文献导读」。正文 = 从 `D:\Claudeworkspace\papers\DAO文献\` 目录的 15+ 份 PDF 文件名整理的文献清单（每行：作者年份、标题、一句话主题），开头声明「文献全文受版权保护不在此分发，清单仅作研读索引」。**这是合规的干货形态：只有书目信息，无全文。**

- [ ] **Step 4: 验证 + 提交**

`npm run build`；`/notes/` 只应出现 DAO 导读（三条 draft 被过滤）；`curl` 验证。提交：`feat: 论文与研读栏目（论文条目 draft 待用户确认，DAO 文献导读发布）`。

---

### Task 4: Now 页（月更真实状态）

**Files:**
- Create: `src/content/now/2026-09.md`；`src/pages/now.astro`；Modify: `src/content.config.ts`

- [ ] **Step 1: schema**

```ts
const now = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
  schema: z.object({
    period: z.string().regex(/^\d{4}-\d{2}$/),
    updated: z.coerce.date()
  })
});
```

- [ ] **Step 2: 2026-09 内容**

`src/content/now/2026-09.md` frontmatter：`period: 2026-09`、`updated: 2026-09-29`。正文（H2 分块，全部事实取自 `D:\Claudeworkspace\github-portfolio-todo.md` 执行状态总账与本站建设实况，不编造）：
- **备考**：法考备考推进中（错题管线月处理规模见 /exam/）。
- **构建**：statute-rag v0.2 排队中（待中文 embedding 通道）；clause-scope 真实合同语料评测待补；judgment-struct 受阻于语料获取。
- **写作**：本站 M3 建设中（法考/论文/Now/工具箱四栏目上线）。
- **待决**：简历 PDF 与个人照片待补（M4 上线前）。

- [ ] **Step 3: 页面** `src/pages/now.astro`

单页（非 [slug]）：取 `getCollection('now')` 按 period 降序的第一个条目，渲染 `{period}` 标题 + 正文（prose）+ 「This is a /now page」式一句说明（什么是 now 页，链到 https://nownownow.com/ ，target blank）。多期历史不渲染（YAGNI，月更后自然替换）。

- [ ] **Step 4: 验证 + 提交**

`npm run build` + curl `/now/`。提交：`feat: Now 页与 2026-09 期内容`。

---

### Task 5: 工具箱（仅公开仓，逐个验证后入库）

**Files:**
- Create: `src/content/toolbox/`（若干 md）；`src/pages/toolbox/index.astro`；Modify: `src/content.config.ts`

- [ ] **Step 1: schema**

```ts
const toolbox = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/toolbox' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    description: z.string(),
    category: z.enum(['法律工具', '工程小件'])
  })
});
```

- [ ] **Step 2: 逐仓验证公开性后入库**

候选清单（GitHub 用户 1438388098-glitch 名下）：fakao-grader、zhuma-fakao-review、statute-rag、cn-judbench、clause-scope、legal-hallu-guard、pdf-legal-zh-translator、legal-wisdom-app、legal-job-tracker、fakao-shuati、zhcrypt。**每个候选先 `curl -s -o /dev/null -w '%{http_code}' https://github.com/1438388098-glitch/<repo>`，200 才入库，404/301 到登录页的跳过并在报告记录。** 每条一个 md（文件名 = repo 名），description 一句话（从各仓 GitHub description 或 README 首行取，禁止编造功能）。分类：前九个「法律工具」，zhcrypt 若公开归「工程小件」。

- [ ] **Step 3: 页面** `src/pages/toolbox/index.astro`

按 category 分组的卡片列表（name 为外链、description 一行、卡片风格对齐 ProjectCard 但更轻——本页内联样式）。空分组不渲染。

- [ ] **Step 4: 验证 + 提交**

`npm run build` + curl 验证清单条数与 HTTP 验证结果一致。提交：`feat: 工具箱栏目（公开仓逐一验证后入库）`。

---

### Task 6: NAV 扩展与首页动态区

**Files:**
- Modify: `src/lib/site.ts`、`src/pages/index.astro`

- [ ] **Step 1: NAV 扩展**

`NAV` 改为：项目 / 博客 / 法考(/exam/) / 笔记(/notes/) / 工具箱(/toolbox/) / 关于。Header 组件无需改动（读 NAV 渲染）。构建后确认桌面宽度下导航单行不换行（dist HTML 检查项数即可，视觉留给验收）。

- [ ] **Step 2: 首页动态区**

在「最近写作」区块之后新增两个信息块（保持不对称与低动效，实现为 index.astro 内联 section）：
- **法考卡**：一句概况 + `{EXAM_AGG.subjects} 科目 / {EXAM_AGG.wrongQuestions} 错题`（数据自 `src/lib/exam-progress.ts`）+ 链接 `/exam/`；
- **Now 摘要**：最新期 period + 正文前 2 个 H2 标题 + 链接 `/now/`。
布局：两个块在桌面端并为 2fr/1fr 网格（法考卡宽、Now 窄），窄屏单列。

- [ ] **Step 3: README 更新**

「如何写内容」节补三行：exam（法考文章，type 三选一）、notes（论文与研读，draft 默认 false 需显式发布）、now（月更：复制上一期 md 改 period 与内容）。

- [ ] **Step 4: 验证 + 提交**

五连（build/test/check/check:links/check:secrets）全绿；curl 首页含新动态区。提交：`feat: 导航扩展至六栏，首页动态区接入法考与 Now`。

---

### Task 7: M3 验收

- [ ] **Step 1:** 五连全绿（记录输出关键行）。
- [ ] **Step 2:** 产物抽查：`dist/exam/`、`dist/notes/`（仅 DAO 导读一篇可见）、`dist/now/index.html`、`dist/toolbox/`；首页动态区；导航六项；全站 em-dash 扫描零命中（含实体形态）；`grep -c draft` 相关页面确认 draft 条目未泄漏到任何 dist 页面。
- [ ] **Step 3:** 修复发现的问题（只修验收阻断项）后提交：`docs: M3 验收通过`（或有修复则分开提交）。

---

## 自审记录

1. **Spec 覆盖**：spec §3.3 法考专栏（看板+方法论+错题笔记位）、§2 /notes/ /now/ /toolbox/、§3.1 首页动态区（法考进度+Now 摘要）、§5.2 四个新集合 schema——全部有任务对应。错题笔记原文上站涉及个人学习数据，本计划不主动上站，待用户提供（遗留清单）。
2. **占位符**：exam-progress.ts 的 EXAM_AGG 数值是指令性占位（必须替换为 README 实测值并有验证步骤），属用户数据采集点，非代码 TBD。
3. **类型一致性**：exam/notes/now/toolbox 四集合字段与各自页面解构一一对应；首页动态区引用 EXAM_AGG 与 now 集合的字段名与 Task 1/4 定义一致；PostCard 不被跨集合滥用。
