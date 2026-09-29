---
title: JurisCoT：法律论文思维链提示引擎
summary: 面向中文法学论文写作的 CoT 提示库：6 类论文模板各带结构化推理链与逐步提示资产，配 list/show/run 小 CLI 与模板完整性测试；v0.1 只做模板资产管理，推理管线未实现且如实报告。
group: 法律工具
date: 2026-09-28
featured: false
order: 4
metrics:
  - label: 论文模板
    value: '6 类'
    detail: 理论分析、案例分析、制度比较、实证研究、立法建议、文献综述
  - label: CoT 步骤
    value: '4~8 步/类'
    detail: 案例分析 8 步最重，文献综述 4 步最轻，每步配对提示文件
  - label: 诚实边界
    value: 'run 不装'
    detail: v0.1 未接模型管线：无 API key 明确报错退出，有 key 也如实告知功能未实现，不假装调用成功
links:
  - label: GitHub 仓库
    url: https://github.com/1438388098-glitch/JurisCoT
---

## 问题与边界

法学论文的推理结构因文体而异：判决书评析要按裁判逻辑走，立法建议要按问题、方案、理由走。JurisCoT 把六类文体的推理链做成模板资产，输入法律问题加文献、法条、案例、数据、域外法，输出结构化推理链与学术正文段落，设计为 LawAutoPaper 的核心推理组件。边界直说：v0.1 只覆盖模板资产管理（list / show），模型推理管线在 TASKS.md 排期里尚未实现，run 入口对「能不能跑」的两种情况都给诚实退出码，不伪造成功。

## 机制

提示资产分层：base 目录放角色设定与法律论证规则，cot 目录放逐步提示（含变体），templates 目录放六类文体的 YAML 链模板。测试覆盖两类：模板完整性（六个模板全部可解析、字段齐全、每个链步骤都有配对提示文件）与 CLI 行为（list / show / run 的成功与错误路径，退出码 0 / 2 / 3 分别对应成功、配置错误、功能未实现）。
