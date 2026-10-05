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

export default defineConfig({
  /* 域名唯一事实源：src/lib/site.ts 的 SITE.url */
  site: SITE.url,
  /* sitemap：/search/ 是客户端渲染的薄内容页，无独立检索价值，排除出收录（404/500 由插件默认排除） */
  integrations: [
    sitemap({ filter: (page) => !page.includes('/search/') }),
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
