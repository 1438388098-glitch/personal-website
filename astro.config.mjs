// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iweistoicqc5.top',
  integrations: [sitemap()],
  markdown: {
    // 关闭 smartypants：防止把正文里的 CLI 旗标（如 node --test）转成排版破折号
    smartypants: false,
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' }
    }
  }
});
