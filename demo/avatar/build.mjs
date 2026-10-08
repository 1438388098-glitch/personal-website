// 出图脚本：从 marks.mjs 生成 6 张 512×512 成品方图（PNG）、对应的矢量 SVG，以及 6 版对比表 sheet.png。
//
//   node demo/avatar/build.mjs
//
// 两条渲染路径都必须走 Chrome：librsvg/sharp 依赖 fontconfig，不认识 CSS @font-face，
// 而 Archivo 没有系统安装，用 sharp 渲染含 <text> 的 SVG 会静默回退到系统字体。
// 这里把 woff2 以 base64 内联进 HTML 的 @font-face，绕开 file:// 的字体跨源限制。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { marks, svgOf } from './marks.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const WORK = path.join(os.tmpdir(), 'avatar-build'); // 中间产物（含大段 base64）不落在仓库里
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FONT = path.join(REPO, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2');

const sharp = createRequire(path.join(REPO, 'package.json'))('sharp');
fs.mkdirSync(WORK, { recursive: true });

const fontB64 = fs.readFileSync(FONT).toString('base64');
// marks.mjs 是 ESM，浏览器里要靠内联；去掉 export 关键字即可当普通脚本跑。
const marksSrc = fs.readFileSync(path.join(HERE, 'marks.mjs'), 'utf8').replace(/^export /gm, '');

function shoot(htmlName, w, h, outPng, scale) {
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--user-data-dir=${path.join(WORK, '.cprof')}`,
    `--force-device-scale-factor=${scale}`,
    `--window-size=${w},${h}`, // --screenshot 只截视口：高度必须大于内容，否则底部被裁
    '--virtual-time-budget=6000', // 不给它可能在字体就绪前就截图
    '--default-background-color=ffffffff',
    `--screenshot=${outPng}`,
    `file:///${path.join(WORK, htmlName).replace(/\\/g, '/')}`,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
}

/* 1) 六版对比表 */
{
  let html = fs.readFileSync(path.join(HERE, 'template.html'), 'utf8');
  // 「上一版」对照格用 avatar-prev.png（换头像前的旧图存档）；文件不在就整格拿掉，别渲染成空圈。
  const prevPath = path.join(HERE, 'avatar-prev.png');
  html = fs.existsSync(prevPath)
    ? html.replace('__NOW_B64__', fs.readFileSync(prevPath).toString('base64'))
    : html.replace(/<!-- now-tile:start -->[\s\S]*?<!-- now-tile:end -->/, '');
  html = html.replace('/*__MARKS__*/', marksSrc).replace('__FONT_B64__', fontB64);
  fs.writeFileSync(path.join(WORK, 'sheet.html'), html);
  shoot('sheet.html', 1320, 1420, path.join(HERE, 'sheet.png'), 1.5);
  const m = await sharp(path.join(HERE, 'sheet.png')).metadata();
  console.log(`sheet.png  ${m.width}x${m.height}  （六版对比，含 16/20/44/64px 档）`);
}

/* 2) 成品方图：一页横向平铺后按整格切出，只启动一次 Chrome */
{
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @font-face { font-family:'Archivo'; src:url(data:font/woff2;base64,${fontB64}) format('woff2-variations');
      font-weight:100 900; font-display:block; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${512 * marks.length}px; height:512px; display:flex; }
    .t { width:512px; height:512px; flex:none; }
    .t svg { display:block; width:100%; height:100%; }
  </style></head><body>${marks.map((m) => `<div class="t">${svgOf(m)}</div>`).join('')}</body></html>`;
  fs.writeFileSync(path.join(WORK, 'finals.html'), html);

  const strip = path.join(WORK, 'finals.png');
  shoot('finals.html', 512 * marks.length, 512, strip, 2);

  const meta = await sharp(strip).metadata();
  const tile = meta.width / marks.length;
  for (let i = 0; i < marks.length; i++) {
    const png = path.join(HERE, `avatar-${marks[i].key}.png`);
    await sharp(strip)
      .extract({ left: Math.round(i * tile), top: 0, width: Math.round(tile), height: meta.height })
      .resize(512, 512, { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(png);
    fs.writeFileSync(path.join(HERE, `avatar-${marks[i].key}.svg`), svgOf(marks[i]) + '\n');
    console.log(`avatar-${marks[i].key}.png  512x512  ${(fs.statSync(png).size / 1024).toFixed(1)} KB  ${marks[i].name}`);
  }
}
