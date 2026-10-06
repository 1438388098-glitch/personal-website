/** 站点唯一域名：页面 canonical / JSON-LD / RSS / robots 都从这一处派生，不再各写一份字面量 */
const ORIGIN = 'https://iweistoicqc5.top';
const GITHUB = 'https://github.com/1438388098-glitch';

export const SITE = {
  title: '胡圣炜 · Stoic',
  description:
    '胡圣炜（Stoic）：法学在读，业余造工具。法条检索、法考判分、司法评测，全部开源，数字可查。',
  url: ORIGIN,
  author: '胡圣炜',
  /** 站长拉丁转写：页头品牌行与中文并列（v3 设计语言） */
  authorEn: 'HU SHENGWEI',
  github: GITHUB,
  poems: `${ORIGIN}/poems/`,
  /** 执行时处理：从旧站页面提取知乎主页链接（curl 首页 grep zhihu）；提取不到则置空 */
  zhihu: '',
  /** 用户已确认可公开的展示邮箱（2026-09-29 拍板），页脚与关于页渲染 */
  email: 'sww00316@163.com'
} as const;

/** 站内固定资源路径：多处引用同一路径时从这里取，避免字面量各写一份 */
export const SITE_PATHS = {
  ogImage: '/og-default.png',
  feed: '/feed.xml',
  sitemap: '/sitemap-index.xml',
  search: '/search/',
  searchIndex: '/search-index.json'
} as const;

/** 手机浏览器地址栏取色（与 global.css 的 --bg 同源；meta 里不能用 CSS 变量，只能在此登记） */
export const THEME_COLORS = { light: '#faf9f6', dark: '#151513' } as const;

/** 站长的某个 GitHub 仓库地址 */
export const githubRepoUrl = (name: string): string => `${GITHUB}/${name}`;

export const NAV = [
  { label: '项目', href: '/projects/' },
  { label: '博客', href: '/blog/' },
  { label: '法考', href: '/exam/' },
  { label: '笔记', href: '/notes/' },
  { label: 'Now', href: '/now/' },
  { label: '工具箱', href: '/toolbox/' },
  { label: '关于', href: '/about/' }
] as const;
