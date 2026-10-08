import { describe, expect, it } from 'vitest';
import { EN_CATEGORY, EN_EXAM_TYPE, EN_GROUP, EN_STATUS, EN_TAG, STRINGS, langOf, prefix, href } from './i18n';
import { EXAM_TYPES, NOTE_CATEGORIES, NOTE_STATUS, POST_CATEGORIES, PROJECT_GROUPS, TAG_VOCAB, TOOLBOX_CATEGORIES } from './categories';

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
    expect(uniqKeyPaths(STRINGS.en)).toEqual(uniqKeyPaths(STRINGS.zh));
  });

  it('分类受控词表全部有英文对照，映射表无词表外孤儿（EN_CATEGORY 同时服务博客 7 分类与 notes 3 分类）', () => {
    const vocab = [...POST_CATEGORIES, ...NOTE_CATEGORIES];
    for (const c of vocab) expect(EN_CATEGORY[c], `缺对照: ${c}`).toBeTruthy();
    for (const k of Object.keys(EN_CATEGORY)) {
      expect(vocab, `EN_CATEGORY 孤儿键: ${k}`).toContain(k);
    }
  });

  it('标签受控词表全部有英文对照，映射表无词表外孤儿', () => {
    for (const t of TAG_VOCAB) expect(EN_TAG[t], `缺对照: ${t}`).toBeTruthy();
    for (const k of Object.keys(EN_TAG)) {
      expect(TAG_VOCAB, `EN_TAG 孤儿键: ${k}`).toContain(k);
    }
  });

  it('项目分组与工具箱分类全部有英文对照，映射表无词表外孤儿', () => {
    const vocab = [...PROJECT_GROUPS, ...TOOLBOX_CATEGORIES];
    for (const g of vocab) expect(EN_GROUP[g], `缺对照: ${g}`).toBeTruthy();
    for (const k of Object.keys(EN_GROUP)) {
      expect(vocab, `EN_GROUP 孤儿键: ${k}`).toContain(k);
    }
  });

  it('exam 类型与 notes 分类/状态全部有英文对照，映射表无词表外孤儿', () => {
    for (const t of EXAM_TYPES) expect(EN_EXAM_TYPE[t], `缺对照: ${t}`).toBeTruthy();
    for (const c of NOTE_CATEGORIES) expect(EN_CATEGORY[c], `notes 分类缺对照: ${c}`).toBeTruthy();
    for (const s of NOTE_STATUS) expect(EN_STATUS[s], `缺对照: ${s}`).toBeTruthy();
    for (const k of Object.keys(EN_EXAM_TYPE)) expect(EXAM_TYPES, `EN_EXAM_TYPE 孤儿键: ${k}`).toContain(k);
    for (const k of Object.keys(EN_STATUS)) expect(NOTE_STATUS, `EN_STATUS 孤儿键: ${k}`).toContain(k);
  });

  it('en 导航与 zh 七项一一对应（exam/notes 已出英文版），且链接带 /en 前缀', () => {
    const zhHrefs = STRINGS.zh.navItems.map((n) => n.href);
    for (const item of STRINGS.en.navItems) {
      expect(zhHrefs).toContain(item.href.replace('/en', '').replace(/^$/, '/'));
      expect(item.href.startsWith('/en/')).toBe(true);
    }
    /* en 不再是子集：exam/notes 英文版上线后导航全量对齐 */
    expect(STRINGS.en.navItems.length).toBe(STRINGS.zh.navItems.length);
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
