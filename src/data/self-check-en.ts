/**
 * 主观题采分点自查清单 —— 英文数据集（/en/exam/checklist/ 专用）。
 *
 * 与 src/data/self-check.ts 的 SELF_CHECK 严格同构：科目（7）→ 组（17）→ 条目（54）
 * 三层一一对应、顺序一致；所有 id 与中文数据集一字不改 —— id 同时是 localStorage 键
 * （'fakao-self-check:v1'），中英两个页面共享同一份勾选状态，改动 id 即丢失用户勾选。
 * name/title/text/hint 为英文译文：text 用平实的祈使句，每条一句话；hint 解释判分逻辑。
 * 三类采分点（conclusion / authority / analysis）与 ✓ 满分 · △ 半分 · ✗ 定性错误不倒扣
 * 的口径复用 fakao-grader 的判分设计；内容为人工整理的备考方法论，
 * 不含真题原文，不含任何题库平台的评分数据。
 */
import type { SelfCheckSubject } from './self-check';

export const SELF_CHECK_EN: SelfCheckSubject[] = [
  {
    id: 'general',
    name: 'General Answer Conventions',
    note: 'Subject-agnostic: run this layer once after finishing each paper, before you hand it to the AI grader',
    groups: [
      {
        id: 'general-flow',
        title: 'Flow and Paper Management',
        items: [
          {
            id: 'g-flow-questions',
            text: 'Mark the number of questions on your scratch sheet before writing, and tick each one off as you finish it',
            hint: 'Answering off-topic neither earns nor loses points, but a missed question zeroes out that entire question'
          },
          {
            id: 'g-flow-time',
            text: 'Allocate time and length by point value, roughly two to three lines per point',
            hint: 'Real grading first assigns a band, then awards points within it: full coverage of scoring points beats polishing any single one'
          },
          {
            id: 'g-flow-selective',
            text: 'Commercial and administrative law is an either-or choice — answer one only',
            hint: 'You are scored on the subject marked on your answer sheet; when both are answered, usually only the first counts — do not gamble'
          },
          {
            id: 'g-flow-final',
            text: 'Save five minutes before submitting: check every question has a conclusion sentence and none was skipped'
          }
        ]
      },
      {
        id: 'general-three',
        title: 'Run the Three Point Types per Question',
        items: [
          {
            id: 'g-three-conclusion',
            text: 'Open every answer with a definite conclusion (established or not; which crime or liability applies or not)',
            hint: 'Conclusion points are scored independently; without a conclusion, the authority and the analysis hang in mid-air'
          },
          {
            id: 'g-three-single',
            text: 'Commit to a single characterization — no fence-sitting',
            hint: 'If your stated characterization is wrong, every later scoring point in that question that depends on it falls in a chain'
          },
          {
            id: 'g-three-basis',
            text: 'Back each conclusion with authority: the key content of the rule or of the elements',
            hint: 'Stating the key content of the provision earns the point; article numbers are not required — if you cannot recall the number, write the rule\'s content and never fabricate one'
          },
          {
            id: 'g-three-analysis',
            text: 'After stating the authority, subsume the case facts: match each fact to each element',
            hint: 'Analysis points are scored separately; a bare conclusion with no development earns half credit'
          },
          {
            id: 'g-three-equivalent',
            text: 'When stuck, state the meaning in plain words instead of leaving it blank',
            hint: 'Grading accepts semantic equivalence: formal legal phrasing or plain language both count'
          },
          {
            id: 'g-three-concession',
            text: 'Keep your own characterization out of concessive hypotheticals ("even if ..., it would not constitute ...")',
            hint: 'Hypothetical phrasing does not trigger chain-loss, but it reads as a risk on the paper — rewrite as direct statements where possible'
          }
        ]
      }
    ]
  },
  {
    id: 'criminal',
    name: 'Criminal Law',
    note: 'Case analysis: characterization plus element-by-element subsumption; property and personal crimes take turns as the centerpiece',
    groups: [
      {
        id: 'criminal-property',
        title: 'Property Crimes',
        items: [
          { id: 'c-prop-intent', text: 'State the purpose of unlawful possession explicitly', hint: 'A high-frequency independent scoring point; any equivalent of "intending to keep it for oneself" suffices' },
          { id: 'c-prop-peace', text: 'Characterize how the property was taken: peaceful acquisition or violence and coercion', hint: 'This is the line between theft and robbery; point it out even in a single sentence' },
          { id: 'c-prop-possession', text: 'Settle possession and its transfer: who held it and when it passed', hint: 'The line between embezzlement and theft sits exactly here' },
          { id: 'c-prop-amount', text: 'Address the amount or circumstance thresholds (relatively large amount, repeated offenses, entering a residence, carrying a weapon, pickpocketing)', hint: 'The review path for "relatively large amount" is a common follow-up question' },
          { id: 'c-prop-distinguish', text: 'Rule out the neighboring offense in one sentence (fraud vs. theft, embezzlement vs. occupational embezzlement)' }
        ]
      },
      {
        id: 'criminal-person',
        title: 'Personal Crimes and Complicity',
        items: [
          { id: 'c-per-intent', text: 'State the basis on which intent or negligence is found' },
          { id: 'c-per-causation', text: 'Address causation: write out the steps for judging whether an intervening factor breaks attribution', hint: 'A high-frequency analysis-point question' },
          { id: 'c-per-aggravated', text: 'For aggravated results, spell out "fault as to the aggravated result plus an express statutory basis"' },
          { id: 'c-per-accomplice', text: 'Name each accomplice\'s mode of participation (principal, aider, or instigator) and state how liability derives from the principal' }
        ]
      },
      {
        id: 'criminal-general',
        title: 'Stages and Number of Offenses',
        items: [
          { id: 'c-gen-attempt', text: 'Apply the standards for each stage of the crime (preparation, attempt, discontinuation, completion) to the facts' },
          { id: 'c-gen-number', text: 'Settle the number of offenses in one sentence (imaginative joinder, statutory concurrence, or concurrent punishment for several offenses)' },
          { id: 'c-gen-surrender', text: 'Write voluntary surrender in full as "voluntary surrender plus truthful confession"; address confession and meritorious service by their own elements without conflating them' }
        ]
      }
    ]
  },
  {
    id: 'criminal-procedure',
    name: 'Criminal Procedure',
    note: 'Case analysis plus legal documents: procedure points are fine-grained, and the two layers of a concept must never be blended',
    groups: [
      {
        id: 'proc-evidence',
        title: 'Evidence',
        items: [
          { id: 'p-ev-capacity', text: 'Evaluate evidentiary capacity and probative value separately', hint: 'Blend the two layers into one sentence and a two-point award collapses into one' },
          { id: 'p-ev-exclusion', text: 'Cover exclusion of illegal evidence in full: who may raise it, the procedure, and the burden of proof' },
          { id: 'p-ev-indirect', text: 'For a verdict resting on indirect evidence, state the rule: a complete chain and a unique conclusion' }
        ]
      },
      {
        id: 'proc-procedure',
        title: 'Procedure',
        items: [
          { id: 'p-pro-defect', text: 'Classify the consequences of procedural defects such as jurisdiction or recusal (cure, remand for retrial, invalidity)' },
          { id: 'p-pro-remedy', text: 'State the full remedy path (appeal, protest, retrial petition) and aim each remedy at the right target' },
          { id: 'p-pro-coercive', text: 'Check compulsory measures and investigative acts against their application conditions item by item' }
        ]
      },
      {
        id: 'proc-document',
        title: 'Legal Documents',
        items: [
          { id: 'p-doc-format', text: 'Include every document element: heading, facts, reasons, conclusion, and closing' },
          { id: 'p-doc-evidence', text: 'Match every piece of evidence cited in the document to its number in the evidence list' }
        ]
      }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Law and Civil Procedure (Combined)',
    note: 'One mega-question chains substantive law to procedure; questions depend on one another, so keep every characterization stable',
    groups: [
      {
        id: 'civil-contract',
        title: 'Contracts and Security',
        items: [
          { id: 'm-con-validity', text: 'Walk contract validity in three steps: formation, then validity, then performance', hint: 'When judging validity, name the specific ground (invalidating mandatory provisions, malicious collusion, and so on)' },
          { id: 'm-con-breach', text: 'Keep liability for breach and the right to terminate apart: elements of liability versus conditions for exercise' },
          { id: 'm-guar-order', text: 'Spell out the enforcement order when securities compete (personal and property security coexisting, and so on)' }
        ]
      },
      {
        id: 'civil-tort',
        title: 'Torts',
        items: [
          { id: 'm-tort-basis', text: 'Name the liability principle first (fault, presumed fault, or no-fault), then subsume the facts' },
          { id: 'm-tort-defense', text: 'Check each ground for reduced or excluded liability against the facts (the victim\'s intent, third-party causes, and so on)' }
        ]
      },
      {
        id: 'civil-procedure',
        title: 'Civil Procedure',
        items: [
          { id: 'm-cv-parties', text: 'Give reasons for proper-party status and for identifying joint litigants and third parties' },
          { id: 'm-cv-burden', text: 'State the burden of proof as "who must prove which facts"' },
          { id: 'm-cv-exec', text: 'For procedural questions such as objections to enforcement, check the filing conditions item by item' }
        ]
      }
    ]
  },
  {
    id: 'administrative',
    name: 'Administrative Law and Administrative Litigation',
    note: 'Elective option one: the four-step legality review is a fixed skeleton',
    groups: [
      {
        id: 'admin-scope',
        title: 'Scope of Cases and Parties',
        items: [
          { id: 'a-scope-first', text: 'Decide first whether the matter falls within the scope of acceptable cases: internal acts and preparatory acts are generally not actionable; factual acts usually are' },
          { id: 'a-defendant', text: 'Name the correct defendant; for cases that went through reconsideration, note when the reconsideration organ joins as a co-defendant' },
          { id: 'a-rexian', text: 'State whether reconsideration must precede litigation or the party may choose freely, and give the basis' }
        ]
      },
      {
        id: 'admin-review',
        title: 'Legality Review',
        items: [
          { id: 'a-review-four', text: 'Run the four steps in order: authority, then fact-finding, then application of law, then procedure', hint: 'Skip one step and you skip a whole block of scoring points' },
          { id: 'a-review-evidence', text: 'Point out the defendant\'s burden of proof and the evidentiary requirements' }
        ]
      },
      {
        id: 'admin-judgment',
        title: 'Judgment Types',
        items: [
          { id: 'a-judgment-type', text: 'Match the judgment type to the case (revocation, declaration of illegality, order to perform, payment, modification, declaration of nullity) and state its conditions of application' }
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Law (Elective)',
    note: 'Elective option two: mainly company law plus bankruptcy law; you choose between this and administrative law',
    groups: [
      {
        id: 'commercial-company',
        title: 'Company Law',
        items: [
          { id: 'b-eq-defect', text: 'For defective capital contributions, cover the full chain: the duty to make up the shortfall plus the liability of founders and directors' },
          { id: 'b-piercing', text: 'For piercing the corporate veil, include both elements: abusive conduct plus serious harm to creditors' },
          { id: 'b-resolution', text: 'Sort the corporate resolution into the right defect class (void, voidable, or not duly formed)' }
        ]
      },
      {
        id: 'commercial-bankruptcy',
        title: 'Bankruptcy Law',
        items: [
          { id: 'b-br-cause', text: 'State the bankruptcy cause precisely: inability to pay debts as they fall due plus insolvency or an apparent lack of solvency' },
          { id: 'b-br-rights', text: 'Point out the elements and the exercise deadlines of the right of separation, the avoidance right, and the set-off right' },
          { id: 'b-br-order', text: 'Write the payment order in full, in rank: bankruptcy expenses and common-benefit debts, then employee claims, then social insurance and taxes, then ordinary claims', hint: 'A secured creditor exercises the right of separation and takes priority out of the specific asset — that step never enters this ranking' }
        ]
      }
    ]
  },
  {
    id: 'theory',
    name: 'Legal Theory (Essay Question)',
    note: 'Question one: an essay written from given material — secure structure and length first',
    groups: [
      {
        id: 'theory-essay',
        title: 'Essay Question',
        items: [
          { id: 't-structure', text: 'Keep all three parts: what it is, why, and what to do' },
          { id: 't-material', text: 'Tie every argument back to the given material; no free-floating talk' },
          { id: 't-authority', text: 'Quote authoritative formulations only where you are confident; never force an uncertain quote' },
          { id: 't-length', text: 'Meet the required word count and keep the paragraphs clearly separated' }
        ]
      }
    ]
  }
];
