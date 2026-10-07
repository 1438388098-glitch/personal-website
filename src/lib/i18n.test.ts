import { describe, expect, it } from 'vitest';
import { EN_CATEGORY, EN_GROUP, EN_TAG, STRINGS, langOf, prefix, href } from './i18n';
import { POST_CATEGORIES, TAG_VOCAB } from './categories';

/** 深走键位：zh 与 en 的对象树必须逐键对齐（en 多键少键都算漂移） */
function keyPaths(obj: unknown, path = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [path];
  if (Array.isArray(obj)) {
    /* 数组统一记 [*]：元素个数本就有意不同（zh 首页两张探索卡、en 一张；导航七项对五项），
       平齐只约束「形状」不约束「个数」；空数组记 [] */
    return obj.length === 0 ? [`${path}[]`] : obj.flatMap((v) => keyPaths(v, `${path}[*]`));
  }
  return Object.keys(obj as Record<string, unknown>)
    .sort()
    .flatMap((k) => keyPaths((obj as Record<string, unknown>)[k], path ? `${path}.${k}` : k));
}

/** 去重后的键位集合视图：数组多元素会产生同路径重复（两张探索卡 → 同键 ×2），
    平齐约束的是「形状」不是「个数」，比较前先收敛成集合。 */
function uniqKeyPaths(obj: unknown): string[] {
  return [...new Set(keyPaths(obj))];
}

describe('i18n 字典', () => {
  it('zh 与 en 键位完全平齐', () => {
    /* home.band 豁免：zh 首页的法考通栏在 en 是 null（法考栏目不译），类型允许单侧可空 */
    const strip = (paths: string[]) => paths.filter((p) => !p.startsWith('home.band'));
    expect(strip(uniqKeyPaths(STRINGS.en))).toEqual(strip(uniqKeyPaths(STRINGS.zh)));
  });

  it('分类受控词表全部有英文对照', () => {
    for (const c of POST_CATEGORIES) expect(EN_CATEGORY[c], `缺对照: ${c}`).toBeTruthy();
  });

  it('标签受控词表全部有英文对照', () => {
    for (const t of TAG_VOCAB) expect(EN_TAG[t], `缺对照: ${t}`).toBeTruthy();
  });

  it('项目分组与工具箱分类全部有英文对照', () => {
    for (const g of ['法律主线', '法律工具', '量化研究', '工程侧证', '实验', '工程小件']) {
      expect(EN_GROUP[g], `缺对照: ${g}`).toBeTruthy();
    }
  });

  it('en 导航是不含法考/笔记的子集，且链接带 /en 前缀', () => {
    const zhHrefs = STRINGS.zh.navItems.map((n) => n.href);
    for (const item of STRINGS.en.navItems) {
      expect(zhHrefs).toContain(item.href.replace('/en', '').replace(/^$/, '/'));
      expect(item.href.startsWith('/en/')).toBe(true);
    }
    expect(STRINGS.en.navItems.some((n) => n.href.includes('exam'))).toBe(false);
    expect(STRINGS.en.navItems.some((n) => n.href.includes('notes'))).toBe(false);
  });

  it('langOf/prefix/href', () => {
    expect(langOf('/')).toBe('zh');
    expect(langOf('/blog/x/')).toBe('zh');
    expect(langOf('/en/')).toBe('en');
    expect(langOf('/en/blog/x/')).toBe('en');
    expect(prefix('zh')).toBe('');
    expect(prefix('en')).toBe('/en');
    expect(href('en', '/blog/x/')).toBe('/en/blog/x/');
    expect(href('zh', '/blog/x/')).toBe('/blog/x/');
  });
});
