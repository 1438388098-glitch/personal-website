// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/lib/site';

/* 构建完成钩子：给产物 HTML 里带 id 的标题尾部注入 § 锚链。
   法律长文按节引用是高频动作；5.18 的 content layer 渲染不走 markdown.rehypePlugins（实测工厂零调用），故落在产物层做。
   § 进 tab 序：只靠 hover 等于把「引用某一节」留给鼠标用户，键盘用户够不到。 */
function anchorLinks() {
  return {
    name: 'anchor-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const files = [];
        const root = fileURLToPath(dir);
        (function walk(d) {
          for (const entry of readdirSync(d, { withFileTypes: true })) {
            const p = join(d, entry.name);
            if (entry.isDirectory()) walk(p);
            else if (entry.name.endsWith('.html')) files.push(p);
          }
        })(root);
        const re = /(<h[1-6] id="[^"]+"[^>]*>[\s\S]*?)(<\/h[1-6]>)/g;
        let touched = 0;
        for (const f of files) {
          const html = readFileSync(f, 'utf8');
          /* § 锚链的 aria 文案随页面语言走：/en/ 路径用英文，其余中文 */
          const isEn = /[/\\]en[/\\]/.test(f.slice(root.length));
          const anchorLabel = isEn ? 'Anchor for this section' : '本节锚点';
          const next = html.replace(re, (m, open, close) => {
            const id = /id="([^"]+)"/.exec(open)[1];
            return open + '<a class="anchor" href="#' + id + '" aria-label="' + anchorLabel + '">§</a>' + close;
          });
          if (next !== html) { writeFileSync(f, next); touched++; }
        }
        console.log('anchor-links: ' + touched + ' 个页面已注入标题锚链。');
      },
    },
  };
}

/* sitemap 的 lastmod：serialize 只拿到 URL 字符串，拿不到 frontmatter，
   故构建期直接从内容目录读原始文件解析各内容的日期，按 URL 路径反查。
   博客取 pubDate，exam/notes/projects 取 date，/now/ 取所有条目 updated 的最大值。
   en 集合（src/content-en/，同名文件配对）映射到 /en/ 前缀路径。 */
function contentLastmods() {
  /** @type {Map<string, string>} */
  const map = new Map();
  const contentRoot = fileURLToPath(new URL('./src/content/', import.meta.url));
  const contentRootEn = fileURLToPath(new URL('./src/content-en/', import.meta.url));
  const collections = [
    { root: contentRoot, dir: 'posts', prefix: '/blog/', field: 'pubDate' },
    { root: contentRoot, dir: 'exam', prefix: '/exam/', field: 'date' },
    { root: contentRoot, dir: 'notes', prefix: '/notes/', field: 'date' },
    { root: contentRoot, dir: 'projects', prefix: '/projects/', field: 'date' },
    { root: contentRootEn, dir: 'posts', prefix: '/en/blog/', field: 'pubDate' },
    { root: contentRootEn, dir: 'exam', prefix: '/en/exam/', field: 'date' },
    { root: contentRootEn, dir: 'notes', prefix: '/en/notes/', field: 'date' },
    { root: contentRootEn, dir: 'projects', prefix: '/en/projects/', field: 'date' },
  ];
  for (const { root, dir, prefix, field } of collections) {
    const base = join(root, dir);
    let names;
    try { names = readdirSync(base); } catch { continue; }
    for (const name of names) {
      if (!name.endsWith('.md')) continue;
      const text = readFileSync(join(base, name), 'utf8');
      /* posts 支持 updatedDate：有修订日期时 lastmod 跟修订走，否则退回发布日期 */
      const m = (field === 'pubDate'
        ? new RegExp(`^updatedDate:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(text)
        : null)
        ?? new RegExp(`^${field}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(text);
      if (m) map.set(`${prefix}${name.slice(0, -3)}/`, m[1]);
    }
  }
  /* /now/ 与 /en/now/ 都是聚合单页：取全部月更里最新的 updated */
  for (const [root, path] of [[contentRoot, '/now/'], [contentRootEn, '/en/now/']]) {
    try {
      const base = join(root, 'now');
      /** @type {string[]} */
      const dates = [];
      for (const n of readdirSync(base)) {
        if (!n.endsWith('.md')) continue;
        const m = /^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m.exec(readFileSync(join(base, n), 'utf8'));
        if (m) dates.push(m[1]);
      }
      if (dates.length) map.set(path, dates.sort()[dates.length - 1]);
    } catch { /* 无 now 集合目录则跳过 */ }
  }
  return map;
}

const lastmods = contentLastmods();

export default defineConfig({
  /* 域名唯一事实源：src/lib/site.ts 的 SITE.url */
  site: SITE.url,
  /* 站内链接预取：换页走 View Transitions，点击后要先拿到新页 HTML 才能开始过渡。
     不预取时整轮网络往返（跨境到 CF 约 300–400ms）都摊在点击上，手感就是「点一下卡一下」。
     hover 策略在鼠标悬停时预热，落点是浏览器 HTTP 缓存——慢速连接与 saveData 由 Astro 自行跳过，
     移动端没有 hover，按下时也走同一套 prefetch（tap 路径在 prefetch 模块里独立处理）。
     只预热站内页，外链与 #锚点不碰。动效本身（过渡动画、淡入）不受影响。 */
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  /* sitemap：/search/ 是客户端渲染的薄内容页，无独立检索价值，排除出收录。
     /en/404/ 也要排除：zh 的 404 由 Astro 特判成 404.html（插件默认排除），en 的 404
     却按目录格式产出 en/404/index.html（200 可访问），不显式排除就会带着 noindex 进 sitemap 自相矛盾。 */
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search/') && !page.includes('/404'),
      /* 每条 URL 反查内容日期补 lastmod：无对应内容的页面（列表页、静态页）保持原样 */
      serialize: (item) => {
        const lastmod = lastmods.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    anchorLinks(),
  ],
  markdown: {
    /* Astro 7 起 smartypants（智能标点）归属 markdown 处理器：默认处理器 Sätteri 的
       smartPunctuation 默认开着，会把正文里的 CLI 旗标（如 node --test）转成排版破折号，
       故显式关掉。旧的顶层 markdown.smartypants 在 7 里已废弃，将在下个大版本移除。 */
    processor: satteri({ features: { smartPunctuation: false } }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' }
    }
  }
});
