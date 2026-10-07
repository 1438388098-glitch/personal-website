// @ts-check
// 金标 A：中文内容零回归。对 src/content/** 全量 .md 计算 SHA256，与清单比对，任何改动即失败。
// --update 显式再生清单（用户有意修订中文内容时使用，提交里要能看出「动了金标」）。
// 清单文件入库（scripts/content-golden.json），构成中文内容不可静默变动的硬闸。
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve('src/content');
const MANIFEST = resolve('scripts/content-golden.json');

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** 相对路径 → 哈希 的全量清单（按路径排序，保证 diff 稳定） */
export function collectHashes(root = ROOT) {
  const map = {};
  (function walk(dir) {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.md')) map[p.split(root).pop().replace(/\\/g, '/')] = sha256(readFileSync(p, 'utf8'));
    }
  })(root);
  return map;
}

/** 比对清单，返回违规说明列表（新增/缺失/改动各是一条） */
export function diffManifest(hashes, manifest) {
  const issues = [];
  for (const [f, h] of Object.entries(hashes)) {
    if (!(f in manifest)) issues.push(`${f}: 新文件不在金标清单（--update 再生）`);
    else if (manifest[f] !== h) issues.push(`${f}: 中文内容被改动（金标 A 失守）`);
  }
  for (const f of Object.keys(manifest)) {
    if (!(f in hashes)) issues.push(`${f}: 中文文件被删除（金标 A 失守）`);
  }
  return issues;
}

function main() {
  const hashes = collectHashes();
  if (process.argv.includes('--update')) {
    writeFileSync(MANIFEST, JSON.stringify(hashes, null, 2) + '\n');
    console.log(`content-golden: 清单已再生，${Object.keys(hashes).length} 个文件。`);
    return;
  }
  if (!existsSync(MANIFEST)) {
    console.error('content-golden: 清单不存在，先跑 node scripts/content-golden.mjs --update');
    process.exit(1);
  }
  const issues = diffManifest(hashes, JSON.parse(readFileSync(MANIFEST, 'utf8')));
  if (issues.length > 0) {
    console.error(`content-golden 失败，${issues.length} 处：`);
    for (const i of issues) console.error('  ' + i);
    process.exit(1);
  }
  console.log(`content-golden 通过：中文内容 ${Object.keys(hashes).length} 个文件逐字节未动。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
