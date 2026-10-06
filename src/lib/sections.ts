export interface Section<T> {
  name: string;
  en?: string;
  /** 展示层派生的序号（01 递增，只数非空分组），不是数据 */
  no: string;
  items: T[];
}

/** 分组定义：给字符串（只要中文名）或对象（带英文对照）都行 */
export type GroupDef = string | { name: string; en?: string };

/** 按分组清单分派条目、丢掉空组、再按页面顺序重编号（01 递增）。
    项目 / 笔记 / 工具箱三个列表页共用，避免同一段过滤+重编号逻辑各写一份而漂移。 */
export function buildSections<T>(
  items: T[],
  groups: readonly GroupDef[],
  keyOf: (item: T) => string
): Section<T>[] {
  return groups
    .map((g) => (typeof g === 'string' ? { name: g } : { ...g }))
    .map((g) => ({ ...g, items: items.filter((t) => keyOf(t) === g.name) }))
    .filter((s) => s.items.length > 0)
    .map((s, i) => ({ ...s, no: String(i + 1).padStart(2, '0') }));
}
