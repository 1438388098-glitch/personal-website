/** 内容列表统一的日期降序比较器：同日期保持原数组顺序（Array.sort 稳定排序）。 */
export function byDateDesc<T>(getDate: (item: T) => Date) {
  return (a: T, b: T) => getDate(b).valueOf() - getDate(a).valueOf();
}
