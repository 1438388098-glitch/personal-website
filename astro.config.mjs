// @ts-check
import { defineConfig } from 'astro/config';
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
          const next = html.replace(re, (m, open, close) => {
            const id = /id="([^"]+)"/.exec(open)[1];
            return open + '<a class="anchor" href="#' + id + '" aria-label="本节锚点">§</a>' + close;
          });
          if (next !== html) { writeFileSync(f, next); touched++; }
        }
        console.log('anchor-links: ' + touched + ' 个页面已注入标题锚链。');
      },
    },
  };
}

/* sitemap 的 lastmod：serialize 只拿到 URL 字符串，拿不到 frontmatter，
   故构建期直接从 src/content 读原始文件解析各内容的日期，按 URL 路径反查。
   博客取 pubDate，exam/notes/projects 取 date，/now/ 取所有条目 updated 的最大值。 */
function contentLastmods() {
  /** @type {Map<string, string>} */
  const map = new Map();
  const collections = [
    { dir: 'posts', prefix: '/blog/', field: 'pubDate' },
    { dir: 'exam', prefix: '/exam/', field: 'date' },
    { dir: 'notes', prefix: '/notes/', field: 'date' },
    { dir: 'projects', prefix: '/projects/', field: 'date' },
  ];
  const contentRoot = fileURLToPath(new URL('./src/content/', import.meta.url));
  for (const { dir, prefix, field } of collections) {
    const base = join(contentRoot, dir);
    let names;
    try { names = readdirSync(base); } catch { continue; }
    for (const name of names) {
      if (!name.endsWith('.md')) continue;
      const text = readFileSync(join(base, name), 'utf8');
      const m = new RegExp(`^${field}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(text);
      if (m) map.set(`${prefix}${name.slice(0, -3)}/`, m[1]);
    }
  }
  /* /now/ 是聚合单页：取全部月更里最新的 updated */
  try {
    const base = join(contentRoot, 'now');
    /** @type {string[]} */
    const dates = [];
    for (const n of readdirSync(base)) {
      if (!n.endsWith('.md')) continue;
      const m = /^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m.exec(readFileSync(join(base, n), 'utf8'));
      if (m) dates.push(m[1]);
    }
    if (dates.length) map.set('/now/', dates.sort()[dates.length - 1]);
  } catch { /* 无 now 集合目录则跳过 */ }
  return map;
}

const lastmods = contentLastmods();

export default defineConfig({
  /* 域名唯一事实源：src/lib/site.ts 的 SITE.url */
  site: SITE.url,
  /* sitemap：/search/ 是客户端渲染的薄内容页，无独立检索价值，排除出收录（404/500 由插件默认排除） */
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search/'),
      /* 每条 URL 反查内容日期补 lastmod：无对应内容的页面（列表页、静态页）保持原样 */
      serialize: (item) => {
        const lastmod = lastmods.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    anchorLinks(),
  ],
  markdown: {
    // 关闭 smartypants：防止把正文里的 CLI 旗标（如 node --test）转成排版破折号
    smartypants: false,
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' }
    }
  }
});
