# 性能排查记录（2026-10-07）

排查触发：站主反馈「检索坏了」「网站点击、加载很卡」。本文记录实测数据、根因与处置，
供后续判断「还能不能再压」时有据可查，而不是靠感觉。
约束：只改投递方式，不动动效与视觉语言（过渡动画、淡入、悬停反馈全部保留）。

## 一、检索索引加载失败（真 bug，已修）

现象：搜索页输词后一律显示「索引加载失败，请检查网络后重试。」

定位：`/search-index.json` 端点本身 200、内容合法（线上 curl 验证）。浏览器实测复现后，
把注入页面的 `search-config` 打出来对照：

```
{"index":"/search-index.json","strings":{"capped":"…","none":"…","err":"…"}}
```

`loaded` 与 `results` 两项消失了。原因在 `src/lib/i18n.ts`：

```ts
client: {
  loaded: (n: number) => `${n} 条内容，找关键词直达。`,   // 函数
  results: (n: number) => `${n} 条结果`,                  // 函数
}
```

这两项是**函数**，走 `JSON.stringify` 注入 `<script type="application/json">` 时被静默丢弃
（函数不是 JSON 值）。客户端拿到 `undefined` 再调用 `msg.loaded(docs.length)` 抛 TypeError，
而这段调用正好在 `load()` 的 try 里 → 被 catch 当成网络错误显示。

处置：文案改为带 `{n}` 占位符的纯字符串，客户端用 `fillN(template, n)` 填充；
`src/lib/search.test.ts` 增加回归护栏——`search.client` 的每一项都必须能过 JSON 往返。

## 二、字体：两个问题叠在一起（一为浪费，一为失效）

### 2.1 webfont 从未生效（真 bug，已修）

`src/styles/global.css` 的字体栈写的是 `'Archivo'`、`'Noto Sans SC'`，
而自托管的 `@fontsource-variable/*` 包声明的族名带 **Variable 后缀**：
`'Archivo Variable'`、`'Noto Sans SC Variable'`。族名不匹配不会报错、也不会回退到别处，
只是永远匹配不上——**全部中西文展示字一直落在系统字体上**（Windows 上是 Microsoft YaHei）。

实测（浏览器内同段文字宽度对比，线上首页）：

| | 宽度(px) |
|---|---|
| 站点栈 | 440 |
| 强制 Microsoft YaHei | 440 |

相等即证明线上真实渲染用的是系统字体。修复后同一测试 379 vs 389（不等），webfont 生效。

来源：`demo/redesign-demo.html` 当年引的是 Google Fonts CDN（族名 `Archivo`），
改用自托管可变字体包时没同步改栈里的名字。

代价要说清楚：修好之后字体**才开始真的下载**。此前每页也会拉 3–8 个字体文件，
但那只是为了满足 `<link rel=preload>`，渲染时一个都用不上——纯浪费。
现在它们有用了，代价是每页字体字节变多（见下）。

### 2.2 分片粒度与站点用字不匹配（已大幅缓解）

Noto Sans SC 在 `@fontsource-variable` 里被切成 120 片、每片 45–77KB，
切法按码位区间，与本站在写什么无关。实测（修复前，静态复算，见 `npm run fonts:budget`）：

- 全站只用到 2020 个不同码位，却分布在 47 个分片里
- 一个博文页命中 26 片 ≈ **1.4MB**；全站 141 页平均 862KB
- 「胡圣炜」三个字（分片 57/112/113）就要 167KB

处置：构建末段新增 `scripts/subset-fonts.mjs`，按「站内实际用到的字符」逐片子集化：

- 语料口径取 dist 下全部文本类文件的**原始字符**（不剥标签、不剥 `<script>`）——宁可多留几个
  只出现在脚本里的字形，也不能漏掉浏览器会渲染的字
- 命中的分片压到「该片范围内站内真的用到的字」，并把 `unicode-range` 收窄到实际保留的码位
- 零命中的分片连 `@font-face` 块一起删（原先由 `trim-dist` 按文件名正则删，判据是
  「非 CJK 切片中文站永不命中」——这个前提是错的，项目页里有 α/κ/γ，见下）

| | 修复前 | 修复后 |
|---|---|---|
| dist 字体总量 | 4441KB（98 个文件） | 700KB（55 个文件） |
| 博文页命中 | 26 片 ≈ 1395KB | 27 个文件 ≈ 631KB（含 Archivo/Space Mono） |

顺带修掉一个连带缺陷：`trim-dist` 原按文件名删 `greek` 类切片，
但站点字体栈里没有任何字体包带 Greek 覆盖（Noto Sans SC 101 块 / Archivo 3 块 /
Space Mono 400+700 各 3 块，全部 unicode-range 都不含 U+0370–03FF），
α/κ/γ 一直是系统字体回退。这一条记入 `check-dist.mjs` 的 `NO_WEBFONT_COVER` 名单并注明来由。

## 三、点击卡：换页无预取（已修）

View Transitions 换页要先拿到新页 HTML 才能开始过渡。未预取时，这轮往返（跨境到 CF
约 300–550ms）全部摊在点击上。实测线上点击 `/blog/`：

```
click 4162 → before-preparation 4165 → after-preparation 4714 → before-swap 4714
```

约 550ms 的纯网络等待，期间页面毫无反馈——这就是「点一下卡一下」。

处置：`astro.config.mjs` 打开 `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }`。
悬停 80ms 后在浏览器 HTTP 缓存里预热目标页，慢速连接与 `saveData` 由 Astro 自行跳过。
动效不受影响：过渡动画照旧，只是它开始时 HTML 已经在本地。

实测预取效果：点击时那次 fetch 的传输量从 12544 字节降到 300 字节（304 复用），
但**仍要一轮往返**——因为 nginx 对 HTML 发 `Cache-Control: no-cache`。

## 四、还留在桌上的事

### 4.1 让 HTML 可缓存（需服务器侧改，未做）

现状：源站 nginx 对 HTML 发 `Cache-Control: no-cache`，Cloudflare 因此不缓存 HTML
（`cf-cache-status: DYNAMIC`），每次换页都要回一次源站。预取已经把 body 省掉了，
但省不掉这一轮 RTT。

建议（宝塔 → 站点 → 配置文件，`location /` 内）：

```nginx
# HTML 短窗缓存：换页走预取时直接命中，不再回源；60 秒窗口让发布后最多 stale 一分钟
location ~* \.html$ {
    add_header Cache-Control "public, max-age=60, stale-while-revalidate=300";
}
```

风险与前提：发布后最长 60 秒内可能拿到旧页（个人站可接受）；上线后要实测一次
「发布 → 立即访问」，确认 stale 窗口符合预期。**改服务器配置属于对外操作，需站主确认后执行。**

### 4.2 字体还能再压（评估过，暂不做）

现在博文页仍要约 631KB 字体。理论上限：一页真正用到约 800 个字形，
按可变字体 ~300B/字形算，地板约 240KB。差距来自分片粒度——页面命中 27 片、
每片 150+ 字形，其中只用到十几个。

评估过两种更细的方案，都放弃了：

- **按页面共现聚类细分**：模拟过（cap=24/48/80 三档）。平均下载字形能降 26–39%，
  但每页命中文件数翻倍（27→31~47 个），单文件固定开销（约 1.2KB）吃掉大半收益，
  重字页反而更差。性价比不够。
- **每页一个字体**：理论上最省（等于页面实际用字），但需要把多个源分片**合并**成一个字体，
  而 `subset-font` 只能单进单出；换用整字体源（未切片，约 10MB）会给仓库与构建引入
  新的重资产，且跨页零复用。个人站不值这个复杂度。

真要继续压，先看 `npm run fonts:budget` 的数字，别凭感觉。

### 4.3 预存的其它观察

- 站内没有任何 `<img>`，图片不构成负担；`og-default.png` 只在抓取时用
- HTML/CSS/JS 都很小（首页 24KB HTML、19KB 阻塞 CSS、30KB JS），且 `_astro/*` 已
  `public, max-age=31536000, immutable`，二次访问几乎零成本
- 搜索索引 191KB（gzip 后 89KB），首次输入时才拉，可接受
- 首页主线程长任务合计约 295ms（最大一段 140ms），属正常量级，未做处理
- `public/sw.js` 是旧站 SW 的自毁脚本，新站不注册 SW，维持现状

## 五、顺手修掉的门禁问题

- `npm run check:scripts` 原本 45 个类型错误（含 3 个门禁脚本共 36 个历史遗留），
  本次一并补齐 JSDoc 类型，现为 0
- `scripts/font-budget.mjs` 新增为 `npm run fonts:budget`：按页复算字体命中分片与字节数，
  是「字体还能不能再压」的唯一数字来源
- `check-dist.mjs` 增加字体门禁：@font-face 指向的文件必须存在、页面可见文本必须落在
  已发布字体的 unicode-range 内、字体总量不得超预算（防止子集化没跑）

## 六、未处理的历史遗留（与本次改造无关，留待站主决定）

- `npm run check:i18n`：3 处违规（`projects/fakao-tracker.md` 日期不一致、
  `projects/fakao-self-check.md` 缺英文译文、10-07 博文英文版缺数字 1860）
- `npm run check:style`：4 处「——」破折号（`projects/fakao-self-check.md` ×2、
  `pages/exam/checklist.astro`、`pages/exam/index.astro`）
