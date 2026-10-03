import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { HOME_METRICS, figure } from './metrics';
import { EXAM_AGG } from './exam-progress';
import { byDateDesc } from './sort';

const projectFile = (source: string) =>
  new URL(`../content/projects/${source}.md`, import.meta.url);

describe('HOME_METRICS', () => {
  it('每条指标都可溯源且不含 em-dash', () => {
    expect(HOME_METRICS.length).toBeGreaterThanOrEqual(3);
    for (const m of HOME_METRICS) {
      expect(m.source.length).toBeGreaterThan(0);
      expect(m.value).not.toMatch(/[—–]/);
      expect(m.detail).not.toMatch(/[—–]/);
    }
  });
  it('数字条每个 value 都能在对应案例页内容中溯源', () => {
    for (const m of HOME_METRICS) {
      const raw = readFileSync(projectFile(m.source), 'utf8');
      expect(raw).toContain(m.value);
      // detail 允许与案例页措辞不同，只断言含数字或斜杠等实质内容
      expect(/[0-9/]/.test(m.detail)).toBe(true);
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
    expect(figure('statute-rag', 'hitRate')).toBe('64.2%');
    expect(figure('cn-judbench', 'packs')).toBe('12 个评测包');
  });
  it('同 source 多条时取带该 key 的那条（法条语料在前但无 figures，不得误中）', () => {
    expect(figure('statute-rag', 'questions')).toBe('95 道留出盲写题');
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
