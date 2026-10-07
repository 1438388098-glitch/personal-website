/**
 * 主观题采分点自查清单 —— 数据单源。
 *
 * 结构复用自 fakao-grader 的按点判分规则（SKILL.md/DESIGN.md）：
 * 采分点分「结论 / 依据 / 分析」三类，✓ 意思等价、△ 只写结论、✗ 定性错误触发连锁失分；
 * 白名单（等义表述）与黑名单（矛盾定性）的语义折进各条 hint。
 * 内容为人工整理的备考方法论，不含真题原文，不含任何题库平台的评分数据。
 */

export interface SelfCheckItem {
  /** 稳定唯一 id，同时是 localStorage 的键，改动即丢失用户勾选 */
  id: string;
  /** 自查项本身（祈使句） */
  text: string;
  /** 为什么 / 判分规则怎么说（可选） */
  hint?: string;
}

export interface SelfCheckGroup {
  id: string;
  title: string;
  items: SelfCheckItem[];
}

export interface SelfCheckSubject {
  id: string;
  name: string;
  /** 一句话说明该科目考什么形态 */
  note?: string;
  groups: SelfCheckGroup[];
}

export const SELF_CHECK: SelfCheckSubject[] = [
  {
    id: 'general',
    name: '通用答题规范',
    note: '不挑科目：每套题答完、对 AI 判分前，先把这层过一遍',
    groups: [
      {
        id: 'general-flow',
        title: '流程与卷面',
        items: [
          {
            id: 'g-flow-questions',
            text: '动笔前把问题数标在草稿上，答完逐问打勾',
            hint: '答非所问不加分也不扣分，但漏答一问就是整问归零'
          },
          {
            id: 'g-flow-time',
            text: '按分值分配时间与篇幅，大致 1 分 2~3 行',
            hint: '真实阅卷先定档、档内采点：要点覆盖完整比单点雕琢更值钱'
          },
          {
            id: 'g-flow-selective',
            text: '商法 / 行政二选一，只答一道',
            hint: '按答题卡所选科目计分，双答一般只认第一道，别赌'
          },
          {
            id: 'g-flow-final',
            text: '交卷前留 5 分钟：每问有没有结论句、有没有漏问'
          }
        ]
      },
      {
        id: 'general-three',
        title: '逐问过三类点',
        items: [
          {
            id: 'g-three-conclusion',
            text: '每问第一句就给明确结论（成立 / 不成立，构成 / 不构成何罪何责）',
            hint: '结论点独立给分；结论缺失，依据和分析都挂在半空'
          },
          {
            id: 'g-three-single',
            text: '定性结论唯一，不写骑墙句',
            hint: '自己表明的定性错了，该问内依赖它的后续采分点连锁丢分'
          },
          {
            id: 'g-three-basis',
            text: '结论后面跟上依据：规则或构成要件的关键内容',
            hint: '答出条文关键内容即给分，不要求条号；写不出条号就写规则内容，绝不硬编'
          },
          {
            id: 'g-three-analysis',
            text: '依据说完用案情事实涵摄：哪个事实对上哪个要件',
            hint: '分析点单独给分；只写结论不展开按半分计'
          },
          {
            id: 'g-three-equivalent',
            text: '卡住时用人话把意思写清，别空着',
            hint: '判分认「意思等价」：法言法语或白话均可'
          },
          {
            id: 'g-three-concession',
            text: '让步假设句（「即使……也不构成」）里不放自己的定性',
            hint: '假设句式不触发连锁失分，但算卷面风险，尽量改成直接表述'
          }
        ]
      }
    ]
  },
  {
    id: 'criminal',
    name: '刑法',
    note: '案例分析：定性 + 构成要件涵摄，财产与人身犯罪轮流坐庄',
    groups: [
      {
        id: 'criminal-property',
        title: '财产犯罪',
        items: [
          { id: 'c-prop-intent', text: '「非法占有目的」明确写出', hint: '高频独立采分点，写「想据为己有」等义即可' },
          { id: 'c-prop-peace', text: '取财方式定性：和平取得还是暴力胁迫', hint: '盗窃与抢劫的分界，一句话也要点出来' },
          { id: 'c-prop-possession', text: '占有归属与转移：谁在占有、何时转移', hint: '侵占与盗窃的分界就在这' },
          { id: 'c-prop-amount', text: '数额 / 情节门槛交代（数额较大、多次、入户、凶器、扒窃）', hint: '「数额较大」的审查路径是常见追问' },
          { id: 'c-prop-distinguish', text: '此罪彼罪用一句话排除（诈骗 vs 盗窃、侵占 vs 职务侵占）' }
        ]
      },
      {
        id: 'criminal-person',
        title: '人身犯罪与共犯',
        items: [
          { id: 'c-per-intent', text: '故意 / 过失的认定交代了依据' },
          { id: 'c-per-causation', text: '因果关系：介入因素是否打断归责，判断步骤写出来', hint: '分析点高频题' },
          { id: 'c-per-aggravated', text: '结果加重犯点明「对加重结果的过错 + 法有明文」' },
          { id: 'c-per-accomplice', text: '共犯参与形态点名（正犯 / 帮助 / 教唆）并交代从属' }
        ]
      },
      {
        id: 'criminal-general',
        title: '形态与罪数',
        items: [
          { id: 'c-gen-attempt', text: '犯罪形态（预备 / 未遂 / 中止 / 既遂）的判断标准落到案情' },
          { id: 'c-gen-number', text: '罪数一句话交代（想象竞合 / 法条竞合 / 数罪并罚）' },
          { id: 'c-gen-surrender', text: '自首写全「自动投案 + 如实供述」；坦白、立功按各自构成交代，不混用' }
        ]
      }
    ]
  },
  {
    id: 'criminal-procedure',
    name: '刑事诉讼法',
    note: '案例分析 + 法律文书：程序抠点细，两层概念不能混',
    groups: [
      {
        id: 'proc-evidence',
        title: '证据',
        items: [
          { id: 'p-ev-capacity', text: '证据能力与证明力分开评价', hint: '两层混在一句里写，两分变一分' },
          { id: 'p-ev-exclusion', text: '非法证据排除：启动主体、程序、证明责任写全' },
          { id: 'p-ev-indirect', text: '间接证据定案：链条完整、结论唯一，点明规则' }
        ]
      },
      {
        id: 'proc-procedure',
        title: '程序',
        items: [
          { id: 'p-pro-defect', text: '管辖 / 回避等程序瑕疵的后果分类（补正 / 发回重审 / 无效）' },
          { id: 'p-pro-remedy', text: '救济路径写全（上诉 / 抗诉 / 再审申诉），对象选对' },
          { id: 'p-pro-coercive', text: '强制措施与侦查行为逐项对照适用条件' }
        ]
      },
      {
        id: 'proc-document',
        title: '法律文书',
        items: [
          { id: 'p-doc-format', text: '文书要素齐全：首部、事实、理由、结论、尾部' },
          { id: 'p-doc-evidence', text: '文书里引用证据与证据清单编号对应' }
        ]
      }
    ]
  },
  {
    id: 'civil',
    name: '民法 · 民诉综合',
    note: '一道大题串起实体与程序，问与问之间有依赖，定性要稳',
    groups: [
      {
        id: 'civil-contract',
        title: '合同与担保',
        items: [
          { id: 'm-con-validity', text: '合同效力三步走：成立 → 有效 → 履行', hint: '效力判断点出具体事由（效力性强制规定、恶意串通等）' },
          { id: 'm-con-breach', text: '违约责任与解除权：构成要件与行使条件分开写' },
          { id: 'm-guar-order', text: '担保竞合的实现顺序点明（人保物保并存等）' }
        ]
      },
      {
        id: 'civil-tort',
        title: '侵权',
        items: [
          { id: 'm-tort-basis', text: '归责原则点名（过错 / 过错推定 / 无过错）再涵摄' },
          { id: 'm-tort-defense', text: '减免责事由逐项对照（受害人故意、第三人原因等）' }
        ]
      },
      {
        id: 'civil-procedure',
        title: '民诉',
        items: [
          { id: 'm-cv-parties', text: '当事人适格、共同诉讼与第三人识别有说理' },
          { id: 'm-cv-burden', text: '举证责任写明「谁对什么事实举证」' },
          { id: 'm-cv-exec', text: '执行异议之诉等程序题：起诉条件逐项对照' }
        ]
      }
    ]
  },
  {
    id: 'administrative',
    name: '行政法与行政诉讼法',
    note: '选做之一：合法性审查四步是固定骨架',
    groups: [
      {
        id: 'admin-scope',
        title: '受案范围与当事人',
        items: [
          { id: 'a-scope-first', text: '先判断是否属于受案范围：内部行为、过程性行为一般不可诉；事实行为通常可诉' },
          { id: 'a-defendant', text: '被告列对；经复议的案件点明复议机关作共同被告的情形' },
          { id: 'a-rexian', text: '复议前置还是自由选择，写明依据' }
        ]
      },
      {
        id: 'admin-review',
        title: '合法性审查',
        items: [
          { id: 'a-review-four', text: '四步逐项过：职权依据 → 事实认定 → 法律适用 → 程序', hint: '漏一步就是漏一组采分点' },
          { id: 'a-review-evidence', text: '被告的举证责任与证据要求点明' }
        ]
      },
      {
        id: 'admin-judgment',
        title: '判决方式',
        items: [
          { id: 'a-judgment-type', text: '判决方式对号入座（撤销 / 确认违法 / 履行 / 给付 / 变更 / 确认无效），写明适用条件' }
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: '商法（选做）',
    note: '选做之二：公司法 + 破产法为主，与行政二选一',
    groups: [
      {
        id: 'commercial-company',
        title: '公司法',
        items: [
          { id: 'b-eq-defect', text: '出资瑕疵：补足责任 + 发起人 / 董事的责任链条写全' },
          { id: 'b-piercing', text: '法人人格否认：滥用行为 + 严重损害债权人利益，两要件齐全' },
          { id: 'b-resolution', text: '决议瑕疵三分类（无效 / 可撤销 / 不成立）对号入座' }
        ]
      },
      {
        id: 'commercial-bankruptcy',
        title: '破产法',
        items: [
          { id: 'b-br-cause', text: '破产原因表述准确（不能清偿到期债务 + 资不抵债或明显缺乏清偿能力）' },
          { id: 'b-br-rights', text: '别除权 / 撤销权 / 抵销权的构成与行使期限点明' },
          { id: 'b-br-order', text: '清偿顺序按位次写全：破产费用与共益债务 → 职工债权 → 社保与税款 → 普通债权', hint: '担保物权人行使别除权、就特定财产优先受偿，不进这个顺位' }
        ]
      }
    ]
  },
  {
    id: 'theory',
    name: '理论法（论述题）',
    note: '第一题：给材料写作文，结构和篇幅先保住',
    groups: [
      {
        id: 'theory-essay',
        title: '论述题',
        items: [
          { id: 't-structure', text: '是什么 — 为什么 — 怎么办，三段齐全' },
          { id: 't-material', text: '每个论点回扣题干材料，不空谈' },
          { id: 't-authority', text: '引用权威表述挑有把握的写，不确定的不硬引' },
          { id: 't-length', text: '字数达到题干要求，分段清晰' }
        ]
      }
    ]
  }
];

/** 供页面与法考 tab 卡片单源引用的聚合数，由数据本身推导，不手写。 */
export const SELF_CHECK_AGG = {
  subjects: SELF_CHECK.length,
  groups: SELF_CHECK.reduce((n, s) => n + s.groups.length, 0),
  items: SELF_CHECK.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0)
} as const;
