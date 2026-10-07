// @ts-check
/* 字体预算核算：按各页实际出现的字符，算出浏览器会命中哪些 Noto 切片、合计多少字节。
   用途是给「首屏字体该不该再压」提供可复算的数字，不参与构建。 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = 'dist';
const astroDir = join(dist, '_astro');
const fontsCss = readdirSync(astroDir)
  .filter((f) => f.includes('fonts') && f.endsWith('.css'))
  .map((f) => join(astroDir, f))[0];
/** @type {Record<string, number>} */
const sizes = {};
for (const f of readdirSync(astroDir)) {
  const m = /noto-sans-sc-(\d+)-wght-normal\..*\.woff2/.exec(f);
  if (m) sizes[m[1]] = statSync(join(astroDir, f)).size;
}
const faces = [...readFileSync(fontsCss, 'utf8').matchAll(/@font-face\{([^}]*)\}/g)]
  .map((m) => m[1])
  .map((b) => {
    const num = /noto-sans-sc-(\d+)-wght-normal/.exec(b)?.[1];
    if (!num) return null;
    const ur = /unicode-range:([^;}]*)/.exec(b)?.[1] ?? '';
    const ranges = ur
      .split(',')
      .filter(Boolean)
      .map((r) => {
        const [a, z] = r.trim().replace(/^U\+/i, '').split('-');
        const lo = parseInt(a, 16);
        return [lo, z ? parseInt(z, 16) : lo];
      });
    return { num, ranges, size: sizes[num] ?? 0 };
  })
  .filter((x) => x !== null);
console.log(
  `Noto 分片声明 ${faces.length} 个，文件合计 ${Math.round(faces.reduce((a, f) => a + f.size, 0) / 1024)}KB`,
);

/** 取可见文本：脚本/样式与标签都剥掉，HTML 实体压成空格（实体多是不可见字符） */
/** @param {string} html */
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');

const pages = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
})(dist);

/** @param {Set<number>} cps */
const hitSlices = (cps) => faces.filter((f) => f.ranges.some(([a, z]) => [...cps].some((c) => c >= a && c <= z)));

const rows = [];
for (const p of pages) {
  const cps = new Set([...textOf(readFileSync(p, 'utf8'))].map((c) => c.codePointAt(0) ?? 0));
  const hit = hitSlices(cps);
  rows.push({
    page: '/' + relative(dist, p).replace(/\\/g, '/').replace('index.html', ''),
    slices: hit.length,
    kb: Math.round(hit.reduce((a, f) => a + f.size, 0) / 1024),
    chars: cps.size,
  });
}
rows.sort((a, b) => b.kb - a.kb);
console.log('\n字体字节最多的 12 个页面:');
for (const r of rows.slice(0, 12)) {
  console.log(String(r.kb).padStart(4) + 'KB', String(r.slices).padStart(3) + ' 片', String(r.chars).padStart(5) + ' 不同字符', r.page);
}
const total = rows.reduce((a, r) => a + r.kb, 0);
const sorted = rows.map((r) => r.kb).sort((a, b) => a - b);
console.log(
  `\n全部 ${rows.length} 页：平均 ${Math.round(total / rows.length)}KB，中位数 ${sorted[Math.floor(rows.length / 2)]}KB`,
);

const union = new Set();
for (const p of pages) for (const c of textOf(readFileSync(p, 'utf8'))) union.add(c.codePointAt(0) ?? 0);
const unionHit = hitSlices(union);
console.log(
  `全站并集：${union.size} 个码位，命中 ${unionHit.length} 片 / ${Math.round(unionHit.reduce((a, f) => a + f.size, 0) / 1024)}KB`,
);
