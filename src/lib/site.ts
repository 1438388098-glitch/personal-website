export const SITE = {
  title: '胡圣炜 · Stoic',
  description:
    '胡圣炜（Stoic）：中南财经政法大学法学在读，自学工程师。给法律场景造可复核、可评估、懂边界的 AI 工具。',
  url: 'https://iweistoicqc5.top',
  author: '胡圣炜',
  github: 'https://github.com/1438388098-glitch',
  poems: 'https://iweistoicqc5.top/poems/',
  /** 执行时处理：从旧站页面提取知乎主页链接（curl 首页 grep zhihu）；提取不到则置空 */
  zhihu: '',
  /** 用户已确认可公开的展示邮箱（2026-09-29 拍板），页脚与关于页渲染 */
  email: 'sww00316@163.com'
} as const;

export const NAV = [
  { label: '项目', href: '/projects/' },
  { label: '博客', href: '/blog/' },
  { label: '关于', href: '/about/' }
] as const;
