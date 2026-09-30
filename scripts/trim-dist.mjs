// 构建后清理：删除 dist/_astro 下的 .woff 旧格式字体（woff2 在 @fontsource src 列表首位，
// 2016 年后的浏览器全部走 woff2，woff 属于永不下载的死重，约占部署体积一半）。
import { readdirSync, readFileSync, writeFileSync, unlinkSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve('dist/_astro');
try {
  const woffs = readdirSync(dir).filter((f) => f.endsWith('.woff'));
  for (const f of woffs) unlinkSync(join(dir, f));
  if (woffs.length === 0) {
    /* 产物目录名变化或上游已不产 .woff：静默通过会掩盖漏删，构建日志必须喊一声 */
    console.warn(`trim-dist: ${dir} 下没有可删的 .woff（0 个）。若上游仍产 .woff，说明产物目录名变了，请核对。`);
  }
  console.log(`trim-dist: 已删除 ${woffs.length} 个 .woff 死重文件。`);

  /* 删文件后 CSS 里的 src 列表还挂着 .woff 引用（悬挂路径）。
     浏览器永远先命中 woff2，但产物不该留死链接：把「, url(...woff) format("woff")」整段抹掉。 */
  let rewritten = 0;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    const p = join(dir, f);
    const css = readFileSync(p, 'utf8');
    const next = css.replace(/,\s*url\([^)]*\.woff\)\s*format\((["'])woff\1\)/g, '');
    if (next !== css) {
      writeFileSync(p, next);
      rewritten++;
    }
  }
  console.log(`trim-dist: 已改写 ${rewritten} 个 CSS 的 .woff 悬挂引用。`);

  /* 非 CJK 切片（中文站永不命中 unicode-range）：删文件并从 CSS 抹掉对应 @font-face 块。
     latin 保留：数字与西文展示位在用。 */
  const nonCjk = /(cyrillic|vietnamese|greek|latin-ext)/;
  let sliced = 0;
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.woff2') && nonCjk.test(f)) {
      unlinkSync(join(dir, f));
      sliced++;
    }
  }
  let blocks = 0;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    const p = join(dir, f);
    const css = readFileSync(p, 'utf8');
    const next = css.replace(/@font-face\s*{[^}]*}[\s\S]?/g, (m) => (nonCjk.test(m) ? (blocks++, '') : m));
    if (next !== css) writeFileSync(p, next);
  }
  console.log(`trim-dist: 已剔除 ${sliced} 个非 CJK 切片、${blocks} 个对应 @font-face 块。`);

  /* public/ 会被逐字部署：dist 里出现 .md 说明把内部工作笔记当静态资产发了，直接失败 */
  const strays = [];
  (function walkMd(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walkMd(p);
      else if (name.endsWith('.md')) strays.push(p);
    }
  })(resolve('dist'));
  if (strays.length > 0) {
    console.error('trim-dist: dist 内发现 .md 文件（内部笔记不该上站）：\n' + strays.join('\n'));
    process.exit(1);
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('trim-dist: dist/_astro 不存在，请先 astro build');
    process.exit(1);
  }
  throw err;
}
