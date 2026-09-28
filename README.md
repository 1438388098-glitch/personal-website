# 炜 · 个人网站

> 中南财经政法大学 · 法学本科在读 | 个人展示网站

## TL;DR (EN)

Personal website of an undergraduate law student at Zhongnan University of Economics and Law.
It serves as a portfolio gateway: legal coursework and moot court case studies, community legal aid volunteering,
and self-built tech projects — including a self-hosted poetry website with a PHP admin panel and a local LLM (Ollama/Qwen3) deployment.
Pure static front-end (HTML/CSS/vanilla JS, zero framework dependencies) with an optional PHP admin backend; bilingual (CN/EN), PWA-ready.

## 概述

一个现代、简洁、响应式的个人网站，用于展示学业成果、项目经历和技能特长。面向潜在雇主、实习招聘官和研究生导师。

### 技术栈

- **HTML5** + **CSS3** + **原生 JavaScript**（零框架依赖）
- **Tailwind CSS v3** — 仅用于基础的容器和排版工具类
- **Font Awesome 6** — 图标库
- Google Fonts **Inter** — 字体
- 深色/浅色模式 — 基于 CSS 自定义属性和 `prefers-color-scheme`

## 目录结构

```
personal-website/
├── index.html          # 主页面
├── 404.html            # 404 错误页面
├── css/
│   └── style.css       # 全部自定义样式
├── js/
│   ├── projects.js     # 项目作品数据
│   └── app.js          # 主脚本（导航、主题、动画、表单等）
├── images/             # 存放个人照片和项目截图（WebP 格式）
└── README.md           # 本文件
```

## 功能特性

- ✅ **响应式设计** — 完美适配桌面、平板和手机
- ✅ **深色/浅色模式** — 手动切换，自动保存偏好
- ✅ **平滑滚动** — 所有锚点链接平滑过渡
- ✅ **滚动进入动画** — Intersection Observer 驱动的淡入效果
- ✅ **项目作品筛选** — 按类别（课程/个人/竞赛/实践）动态筛选
- ✅ **项目详情模态框** — 点击卡片弹出完整信息
- ✅ **技能进度条动画** — 滚动到视口时自动填充
- ✅ **联系表单验证** — 实时 + 提交时双重验证
- ✅ **Toast 消息提示** — 表单提交成功/错误反馈
- ✅ **返回顶部按钮** — 滚动超过 400px 时显示
- ✅ **汉堡菜单** — 移动端全屏导航
- ✅ **固定导航栏** — 滚动时背景变半透明
- ✅ **图片懒加载** — 原生 `loading="lazy"`
- ✅ **语义化 HTML** — header / section / footer / nav 等
- ✅ **SEO meta 标签** — Open Graph、description、keywords
- ✅ **无障碍支持** — ARIA 标签、键盘导航（Esc 关闭模态框）

## 如何运行

### 本地直接打开（推荐）

该项目为纯静态网站，无需构建步骤。直接用浏览器打开 `index.html` 即可：

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 使用本地服务器（可选，推荐以获得最佳效果）

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js (npx)
npx serve .

# 使用 VS Code Live Server 插件
# 右键 index.html → Open with Live Server
```

### 自定义内容

1. **个人信息** — 编辑 `index.html` 中的姓名、学校、专业、简介等文字
2. **项目作品** — 编辑 `js/projects.js` 中的 `projectsData` 数组
3. **个人照片** — 将照片（WebP 格式）放入 `images/` 目录，更新 HTML 中的占位图
4. **简历文件** — 将 PDF 简历放入 `images/` 目录，更新下载链接的 `href`
5. **联系方式** — 更新邮箱地址、社交媒体链接
6. **颜色主题** — 编辑 `css/style.css` 中 `:root` 下的 CSS 变量

## 管理后台（可选）

`admin/` 为 PHP 管理后台（留言、访客统计、内容在线编辑），**不需要**也不影响静态页面的正常展示。

- 管理员凭据从本地 `admin/config.php` 读取，该文件不入库
- 部署后台时：复制 `admin/config.example.php` 为 `admin/config.php` 并填入自己的用户名与 bcrypt 密码哈希
- 生成哈希：`php -r "echo password_hash('你的密码', PASSWORD_BCRYPT);"`

## 部署指南

### GitHub Pages（免费）

1. 在 GitHub 创建仓库，将本目录所有文件推送至 `main` 分支
2. 进入仓库 Settings → Pages
3. Source 选择 "Deploy from branch"，Branch 选择 `main`，目录 `/ (root)`
4. 点击 Save，等待几分钟即可通过 `https://<用户名>.github.io/<仓库名>/` 访问

### Vercel（免费）

1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目根目录运行：`vercel`
3. 或登录 [vercel.com](https://vercel.com)，导入项目，保持默认配置即可

### 阿里云 OSS 静态托管

1. 将 `images/`、`css/`、`js/` 和 HTML 文件上传至 OSS Bucket
2. 开启静态网站托管，首页设为 `index.html`，404 页设为 `404.html`
3. （可选）绑定自定义域名并配置 CDN

## 性能优化

- 所有样式压缩合并为单文件 `style.css`（约 8KB gzipped）
- JavaScript 分为数据层（`projects.js`）和逻辑层（`app.js`），便于维护
- 使用 CSS 变量实现主题切换，无额外 HTTP 请求
- Google Fonts 和 Font Awesome 使用 CDN 并配置 `preconnect`
- 图片推荐使用 WebP 格式以减小体积

## 兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动端浏览器

## License

MIT
