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
