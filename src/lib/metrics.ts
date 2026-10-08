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

/** en 法考页的对照表：key 与 zh 一一对应，值是英文文案（数字口径相同）。 */
export const HOME_METRICS_EN: Metric[] = [
  { source: 'fakao-tracker', figures: { planStages: '4+ stage plan', dailySlots: '4 task blocks a day' } },
  { source: 'cn-judbench', figures: { packs: '12 benchmark packs', questions: '323 public questions' } },
  { source: 'statute-rag', figures: { questions: '100 blind holdout questions', hitRate: '92.0%' } }
];


/** 按 source+key 取结构化数字。缺数据在构建期抛错，不静默降级（避免页面输出 undefined）。 */
export function figure(source: string, key: string): string {
  const v = HOME_METRICS.find((x) => x.source === source && x.figures[key])?.figures[key];
  if (!v) throw new Error(`metrics: 缺少 ${source} 的结构化数字 ${key}`);
  return v;
}

/** en 法考页取数：表结构与 key 同 zh，只换文案语言。 */
export function figureEn(source: string, key: string): string {
  const v = HOME_METRICS_EN.find((x) => x.source === source && x.figures[key])?.figures[key];
  if (!v) throw new Error(`metrics: missing structured figure ${key} for ${source} (en)`);
  return v;
}
