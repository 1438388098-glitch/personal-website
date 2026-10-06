// @ts-check
// 扫描 dist/**/*.html 中的站内链接（href/src 以 / 开头），校验目标文件存在。
// 解析与判定抽成纯函数导出（gates 测试消费）；命令行直跑时才执行扫描主流程。
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');

/** 从一段 HTML 提取站内链接目标（href/src 以 / 开头，剔除锚点与查询串）。
    \s 前缀防误匹配 data-href 这类属性名。
 * @param {string} html
 * @returns {string[]} */
export function parseLinks(html) {
  const linkRe = /\s(?:href|src)="(\/[^"#?]*)[^"]*"/g;
  return [...html.matchAll(linkRe)].map((m) => m[1]);
}

/** 解码百分号编码；畸形序列返回 null（调用方按原始串降级并告警）
 * @param {string} link
 * @returns {string | null} */
export function decodeLink(link) {
  try {
    return decodeURIComponent(link);
  } catch {
    return null;
  }
}

/** 站内路径在 dist 下是否存在（文件，或目录的 index.html）
 * @param {string} dist
 * @param {string} path
 * @returns {boolean} */
export function linkTargetExists(dist, path) {
  const target = join(dist, path);
  if (!existsSync(target)) return false;
  return statSync(target).isFile() || existsSync(join(target, 'index.html'));
}

function main() {
  if (!existsSync(dist)) {
    console.error('dist 不存在，请先 npm run build');
    process.exit(1);
  }

  /** @type {string[]} */
  const htmlFiles = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) htmlFiles.push(p);
    }
  })(dist);

  const bad = [];
  const decodeFails = [];
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const link of parseLinks(html)) {
      const decoded = decodeLink(link);
      const path = decoded ?? link;
      if (decoded === null) decodeFails.push(`${file}: ${link}`);
      if (!linkTargetExists(dist, path)) bad.push(`${file}: ${link}`);
    }
  }
  if (decodeFails.length > 0) {
    console.warn(`解码失败 ${decodeFails.length} 处（已按原始串继续）：\n${decodeFails.join('\n')}`);
  }
  if (bad.length > 0) {
    console.error(`死链 ${bad.length} 个：\n${bad.join('\n')}`);
    process.exit(1);
  }
  console.log(`内链检查通过：${htmlFiles.length} 个页面，无死链。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
