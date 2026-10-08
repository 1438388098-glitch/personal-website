# GitHub 头像（品牌素材）

站主 GitHub 头像的候选与定稿。**2026-10-08 选定 E**：一端墨色方块（成文规则）、一端蓝色圆（概率模型）、
中间是天平。保留法律身份，把原来的庄严徽章改成了结构图。

| 文件 | 用途 |
|------|------|
| `avatar-E.png` | **上传用**。512×512 方图，GitHub 上传后自行裁圆 |
| `avatar-E.svg` | 矢量源。纯几何、不含文字，不依赖 Archivo，可任意缩放改色 |
| `sheet.png` | 六版对比表：每版都有圆形裁切、完整方图、16/20/44/64px 四档 |
| `e-final-check.png` | 定稿的圆形裁切验收：380/96/64/32/20px + GitHub 页头式摆位 |
| `avatar-prev.png` | 换头像前的旧图，仅用于对比表的「上一版」列 |
| `marks.mjs` | 六个候选的几何定义（唯一事实来源） |
| `build.mjs` | 出图：PNG + SVG + 对比表 |
| `check-final.mjs` | 圆形裁切验收图 |
| `template.html` | 对比表的页面模板 |

## 设计规矩

与 `demo/redesign-style-guide.md` 同源，不另立一套：

- 只用站点令牌：暖白 `#faf9f6`、墨 `#17160f`、强调蓝 `#2745f0`（暗色版 `#8b9dff`）
- 零圆角；字样用 Archivo 900
- **内容必须留在内切圆内**：GitHub 头像一律裁圆，方图上传、显示成圆
- 验收看四档：16 / 20 / 44 / 64px。信息流里就是 16–20px，放大好看不算数

## 怎么改、怎么重出

改 `marks.mjs` 里的几何，然后：

    node demo/avatar/build.mjs        # 重出 6 张 PNG + SVG + sheet.png
    node demo/avatar/check-final.mjs  # 重出定稿的圆形裁切验收图（换字母即换候选，如 check-final.mjs A）

`sheet.png` 的「上一版」对照格取自 `avatar-prev.png`（换头像前的旧图存档）；把该文件删掉，这一格会自动省掉。

## 渲染上的坑（改脚本前先读）

`build.mjs` 走 Chrome headless，不走 sharp 的 SVG 管线。原因是 librsvg（sharp 的 SVG 后端）依赖
fontconfig，**不认识 CSS `@font-face`**，而 Archivo 在本机没有系统安装，用 sharp 渲染含 `<text>` 的 SVG
会静默回退到系统字体，不报错，图看着「差不多但不对」（和 2026-10-07 全站字体静默失效同一个坑）。

因此：把 `archivo-latin-wght-normal.woff2` 以 base64 内联进 HTML 的 `@font-face`（用 data URI 而非
`file://` 路径，绕开 file:// 下的字体跨源限制），并给 `--virtual-time-budget`，否则可能在字体就绪前截图。
另注意 `--screenshot` **只截视口**，`--window-size` 的高度必须大于内容，否则底部被裁。

## 上传

GitHub 的 REST API 没有改头像的接口（`PATCH /user` 不含 avatar），只能在网页端传：
Settings → Public profile → Profile picture → Edit → Upload a photo，选 `avatar-E.png`。
头像显示尺寸为 460×460，本文件 512×512 足够。
