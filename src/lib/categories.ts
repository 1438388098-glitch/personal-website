/* 博客文章分类唯一清单：schema 枚举与博客页 tabs 同源，新增分类只改这里 */
export const POST_CATEGORIES = [
  '法学随笔',
  '技术笔记',
  '工程方法论',
  '游戏手记',
  '杂谈',
  '经济观察',
  '热点快评'
] as const;

/* 博客标签受控词表：同义词在此归并（如 幻觉并入AI幻觉），新词先入表再使用，防标签云碎片化。
   51 → 22 归并后的最终词表；下位词（AI治理/合规/著作权/基准 等）已并入下表的上位词。 */
export const TAG_VOCAB = [
  'AIGC',
  'Agent',
  'RSI',
  'AI幻觉',
  'AI监管',
  '判例',
  '安全',
  '大模型',
  '工程方法',
  '开源',
  '强化学习',
  '检索',
  '评测',
  '游戏',
  '自动化',
  '法考',
  '法律AI',
  '司法',
  '欧盟AI法',
  '比较法',
  '求职',
  '踩坑记',
  '数学',
  /* 经济观察线（10-06 远端线引入）新造的两个领域词：与既有词非同类，不属归并对象 */
  '量化',
  '数据工程',
] as const;

/** exam 板块 type 枚举（content.config 与 i18n 守卫共用单源） */
export const EXAM_TYPES = ['方法论', '错题笔记', '周记'];

/** notes 板块 category/status 枚举 */
export const NOTE_CATEGORIES = ['课程论文', '文献研读', '读书笔记'];
export const NOTE_STATUS = ['已完成', '写作中', '在读'];

/** projects 分组与 toolbox 分类的受控值（EN_GROUP 映射表的两条来源） */
export const PROJECT_GROUPS = ['法律主线', '法律工具', '量化研究', '工程侧证', '实验'];
export const TOOLBOX_CATEGORIES = ['法律工具', '工程小件'];
