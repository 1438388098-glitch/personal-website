// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/lib/site';

export default defineConfig({
  /* 域名唯一事实源：src/lib/site.ts 的 SITE.url */
  site: SITE.url,
  integrations: [sitemap()],
  markdown: {
    // 关闭 smartypants：防止把正文里的 CLI 旗标（如 node --test）转成排版破折号
    smartypants: false,
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' }
    }
  }
});
