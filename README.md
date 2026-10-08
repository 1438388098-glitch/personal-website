# 胡圣炜的个人网站

线上地址：https://iweistoicqc5.top

「法律 × AI」个人品牌站：项目案例、技术写作、法考备考、读书笔记。
设计文档见 docs/superpowers/specs/，实施计划见 docs/superpowers/plans/。

## 如何运行
Node ≥ 22.12（开发环境 22 LTS，见 .nvmrc）。
    npm install
    npm run dev      # 本地开发 http://localhost:4321
    npm run build    # 产出 dist/
    npm run preview  # 本地预览构建产物

## 如何测试
    npm test               # Vitest 单测（纯函数）
    npm run check          # astro check 类型检查
    npm run build          # 构建（构建后自动跑 trim-dist 清死重、subset-fonts 按用量子集化字体）
    npm run check:dist     # 产物冒烟（必需资产齐全、后处理生效、字体覆盖与预算；需先 npm run build）
    npm run check:links    # 全站死链检查（需先 npm run build）
    npm run check:secrets  # 密钥泄漏扫描
    npm run check:style    # 文风红线扫描（破折号/黑话禁词/句式堆叠）
    npm run check:content  # 内容日期一致性（文件名前缀须等于 frontmatter 日期）
    npm run check:scripts  # scripts/*.mjs 的 JSDoc 类型检查（tsconfig.scripts.json，无需构建）
    npm run check:audit    # 依赖漏洞雷达（固定官方 registry；由定时任务跑，PR/push 不跑）
    npm run check:extlinks # 站外链接探活（网络门禁易抖动；由定时任务跑，PR/push 不跑）
    npm run fonts:budget   # 按页复算字体命中分片与字节数（判断「字体还能不能再压」的数字来源）

## 字体管线（改字体相关的东西前先读）
- 字体族名必须与包声明逐字一致：`@fontsource-variable/*` 的族名带「 Variable」后缀
  （`'Archivo Variable'` / `'Noto Sans SC Variable'`），静态包才不带（`'Space Mono'`）。
  写错不会报错，只会静默落到系统字体——2026-10-07 之前全站就是这样，详情见
  docs/perf-review-2026-10-07.md。
- 构建顺序：`astro build` → `trim-dist`（删 .woff 死重、抹悬挂引用）→ `subset-fonts`
  （按 dist 实际用字逐片子集化并收窄 unicode-range，零命中的分片连 @font-face 一起删）。
  `subset-fonts` 必须在 `trim-dist` 之后跑，且每次都从 Astro 新写的原始分片开始，可重复执行。
- `subset-fonts` 依赖 devDependency `subset-font`（HarfBuzz 的 WASM 封装）：
  自托管 CJK 可变字体按需裁剪只有它能做，纯 Node、构建期跑，不进浏览器产物。
  它没有随包发类型声明，本仓库用 `scripts/subset-font.d.ts` 收窄声明。
- 首屏分片 preload 只在 `components/BaseHead.astro` 维护：换品牌名或首页主标题文案时，
  要按该文件注释里的步骤重新求命中分片。

## 如何写内容
    src/content/projects/  项目案例（.md，frontmatter 见 src/content.config.ts）
    src/content/posts/     博客文章（.md）
    src/content/exam/      法考文章（.md，type 三选一：方法论/错题笔记/周记）
    src/content/notes/     论文与研读（.md，默认发布，需隐藏须显式写 draft: true）
    src/content/now/       Now 月更（复制上一期 .md，改 period 与正文内容）
    src/content/toolbox/   工具箱（.md，文件名 = repo 名，url 需验证公开可访问）
（M3 四栏目 exam/notes/now/toolbox 已上线，2026-09-29 验收通过）
    正文排版约定：一个自然段一行（不手工折行），2026-09 起的存量文章按此惯例。

## 发布机制（定时发布）
- 文章 pubDate 写未来时间是合法的：构建与 RSS 经 `src/lib/publish.ts` 的 `isPublished`
  统一过滤，到点自然出现在列表、详情、订阅源与 sitemap。
- CI 每日构建（UTC 00:00，北京时间 08:00）只做「到日文章可正常产出」的验证，
  不部署：站点上线需手动 `npm run build` 后发布 dist/。
- **推拉纪律**：本仓库曾出现两条并行线（同一份 main 在两地各自提交，2026-10-05 到 10-07 分叉成
  本地 29 个 / 远端 18 个提交，线上跑的是远端线）。已于 2026-10-07 合并。动手前先 `git fetch` 并看
  `git rev-list --left-right --count HEAD...origin/main`，非 0 0 就先合并再改，别在两条线上各写各的。
- 换页走 View Transitions + hover 预取（`astro.config.mjs` 的 prefetch）。预取已经把重复传输
  省掉，但 HTML 仍是 `no-cache`，每次换页要回一次源站；想让点击真正零等待要改 nginx 的
  HTML 缓存头，方案与风险见 docs/perf-review-2026-10-07.md 第四节。
- 法学随笔等栏目 category 七选一：工程方法论/技术笔记/法学随笔/游戏手记/杂谈/经济观察/热点快评。

## 如何新增一篇项目案例
在 src/content/projects/ 建 <repo>.md，frontmatter 参照 statute-rag.md；
metrics 里的每个数字必须在正文「验证」一节可溯源。构建即校验，写错字段会构建失败。

## 如何新增一篇文章
在 src/content/posts/ 建 YYYY-MM-DD-<slug>.md，frontmatter 参照现有文章；
发布前跑：
    npm run build && npm run check:links && npm run check:secrets && npm run check:style
