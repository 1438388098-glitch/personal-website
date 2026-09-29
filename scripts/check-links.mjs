// 扫描 dist/**/*.html 中的站内链接（href/src 以 / 开头），校验目标文件存在。
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
// PDF 待站主补齐
// TODO(M4 上线前): 补齐 PDF 后移除本白名单并复跑 check:links
const ALLOW = new Set(['/resume/hu-shengwei-resume.pdf']);

if (!existsSync(dist)) {
  console.error('dist 不存在，请先 npm run build');
  process.exit(1);
}

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
const decodeFails = [];
let skipped = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(linkRe)) {
    let path;
    try {
      path = decodeURIComponent(m[1]);
    } catch {
      path = m[1];
      decodeFails.push(`${file}: ${m[1]}`);
    }
    if (ALLOW.has(path)) { skipped++; continue; }
    const target = join(dist, path);
    const asFile = existsSync(target) && statSync(target).isFile();
    const asDir = existsSync(join(target, 'index.html'));
    if (!asFile && !asDir) bad.push(`${file}: ${m[1]}`);
  }
}
if (decodeFails.length > 0) {
  console.warn(`解码失败 ${decodeFails.length} 处（已按原始串继续）：\n${decodeFails.join('\n')}`);
}
if (bad.length > 0) {
  console.error(`死链 ${bad.length} 个：\n${bad.join('\n')}`);
  process.exit(1);
}
if (skipped > 0) console.log(`跳过白名单 ${skipped} 项。`);
console.log(`内链检查通过：${htmlFiles.length} 个页面，无死链。`);
