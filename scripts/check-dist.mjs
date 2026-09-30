// 产物冒烟：运营必需资产存在 + 产物后处理确实发生。CI 在 build 之后、check:links 之前运行。
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');

/* 必需资产：运营与分发依赖它们，构建成功不等于它们在 */
const required = [
  'feed.xml',
  'sitemap-index.xml',
  '404.html',
  'og-default.png',
  'search/index.html',
];

/* 产物后处理断言：anchor-links 集成与 trim-dist 都是副作用，必须验证副作用真的发生 */
function countAnchors() {
  let n = 0;
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) n += (readFileSync(p, 'utf8').match(/class="anchor"/g) || []).length;
    }
  })(dist);
  return n;
}

function main() {
  let errors = 0;
  for (const f of required) {
    if (!existsSync(join(dist, f))) {
      console.error(`缺产物: ${f}`);
      errors++;
    }
  }
  const anchors = countAnchors();
  if (anchors === 0) {
    console.error('标题锚链注入数为 0：anchor-links 集成未生效');
    errors++;
  }
  if (errors > 0) process.exit(1);
  console.log(`产物冒烟通过：必需资产齐全，锚链 ${anchors} 处。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
