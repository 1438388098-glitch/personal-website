// 扫描 dist/**/*.html 中的站内链接（href/src 以 / 开头），校验目标文件存在。
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const ALLOW = new Set(['/resume/hu-shengwei-resume.pdf']); // PDF 待站主补齐，M4 上线前移除白名单

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const linkRe = /(?:href|src)="(\/[^"#?]*)[^"]*"/g;
const bad = [];
let skipped = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(linkRe)) {
    const path = decodeURIComponent(m[1]);
    if (ALLOW.has(path)) { skipped++; continue; }
    const target = join(dist, path);
    const asFile = existsSync(target) && statSync(target).isFile();
    const asDir = existsSync(join(target, 'index.html'));
    if (!asFile && !asDir) bad.push(`${file}: ${m[1]}`);
  }
}
if (bad.length > 0) {
  console.error(`死链 ${bad.length} 个：\n${bad.join('\n')}`);
  process.exit(1);
}
if (skipped > 0) console.log(`跳过白名单 ${skipped} 项。`);
console.log(`内链检查通过：${htmlFiles.length} 个页面，无死链。`);
