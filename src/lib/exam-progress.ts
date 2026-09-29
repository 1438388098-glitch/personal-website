export interface ExamAgg {
  subjects: number;
  units: number;
  wrongQuestions: number;
  minutesPerRound: number;
}

/** 法考错题规模：全部取自 zhuma-fakao-review README「一次完整运行的实测规模」表。 */
export const EXAM_AGG: ExamAgg = {
  subjects: 18, // 科目数：客观题一 9 + 客观题二 9
  units: 41, // 处理单元：每单元 ≤ 55 题
  wrongQuestions: 1655, // 唯一错题数：章节预期合计 1661，差值为跨章节重复题，按 id 去重
  minutesPerRound: 9 // 抓取耗时：约 9 分钟抓完全部错题
};
