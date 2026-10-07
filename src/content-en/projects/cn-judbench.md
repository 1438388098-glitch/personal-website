---
title: "cn-judbench: an LLM benchmark for the Chinese judiciary"
summary: "12 task packages, 323 public questions, machine-checked grading, pre-registered statistics: what models can do, where they are dangerous, what it costs."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-07-12
featured: true
order: 2
relatedPosts:
  - 2026-07-21-cn-judbench
metrics:
  - label: Benchmark size
    value: '12 packages / 323 questions'
    detail: "Public question set, predicate-level machine-checked grading, reconciled question by question against MANIFEST"
  - label: Baseline anchors
    value: 'random 7.96 / rule 27.40'
    detail: "Same grading pipeline (baseline-v06c); mock:gold at 100.00 is the pipeline ceiling and health gate, not a model score"
  - label: Real-examinee round pass^2
    value: '46.77'
    detail: "62 questions with doubly isolated real examinees, 95% CI [33.87, 59.68]"
  - label: Regression tests
    value: '630+ items'
    detail: "pytest all green; the CI gate includes a zero-flip assertion on reruns"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/cn-judbench
---

## Problem and boundary

In judicial settings the gap between "looks competent" and "is competent" is wide: a high score from a single sample can be leakage, contamination or luck. CN-JudBench answers four questions: which legal abilities a model actually has, where it is dangerous, how stable it is across runs, and what it costs. The boundary is equally clear: it evaluates, it never gives legal advice, and its results must not be used for adjudication, compliance sign-off or party decisions. All externally quotable scores go through one grading pipeline and are registered in a single score ledger.

## Mechanism

12 task packages cover citation validity, element extraction, computation with hidden unit tests, subsuming facts under offences, tool calling with fault injection, multi-turn interviewing and multi-day case management. Grading is machine-checked at predicate level: each package ships a machine-checkable oracle (hidden unit tests, a citation-status ladder, env_diff end-state comparison, among others), plus a registered failure taxonomy, contamination canaries, and leakage monitoring against random and rule-based baselines. The statistics protocol is pre-registered: pass^k combination semantics, paired bootstrap confidence intervals, exact McNemar tests, two-level ranking granularity. Questions pass an admission pipeline from draft to public: two isolated real examinees answer, golden answers are adjudicated under a five-condition policy, verified verbatim against official anchor text plus a text_hash, and only then enter the public set and reconcile against MANIFEST.

## Verification

Baseline anchors and the real-examinee round are published side by side. On the same grading pipeline, the random baseline scores 7.96 and the rule-based baseline 27.40; mock:gold replays golden answers through the full grading pipeline and scores 100.00, which is the pipeline's ceiling and health gate, not a model score. In v0.5 stage five, the doubly isolated real-examinee round (62 questions) scored pass^2 46.77, 95% CI [33.87, 59.68]. All 13 rows of the current model board are provisional: until the flip-rate gate (below 5%) clears them, only descriptive comparisons are allowed, no official ranking. Over 630 pytest tests are green; the CI gate includes validation, a full mock run, artifact assertions and a zero-flip assertion on reruns. v0.6 fixed three grading-validity gaps:

- as_of dates in question stems are now mandatory;
- opposite-polarity wording is no longer graded as support;
- refusal decisions gained a negative exemption ("no referral needed" no longer counts as a refusal).

## Known failures

Flip rates taught a lesson early: re-testing GLM in examinee mode with k=3, per-question paired flips hit 6/11, about 55%, far above the 5% gate, so every single-sample run is provisional and the official main table mandates pass^k. The answer-alignment guard (bigram Dice plus reverse optimal matching confirmation) caught two real subagent answer-misalignment incidents; the SUSPECT list always requires human review. Before the flip gate passes, the model board carries descriptive conclusions only. DS v0.4 rerun, holdout-freeze enforcement and the human-grader agreement κ pilot are all still on the todo list; unmeasured parts are written as "not measured" in reports, and fabricating comparisons is forbidden.
