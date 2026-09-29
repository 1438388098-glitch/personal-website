export interface Metric {
  label: string;
  value: string;
  detail: string;
  source: string;
}

/** 首页数字条：每个数字必须能在对应项目案例页溯源。更新数字时同步更新 METRICS_AS_OF。 */
export const HOME_METRICS: Metric[] = [
  { label: '法条语料', value: '14,212', detail: '条，条/款/项结构化入库', source: 'statute-rag' },
  { label: '评测金标', value: '323', detail: '题，12 个评测包，机检判分', source: 'cn-judbench' },
  { label: '检索 Recall@5', value: '98.9%', detail: '混合检索，合成金标 177 题，较 LIKE 基线（模拟 FTS5）+21.5pt', source: 'statute-rag' }
];

export const METRICS_AS_OF = '2026-09';
