import { SITE } from './site';

/* 全站双语字典与语言工具：zh 留根路径、en 走 /en/。
   这里是 UI 文案（含页面长文案）的单一事实源：模板只做查表渲染，不再写死字面量。
   zh 对象定义键形状，en 对象必须逐键对齐（TS 结构检查 + vitest 键位平齐测试兜底）。
   内容层（正文、指标、链接）不进字典：它们在 src/content-en/ 按同名文件配对，由 check-i18n 门禁管。 */

export type Lang = 'zh' | 'en';

/** 从构建期 URL 前缀判语言：/en/ 开头即英文，其余（含 /404.html 这类无尾斜杠形式）一律中文 */
export function langOf(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

/** 语言对应的路径前缀：zh 无前缀（存量 URL 不动） */
export function prefix(lang: Lang): string {
  return lang === 'en' ? '/en' : '';
}

/** 站内路径加语言前缀：卡片/列表的链接统一走这里，避免各页手拼 */
export function href(lang: Lang, path: string): string {
  return prefix(lang) + path;
}

/* ---- 受控词表的英文对照：frontmatter 里存的仍是中文枚举 ID（schema 复用、配对校验简单），
   展示层从这里映射英文。新增枚举值时 zh/en 两张表必须同步。 ---- */

export const EN_CATEGORY: Record<string, string> = {
  法学随笔: 'Essays on Law',
  技术笔记: 'Technical Notes',
  工程方法论: 'Engineering Method',
  游戏手记: 'Game Notes',
  杂谈: 'Misc.',
  经济观察: 'Economics Watch',
  热点快评: 'Quick Takes',
};

export const EN_TAG: Record<string, string> = {
  AIGC: 'AIGC',
  Agent: 'Agent',
  RSI: 'RSI',
  AI幻觉: 'AI hallucination',
  AI监管: 'AI regulation',
  判例: 'Case law',
  安全: 'Safety',
  大模型: 'LLM',
  工程方法: 'Engineering method',
  开源: 'Open source',
  强化学习: 'Reinforcement learning',
  检索: 'Retrieval',
  评测: 'Evaluation',
  游戏: 'Games',
  自动化: 'Automation',
  法考: 'Bar exam',
  法律AI: 'Legal AI',
  司法: 'Judiciary',
  欧盟AI法: 'EU AI Act',
  比较法: 'Comparative law',
  求职: 'Job hunting',
  踩坑记: 'Debugging notes',
  数学: 'Mathematics',
  量化: 'Quant',
  数据工程: 'Data engineering',
};

export const EN_GROUP: Record<string, string> = {
  法律主线: 'Legal Core',
  法律工具: 'Legal Tools',
  量化研究: 'Quant Research',
  工程侧证: 'Engineering Side',
  实验: 'Experiments',
  /* 工具箱的分类与项目分组共用一张表：工程小件只出现在 toolbox */
  工程小件: 'Utilities',
};

/** 分类/标签展示值：zh 原样返回 ID（即中文），en 查表；漏配返回 ID 并在控制台留一声（构建期可见） */
export function categoryLabel(lang: Lang, id: string): string {
  if (lang === 'zh') return id;
  return EN_CATEGORY[id] ?? (console.warn(`i18n: 分类缺英文对照 ${id}`), id);
}
export function tagLabel(lang: Lang, id: string): string {
  if (lang === 'zh') return id;
  return EN_TAG[id] ?? (console.warn(`i18n: 标签缺英文对照 ${id}`), id);
}
export function groupLabel(lang: Lang, id: string): string {
  if (lang === 'zh') return id;
  return EN_GROUP[id] ?? (console.warn(`i18n: 分组缺英文对照 ${id}`), id);
}

/* ---- 字典本体 ---- */

const zh = {
  htmlLang: 'zh-CN',
  ogLocale: 'zh_CN',
  ogLocaleAlternate: 'en_US',
  skipLink: '跳到主要内容',
  navAria: '主导航',
  /** zh 导航七项全量；en 是子集（见 en.navItems），顺序即展示顺序 */
  navItems: [
    { label: '项目', href: '/projects/' },
    { label: '博客', href: '/blog/' },
    { label: '法考', href: '/exam/' },
    { label: '笔记', href: '/notes/' },
    { label: 'Now', href: '/now/' },
    { label: '工具箱', href: '/toolbox/' },
    { label: '关于', href: '/about/' },
  ],
  searchPlaceholder: '搜索',
  searchAria: '站内搜索',
  searchAction: '/search/',
  themeToggle: { base: '切换明暗主题', dark: '切换明暗主题（当前：深色）', light: '切换明暗主题（当前：浅色）' },
  /** 语言切换器：指向对方的真实对应页或对方首页 */
  langSwitch: { label: 'EN', aria: 'Switch to English' },
  footer: {
    poems: '诗集《陌生的你》',
    poemsAria: '诗集《陌生的你》（在新窗口打开）',
    search: '搜索',
    tags: '标签索引',
    opensInNew: '（在新窗口打开）',
  },
  feedPath: '/feed.xml',
  home: {
    title: '胡圣炜 · Stoic',
    label: '法律 × 工程',
    h1: '用 <span class="hl">AI</span> 加速进步。',
    /* 分号后手动断行：两行各对应一层信息（开源工具/量化私有），避免词被拆断 */
    lede: '法条检索、法考判分、司法评测，法律工具全部开源、数字可查；<br />A 股量化平台私有，规模与方法写在项目页。',
    /* 一行元信息注记：不再用边框小签（「法律工具全部开源」与导语重复，删） */
    pills: ['武汉', '备考法考中'],
    ctas: { primary: '看项目', about: '关于我', contact: '联系我' },
    numbersAria: '关键数字',
    panel: [
      /* 每行带项目名（「指标 · 项目名」，同「评测规模 · 法衡」的既有模式）：
         项目名用项目 ID 本尊（statute-rag / fakao-grader / stock-db），
         法衡是 cn-judbench 的正式中文名故保留。取数 key（metricLabel）不动。 */
      { projectId: 'statute-rag', metricLabel: '盲写留出题 Recall@5', k: 'Recall@5 · statute-rag' },
      { projectId: 'statute-rag', metricLabel: '语料规模', k: '入库法条 · statute-rag' },
      { projectId: 'cn-judbench', metricLabel: '评测规模', k: '评测规模 · 法衡' },
      { projectId: 'fakao-grader', metricLabel: '判定口径', k: '判分口径 · fakao-grader' },
      { projectId: 'stock-db', metricLabel: '数据规模', k: '数据规模 · stock-db' },
    ],
    featured: { h2: '精选项目', en: 'Selected Work', link: '全部项目 →' },
    writing: { h2: '最近写作', en: 'Writing', link: '全部文章 →' },
    explore: { h2: '接着逛', en: 'Explore' },
    exploreCards: [
      { title: '笔记', desc: '课程论文与文献研读', href: '/notes/' },
      { title: '工具箱', desc: '公开在 GitHub 的法律工具，一键到仓库', href: '/toolbox/' },
    ],
    /* zh 首页的法考通栏；en 首页不译法考栏目，置 null 整块收起 */
    band: {
      label: '法考 × AI',
      en: 'Exam Workflow',
      h2: '把 AI 缝进备考流程',
      text: '错题变笔记、主观题机器初判、法条检索必带引用，每个环节一个自建工具。',
      figures: (subjects: number, wrong: number) => `${subjects} 科目 / ${wrong} 错题`,
      btn: '看备考工作流',
      href: '/exam/',
    } as null | {
      label: string;
      en: string;
      h2: string;
      text: string;
      figures: (subjects: number, wrong: number) => string;
      btn: string;
      href: string;
    },
    now: { link: '看本期动态 →' },
    jsonLdJobTitle: '法学在读 · 法律 × AI',
  },
  about: {
    title: '关于',
    metaDescription: '胡圣炜的个人介绍与简历：法学与经济学双学位、三段法律实习、法律 × AI 工程实践。',
    h1: '关于',
    intro: [
      '我是胡圣炜，广东韶关人，中南财经政法大学法学与经济学双学位本科生，成长于粤北多语言环境（普通话、粤语、客家话），这让我习惯在不同语境间准确转译，也让我对「表述精确」有职业级的执念。',
      '我的方向是法律与 AI 的交叉地带：法律文本的结构化、检索与评估。我相信法律场景的 AI 输出不能靠蒙，所以我的项目都围着同一件事转：让模型的每句话可复核、可评估、可追溯。工具上重度使用 Claude Code 等 AI 编码协作，并把工程纪律（测试、指标、失败案例）带进每一个法律项目。',
      '经济学方向的数理统计、概率论与计量经济学，让我习惯把判断变成能检验的命题。这套习惯的练手场是自己搭的 A 股量化平台，做因子挖掘、回测与截面 IC 评估（见<a href="/projects/stock-db/">量化项目</a>）。',
    ],
    factsAria: '关键信息',
    facts: [
      { k: '学校', v: '中南财经政法大学', mono: false },
      { k: '学位', v: '法学 & 经济学 双学位', mono: false },
      { k: '学年', v: '2023.09 - 2027.06', mono: true },
      { k: '法学均分', v: '87 / 100', mono: true },
      { k: '状态', v: '法考备考中', mono: false },
      { k: '语言', v: '普通话 · 粤语 · IELTS 6.5', mono: false },
    ],
    jsonLdJobTitle: '法学在读 · 法律 × AI 工程实践',
    sections: [
      {
        title: '教育背景',
        en: 'Education',
        edu: [
          { strong: '法学', note: '主修课程：法理学、民法总论、刑法、刑事诉讼法、行政法与行政诉讼法、知识产权法、商法、民事诉讼法、国际公法' },
          { strong: '经济学', note: '主修课程：高等数学、政治经济学、数理统计与概率论、中级微观经济学、中级宏观经济学、中级计量经济学' },
        ],
        entries: [] as { date: string; org: string; role: string; bullets: string[] }[],
      },
      {
        title: '实习经历',
        en: 'Internships',
        edu: [],
        entries: [
          {
            date: '2025.07 - 2025.08',
            org: '广东智洋凯成律师事务所',
            role: '律师助理',
            bullets: [
              '协助民事案件处理：证据整理标注、独立推进网上立案，参与建设工程纠纷专项并完成类案检索报告',
              '研读刑事案件卷宗，独立撰写法律文书；跟进合同诈骗上诉案，整合证据链并撰写上诉材料',
              '为顾问单位审查文件、修订管理办法并提出合规建议；审查交通领域协议，回复国企合规咨询',
            ],
          },
          {
            date: '2024.07 - 2024.08',
            org: '广东中南钢铁股份有限公司',
            role: '法务与合规部门实习生',
            bullets: [
              '协助处理买卖合同纠纷案：证据材料整理、法律条文核对及案件时间轴可视化梳理',
              '完成《限制出境措施解除条件案例检索报告》，独立检索相关裁判文书',
              '参与部门合规培训项目与会议',
            ],
          },
          {
            date: '2024.01 - 2024.02',
            org: '韶关市曲江区人民法院',
            role: '法官助理实习生',
            bullets: [
              '系统学习案件全流程管理：立案审查、庭审记录、文书送达及执行程序等核心环节',
              '协助法官完成判决书、调解书等法律文书初稿起草及校对，累计处理案件文书 20+ 份',
              '参与民商事案件研讨，独立完成法律检索报告，分析争议焦点并提出裁判依据建议',
              '全程观摩多场庭审并记录，深化对诉讼程序、证据规则及法庭辩论技巧的理解',
            ],
          },
        ],
      },
      {
        title: '项目经历',
        en: 'Research',
        edu: [],
        entries: [
          {
            date: '2024.07 - 2025.01',
            org: '人工智能边境安全情报态势感知模型研究（省级大创立项）',
            role: '校际研究员',
            bullets: [
              '聚焦 AI 法律伦理议题，结合边境安全与跨境数据场景，系统梳理《数据安全法》中算法决策合规、跨境数据流动、隐私保护等核心法规依据',
              '支撑项目伦理合规模块研究，辅助团队规避 AI 技术应用的合规风险',
              '参与校际法律伦理研讨会，提出算法透明化、风险分级管控的实操建议',
            ],
          },
          {
            date: '2024.06 - 2024.09',
            org: '双减背景下大学生家教市场的利益分配与权益保障实证分析',
            role: '项目组长',
            bullets: [
              '设计问卷调查并对当事人访谈，收集大学生家教市场的一手数据',
              '运用中间利润分配模型剖析利益分配机制，提出优化教师、家长、平台间利益关系的具体建议',
              '针对家教过程中的权益侵害问题，提出合同签订、中介费用规范等权益保障措施',
            ],
          },
        ],
      },
      {
        title: '在校经历',
        en: 'Campus',
        edu: [],
        entries: [
          {
            date: '2023.11 - 2024.11',
            org: '中南财经政法大学未来律师协会',
            role: '外联部干事',
            bullets: [
              '第二届「江城杯」模拟法庭外联部负责人：对接北京盈科（武汉）律师事务所并邀请实务专家参与文书评审，多渠道宣传吸引武汉大学、华中科技大学等 8 所高校参赛，并协调多所高校的赛事对接',
              '第三届盈之楚辩论赛外联统筹负责人：洽谈企业赞助，成功获得赞助经费，实现赛事经费自给',
            ],
          },
        ],
      },
      {
        title: '技能与证书',
        en: 'Skills',
        edu: [],
        entries: [],
        skills: [
          { k: '法律检索', html: '北大法宝、中国裁判文书网、Westlaw；课程论文《竞业限制的滥用与规制》引用熊晖、王瑞宏对 556 份裁判文书的统计等实证材料（见<a href="/notes/non-compete/">笔记栏</a>）' },
          { k: '工程', html: 'Python、JavaScript/TypeScript、SQLite/FTS5、RAG 与评测管线、多 Agent 编排、Git/CI（全部有公开仓库背书，见<a href="/projects/">项目栏</a>）' },
          { k: '量化与数据', html: 'A 股数据管线（5,824 只股票、约 1,674 万行日线，34 字段）、GP 因子挖掘与回测管线、每期 Top20 的中期选股链（规模与方法见<a href="/projects/stock-db/">量化项目</a>）' },
          { k: '技能证书', html: '计算机二级（MS Office）、C1 驾驶证' },
          { k: '社媒活动', html: '小红书自媒体运营：浏览量累计 <strong class="mono">18 万+</strong>，获赞及收藏近 <strong class="mono">5000</strong>' },
          { k: '兴趣爱好', html: '羽毛球、骑行、健身' },
        ] as { k: string; html: string }[],
      },
      {
        title: '联系我',
        en: 'Contact',
        edu: [],
        entries: [],
        contactHtml: `<a href="${SITE.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub（在新窗口打开）">GitHub</a> · <a href="mailto:${SITE.email}">${SITE.email}</a>。此刻在做什么见 <a href="/now/">Now</a> 页。`,
        resumeHtml: `简历可<a href="mailto:${SITE.email}?subject=%E7%AE%80%E5%8E%86%E7%B4%A2%E5%8F%96">来信索取</a>。`,
      },
    ] as Array<{
      title: string;
      en?: string;
      edu?: { strong: string; note: string }[];
      entries?: { date: string; org: string; role: string; bullets: string[] }[];
      skills?: { k: string; html: string }[];
      contactHtml?: string;
      resumeHtml?: string;
    }>,
  },
  now: {
    metaDescription: '此刻正在做的事：备考、构建、写作与待决，按月更新。',
    updatedPrefix: '更新于 ',
    seeAlsoHtml: '我的背景与联系方式见<a href="/about/">关于</a>页。',
  },
  toolbox: {
    title: '工具箱',
    metaDescription: '工具箱是项目的可安装入口（仓库均公开可见）：点标题直达 GitHub 仓库；想看每个工具怎么做的、哪里失败过，去对应的项目案例页。',
    introHtml: '这些是项目的可安装入口：点标题直达 GitHub 仓库；想看每个工具怎么做的、哪里失败过，去它的<a href="/projects/">项目案例</a>。',
    opensInNew: '（在新窗口打开）',
  },
  blog: {
    title: '博客',
    metaDescription: '法律 × AI 的工程方法论、技术笔记与法学随笔，另有游戏手记、杂谈、经济观察与热点快评。',
    all: '全部',
    essayNoteHtml: '法学向的长文收录在<a href="/notes/">论文与研读</a>栏：竞业限制的实证研究、布雷克顿与罗马法，都在那里。',
    emptyNote: '这个分类还没攒出稿子，先看看别的。',
  },
  post: {
    allPosts: '← 全部文章',
    adjacentAria: '相邻文章',
    newer: '← 较新：',
    older: '较旧：',
    related: '相关文章',
    relatedAria: '相关文章',
    breadcrumbHome: '首页',
    breadcrumbBlog: '博客',
  },
  projects: {
    title: '项目',
    metaDescription: '法律 AI 与工程小件的全量项目清单：每个项目都有边界、机制与可验证的事实。本页讲项目的边界与机制，想要仓库入口去工具箱。',
    all: '全部',
    secEn: 'Projects',
    tableHead: ['指标', '数值', '说明'],
    related: '相关推荐',
    separator: '、',
    sameGroup: '同组项目：',
    toolbox: '工具箱：',
    toolboxLink: '一键到仓库',
    toolboxAria: '工具箱：一键到仓库（在新窗口打开）',
    relatedPosts: '相关博文：',
    allProjects: '← 全部项目',
    repo: '仓库',
    repoAria: '仓库（在新窗口打开）',
    breadcrumbHome: '首页',
    breadcrumbProjects: '项目',
  },
  tags: {
    title: '标签',
    metaDescription: '全部文章按标签索引：点一个标签，看同一主题下写过什么。',
    intro: (tags: number, posts: number) => `${tags} 个标签，来自 ${posts} 篇文章；点进去看同主题的文章。`,
    detailTitle: (tag: string) => `标签：${tag}`,
    detailDescription: (tag: string, n: number) => `标签「${tag}」下的全部文章，共 ${n} 篇。`,
    detailIntro: (n: number) => `${n} 篇文章。`,
    allTags: '← 全部标签',
    postsHeading: '文章',
    postsEn: 'Posts',
  },
  search: {
    title: '搜索',
    metaDescription: '站内搜索：在已发布的博客、法考实录、研读笔记、项目案例与工具箱里找关键词。',
    intro: '在已发布的博客、法考实录、研读笔记、项目案例与工具箱里找关键词。',
    noscriptHtml: '搜索需要启用 JavaScript；也可以改用无需脚本的<a href="/tags/">标签索引</a>。',
    placeholder: '试试：幻觉、错题、竞业限制…',
    searchAria: '搜索关键词',
    /* 客户端脚本用的字符串：经 search-config JSON 传给前端。
       必须是纯字符串——函数过不了 JSON.stringify（会被静默丢弃，前端调用即抛错），
       {n} 占位符由 fillN 在客户端替换。 */
    client: {
      loaded: '{n} 条内容，找关键词直达。',
      results: '{n} 条结果',
      resultsOne: '{n} 条结果',
      capped: '（只显示前 20 条，换个更具体的词）',
      none: '没有匹配的内容，换个词试试。',
      err: '索引加载失败，请检查网络后重试。',
    },
  },
  notFound: {
    title: '页面不存在',
    metaDescription: '这个地址没有页面，从首页、项目或博客找回去。',
    h1: '这个地址没有页面',
    hint: '链接可能敲错了，或者页面挪了地方。从这几条路找回去：',
    home: '回首页',
    projects: '看项目',
    blog: '看博客',
    search: '搜索',
  },
  anchor: '本节锚点',
  tocAria: '本篇目录',
};

/** zh 的形状即契约：en 缺键/多键都过不了 TS 与键位平齐测试 */
export type Strings = typeof zh;

const en: Strings = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  ogLocaleAlternate: 'zh_CN',
  skipLink: 'Skip to main content',
  navAria: 'Main navigation',
  navItems: [
    { label: 'Projects', href: '/en/projects/' },
    { label: 'Blog', href: '/en/blog/' },
    { label: 'Now', href: '/en/now/' },
    { label: 'Toolbox', href: '/en/toolbox/' },
    { label: 'About', href: '/en/about/' },
  ],
  searchPlaceholder: 'Search',
  searchAria: 'Site search',
  searchAction: '/en/search/',
  themeToggle: { base: 'Toggle dark mode', dark: 'Toggle dark mode (current: dark)', light: 'Toggle dark mode (current: light)' },
  langSwitch: { label: '中文', aria: '切换到中文版' },
  footer: {
    poems: 'Poems: Strangers',
    poemsAria: 'Poetry collection Strangers (opens in new window)',
    search: 'Search',
    tags: 'Tags',
    opensInNew: ' (opens in new window)',
  },
  feedPath: '/en/feed.xml',
  home: {
    title: 'HU Shengwei · Stoic',
    label: 'Law × Engineering',
    h1: 'Law student,<br />building <span class="hl">tools</span> on the side.',
    lede: 'Statute retrieval, bar-exam grading, judicial benchmarks: the legal tools are all open source, every number checkable.<br />The A-share quant platform is private, its scale and method on the project page.',
    pills: ['Wuhan, China', 'Prepping for the Chinese bar exam'],
    ctas: { primary: 'See projects', about: 'About me', contact: 'Contact' },
    numbersAria: 'Key numbers',
    panel: [
      { projectId: 'statute-rag', metricLabel: 'Blind holdout recall@5', k: 'Recall@5 · statute-rag' },
      { projectId: 'statute-rag', metricLabel: 'Corpus size', k: 'Statutes in corpus · statute-rag' },
      { projectId: 'cn-judbench', metricLabel: 'Benchmark size', k: 'Benchmark size · JudBench' },
      { projectId: 'fakao-grader', metricLabel: 'Judgement method', k: 'Grading · fakao-grader' },
      { projectId: 'stock-db', metricLabel: 'Data scale', k: 'Data size · stock-db' },
    ],
    featured: { h2: 'Selected Work', en: '', link: 'All projects →' },
    writing: { h2: 'Writing', en: '', link: 'All posts →' },
    explore: { h2: 'Explore', en: '' },
    exploreCards: [
      { title: 'Toolbox', desc: 'Legal tools with public GitHub repos: one click away.', href: '/toolbox/' },
    ],
    band: null,
    now: { link: 'See this month →' },
    jsonLdJobTitle: 'Law student · Legal × AI engineering',
  },
  about: {
    title: 'About',
    metaDescription: 'HU Shengwei: law and economics double-degree undergraduate, three legal internships, and legal × AI engineering on the side.',
    h1: 'About',
    intro: [
      "I'm HU Shengwei, from Shaoguan, Guangdong. I'm a law and economics double-degree undergraduate at Zhongnan University of Economics and Law. I grew up between languages (Mandarin, Cantonese, Hakka), which trained me to translate precisely across contexts and left me professionally obsessed with exact wording.",
      'My direction is the overlap of law and AI: structuring, retrieving and evaluating legal text. I don\'t believe AI output in legal settings should ever be taken on faith, so all my projects revolve around one thing: making every sentence a model produces checkable, evaluable and traceable. On the tooling side I work heavily with AI coding assistants such as Claude Code, and I bring engineering discipline (tests, metrics, failure cases) into every legal project.',
      'The economics side of my degree — mathematical statistics, probability, econometrics — trained me to turn judgments into testable propositions. My proving ground is a self-built A-share quant platform, doing factor mining, backtesting and cross-sectional IC evaluation (see the <a href="/en/projects/stock-db/">quant project</a>).',
    ],
    factsAria: 'Key facts',
    facts: [
      { k: 'University', v: 'Zhongnan University of Economics and Law', mono: false },
      { k: 'Degrees', v: 'Law & Economics (double degree)', mono: false },
      { k: 'Years', v: '2023.09 - 2027.06', mono: true },
      { k: 'Law GPA', v: '87 / 100', mono: true },
      { k: 'Status', v: 'Preparing for the Chinese bar exam', mono: false },
      { k: 'Languages', v: 'Mandarin · Cantonese · IELTS 6.5', mono: false },
    ],
    jsonLdJobTitle: 'Law student · Legal × AI engineering',
    sections: [
      {
        title: 'Education',
        en: '',
        edu: [
          { strong: 'Law', note: 'Main courses: jurisprudence, general civil law, criminal law, criminal procedure, administrative law and administrative litigation, intellectual property, commercial law, civil procedure, public international law' },
          { strong: 'Economics', note: 'Main courses: calculus, political economy, mathematical statistics and probability, intermediate microeconomics, intermediate macroeconomics, intermediate econometrics' },
        ],
        entries: [],
      },
      {
        title: 'Internships',
        en: 'Internships',
        edu: [],
        entries: [
          {
            date: '2025.07 - 2025.08',
            org: 'Guangdong Zhiyang Kaicheng Law Firm',
            role: 'Paralegal intern',
            bullets: [
              'Assisted with civil cases: organising and annotating evidence, filing cases online on my own, and a construction-dispute project where I produced a similar-case retrieval report',
              'Read criminal-case files and drafted legal documents independently; followed a contract-fraud appeal, consolidated the evidence chain and wrote the appeal materials',
              'Reviewed documents and management rules for client companies and proposed compliance fixes; reviewed transport-sector agreements and answered SOE compliance enquiries',
            ],
          },
          {
            date: '2024.07 - 2024.08',
            org: 'Guangdong Zhongnan Iron & Steel Co., Ltd.',
            role: 'Legal and compliance intern',
            bullets: [
              'Assisted with a sales-contract dispute: organising evidence, cross-checking statutory provisions, and building a visual timeline of the case',
              'Produced a case-retrieval report on when exit bans should be lifted, searching China Judgments Online on my own',
              'Took part in the department\'s compliance training programme and meetings',
            ],
          },
          {
            date: '2024.01 - 2024.02',
            org: 'Qujiang District People\'s Court, Shaoguan',
            role: 'Judge\'s assistant intern',
            bullets: [
              'Learned full case-cycle management: filing review, courtroom recording, service of documents and enforcement procedure',
              'Drafted and proofread first versions of judgments and mediation statements for judges, 20+ case documents in total',
              'Joined civil and commercial case discussions; produced a legal-research report analysing the disputed issues and proposing grounds for decision',
              'Observed and took notes at multiple full hearings, deepening my grasp of procedure, evidence rules and courtroom argument',
            ],
          },
        ],
      },
      {
        title: 'Research',
        en: 'Research',
        edu: [],
        entries: [
          {
            date: '2024.07 - 2025.01',
            org: 'AI border-security intelligence situational-awareness model research (provincial-level innovation grant)',
            role: 'Cross-campus researcher',
            bullets: [
              'Focused on AI legal-ethics issues at the border-security and cross-border-data intersection: mapped the core provisions of the Data Security Law on algorithmic-decision compliance, cross-border data flows and privacy protection',
              'Supported the project\'s ethics-compliance module and helped the team avoid compliance risks in AI deployment',
              'Joined cross-campus legal-ethics workshops and proposed practical measures on algorithm transparency and tiered risk control',
            ],
          },
          {
            date: '2024.06 - 2024.09',
            org: 'Empirical study of profit distribution and rights protection in the college-tutoring market under the double-reduction policy',
            role: 'Team lead',
            bullets: [
              'Designed the questionnaire and interviewed parties to collect first-hand data on the market',
              'Analysed profit distribution with an intermediate-profit model and proposed concrete fixes to the teacher-parent-platform relationship',
              'Proposed rights-protection measures (contract terms, agency-fee rules) against abuses in tutoring',
            ],
          },
        ],
      },
      {
        title: 'Campus',
        en: 'Campus',
        edu: [],
        entries: [
          {
            date: '2023.11 - 2024.11',
            org: 'Future Lawyers Association, ZUEL',
            role: 'Outreach department member',
            bullets: [
              'Head of outreach for the 2nd Jiangcheng Cup mock trial: liaised with Yingke Law Firm (Wuhan) and invited practitioners to judge briefs; outreach across multiple channels brought 8 universities including Wuhan University and HUST into the competition',
              'Coordinated outreach and sponsorship for the 3rd Yingshichu debate tournament: negotiated corporate sponsorship and made the event self-funding',
            ],
          },
        ],
      },
      {
        title: 'Skills',
        en: 'Skills',
        edu: [],
        entries: [],
        skills: [
          { k: 'Legal research', html: 'pkulaw, China Judgments Online, Westlaw; my course paper on the abuse of non-compete clauses draws on empirical work by Xiong Hui and Wang Ruihong covering 556 judgments (<a href="/notes/non-compete/">paper notes</a>, in Chinese)' },
          { k: 'Engineering', html: 'Python, JavaScript/TypeScript, SQLite/FTS5, RAG and evaluation pipelines, multi-agent orchestration, Git/CI (all backed by public repositories, see <a href="/en/projects/">projects</a>)' },
          { k: 'Quant & data', html: 'A-share data pipeline (5,824 stocks, about 16.74M daily rows, 34 fields), a GP factor-mining and backtesting pipeline, and a mid-term Top20 selection chain (scale and method on the <a href="/en/projects/stock-db/">quant project page</a>)' },
          { k: 'Certificates', html: 'NCRE Level 2 (MS Office), C1 driving licence' },
          { k: 'Social media', html: 'Xiaohongshu (RED) account: <strong class="mono">180k+</strong> cumulative views and nearly <strong class="mono">5,000</strong> likes and saves' },
          { k: 'Interests', html: 'Badminton, cycling, gym' },
        ] as { k: string; html: string }[],
      },
      {
        title: 'Contact',
        en: 'Contact',
        edu: [],
        entries: [],
        contactHtml: `<a href="${SITE.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new window)">GitHub</a> · <a href="mailto:${SITE.email}">${SITE.email}</a>. What I\'m doing right now: the <a href="/en/now/">Now</a> page.`,
        resumeHtml: `For my CV, <a href="mailto:${SITE.email}?subject=CV%20request">email me</a>.`,
      },
    ] as Array<{
      title: string;
      en?: string;
      edu?: { strong: string; note: string }[];
      entries?: { date: string; org: string; role: string; bullets: string[] }[];
      skills?: { k: string; html: string }[];
      contactHtml?: string;
      resumeHtml?: string;
    }>,
  },
  now: {
    metaDescription: 'What I\'m doing right now: exam prep, building, writing and open decisions. Updated monthly.',
    updatedPrefix: 'Updated ',
    seeAlsoHtml: 'Background and contact details: the <a href="/en/about/">About</a> page.',
  },
  toolbox: {
    title: 'Toolbox',
    metaDescription: 'The toolbox is the installable side of the projects (all repos public): click a title to reach the GitHub repository; for how each tool works and where it failed, see the project case study.',
    introHtml: 'These are the installable entry points of the projects: click a title to open the GitHub repository. For how each tool was built and where it failed, read its <a href="/en/projects/">project case study</a>.',
    opensInNew: ' (opens in new window)',
  },
  blog: {
    title: 'Blog',
    metaDescription: 'Engineering method, technical notes and essays on law × AI, plus game notes, miscellany, economics watch and quick takes.',
    all: 'All',
    essayNoteHtml: 'Long-form legal papers live in the <a href="/notes/">Notes</a> section (in Chinese): the empirical study on non-compete clauses, Bracton and Roman law.',
    emptyNote: 'Nothing published in this category yet. Try another one.',
  },
  post: {
    allPosts: '← All posts',
    adjacentAria: 'Adjacent posts',
    newer: '← Newer: ',
    older: 'Older: ',
    related: 'Related posts',
    relatedAria: 'Related posts',
    breadcrumbHome: 'Home',
    breadcrumbBlog: 'Blog',
  },
  projects: {
    title: 'Projects',
    metaDescription: 'The full list of legal-AI and engineering projects: each has a boundary, a mechanism and verifiable facts. This page covers boundaries and mechanisms; the toolbox holds the repository links.',
    all: 'All',
    secEn: '',
    tableHead: ['Metric', 'Value', 'Notes'],
    related: 'Related',
    separator: ', ',
    sameGroup: 'More in this group: ',
    toolbox: 'Toolbox: ',
    toolboxLink: 'Open repository',
    toolboxAria: 'Toolbox: open repository (opens in new window)',
    relatedPosts: 'Related posts: ',
    allProjects: '← All projects',
    repo: 'Repo',
    repoAria: 'Repository (opens in new window)',
    breadcrumbHome: 'Home',
    breadcrumbProjects: 'Projects',
  },
  tags: {
    title: 'Tags',
    metaDescription: 'All posts indexed by tag: pick one to see what has been written on the topic.',
    intro: (tags: number, posts: number) => `${tags} tags across ${posts} posts; follow one to see the same topic.`,
    detailTitle: (tag: string) => `Tag: ${tag}`,
    detailDescription: (tag: string, n: number) => `All posts under “${tag}”: ${n} in total.`,
    detailIntro: (n: number) => `${n} posts. `,
    allTags: '← All tags',
    postsHeading: 'Posts',
    postsEn: '',
  },
  search: {
    title: 'Search',
    metaDescription: 'Site search across published posts, exam logs, paper notes, project case studies and the toolbox.',
    intro: 'Search across published posts, exam logs, paper notes, project case studies and the toolbox.',
    noscriptHtml: 'Search needs JavaScript. The script-free <a href="/en/tags/">tag index</a> works without it.',
    placeholder: 'Try: hallucination, recall, statute…',
    searchAria: 'Search keywords',
    client: {
      loaded: '{n} documents. Type to search.',
      results: '{n} results',
      resultsOne: '{n} result',
      capped: ' (showing the first 20; try more specific terms)',
      none: 'Nothing matches. Try another term.',
      err: 'Index failed to load. Check your network and retry.',
    },
  },
  notFound: {
    title: 'Page not found',
    metaDescription: 'No page at this address. Head back via the home page, projects or blog.',
    h1: 'No page at this address',
    hint: 'The link may be mistyped, or the page has moved. Ways back:',
    home: 'Home',
    projects: 'Projects',
    blog: 'Blog',
    search: 'Search',
  },
  anchor: 'Anchor for this section',
  tocAria: 'On this page',
};

export const STRINGS: Record<Lang, Strings> = { zh, en };

/** 模板取文案的唯一入口：const t = strings(langOf(Astro.url.pathname)) */
export function strings(lang: Lang): Strings {
  return STRINGS[lang];
}
