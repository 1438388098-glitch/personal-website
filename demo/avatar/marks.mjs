// GitHub 头像候选的几何定义。build.mjs（出 PNG/对比表）与 check-final.mjs（圆形裁切验收）共用这一份，
// 避免预览与成品各写一遍导致不一致。
//
// 规矩（与 demo/redesign-style-guide.md 同源）：只用站点令牌、零圆角、Archivo 900；
// 所有内容留在内切圆内 —— GitHub 头像一律裁圆，方图上传、显示成圆。

export const BG = '#faf9f6';    // --bg 暖白
export const INK = '#17160f';   // --ink 墨
export const BLUE = '#2745f0';  // --accent 强调蓝（亮）
export const DARK = '#151513';  // 暗色底
export const LILAC = '#8b9dff'; // --accent（暗）

// Archivo 的大写字高约为 0.73em：按字高居中求基线，而不是按行盒居中。
const capY = (s) => (50 + (0.73 * s) / 2).toFixed(1);
const S = (size, fill, dx = 0, dy = 0) =>
  `<g transform="translate(${dx},${dy})"><text x="50" y="${capY(size)}" font-family="Archivo" font-weight="900" text-anchor="middle" font-size="${size}" fill="${fill}">S</text></g>`;

export const marks = [
  {
    key: 'A',
    name: 'A · 蓝底白 S',
    note: '满幅强调蓝配 Archivo 900 的 S。最亮、最不像公文，缩到 16px 还是一个结实的蓝块。',
    svg: `<rect width="100" height="100" fill="${BLUE}"/>` + S(78, BG),
  },
  {
    key: 'B',
    name: 'B · 白底蓝 S + 站点角标',
    note: '把站点「反色块四角 + 记号」的母题移到头像上。但那对 + 是纯装饰，按「装饰必须有数据含义」的规矩站不住。',
    svg:
      `<rect width="100" height="100" fill="${BG}"/>` +
      S(74, BLUE) +
      `<g stroke="${INK}" stroke-width="2.4">
         <path d="M28 21 v11 M22.5 26.5 h11"/><path d="M72 68 v11 M66.5 73.5 h11"/>
       </g>`,
  },
  {
    key: 'C',
    name: 'C · S + 块状光标',
    note: '墨色 S 后面跟一个蓝色块状光标，读作「还在写」。工程味、轻，不是律所徽章那一挂。',
    svg:
      `<rect width="100" height="100" fill="${BG}"/>` +
      S(70, INK, -13, 0) +
      `<rect x="61" y="46" width="17" height="21" fill="${BLUE}"/>`,
  },
  {
    key: 'D',
    name: 'D · 三根蓝柱',
    note: '呼应首页数字面板的量化语言：不标榜权威，标榜「可测量、可复现」。16px 下依然是个清楚的轮廓。',
    svg: `<rect width="100" height="100" fill="${BG}"/>
          <g fill="${BLUE}">
            <rect x="26" y="52" width="15" height="26"/>
            <rect x="43" y="38" width="15" height="40"/>
            <rect x="60" y="24" width="15" height="54"/>
          </g>
          <rect x="20" y="78" width="60" height="3" fill="${INK}"/>`,
  },
  {
    key: 'E',
    name: 'E · 方块与圆对置（2026-10-08 选定，站主头像）',
    note: '一端墨色方块（成文规则），一端蓝色圆（概率模型），中间是天平。保留法律身份，但把庄严徽章改成了结构图。',
    // 512px 下复核过：吊杆要 22 单位才读得出「悬吊」，15 时像磕碰掉的小疙瘩；支点顶端不留疙瘩。
    // 纯几何、不含文字，所以导出的 avatar-E.svg 不依赖 Archivo，可自由缩放改色。
    svg: `<rect width="100" height="100" fill="${BG}"/>
          <g stroke="${INK}" stroke-width="5">
            <path d="M21 26 H79"/><path d="M50 26 V71"/><path d="M37 71 H63"/>
            <path d="M21 26 V48"/><path d="M79 26 V48"/>
          </g>
          <rect x="10" y="48" width="22" height="22" fill="${INK}"/>
          <circle cx="78" cy="59" r="11" fill="${BLUE}"/>`,
  },
  {
    key: 'F',
    name: 'F · 墨底蓝 S（反色）',
    note: '深底配站点暗色模式的浅蓝。在一列浅色头像里最跳，代价是与站点亮色主调不一致。',
    svg: `<rect width="100" height="100" fill="${DARK}"/>` + S(78, LILAC),
  },
];

export const svgOf = (m) =>
  `<svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">${m.svg}</svg>`;
