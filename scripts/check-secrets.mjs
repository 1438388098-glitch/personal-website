// @ts-check
// 扫描 dist 文本产物中的密钥特征串与个人信息红线，命中即失败。
// 扫描逻辑抽成纯函数导出（gates 测试消费）；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const textExts = new Set(['.html', '.js', '.css', '.xml', '.svg', '.txt', '.json']);
// 注意：.pdf 是二进制，正则扫不可靠——简历 PDF 上线前须人工复查手机号
/** @type {[RegExp, string][]} */
const patterns = [
  [/sk-[A-Za-z0-9]{20,}/g, '疑似 LLM API Key'],
  [/sk_live_[A-Za-z0-9]{10,}/g, '疑似 Stripe 密钥'],
  [/ghp_[A-Za-z0-9]{20,}/g, '疑似 GitHub PAT（经典）'],
  [/gho_[A-Za-z0-9]{20,}/g, '疑似 GitHub OAuth Token'],
  [/github_pat_[A-Za-z0-9_]{20,}/g, '疑似 GitHub PAT（细粒度）'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/g, '疑似 Slack Token'],
  [/AKIA[0-9A-Z]{16}/g, '疑似 AWS Access Key'],
  [/"?api[_-]?key"?\s*[:=]\s*["'][^"']{8,}["']/gi, '疑似明文 api key 赋值'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/g, '疑似私钥（PEM）'],
  [/\bBearer\s+[A-Za-z0-9._~+/=-]{16,}/g, '疑似 Bearer Token'],
  [/eyJ[A-Za-z0-9_-]{10,}\./g, '疑似 JWT'],
  /* 连接串内嵌密码：限定 URL userinfo 字符集并排除引号/花括号等 JSON 标点，
     否则 https://host","x":{"@type 这类相邻 JSON 字段会被误连成 user:pass@host */
  [/[a-z][a-z0-9+.-]*:\/\/[^:@/\s"'<>{}\[\],]*:[^@/\s"'<>{}\[\],]+@/gi, '疑似连接串内嵌密码'],
  // 个人信息红线：站主声明手机号绝不上站。两侧须为非数字，避免从更长数字串里截出 11 位
  [/(?<!\d)1[3-9]\d{9}(?!\d)/g, '疑似手机号（内容红线）'],
  [/(?<!\d)\d{17}[\dXx](?!\d)/g, '疑似身份证号（内容红线）']
];

/** 豁免通道：名单内文件（按文件名后缀精确匹配）整体跳过扫描，必须写明理由。
   只用于确证无害的样例/ fixtures；线上产物出现命中时应修内容而非加豁免。
 * @type {{ file: string, reason: string }[]} */
const ALLOWLIST = [
  // { file: 'example.html', reason: '样例页面含演示用假密钥（公开测试 fixtures）' },
];

/** 扫一段文本，返回命中的红线列表（label + index + 命中长度）。
    刻意不返回命中片段：密钥值本身就是敏感数据，不进任何日志或报错输出。
 * @param {string} text
 * @returns {{ label: string, length: number, index: number }[]} */
export function scanSecrets(text) {
  const hits = [];
  for (const [re, label] of patterns) {
    for (const m of text.matchAll(re)) {
      hits.push({ label, length: m[0].length, index: m.index });
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
    if (ALLOWLIST.some((a) => file.endsWith(a.file))) continue;
    const content = readFileSync(file, 'utf8');
    for (const hit of scanSecrets(content)) {
      const line = content.slice(0, hit.index).split('\n').length;
      /* 只报规则名 + 位置 + 长度：绝不打印命中内容，日志本身不能成为泄露渠道 */
      console.error(`${hit.label}: ${file}:${line}（命中长度 ${hit.length}）`);
      hits++;
    }
  }
  if (hits > 0) { process.exit(1); }
  console.log(`密钥扫描通过：${files.length} 个文件无命中。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
