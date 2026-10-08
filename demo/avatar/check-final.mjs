// 定稿头像的圆形裁切验收：GitHub 一律把头像裁成圆，方图好看不等于裁完好看。
//
//   node demo/avatar/check-final.mjs
//
// 产出 e-final-check.png：E 在 380 / 96 / 64 / 32 / 20px 五档圆形裁切，外加一次 GitHub 页头式的实况摆位。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marks, svgOf } from './marks.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const WORK = path.join(os.tmpdir(), 'avatar-build');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FONT = path.join(REPO, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2');

const mark = marks.find((m) => m.key === (process.argv[2] || 'E'));
if (!mark) throw new Error(`marks.mjs 里没有候选 ${process.argv[2]}`);
const fontB64 = fs.readFileSync(FONT).toString('base64');
fs.mkdirSync(WORK, { recursive: true });

const at = (px) => svgOf(mark).replace('width="100" height="100"', `width="${px}" height="${px}"`);
const crop = (px, right = '0') =>
  `<div style="text-align:center;margin-right:${right}">
     <div style="width:${px}px;height:${px}px;border-radius:50%;overflow:hidden">${at(px)}</div>
     <div class="cap">${px}px</div>
   </div>`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @font-face { font-family:'Archivo'; src:url(data:font/woff2;base64,${fontB64}) format('woff2-variations'); font-weight:100 900; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:980px; background:#fff; padding:30px 36px; font-family:'Archivo','Segoe UI',sans-serif; color:#17160f; }
  h2 { font-size:15px; font-weight:800; margin-bottom:16px; }
  .r { display:flex; align-items:flex-end; }
  .cap { font-size:11px; color:#6b6a63; margin-top:8px; }
  .hr { display:flex; align-items:center; gap:12px; margin-top:26px; padding-top:18px; border-top:1px solid #e2e0d8; }
  .who { font-size:20px; font-weight:800; }
  .bio { font-size:12px; color:#6b6a63; margin-top:2px; }
</style></head><body>
  <h2>定稿 ${mark.key} · 圆形裁切验收</h2>
  <div class="r">${crop(380, '30px')}${crop(96, '22px')}${crop(64, '18px')}${crop(32, '14px')}${crop(20)}</div>
  <div class="hr">
    <div style="width:64px;height:64px;border-radius:50%;overflow:hidden">${at(64)}</div>
    <div><div class="who">Stoic</div><div class="bio">LL.B. candidate @ ZUEL × self-taught engineer · 法律 × AI</div></div>
  </div>
</body></html>`;

fs.writeFileSync(path.join(WORK, 'check-final.html'), html);
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--user-data-dir=${path.join(WORK, '.cprof')}`,
  '--force-device-scale-factor=2', '--window-size=980,600',
  '--virtual-time-budget=6000', '--default-background-color=ffffffff',
  `--screenshot=${path.join(HERE, 'e-final-check.png')}`,
  `file:///${path.join(WORK, 'check-final.html').replace(/\\/g, '/')}`,
], { stdio: ['ignore', 'ignore', 'pipe'] });
console.log('e-final-check.png 已更新');
