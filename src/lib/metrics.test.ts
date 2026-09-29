import { describe, it, expect } from 'vitest';
import { HOME_METRICS, METRICS_AS_OF } from './metrics';

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
});
