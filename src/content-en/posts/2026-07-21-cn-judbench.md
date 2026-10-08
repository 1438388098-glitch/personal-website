---
title: "A 'judicial exam' for large language models"
description: "12 task packages, 323 hands-on questions: machine grading and a preregistered protocol to benchmark LLMs on judicial workflow capability."
category: 技术笔记
tags: [评测, 司法]
pubDate: 2026-07-21
---

Legal retrieval, case-fact sorting, litigation-fee arithmetic — more and more judicial support work is being stuffed into LLMs. But how exactly should we judge whether a model can take this work? And in which link does the danger hide?

Most existing Chinese legal benchmarks are still at the stage of "grinding bar-exam multiple choice". Top models have already crammed those single-choice scores past 80 and 90, with no gap between them; worse, a model that cites a repealed statute in its analysis and miscalculates the limitations period can still guess the right multiple-choice option and slip into a glossy total score.

So I built `CN-JudBench` (Faheng in Chinese), an automated benchmark aimed at real judicial workflows. Rather than testing whether a model can grind exams, the more pressing questions are whether it is dependable while doing actual work, whether its output is stable, and what the cost really is.

## 12 task packages, 323 hands-on questions

The benchmark currently holds 12 task packages and 323 public questions in total, all built out of actual judicial-practice moves:

* **Statute validity:** strictly against the baseline date the question specifies (`as_of`), check whether the provisions the model cites were in force at that time.
* **Element extraction:** structured extraction of key legal facts, scored strictly by field F1; key information answered correctly and then broken by later output loses points all the same.
* **Fee and deadline calculation:** answers must pass hidden unit test cases; a correct formula with a wrong last digit fails on the spot.
* **Tool calling and fault tolerance:** one track tests parameter precision across multi-step retrieval; the other track injects simulated network failures midway, to see whether the model can recover from failed calls.
* **Multi-turn interviewing with differential tracking:** a script plays the client, feeding lines from a fixed playbook, testing whether the model can complete the case card under follow-up questioning without inventing extras.

## Machine grading: run the golden answers through first

To avoid the grading drift that comes from "using a model to judge models", the benchmark's grading runs on hard-coded rules as far as possible: every question declares two rule groups, "must hit" and "must not break", and only pure-reasoning essay questions bring in an auxiliary judgment column.

Before any model's score is shown to the outside, the pipeline stands three anchors in place:

* **Random guessing (random):** 7.96
* **Shallow heuristics (rules):** 27.40
* **Golden-answer replay (mock:gold):** 100.00

The first two anchors say that on this question set, guessing or template-fitting alone can hardly pass; `mock:gold` is the grading pipeline's own smoke test: pour the annotated golden answers into the grader untouched, and only if it banks a steady 100 is the grading logic proven not to have tripped over its own feet.

## Three cheating seams closed in iteration

An evaluation system itself also matures by fixing its own bugs. In v0.6, I closed three loopholes that could let a model pick up cheap points:

1. **Limitations cheating:** previously the model was sometimes allowed to self-report the effective date of its citations, so some models cited repealed statutes while asserting in the sentence "this was in force as of 2018", dodging the deduction; now everything is pinned hard to the question's given `as_of`.
2. **Polarity hedging:** "not supported" and "supported" are now polarity-inverted and isolated; findings with a negation prefix are no longer fuzzy-matched as hits.
3. **Misjudged refusals:** fixed a regex rule that mistook a perfectly proper legal opinion — "no third-party referral is needed in this case" — for a model safety refusal.

Rerunning the three fixes against the 245 baseline questions of the time (the set has since grown to 323), existing scores showed zero drift — proof that only the speculation paths were sealed and no bystanders were hurt.

This benchmark keeps evolving. Every model score on the current leaderboard carries a `provisional` tag; until it has passed a strict cross-run flip-rate gate, it is fit for engineering ground-truthing and diagnosis, and must never be taken directly as an endorsement for letting a business through.
