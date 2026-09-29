// 扫描 dist 文本产物中的密钥特征串，命中即失败（内容红线）。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const dist = resolve('dist');
const textExts = new Set(['.html', '.js', '.css', '.xml', '.svg', '.txt', '.json']);
const patterns = [
  [/sk-[A-Za-z0-9]{20,}/, '疑似 LLM API Key'],
  [/ghp_[A-Za-z0-9]{20,}/, '疑似 GitHub Token'],
  [/"?api[_-]?key"?\s*[:=]\s*["'][^"']{8,}["']/i, '疑似明文 api key 赋值']
];
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (textExts.has(extname(name))) files.push(p);
  }
})(dist);

let hits = 0;
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const [re, label] of patterns) {
    const hit = re.exec(content);
    if (hit) {
      const line = content.slice(0, hit.index).split('\n').length;
      const snippet = hit[0].slice(0, 20);
      console.error(`${label}: ${file}:${line}（${snippet}…）`);
      hits++;
    }
  }
}
if (hits > 0) { process.exit(1); }
console.log(`密钥扫描通过：${files.length} 个文件无命中。`);
