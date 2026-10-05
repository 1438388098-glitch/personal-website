import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { HOME_METRICS, figure } from './metrics';
import { EXAM_AGG } from './exam-progress';
import { byDateDesc } from './sort';

const projectFile = (source: string) =>
  new URL(`../content/projects/${source}.md`, import.meta.url);

describe('HOME_METRICS', () => {
  it('每条都有 source 与非空 figures，且值不含 em-dash', () => {
    expect(HOME_METRICS.length).toBeGreaterThanOrEqual(2);
    for (const m of HOME_METRICS) {
      expect(m.source.length).toBeGreaterThan(0);
      const values = Object.values(m.figures);
      expect(values.length).toBeGreaterThan(0);
      for (const v of values) expect(v).not.toMatch(/[—–]/);
    }
  });
  it('每个 figures 数字的数字核心都能在对应案例页内容中溯源', () => {
    for (const m of HOME_METRICS) {
      const raw = readFileSync(projectFile(m.source), 'utf8');
      for (const v of Object.values(m.figures)) {
        /* 页面散文允许措辞不同，只断言其中的数字核心（含 % 与千分位）出现 */
        const core = v.match(/[0-9][0-9.,]*%?/)?.[0] ?? '';
        expect(core, `${m.source} 的 ${v} 无可比对数字`).not.toBe('');
        expect(raw, `${m.source} 缺 ${core}`).toContain(core);
      }
    }
  });
});

const zhuma = readFileSync(projectFile('zhuma-fakao-review'), 'utf8');

describe('EXAM_AGG', () => {
  it('数字类型与量级合理', () => {
    expect(EXAM_AGG.subjects).toBe(18);
    expect(EXAM_AGG.units).toBeGreaterThan(EXAM_AGG.subjects);
    expect(EXAM_AGG.wrongQuestions).toBeGreaterThan(1000);
    expect(EXAM_AGG.pdfBooklets).toBeGreaterThan(0);
    expect(EXAM_AGG.minutesPerRound).toBeLessThan(60);
  });
  it('每个数字都能在 zhuma-fakao-review 案例页溯源', () => {
    for (const v of [EXAM_AGG.subjects, EXAM_AGG.units, EXAM_AGG.wrongQuestions, EXAM_AGG.pdfBooklets, EXAM_AGG.minutesPerRound]) {
      /* 页面散文统一千位逗号口径（14,212 / 1,655 同规） */
      expect(zhuma).toContain(v.toLocaleString('en-US'));
    }
  });
});

describe('figure 结构化取数', () => {
  it('命中返回值', () => {
    expect(figure('statute-rag', 'hitRate')).toBe('92.0%');
    expect(figure('cn-judbench', 'packs')).toBe('12 个评测包');
  });
  it('按 source+key 精确取数（同 source 不同 key 不串味）', () => {
    expect(figure('statute-rag', 'questions')).toBe('100 道留出盲写题');
  });
  it('缺失抛错而非静默降级', () => {
    expect(() => figure('statute-rag', 'nope')).toThrow();
    expect(() => figure('no-such-source', 'x')).toThrow();
  });
});

describe('byDateDesc', () => {
  const d = (iso: string) => new Date(iso);
  it('按日期降序排列', () => {
    const items = [{ t: d('2026-09-01') }, { t: d('2026-10-01') }, { t: d('2026-09-15') }];
    expect([...items].sort(byDateDesc((x) => x.t)).map((x) => x.t.getUTCMonth())).toEqual([9, 8, 8]);
  });
  it('同日期保持稳定（不交换原有顺序）', () => {
    const a = { id: 'a', t: d('2026-09-01') };
    const b = { id: 'b', t: d('2026-09-01') };
    const c = { id: 'c', t: d('2026-08-01') };
    expect([{ ...a }, { ...b }, { ...c }].sort(byDateDesc((x) => x.t)).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });
});
