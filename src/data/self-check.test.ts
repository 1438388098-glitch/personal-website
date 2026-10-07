import { describe, expect, it } from 'vitest';
import { SELF_CHECK, SELF_CHECK_AGG } from './self-check';

/** 内容金样：改内容必须有意为之——科目数、条目数与两个案例页/卡片引用的口径锁在一起。 */
describe('self-check 数据完整性', () => {
  it('聚合数与数据实际一致', () => {
    const groups = SELF_CHECK.reduce((n, s) => n + s.groups.length, 0);
    const items = SELF_CHECK.reduce(
      (n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0),
      0
    );
    expect(SELF_CHECK_AGG.subjects).toBe(SELF_CHECK.length);
    expect(SELF_CHECK_AGG.groups).toBe(groups);
    expect(SELF_CHECK_AGG.items).toBe(items);
  });

  it('规模金样：7 科目 17 组 54 条（案例页 metrics 与此锁同）', () => {
    expect(SELF_CHECK_AGG).toEqual({ subjects: 7, groups: 17, items: 54 });
  });

  it('id 全局唯一（localStorage 键冲突即互相覆盖）', () => {
    const ids = SELF_CHECK.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.id)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每条 text 非空、无前后空白；科目与组标识齐全', () => {
    for (const s of SELF_CHECK) {
      expect(s.id.trim()).toBe(s.id);
      expect(s.groups.length).toBeGreaterThan(0);
      for (const g of s.groups) {
        expect(g.items.length).toBeGreaterThan(0);
        for (const i of g.items) {
          expect(i.text.trim().length).toBeGreaterThan(0);
          expect(i.text).toBe(i.text.trim());
        }
      }
    }
  });

  it('不引入具体条文号（自查项只负责提示「要引依据」，条号由作答者现场写）', () => {
    const all = SELF_CHECK.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.text + (i.hint ?? ''))));
    for (const t of all) {
      expect(t).not.toMatch(/第\s*\d+\s*条/);
    }
  });
});
