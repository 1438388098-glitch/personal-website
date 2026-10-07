// @ts-check
// 构建后清理：删除 dist/_astro 下的 .woff 旧格式字体（woff2 在 @fontsource src 列表首位，
// 2016 年后的浏览器全部走 woff2，woff 属于永不下载的死重，约占部署体积一半）。
// 扫描为**递归**：Astro 可能把字体/CSS 放进 _astro 子目录，只扫顶层会漏删。
import { readdirSync, readFileSync, writeFileSync, unlinkSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve('dist/_astro');

/** 递归列出 root 下所有文件的绝对路径（子目录不清空，交给 readdir 逐层下探）。
 * @param {string} root
 * @returns {string[]} */
function walkFiles(root) {
  /** @type {string[]} */
  const out = [];
  (function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(p);
    }
  })(root);
  return out;
}

try {
  /* 只扫一次目录：后续三处过滤都基于同一份文件清单，避免目录结构变动时口径不一致 */
  const files = walkFiles(dir);

  const woffs = files.filter((f) => f.endsWith('.woff'));
  for (const f of woffs) unlinkSync(f);
  if (woffs.length === 0) {
    /* 产物目录名变化或上游已不产 .woff：静默通过会掩盖漏删，构建日志必须喊一声 */
    console.warn(`trim-dist: ${dir} 下没有可删的 .woff（0 个）。若上游仍产 .woff，说明产物目录名变了，请核对。`);
  }
  console.log(`trim-dist: 已删除 ${woffs.length} 个 .woff 死重文件。`);

  /* 删文件后 CSS 里的 src 列表还挂着 .woff 引用（悬挂路径）。
     浏览器永远先命中 woff2，但产物不该留死链接：把「, url(...woff) format("woff")」整段抹掉。 */
  const cssFiles = files.filter((f) => f.endsWith('.css'));
  let rewritten = 0;
  for (const p of cssFiles) {
    const css = readFileSync(p, 'utf8');
    const next = css.replace(/,\s*url\([^)]*\.woff\)\s*format\((["'])woff\1\)/g, '');
    if (next !== css) {
      writeFileSync(p, next);
      rewritten++;
    }
  }
  console.log(`trim-dist: 已改写 ${rewritten} 个 CSS 的 .woff 悬挂引用。`);

  /* 非 CJK 切片（cyrillic/greek/vietnamese/latin-ext 等）不在本步删。
     早先按文件名正则删，依据是「中文站永不命中」——这个前提是错的：
     项目页里写着 α/κ/γ，Noto 的 greek 切片正是它们的唯一覆盖来源，按名字删会让这几个字母
     掉进系统字体。改由 subset-fonts 按「站内实际用到哪些字符」决定：零命中的分片连
     @font-face 块一起删掉，命中的压成极小文件。判据从文件名换成真实用量，不再依赖假设。 */

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
  if (/** @type {{ code?: string }} */ (err).code === 'ENOENT') {
    console.error('trim-dist: dist/_astro 不存在，请先 astro build');
    process.exit(1);
  }
  throw err;
}
