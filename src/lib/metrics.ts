export interface Metric {
  label: string;
  value: string;
  detail: string;
  source: string;
  /** 页面拼装用的结构化数字：detail 是给人读的文案，页面禁止从文案里切割数字 */
  figures?: Record<string, string>;
}

/** 站内数字来源（法考页引用）：每个数字必须能在对应项目案例页溯源。
    detail 写人话，不写指标行话（pt/MRR 这类词只在案例页与博文里出现）。 */
export const HOME_METRICS: Metric[] = [
  { label: '法条语料', value: '14,212', detail: '条，条/款/项结构化入库', source: 'statute-rag' },
  { label: '评测金标', value: '323', detail: '题，12 个评测包，机检判分', source: 'cn-judbench',
    figures: { packs: '12 个评测包', questions: '323 道公开题' } },
  { label: '检索 Recall@5', value: '98.9%', detail: '177 道模拟题实测，前五条结果几乎必含正确条文', source: 'statute-rag',
    figures: { questions: '177 道模拟测试题', hitRate: '98.9%' } }
];


/** 按 source+key 取结构化数字；同 source 多条时取带该 key 的那条。
    缺数据在构建期抛错，不静默降级（避免页面输出 undefined）。 */
export function figure(source: string, key: string): string {
  const v = HOME_METRICS.find((x) => x.source === source && x.figures?.[key])?.figures?.[key];
  if (!v) throw new Error(`metrics: 缺少 ${source} 的结构化数字 ${key}`);
  return v;
}
