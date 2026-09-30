// 扫描 dist 文本产物中的密钥特征串与个人信息红线，命中即失败。
// 扫描逻辑抽成纯函数导出（gates 测试消费）；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const textExts = new Set(['.html', '.js', '.css', '.xml', '.svg', '.txt', '.json']);
// 注意：.pdf 是二进制，正则扫不可靠——简历 PDF 上线前须人工复查手机号
const patterns = [
  [/sk-[A-Za-z0-9]{20,}/g, '疑似 LLM API Key'],
  [/ghp_[A-Za-z0-9]{20,}/g, '疑似 GitHub PAT（经典）'],
  [/gho_[A-Za-z0-9]{20,}/g, '疑似 GitHub OAuth Token'],
  [/github_pat_[A-Za-z0-9_]{20,}/g, '疑似 GitHub PAT（细粒度）'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/g, '疑似 Slack Token'],
  [/AKIA[0-9A-Z]{16}/g, '疑似 AWS Access Key'],
  [/"?api[_-]?key"?\s*[:=]\s*["'][^"']{8,}["']/gi, '疑似明文 api key 赋值'],
  // 个人信息红线：站主声明手机号绝不上站
  [/(?<!\d)1[3-9]\d{9}(?!\d)/g, '疑似手机号（内容红线）'],
  [/(?<!\d)\d{17}[\dXx](?!\d)/g, '疑似身份证号（内容红线）']
];

/** 扫一段文本，返回命中的红线列表（label + 脱敏片段 + 位置） */
export function scanSecrets(text) {
  const hits = [];
  for (const [re, label] of patterns) {
    for (const m of text.matchAll(re)) {
      hits.push({ label, snippet: m[0].slice(0, 20), index: m.index });
    }
  }
  return hits;
}

function main() {
  if (!existsSync(dist)) {
    console.error('dist 不存在，请先 npm run build');
    process.exit(1);
  }

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
    for (const hit of scanSecrets(content)) {
      const line = content.slice(0, hit.index).split('\n').length;
      console.error(`${hit.label}: ${file}:${line}（${hit.snippet}…）`);
      hits++;
    }
  }
  if (hits > 0) { process.exit(1); }
  console.log(`密钥扫描通过：${files.length} 个文件无命中。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
