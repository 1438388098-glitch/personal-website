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
  { label: '法条语料', value: '25,626', detail: '条，438 部法，以条为检索单元', source: 'statute-rag' },
  { label: '评测金标', value: '323', detail: '题，12 个评测包，机检判分', source: 'cn-judbench',
    figures: { packs: '12 个评测包', questions: '323 道公开题' } },
  { label: '检索 Recall@5', value: '64.2%', detail: '第二轮隔离题库 95 道可测实测（出题方与系统完全隔离、从未参与调参）', source: 'statute-rag',
    figures: { questions: '95 道留出盲写题', hitRate: '64.2%' } }
];


/** 按 source+key 取结构化数字；同 source 多条时取带该 key 的那条。
    缺数据在构建期抛错，不静默降级（避免页面输出 undefined）。 */
export function figure(source: string, key: string): string {
  const v = HOME_METRICS.find((x) => x.source === source && x.figures?.[key])?.figures?.[key];
  if (!v) throw new Error(`metrics: 缺少 ${source} 的结构化数字 ${key}`);
  return v;
}
