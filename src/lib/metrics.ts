export interface Metric {
  source: string;
  /** 页面拼装用的结构化数字：页面禁止从其他文案里切割数字 */
  figures: Record<string, string>;
}

/** 站内数字来源（法考页引用）：每个数字必须能在对应项目案例页溯源。 */
export const HOME_METRICS: Metric[] = [
  { source: 'fakao-tracker', figures: { planStages: '4+ 阶段课表', dailySlots: '每天 4 段任务' } },
  { source: 'cn-judbench', figures: { packs: '12 个评测包', questions: '323 道公开题' } },
  { source: 'statute-rag', figures: { questions: '100 道留出盲写题', hitRate: '92.0%' } }
];


/** 按 source+key 取结构化数字。缺数据在构建期抛错，不静默降级（避免页面输出 undefined）。 */
export function figure(source: string, key: string): string {
  const v = HOME_METRICS.find((x) => x.source === source && x.figures[key])?.figures[key];
  if (!v) throw new Error(`metrics: 缺少 ${source} 的结构化数字 ${key}`);
  return v;
}
