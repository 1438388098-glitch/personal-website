/**
 * 内容列表统一的日期降序比较器：同日期再按 id 升序，排序键合计为全序。
 *
 * getCollection 对同日期条目的迭代顺序并不稳定（同一提交多次构建可得到不同顺序），
 * 只按日期降序时并列项会退回该顺序，令列表与相邻文章的「较新 / 较旧」在构建间漂移。
 * 补一个确定性的次级键后排序结果唯一；id（slug）升序也与 Astro 7 内容层按名排序的
 * 顺序一致，升级后不产生多余的顺序差异。
 */
export function byDateDesc<T>(getDate: (item: T) => Date, getId: (item: T) => string) {
  const byId = (a: T, b: T) => (getId(a) < getId(b) ? -1 : getId(a) > getId(b) ? 1 : 0);
  return (a: T, b: T) => getDate(b).valueOf() - getDate(a).valueOf() || byId(a, b);
}
