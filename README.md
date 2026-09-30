# 胡圣炜的个人网站

「法律 × AI」个人品牌站：项目案例、技术写作、法考备考、读书笔记。
设计文档见 docs/superpowers/specs/，实施计划见 docs/superpowers/plans/。

## 如何运行
    npm install
    npm run dev      # 本地开发 http://localhost:4321
    npm run build    # 产出 dist/
    npm run preview  # 本地预览构建产物

## 如何测试
    npm test               # Vitest 单测（纯函数）
    npm run check          # astro check 类型检查
    npm run build          # 构建（构建后自动跑 trim-dist 清理字体产物）
    npm run check:links    # 全站死链检查（需先 npm run build）
    npm run check:secrets  # 密钥泄漏扫描
    npm run check:style    # 文风红线扫描（破折号/黑话禁词/句式堆叠）
    npm run check:audit    # 依赖漏洞雷达（固定官方 registry；定期手动跑，暂不入 CI）

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
- 法学随笔等栏目 category 七选一：工程方法论/技术笔记/法学随笔/游戏手记/杂谈/经济观察/热点快评。

## 如何新增一篇项目案例
在 src/content/projects/ 建 <repo>.md，frontmatter 参照 statute-rag.md；
metrics 里的每个数字必须在正文「验证」一节可溯源。构建即校验，写错字段会构建失败。

## 如何新增一篇文章
在 src/content/posts/ 建 YYYY-MM-DD-<slug>.md，frontmatter 参照现有文章；
发布前跑：
    npm run build && npm run check:links && npm run check:secrets && npm run check:style
