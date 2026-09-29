import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { HOME_METRICS, METRICS_AS_OF } from './metrics';

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
  it('数据截至日期为 YYYY-MM 格式', () => {
    expect(METRICS_AS_OF).toMatch(/^\d{4}-\d{2}$/);
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
