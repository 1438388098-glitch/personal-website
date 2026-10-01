# v3 设计体系适配指南（瑞士风格底子 + 小图形设计元素）

参考实现（唯一视觉基准）：`demo/redesign-demo.html`（v3 版）。改任何页面前先打开它对照。
全局令牌与公共类已落在 `src/styles/global.css`，组件已在 `src/components/` 适配完毕。页面只做「样式层」适配，**不改内容、不改信息结构、不改路由与链接**。

## 已定稿的设计语言（不要发明新花样）

- **底色**：暖白 `--bg` #faf9f6（暗色 #151513），面板 `--surface`；文字 `--text`，次要 `--text-muted`。
- **强调色 `--accent`**：亮 #2745f0 / 暗 #8b9dff。**只用于小元素**：小方块标记、区块编号、链接、hover 指示、焦点环。禁止大面积铺色、禁止用于正文强调块背景。
- **墨色 `--ink`**：亮 #17160f / 暗 #f2f1ea。强边框 `--border-strong` 与主按钮底都用它。
- **零圆角**：所有 border-radius 移除（全局已是 0；页面里残留的圆角一律删）。零投影（除 .card hover 的 --shadow-card）。无噪点纹理。
- **字体**：全站 `var(--font-display)`（Archivo + Noto Sans SC）。**衬线已废**：页面里出现 `var(--font-serif)` 的一律换成 `var(--font-display)`，不要再引入衬线。数字/日期/编号用 `.mono` 类（Space Mono）。
- **标题**：h1 900 字重（全局已定），h2 800。**旧的 h2 朱砂左侧竖条已全局删除**，页面里不要再加彩色侧条。
- **链接**：内容链接保持全局蓝色；标题类链接用墨色 + hover 蓝下划线（`text-decoration-color: var(--accent)`）。
- **层级靠字重与留白**，区块头用统一的 `.sec-head` 模式：

```html
<div class="sec-head">
  <span class="sec-no">01</span>   <!-- 等宽蓝色编号，全页按区块顺序递增 -->
  <h2>页面标题<span class="sec-en">English Label</span></h2>  <!-- sec-en：小号大写宽字距英文对照 -->
  <a href="...">更多 →</a>          <!-- 可选，右对齐 -->
</div>
```

- **小图形元素**（页面可按需使用，克制）：标签前 8px 蓝方块；列表行左缘 7px hover 指示方块（PostCard/EntryCard 已实现）；等宽编号描边小方框（ProjectCard 的 .idx）；反色通栏块两角的 `+` 记号。
- **数字与日期一律 `.mono`**：指标值、统计、日期列。
- **暗色模式**：只通过令牌生效（global.css 已配好），页面内不要硬编码颜色（#fff/#000/具体 hex 一律换成令牌）。`color-mix(in srgb, var(--ink) X%, transparent)` 可用于淡底纹。
- **a11y 红线不动**：focus-visible、skip-link、对比度、`prefers-reduced-motion`、现有注释里的 a11y 说明都保留。

## 各页具体要求

- **每个页面顶部的主标题区**（若有 hero 式大标题）：h1 用全局样式即可，页面级只调间距；可加 `.label` 式导语（8px 蓝方块 + 0.86rem 粗体 + `.sec-en` 英文对照）。
- **卡片**：用全局 `.card`（已直角白面），页面级只调 padding。
- **列表行**（文章/条目）：参照 PostCard 新样式——顶部分隔线 + 左缘 hover 方块 + 标题墨色。
- **表格/筛选器/搜索框**：直角化，边框 `--border`，聚焦 `--accent`。
- **分页/标签 pill**：直角小框，active 态墨底反白。
- ** prose 正文**：全局已适配（引用块蓝色左线、直角代码块），页面无需再改；若页面里写死了颜色，换成令牌。
- **页面 <style> 里残留的旧视觉**：朱砂侧条、衬线、圆角、噪点、pulse 圆点动画——全部清除。
- 保持既有中文注释风格，改动处顺手更新过时注释。
