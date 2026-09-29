export interface Metric {
  label: string;
  value: string;
  detail: string;
  source: string;
}

/** 站内数字来源（法考页引用）：每个数字必须能在对应项目案例页溯源。
    detail 写人话，不写指标行话（pt/MRR 这类词只在案例页与博文里出现）。 */
export const HOME_METRICS: Metric[] = [
  { label: '法条语料', value: '14,212', detail: '条，条/款/项结构化入库', source: 'statute-rag' },
  { label: '评测金标', value: '323', detail: '题，12 个评测包，机检判分', source: 'cn-judbench' },
  { label: '检索 Recall@5', value: '98.9%', detail: '177 道模拟题实测，前五条结果几乎必含正确条文', source: 'statute-rag' }
];

export const METRICS_AS_OF = '2026-09';
