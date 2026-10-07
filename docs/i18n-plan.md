# 全站双语（zh 根路径 + /en/）实施计划

> 状态标记：[ ] 未做 / [x] 已做。本文档是本轮 i18n 改造的执行记录与验收标准。

## 0. 范围与不做的事

**做（档 1）**：双语骨架 + 全部 UI 文案 + 项目 22 篇 + 首页/关于/Now/工具箱 + 5 篇代表作博文 + 英文搜索索引 + hreflang/语言切换器/首访跳转 + 门禁与金标检验。

**明确不译**：法考（exam，2 篇）、笔记（notes，4 篇）——中文读者语境，无英文对应页。中文 URL、路径、发布状态全部不动。

**不做**：部署到服务器、push GitHub（发布公网需用户确认）；克兰西案等立场敏感博文不译（英文措辞未经用户审校，宁可缺不可错）。

5 篇代表作：statute-rag-recall（方法主线）、legal-hallu-guard、legal-job-tracker-33-sources、supreme-court-ai-24（政策解读）、tech-explosion-eve-2（技术爆炸系列）。

## 1. 架构决策

| 决策 | 内容 | 为什么 |
|---|---|---|
| 不用 Astro i18n 配置 | 手写 `/en/` 路由 + `src/lib/i18n.ts` | @astrojs/sitemap 的 i18n hreflang 映射假定所有语言带前缀，zh 无前缀会错配；手写零框架风险 |
| zh 留根、en 走 `/en/` | `prefixDefaultLocale: false` 语义 | 现有 URL 一条不动，存量收录不受损 |
| en 内容放 `src/content-en/` | 独立集合 postsEn/projectsEn/nowEn/toolboxEn，复用 zh schema | `src/content/` 字节不动（金标 A 的前提）；同文件名配对 |
| 分类/标签/分组保持中文枚举值 | 展示层经字典映射英文 | ID 稳定，schema 复用，配对校验简单 |
| 页面抽模板 | `src/templates/*.astro` 接 `lang` prop，zh/en 两个薄壳页面 | 12 个页面单源，避免两套模板漂移 |
| 语言信号顺序 | cookie > Accept-Language（首访根路径 JS 兜底）> 服务器 IP 层（nginx/CF，交付配置文档不上线） | 浏览器语言是真实偏好，IP 只是代理变量；Google 官方立场反对纯 IP 跳转 |

## 2. 交付物清单

- [x] P1 `src/lib/i18n.ts`：zh/en 字典（导航、页脚、aria、meta、卡片、搜索 UI、首页/关于文案），`langOf()`、`localized()`、`formatDate(lang)`；英文分类/标签/分组标签映射
- [x] P1 `src/content.config.ts`：新增 4 个 en 集合
- [x] P2 模板抽取：index/about/now/search/404/toolbox/blog 列表/blog 详情/projects 列表/projects 详情/tags 列表/tags 详情（zh 页变薄壳，en 页新建）
- [x] P3 BaseLayout/BaseHead 参数化：html lang、og:locale、hreflang 双向 + x-default、en RSS、首访跳转脚本（cookie `site-lang`、bot 守卫、仅根路径）、Header 语言切换器与 en 导航子集
- [x] P3 astro.config：anchorLinks 英文 aria-label、sitemap lastmod 覆盖 en 路径
- [x] P4 内容翻译：22 项目 + 5 博文 + now 2 期 + 工具箱 11 条（`src/content-en/`，文件名与 zh 相同，指标数值逐位不变）
- [x] P5 `/en/search/` + `/en/search-index.json` + `/en/feed.xml`；search.ts 加英文词边界分词
- [x] P6 门禁：`scripts/check-i18n.mjs`（配对/元数据对齐/数字保真/汉字渗漏/长度比）、`scripts/content-golden.mjs`（金标 A）、check-dist 扩展 en 断言、gates/vitest 新测试
- [x] P7 检验：双金标（A 中文内容零回归、C 中文产物 diff 零回归）+ 定制翻译检验（B 结构对齐 + 术语一致性）+ 截图走查
- [x] P8 分组提交；`docs/i18n-rollout.md` 交付 nginx/CF IP 层配置（部署时人工应用）

## 3. 双金标与定制翻译检验的定义

- **金标 A（中文内容零回归）**：`src/content/**` 全量 SHA256 清单（`scripts/content-golden.json`），任何改动即失败，`--update` 显式再生。
- **金标 C（中文产物零回归）**：改造前基线 dist 存仓库外目录，改造后逐字节比对全部 zh HTML；白名单仅限 hreflang/alternate 新增行。
- **定制翻译检验（金标 B + 翻译质量）**：
  1. 配对完整：en 文件与 zh 同名一一对应，无孤儿；
  2. 元数据对齐：pubDate/date/category/tags/relatedPosts/links 逐字段相同；
  3. 数字保真：zh 正文全部数字（含汉字数字条号→阿拉伯数）在 en 正文可寻，逗号分隔容错；
  4. 汉字渗漏：en 正文除《》书名号内不得出现汉字（frontmatter 中文枚举 ID 豁免）；
  5. 长度比：en 词数 / zh 汉字数在 0.35–1.3 区间；
  6. 术语一致：术语表禁变体（盲写≠blind transcription 等）+ 禁用机器翻译腔词表；
  7. en 页产物无汉字渗漏 + html lang=en（check-dist 扩展）。

## 4. 风险与对策

- 在途改动已快照入库（b6f0ea9），此后每个提交只含 i18n 文件；提交前查 `git log` 防并发会话。
- en summary/description 受 schema 160/120 字符上限约束：英文写得短，超限即改写。
- 英文侧文风：平实句、第一人称、短句、零营销黑话、不用长破折号；数字与 zh 逐位一致。
- 字体：en 页正文走 Archivo（Latin 自动命中），品牌行「胡圣炜」分片 preload 全站保留；en 首页不 preload Noto hero 分片（`/` 精确匹配已天然排除 `/en/`）。


## 5. 执行结果（2026-10-07 夜间自主运行）

- 提交链：b6f0ea9（在途快照）→ 027810d（双语骨架）→ e5398a3（首批内容）→ 78c1ed0（22 项目）→ 574217f（5 博文）→ 本轮修复与门禁。
- 双金标：
  - 金标 A（content-golden）：72 个中文内容文件哈希清单入库；再生时吸收了并行会话的 fakao-tracker.md 修订（bae2a3a）与新博文 eve-3（未跟踪，归并行会话提交）。
  - 金标 C（verify-zh-dist.mjs 对比 b6f0ea9 基线构建）：77 个既有 zh 页面可见文本与链接集零回归；15 处差异全部归属并行会话（法考七环节改版、eve-3 涟漪）。审查中抓到并修复 4 处转写丢空格（about 页 JSX 换行语义）。
- 定制翻译检验（check-i18n + check-dist en 断言）：配对/元数据/数字保真（万·亿·k·M 量级归一、汉字条号转阿拉伯）/汉字渗漏/长度比全绿；48 个 en 页断言通过。
- 视觉走查：zh/en 双首页带样式截图合格（数字面板逐位一致、切换器/导航正确、暗色正常）。
- 测试 76/76，astro check 0 错误，check-links 140 页无死链。
- 并行会话（bae2a3a + 未跟踪 eve-3）全程隔离，未扫入本工作提交。
