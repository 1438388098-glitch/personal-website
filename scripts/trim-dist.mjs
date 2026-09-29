// 构建后清理：删除 dist/_astro 下的 .woff 旧格式字体（woff2 在 @fontsource src 列表首位，
// 2016 年后的浏览器全部走 woff2，woff 属于永不下载的死重，约占部署体积一半）。
import { readdirSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve('dist/_astro');
try {
  const woffs = readdirSync(dir).filter((f) => f.endsWith('.woff'));
  for (const f of woffs) unlinkSync(join(dir, f));
  console.log(`trim-dist: 已删除 ${woffs.length} 个 .woff 死重文件。`);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('trim-dist: dist/_astro 不存在，请先 astro build');
    process.exit(1);
  }
  throw err;
}
