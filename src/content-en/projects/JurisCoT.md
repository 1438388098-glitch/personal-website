---
title: "JurisCoT: a chain-of-thought prompt engine for legal papers"
summary: "A CoT prompt library for Chinese legal scholarship: 6 paper templates each with structured reasoning chains and step-by-step prompt assets, a small list/show/run CLI and template-integrity tests. v0.1 manages template assets only; the inference pipeline is unimplemented and reported as such."
group: 法律工具
date: 2026-09-28
featured: false
order: 4
metrics:
  - label: Paper templates
    value: '6 types'
    detail: "Theoretical analysis, case analysis, institutional comparison, empirical research, legislative proposal, literature review"
  - label: CoT steps
    value: '4 to 8 per type'
    detail: "Case analysis is the heaviest at 8 steps, literature review the lightest at 4; every step pairs with a prompt file"
  - label: Honest boundary
    value: 'run does not pretend'
    detail: "v0.1 has no model pipeline: no API key exits with a clear error, and with a key it still reports the feature as unimplemented rather than faking a successful call"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/JurisCoT
---

## Problem and boundary

The reasoning structure of a legal paper varies by genre: a case-comment walks the judgment's logic, a legislative proposal walks problem-solution-grounds. JurisCoT turns the reasoning chains of six genres into template assets: feed in a legal question plus literature, statutes, cases, data and foreign law, and it outputs structured reasoning chains and academic prose, designed as the core reasoning component of LawAutoPaper. The boundary is stated bluntly: v0.1 covers template asset management only (list / show); the model inference pipeline is scheduled in TASKS.md but unimplemented, and the run entry gives honest exit codes for both "can't run" cases instead of faking success.

## Mechanism

Prompt assets are layered: base/ holds persona settings and legal-argument rules, cot/ holds step-by-step prompts (with variants), templates/ holds YAML chain templates for the six genres. Tests cover two classes: template integrity (all six templates parse, fields complete, every chain step paired with a prompt file) and CLI behavior (success and error paths of list / show / run, with exit codes 0 / 2 / 3 for success, configuration error and unimplemented feature).

## Verification

v0.1 has no model-generation quality numbers yet; what is verifiable is asset and CLI correctness, all automated: template-integrity tests check that the six YAML templates parse with complete fields and every chain step paired with a prompt file; CLI behavior tests cover the success and error paths of list / show / run. One command runs it all: python -m pytest tests -q.

The acceptance bar for generation quality is already written into TASKS.md days 38 to 40, four items:

- one run per template with JSON parse success no lower than 95%;
- reasoning completeness: at least 2 doctrines, and comments containing theoretical grounds, explanatory power and limits;
- traceable citations: every doctrine tagged with a source chunk_id;
- consistency: the same input run 3 times keeping the 4c stance unchanged.

All four belong to the acceptance schedule after the inference pipeline exists; none has been executed, so this entry provides no generation-quality numbers, only asset-validation results.

## Known failures

- The inference pipeline is unimplemented: prompt_loader, pipeline and engine are scheduled for TASKS.md days 29 to 37; run is a placeholder that exits with code 2 when no API key is present, and with a key exits code 3 reporting the feature as unimplemented.
- Prompt assets are model-untested: the step-by-step tests scheduled in TASKS.md days 9 to 26 (step1 run once each on 3 questions from different legal fields, step2 verifying statute citations come only from the injected list) are all unchecked; the prompts pass structural validation only, with no generation-quality evidence.
- Reproduction has an external dependency: the whole flow relies on a local statute library of 263 files whose paths are not in the repository, so nobody else can run the full flow from the repo alone.
- Coverage is narrow: 6 paper genres; anything outside them has no reasoning chain.
- Model output fluctuates, which the acceptance criteria anticipated with a same-input-3-times stance-consistency check: the author never expected consistency to come for free.
