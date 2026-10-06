/* 列表页「分类 / 分组」筛选 tabs 的公共行为。
   博客分类页与项目分组页原先各写一份几乎逐行相同的脚本，抽到一处以免修一处漏一处。

   两个页面的差异不靠开关参数，而是由 DOM 自身表达，脚本自动适配：
   - 博客有 [data-view="all"] 平铺视图：选「全部」= 展示平铺列表、隐藏所有分类板块；
   - 项目没有该容器：选「全部」= 所有分区照常显示。
   博客还额外有 [data-note]（法学长文提示，仅「全部」时显示）与 [data-empty-note]
   （空分类占位文案）；项目页没有这两个节点，相关分支自动跳过。

   单监听：initTabs 会在两个页面的脚本入口里各被调用一次（各自打包、各执行一次）。
   若每次调用都在 document 上注册一个 astro:page-load 监听器，先访问 blog 再访问 projects 后，
   两个监听器会同时作用于当前 DOM —— 回 blog 点 tab 时 projects 那个会先把 aria-pressed
   全清、hash 清空，再被 blog 的修正，顺序敏感且有瞬时闪烁。
   因此模块级只注册一个监听器，回调内按当前 DOM 判定该用哪套配置，只处理本页存在的 tab。

   两页语义（逐位保留）：
   - astro:page-load 首次加载与每次换页后都触发：ClientRouter 换页会替换 DOM；
   - aria-pressed 表示选中态；
   - 隐藏 section 用 hidden 属性，可见分区按 01 递增重编号（项目页的 .sec-no）；
   - 支持中文 hash 深链（浏览器会把非 ASCII fragment 百分号编码，比较前先解码）；
   - 选中后 history.replaceState 写回 hash，「全部」时清掉 hash。 */

export interface TabsOptions {
  /** tab 按钮上的 dataset 键名，'cat' 对应 data-cat */
  tabAttr: string;
  /** section 上的 dataset 键名，'category' 对应 data-category */
  sectionAttr: string;
}

/** 「全部」这一档的取值，与两个页面 tab 的 data 值一致 */
const ALL = '全部';

/** camelCase 键名转 kebab 属性名：tabAttr 一般是单词，这里兜住多词写法 */
const dasherize = (s: string): string => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** 唯一的 astro:page-load 回调：按当前 DOM 判定页面语义，只处理本页存在的 tab。 */
function applyTabs(): void {
  /* 博客：有 section[data-category]（且含 [data-view="all"]）；项目：有 section[data-group]。
     两者互斥，先判博客。都没有 = 非列表页，直接返回，不触碰任何元素。 */
  const isBlog = document.querySelector('section[data-category]') !== null;
  if (!isBlog && document.querySelector('section[data-group]') === null) return;

  const tabAttr = isBlog ? 'cat' : 'group';
  const sectionAttr = isBlog ? 'category' : 'group';
  const sectionSelector = `section[data-${dasherize(sectionAttr)}]`;

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.tab'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));
  const allView = document.querySelector<HTMLElement>('[data-view="all"]');
  /* 有平铺视图容器 = 博客语义：「全部」隐藏所有板块而非全部显示 */
  const flatAll = allView !== null;
  const allNote = document.querySelector<HTMLElement>('[data-note]');
  const emptyNote = document.querySelector<HTMLElement>('[data-empty-note]');

  const select = (value: string) => {
    const isAll = value === ALL;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset[tabAttr] === value)));
    /* 空分类在构建期带上 data-empty：选中空分类时藏起板块、只显示占位文案 */
    const empty =
      !isAll && sections.some((s) => s.dataset[sectionAttr] === value && s.dataset.empty === 'true');
    if (allView) allView.hidden = !isAll;

    let visibleIndex = 0;
    sections.forEach((s) => {
      const show = isAll ? !flatAll : s.dataset[sectionAttr] === value && !empty;
      s.hidden = !show;
      if (!show) return;
      /* 可见分区动态重排编号（项目页），并用全站同款缓动重放淡入；
         博客板块没有 .sec-no、CSS 也没有 .section-enter 规则，这两步自动无副作用 */
      visibleIndex += 1;
      const no = s.querySelector<HTMLElement>('.sec-no');
      if (no) no.textContent = String(visibleIndex).padStart(2, '0');
      s.classList.remove('section-enter');
      void s.offsetWidth;
      s.style.animationDelay = `${(visibleIndex - 1) * 60}ms`;
      s.classList.add('section-enter');
    });

    if (emptyNote) emptyNote.hidden = !empty;
    if (allNote) allNote.hidden = !isAll;
    /* 写入用原中文（浏览器自行编码），读取时再解码 */
    history.replaceState(null, '', isAll ? location.pathname : `#${value}`);
  };

  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset[tabAttr] ?? ALL)));

  /* 浏览器会把非 ASCII fragment 百分号编码，比较前先解码，中文 hash 深链才能命中 */
  let hash = location.hash;
  try {
    hash = decodeURIComponent(hash);
  } catch {
    /* 畸形百分号序列保持原值，不影响页面其余交互 */
  }
  const fromHash = tabs.map((t) => t.dataset[tabAttr]).find((v) => v && hash === `#${v}`);
  if (fromHash) select(fromHash);
}

let listening = false;

export function initTabs(_options: TabsOptions): void {
  /* 兼容两页调用签名（各传一份配置）；配置实际由回调按 DOM 判定，这里只需保证只注册一次 */
  if (listening) return;
  listening = true;
  document.addEventListener('astro:page-load', applyTabs);
}
