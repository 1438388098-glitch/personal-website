# 个人网站全方位审查报告

- 审查日期：2026-09-29
- 审查对象：`hu-shengwei-site`（Astro 5 静态站，27 个页面，六个内容栏目）
- 审查方式：三个独立专项审查（内容 / 代码 / SEO·性能·可访问性·隐私）+ 主审对全部关键论断逐条核对 + 13 张页面截图的视觉审查 + 全部门禁脚本亲跑（build / check / check:links / check:secrets / test 均通过）

> 客观性声明：子代理的 4 条论断经主审核对后被推翻，未收入问题清单（见文末「被推翻的论断」）。以下每条问题都经过源码或产物核实。

---

## 一、总评

**总评 7 / 10。**

一句话：**工程自觉和诚实文化是这座站最稀缺的资产，但「编校最后一公里」掉线了**——一半博客的发布日期在未来、简历按钮点下去是 404、四篇已写好的文章还游离在版本控制之外。这三件事单独看都是小事，叠在一起，恰好砸在站主自己最引以为豪的「可审计、可对账」招牌上。修掉它们不需要新能力，只需要跑完最后一公里。

| 维度 | 得分 | 一句话判断 |
|---|---|---|
| 内容与文案 | 6.5 | 证据链一流（边界+已知失败+可复现数字），但最强法学内容藏在二级栏目，博客 0 篇法学随笔 |
| 信息架构 | 6.5 | 六栏目边界未向读者交代，zhuma 一个故事讲了四遍，toolbox 与 projects 零互链 |
| 视觉设计 | 7 | 有明确审美主张（纸面+墨+朱砂），执行克制干净；桌面 hero 右侧空、指标条有模板感 |
| 代码与工程 | 8.5 | 类型全绿、测试守护溯源、边界守卫到位；排序逻辑五处重复内联零测试 |
| SEO | 7 | 元数据纪律极强（27 页 title 全唯一、每页一个 h1）；但 robots.txt / og:image / RSS 自动发现 / JSON-LD 集体缺席 |
| 性能 | 6.5 | HTML 极轻（gzip 5KB），但 254KB CSS（97% 是字体声明）阻塞渲染，dist 16MB 一半是死重 |
| 可访问性 | 8 | 暗色模式教科书级、对比度是算出来的；缺 aria-current，边框对比与触控目标差三口气 |
| 隐私与安全 | 8 | 红线当前干净（手机号/身份证零命中），但守门脚本不扫手机号——红线没有自动化防线 |
| 部署就绪 | 7.5 | 产物完整、URL 一致；缺 robots.txt、简历 PDF、CI |

---

## 二、P0：立即修（直接损害求职可信度）

### 1. 四篇博客的发布日期在未来，且已按已发布状态可见

- **证据**：`src/content/posts/2026-09-30-legal-hallu-guard.md:6`（pubDate: 2026-09-30）、`2026-10-04-cn-judbench.md`、`2026-10-08-zhuma-fakao-review.md`、`2026-10-12-auto-iterate-project.md`。今天是 2026-09-29，即最新一篇「发布于」13 天后。
- **影响**：`src/pages/blog/index.astro:6` 的过滤条件只有 `!p.data.draft`，首页「最近写作」（`src/pages/index.astro:14-16`）同样按日期倒序取前 4 篇——访客现在就能看到 2026-10-12 的文章。对一个把「可审计」当品牌卖点的站，时间穿越是自伤。
- **修法**（二选一）：
  - 把 pubDate 改回真实写作日期；
  - 或加定时发布机制：`blog/index.astro`、`src/pages/blog/[slug].astro:7`、`src/pages/feed.xml.js` 三处过滤条件改为 `!p.data.draft && p.data.pubDate <= new Date()`（首页与 sitemap 同理）。

### 2. 「下载简历 PDF」按钮指向不存在的文件

- **证据**：`src/pages/about.astro:58` 链接 `/resume/hu-shengwei-resume.pdf`；`public/resume/` 内只有 README 占位，其自述「当前下载按钮指向该路径会 404，属已知待补项」。
- **影响**：这是求职站的核心转化动作，潜在雇主点下去是 404。`check-links` 白名单兜底了构建门禁，但兜底不等于按钮能用。
- **修法**：M4 前先移除按钮或改为「简历可来信索取」；补 PDF 时注意两点——PDF 内手机号是 `check-secrets` 扫不到的盲区（二进制），需人工复查；补齐后从 `scripts/check-links.mjs:7-8` 白名单移除并复跑。

### 3. 四篇新文章未提交 git，「验收通过」与版本控制脱节

- **证据**：git status 显示 2026-09-30 / 10-04 / 10-08 / 10-12 四篇未跟踪；README:25 声称「M3 四栏目已上线，2026-09-29 验收通过」。
- **影响**：任何基于 git 的部署/回滚即刻缺失这批内容；也违反自家「完成 = 测试通过 + 已提交」的纪律。
- **修法**：按主题分组提交（如 `feat(blog): 新增法衡评测与竹马自审两文`）。

---

## 三、P1：明显拉低质量

### 内容侧

4. **about 页实习经历空洞**（`src/pages/about.astro:36-37`）：「律师事务所、法院和企业法务部门累计三段实习，覆盖诉讼与合规的初步实务」——无单位、无时间、无岗位、无产出。法律雇主最看重的板块反而是全站最薄的一节。每段至少一行「单位 · 岗位 · 时间 · 一件具体做过的事」；涉密就写「某红圈所争议解决组」级别。
5. **技能自评分级是简历八股**（`about.astro:46`）：本科生自评「精通」法律检索，是面试第一个被挑战的点。改为具体事实，如「熟练使用北大法宝/裁判文书网完成类案检索，556 份裁判文书实证统计见笔记栏」。
6. **指标行话未翻译**：`posts/2026-09-25-statute-rag-recall.md` 的「MRR 0.984」「+21.5pt」、`posts/2026-10-04-cn-judbench.md` 的「pass^k」「McNemar 精确检验」对法律读者是天书——而 `posts/2026-09-30-legal-hallu-guard.md` 证明站主完全有能力翻译（「条文存在与否是索引查找，引文保真与否是子串运算」）。首次出现时加一句人话对照即可。
7. **残留黑话**：`projects/zhuma-fakao-review.md` summary 的「六维审查**闭环**」、`toolbox/legal-job-tracker.md` 的「招聘信息**中台**」——都是站主自己明言反感的词。
8. **metrics 溯源违约**：`projects/statute-rag.md:18-20` 的「源 14,344 条，弃 0.9%」「14,212 条」在正文「验证」节（41-45 行）无对应——README:30 自定约定「metrics 里的每个数字必须在正文『验证』一节可溯源」，五张项目卡唯此卡违约。其余四张全部合规。
9. **一个故事讲四遍**：zhuma 的同一套数字（1655 道、18 册、9 分钟、39 subagent）出现在 projects、posts、exam、toolbox 四处；fakao-grader、statute-rag、cn-judbench 各三处。`posts/2026-09-20-fakao-grader-agent.md` 尤其薄（正文两三百字，验证节写「数字见仓库 README」），作为博客不合格——要么扩写成真文章，要么撤下只留项目卡。
10. **toolbox 与 projects 五个同名条目零互链**：clause-scope、cn-judbench、fakao-grader、statute-rag、zhuma-fakao-review 两栏同名，toolbox 卡外链 GitHub 却不链站内项目页与相关博文；`legal-hallu-guard`、`legal-job-tracker` 有整篇雄文也不互链。读者会困惑哪个是「正式版」。修法：toolbox 卡加「详情：/projects/xxx」「记一笔：/blog/xxx」回链，或在栏目页开头一句话交代分工。
11. **叙事时间线有张力**：`posts/2026-09-28-github-portfolio-audit.md:23` 说「statute-rag、clause-scope、legal-hallu-guard 三个新仓从缺口清单长出来」，但 statute-rag 项目卡 date 为 2026-09-01，且 09-25 博文已在讨论其实测数字——审计（09-28）不可能催生 09-01 的仓。核对各仓真实创建时间后收敛表述。
12. **法学声音缺席博客主线**：8 篇博客 = 4 工程方法论 + 4 技术笔记，0 篇法学随笔（该分类在 `blog/index.astro:8` 的枚举里永远空转）；站内最强的法学文本（non-compete 论文、bracton）藏在「笔记」二级栏目。目标读者是法律人，首页和博客给出的第一印象却是「一个工程师」。

### 工程侧

13. **守门脚本不扫自己的红线**（`scripts/check-secrets.mjs:7-11`）：patterns 只有 sk-/ghp_/api_key 三类，不含手机号与身份证。当前全库实测零命中，但未来任何 markdown 里手滑写进手机号会静默上线。修法：patterns 增加 `1[3-9]\d{9}`（手机号）与 18 位身份证模式；该脚本 dist 缺失时还会裸抛 ENOENT（对比 check-links 的友好提示）。
14. **无 robots.txt**：`public/` 只有 favicon 与 resume/。搜索引擎没有 Sitemap 入口声明。新建 `public/robots.txt`（User-agent: * / Allow: / / Sitemap: https://iweistoicqc5.top/sitemap-index.xml）。
15. **CSS 阻塞体积 106KB(gzip)，97% 是字体声明**：`dist/_astro/about.B1MW3Lhe.css` 原始 254KB，真实样式仅 6.6KB，其余是 214 条 @font-face（Noto Serif SC 600+700 双字重 × 101 切片）。同时 **dist 16MB 中 7.9MB 是 208 个 .woff**（现代浏览器永不下载的旧格式）。修法按性价比：postbuild 删 .woff（立省一半体积）；字体 CSS 异步加载；中文衬线收敛到单字重或改可变字体。
16. **导航当前页无 aria-current**（`src/components/Header.astro:11`）：active 态只有颜色 class，屏幕阅读器无法感知。一行改动：`aria-current={isActive(item.href) ? 'page' : undefined}`。
17. **RSS 无法自动发现**：BaseHead 无 `<link rel="alternate" type="application/rss+xml">`，RSS 只剩页脚一个人工入口。
18. **日期降序比较器五处重复内联且零测试**：`index.astro:15`、`blog/index.astro:7`、`exam/index.astro:8`、`notes/index.astro:7`、`feed.xml.js:7`。全站最易错的公共逻辑反而是唯一没有测试的。抽 `src/lib/sort.ts` 导出 `byDateDesc`，补同日稳定性单测。
19. **站点 URL 双源硬编码**：`astro.config.mjs:6` 与 `src/lib/site.ts:5` 各写一份域名。换域名只改 config 的话，canonical/og:url 会指旧域，与 sitemap/RSS 分叉。页面内改用 `Astro.site`。

---

## 四、P2：打磨项

20. **桌面 hero 右侧约 40% 空白**：首屏左半是姓名+副标题+按钮，右半无任何视觉元素（`about.astro:4` 的「个人照片位 TODO」尚未落地）。上照片或一枚克制的视觉锚点即可平衡。
21. **首页指标条有「仪表盘感」**：MetricStrip 的「红数字+标签+小字+来源胶囊」四件套重复三次，模板感强于内容感；`.source` 胶囊约 23px 高，低于 WCAG 2.5.8 的 24px 触控最小值（exam 页 `.tool` 胶囊同理）。胶囊加 `min-height: 24px` 顺手解决。
22. **文章页戛然而止**：`blog/[slug].astro:19` 结尾只有一行「← 全部文章」，无上一篇/下一篇、无相关推荐。静态站加相邻文章导航成本很低。
23. **按钮边框对比 1.24:1**（global.css `--border` 对 `--bg`）：文字对比达标，但组件边界低于 WCAG 1.4.11 的 3:1。边框加深或给按钮加底色。
24. **og:type 硬编码 website、无 og:image、无 JSON-LD**（`BaseHead.astro:14`）：文章页应为 article；社交分享是裸文本卡片。备一张 1200×630 OG 图（注意不带个人信息），加 Person + BlogPosting 结构化数据。
25. **移动端导航有约 13px 的隐形横向滚动**：实测 `nav.scrollWidth 243 > clientWidth 230`（390px 视口），且 `scrollbar-width: none` 隐藏了滚动条（`Header.astro:44-46`），用户不知道能滑。溢出侧加渐隐遮罩或允许换行。**注：全站移动端无横向溢出（实测 docScrollWidth ≤ innerWidth、零溢出元素）。**
26. **排版违约**：`posts/2026-09-20`、`posts/2026-09-25`、`exam/2026-09-29`、`projects/statute-rag.md` 四处存在手工折行，违反 README「一个自然段一行」约定；`notes/bracton.md:2` 用弯引号“”，站内他处统一用「」。
27. **dao-reading-list 带着内部流程语上站**：`notes/dao-reading-list.md:40,45` 两条金融文献标注「主题待补……与 DAO 的关联待核」——待核就不该公开发布；17 条中文文献无作者/期刊/年份。
28. **now 页暴露内部里程碑编号**（`now/2026-09.md:16`「本站 M3 建设中」）：外部读者不知 M3 为何物。写成「本月上线法考专栏、笔记、Now 页与工具箱」。
29. **clause-scope 卡片「100%」大数字配「虚构语料」小字**（`projects/clause-scope.md:9-20`）：正文诚实，但浏览顺序上大数字先声夺人。把「虚构标注样本」提进 label，如「条款分类准确率（虚构样本）」。
30. **404 页 canonical 指向不存在的 `/404/`**：404.astro 不应走 BaseHead 的 canonical，加 `<meta name="robots" content="noindex">` 更规范。
31. **死代码与双源**：`--accent-soft` 定义两次全站零引用（global.css:8,23）；exam 页 stages 的「1,655 道」「323 道」与 `lib/exam-progress.ts`、`lib/metrics.ts` 双源维护；EXAM_AGG 无溯源测试（对比 HOME_METRICS 的待遇）；`now.period` 正则放过 `2026-99`。
32. **check 脚本细节**：check-secrets 每文件每 pattern 只报首处命中、pattern 缺 gho_/github_pat_/xoxb/AKIA；check-links 正则 `(?:href|src)="` 无词边界会误匹配 `data-href`。
33. **无 CI**：发布前三连（build + check:links + check:secrets）全靠手工记忆。一个 push 触发的 GitHub Actions 就能把红线焊死。
34. **邮箱明文 27 处**（sww00316@163.com，mailto）：站主已拍板接受（site.ts:11 注释留痕），列为已知风险；垃圾邮件失控时可改 JS 拼接。GitHub 用户名 `1438388098-glitch` 内嵌 QQ 号，属间接联系方式，自行权衡。
35. **项目卡无 GitHub 直达链接**：ProjectCard 只渲染标题链接，仓库入口在详情页——求职者扫列表时需两跳。卡片 meta 行加一枚仓库小链接即可。

---

## 五、分维度详评

### 内容与文案（6.5/10）

两极分化明显。最好的一批达到可对外发表水准：`legal-hallu-guard`（行话全部翻译成人话，「误报率才是护栏的生命线」）、`legal-job-tracker-33-sources`（每个坑有场景有修法，零空话）、`notes/non-compete.md`（三重切断框架、556 份文书统计、中美对照，法学能力的硬证据）。最差的一批是项目卡的缩写（`fakao-grader-agent` 正文两三百字，数字外包给仓库）。

全站最大的亮点是**诚实纪律**：cn-judbench「13 行全部 provisional」、fakao-grader「不提供未实际运行的评测数字」、zhuma 自审「95 分虚高，公开下调为 90，过程留在审计文档」——这套自我设限在个人站里罕见，是真正的差异化资产，值得刻意保护。

最大的结构性问题是**受众错位**：定位写给法律人和雇主，博客却没有一篇法学随笔，法学功底要靠主动深挖二级栏目才能发现。其次是重复：一个项目的故事在四个栏目各讲一遍，数字多处复述，既稀释了每篇的独立价值，也增加了未来改数字时打架的风险（这次审查就抓到 statute-rag 的溯源违约与时间线张力）。

### 信息架构（6.5/10）

六栏目（projects/posts/exam/notes/now/toolbox）各自内部质量不差，但**栏目间的分工没有向读者交代**。exam 的「错题笔记」「周记」两种类型从未使用；notes 的「读书笔记」类为空；now 只有 1 期谈不上月更。首页的六区块叙事（hero→指标→精选项目→最近写作→法考×AI→Now）节奏是好的。

### 视觉设计（7/10）

有明确审美主张且执行克制：纸面米白+墨色+朱砂红的「墨与印」意象贯穿，噪点纹理 0.03 透明度不喧宾，标题衬线（Source Serif 4 + 思源宋体）与正文无衬线的搭配有辨识度，暗色模式是教科书级实现（渲染前执行防闪白、after-swap 重放、全变量化色板）。亮色首屏专业度约 7 分：干净、有品味，但 hero 右侧空、指标条模板感、◐ 图标含义靠猜（aria-label 倒是有的）。移动端布局健康（实测无横向溢出），唯导航 13px 隐形滚动。正文排版 `.prose` 限宽 68ch（约 34 个汉字/行），恰在中文舒适区。

### 代码与工程（8.5/10）

实测：`astro check` 0 错误、`npm test` 4/4 通过、`check:links` 27 页无死链、`check:secrets` 33 文件无命中、build 成功。亮点是真有业务语义的测试（metrics.test.ts 断言首页数字能在案例页源文件找到）、空集合快速失败守卫（now.astro:9）、smartypants 关闭防内容损坏、依赖仅 5 个非常克制。扣分在：排序比较器五处重复内联零测试、URL/指标数字双源硬编码、死 CSS 变量、git 最后一公里（P0#3）。@emnapi/runtime 在 devDependencies 属正常（wasm 工具链，核实过 lockfile）。

### SEO（7/10）

元数据纪律是罕见的强：27 页 title 全唯一且拼接逻辑从源头防重复后缀、每页恰一个 h1、层级不跳跃、description 零重复、canonical/sitemap（26 URL，正确排除 404）齐备。但可发现性四件套集体缺席：robots.txt、og:image、RSS autodiscovery、JSON-LD。社交分享和阅读器生态基本裸奔。

### 性能（6.5/10）

HTML 极轻（首页 gzip 5.1KB）、JS 只有 ClientRouter（gzip 5.4KB）、无图片、正文零字体成本（系统字体栈）。但唯一的 CSS 产物 254KB（gzip 106KB），其中 97.4% 是 @font-face 声明——为 6.6KB 真样式让浏览器阻塞解析 106KB；dist 16MB 一半是永不下载的 .woff；中文字体 600/700 双字重全量引入，命中切片下载两份。

### 可访问性（8/10）

对比度是算出来的不是碰出来的（global.css:79 注释写明暗色朱砂底白字 3.5:1 不达标故改深字，实测 5.20:1 分毫不差）；skip-link、focus-visible 朱砂焦点环、prefers-reduced-motion 双保险（无 JS 时内容不消失）、页脚链接强制下划线。差三口气：aria-current、边框 3:1、24px 触控目标（详见 P1#16、P2#21/23）。

### 隐私与安全（8/10）

红线当前干净：src/public/dist 三处正则扫手机号、身份证**零命中**；全站无图片即无元数据泄露面；外链 rel="noopener" 100% 齐全；zhihu 链接取不到就置空。但守门脚本不扫红线（P1#13），且未来简历 PDF 是二进制盲区。邮箱明文 27 处为已拍板风险。

### 部署就绪（7.5/10）

产物完整（27 HTML + sitemap + feed + 404）、绝对 URL 三处一致、trailing slash 一致。缺口：robots.txt、简历 PDF、CI、404 canonical。

---

## 六、做得好的地方（应当保持）

1. 「边界 + 已知失败 + 可复现数字」的项目卡写法——五个项目全部执行，这是让懂行雇主另眼相看的格式。
2. 诚实纪律：provisional 标注、虚高自评公开下调、两套金标口径并列、「不提供未实际运行的评测数字」。
3. 首页数字溯源测试（metrics.test.ts:20-27 读项目源文件断言）——防止宣传数字与案例页脱节，有业务语义的测试。
4. 暗色模式无闪烁的正确实现 + View Transitions 两个经典坑（主题重放、事件委托）都有解释性注释。
5. 元数据纪律：27 页 title 唯一、每页一个 h1、description 零重复。
6. 发布前产物级门禁三连写进 README，check-links 白名单带明确退出条件。
7. 对比度用数据决策并留注释；动效对 reduce-motion/无 JS 双降级。
8. 依赖克制（5 个），lockfile 齐全，README 把运行/测试/写作约定写得能照做。
9. 法考页六环节叙事（exam/index.astro）文案是全站最人话的页面级写作之一：「客观题在竹马刷，错题是唯一属于我的数据」。
10. git 提交历史质量高：中文、conventional 前缀、说清做了什么和为什么。

---

## 七、被推翻的审查论断（客观性记录）

以下论断出自子代理初审，经主审逐字核实**不成立**，未计入问题清单：

| 初审论断 | 核实结果 |
|---|---|
| 「zhuma 总册页数站内打架：133 页 vs 129 页」 | 三处引用全部是 129 页；posts/2026-10-08 原文是「一本百余页的总册」，无 133 字样 |
| 「exam 版 zhuma 的 type 是错题笔记，与 posts 的技术笔记矛盾」 | exam/2026-09-18 frontmatter 实为 `type: 方法论`，无矛盾 |
| 「文章正文行过长（60-70 字/行）」 | `.prose` 限宽 68ch ≈ 34 汉字/行，在舒适区内；系截图平铺伪影 |
| 「移动端内容横向溢出/被截断」 | 实测 docScrollWidth ≤ innerWidth，零溢出元素；系截图平铺伪影（导航 13px 隐形滚动是真实的，已单列 P2#25） |

---

## 八、行动路线图

**本周（P0 + 低成本高收益）**
1. 处理四篇未来日期文章（改日期或加 `pubDate <= now` 过滤）
2. 提交四篇未跟踪文章
3. 简历按钮：移除或改「来信索取」
4. `check-secrets` 加手机号/身份证 pattern + ENOENT 守卫
5. 新建 public/robots.txt（5 分钟）
6. Header 加 aria-current（一行）
7. BaseHead 加 RSS autodiscovery link（一行）

**两周内（P1 主体）**
8. 重写 about 实习经历与技能节（求职影响最大的一项）
9. 字体治理：postbuild 删 .woff → 字体 CSS 异步 → 单字重/可变字体，目标 CSS < 30KB gzip
10. 抽 lib/sort.ts 补排序测试；site URL 单源化
11. 术语人话化（MRR/pass^k/McNemar 首次出现加对照）；删「闭环」「中台」
12. statute-rag 验证节补语料数字；核对「审计长出新仓」时间线
13. toolbox 卡回链站内项目页与博文
14. GitHub Actions：push 触发 build + 三门禁 + test

**一月内（P2 与内容战略）**
15. hero 视觉锚点（照片位落地）
16. 文章页相邻导航；og:image + og:type + JSON-LD
17. dao-reading-list 补元数据或下线；排版折行清理；引号统一
18. 内容战略：写第一篇「法学随笔」进博客主线，把法学声音从二级栏目抬上来；fakao-grader-agent 扩写或撤下
19. 触控目标与边框对比度微调；移动端导航溢出提示

---

*报告完。审查过程中未修改任何网站文件；预览服务器已关闭。*
