---
title: "Jev in measured runs: swapping the rerank layer's LLM judge for a model that only judges"
description: "The statute-retrieval rerank layer switches to TypeSafe's judge model Jev: on 100 isolated blind-written questions Recall@5 goes from 66% to 92%, R@1 84%, 1.3 seconds and $0.00037 per question, with a free-tier rate-limit lesson attached."
category: 技术笔记
tags: [大模型, 检索, 评测, 开源]
pubDate: 2026-10-04
---

## In one sentence

My statute retrieval foundation, statute-rag, has always run its rerank layer as "throw the candidate provisions at an LLM and let it lift the best 5 to the front". On 100 isolated blind-written questions this pushed Recall@5 from 66.0% to 92.0%, at the cost of 3 to 4 seconds per call and a tail that could spike to 23 seconds. This round I swapped the judge for TypeSafe's judge model Jev: Recall@5 stays at 92.0%, the share of answers ranked first moves from 82.0% to 84.0%, the median is 1.3 seconds per question, and the cost is $0.00037 per question.

## What Jev is: it writes no essays, it only judges

Jev is TypeSafe's System One model, served through OpenCode Zen's `POST /zen/v1/systemone`. The input is a `state` plus several typed questions; the answers are typed too, and there are only three kinds:

- `choice`: single choice, with a probability distribution covering all options;
- `score`: a rating from 0 to 3;
- `noul`: yes or no, with a probability.

It will not write a paragraph of text for me to parse. This is the premise of every conclusion below: rerank needs discriminative power, not generation ability.

Pricing is $0.042 per million input tokens, output free, plus a limited-time free tier.

## Why it happens to fill exactly the rerank layer's missing piece

Earlier in this project I swept 15 algorithm variants, all flat or worse: deeper cross-encoders, weight re-sweeps, fusion formulas, aggregation schemes, a larger reranking model, a third embedding family. The diagnosis was clear: of 95 questions, 91 had the correct answer inside the recall pool already, and of the 34 missed questions, 29 had the answer within the semantic top 30; what was stuck was the ranker's inability to tell a "semantic neighbor" from the "actual answer".

The cross-encoder usable on that machine is 278M parameters, not enough to read a provision's full text; a general-purpose LLM reads fine but takes about 4k tokens and 3 to 4 seconds per call. Jev lands exactly in the "reads fine, only judges, fast" tier — a third option that did not exist before.

## Integration: turning a ranking problem into a judging problem

It cannot replace the old judge layer line-for-line: the old approach had a chat model output a JSON array of indices, while Jev returns one judgment per candidate. I wrote two modes that convert judgments into a ranking:

- **choice mode (default)**: treat the 50 candidates as the options of one single-choice question; one call returns a probability distribution covering all 50, and the head is taken in descending probability. Closest to reranking semantics, one request suffices.
- **score mode**: ask each candidate its own question, score each independently, take the head in descending score.

Both keep the contract of the old judge layer exactly: reorder only, invent no entries, fall back to the original order on any failure; standard library only, and outside the core import chain. The frontend need not write two logic paths for them.

## Three measured tables

Methodology first. The evaluation uses 100 second-round isolated blind-written questions (the question writers saw neither corpus nor code); every judge shares the same candidate pool produced by the local pipeline, differing only at the judge step. Before drawing any conclusion, calibration: locally the current pipeline reproduces to Recall@5 66.0%, R@10 72.0%, R@30 89.0%, matching the authoritative numbers recorded in the repository digit for digit.

In the tables, R@5 is the share of questions whose correct answer appears within the top five, R@1 is a hit at the very first slot; "rescued / displaced" counts the questions lifted into the top five by the judge and pushed out of the top five.

### Effect

| Judge | R@5 | R@1 | rescued / displaced |
|---|---|---|---|
| Local pipeline (no judge) | 66.0% | 32.0% | — |
| longcat (chat, free tier) | 92.0% | 82.0% | 26 / 0 |
| DeepSeek v4.1-flash (chat) | 92.0% | 85.0% | not recorded |
| Jev choice (paid tier) | 92.0% | 84.0% | 26 / 0 |
| Jev score (paid tier) | 92.0% | 82.0% | 26 / 0 |

The 92.0% is the ceiling of candidate depth: for the remaining 8 questions the correct answer is not in the top 50 at all — a recall gap that no judge can rescue. Jev's strength is a sharper first slot: R@1 84.0%, above the chat judges' 82.0%, slightly below DeepSeek's 85% to 86%.

### Speed

| Judge | per-call p50 | p95 |
|---|---|---|
| Jev choice | 1278 ms | 2464 ms |
| Jev score | 1332 ms | 2538 ms |
| DeepSeek v4.1-flash | 2750 ms | not recorded |
| longcat (chat) | 3614 ms | 22984 ms |

longcat's 23-second p95 came out of the same batch. In an interactive interface, the worst seconds shape perceived latency more than the median does: Jev's p95 (2.4 seconds) is shorter than longcat's median (3.6 seconds).

### Cost

Counted by the tokens returned in each response; unit prices differ, so token counts do not compare directly.

| Judge | input / output tokens per question | cost per 100 questions |
|---|---|---|
| Jev choice | 8755 / 408 | $0.0368 |
| Jev score | 11723 / 745 | $0.0492 |
| DeepSeek v4.1-flash | 4242 / 13 | within plan, $0.0644 at list price |
| longcat (free tier) | 4176 / 15 | $0 |

Jev's output is a probability array and the output side is not billed, so the expensive part sits entirely in input. choice mode costs $0.00037 per question, about forty percent below DeepSeek converted at list price.

I stress-tested concurrency separately: a single key ramped from 1 concurrent request to 64, zero failures, zero 429s, per-call latency steady at 1.2 to 1.3 seconds and not rising with concurrency; at 64 concurrent, aggregate throughput was about 22.5 requests per second.

## Shortcomings

### The free tier is unusable

After several hundred consecutive calls that day, the endpoint began returning 429 `FreeUsageLimitError`; in testing, 62 to 100 out of 100 calls degraded to original-order returns. The fallback saves availability, not effectiveness — production must use the paid tier. I did not anticipate this at the start; I ran into it during stress testing.

### The top slot still trails DeepSeek a little

84.0% against 85% to 86% sits within single-run jitter of ±2 questions, but the direction is real.

### The probabilities are relative quantities

Probabilities in choice mode are shaped by the batch of candidates: change the batch and the same provision's probability changes, so they cannot serve as absolute thresholds. Refusal logic like "below score X, declare not retrieved" needs the absolute scale of score mode, or a separate `noul` question.

### The ceiling is still recall

This judge swap did not, and could not, touch those 8 recall-gap questions.

## What this says for legal tech

Judge models turn the rerank layer from "call an LLM API once" into "call a cheap specialized endpoint". Solo lawyers and small firms will not pay a cent for one retrieval, but they will walk away over 3 seconds of waiting; only when price and waiting come down together is this retrofit worth doing.

Showing the score beats hiding it. Each result in the interface carries a "Jev score 0.93" and a thin bar; hovering shows the provision's internal rank in Jev's eyes and whether it was lifted; hovering the status tag also shows this round's judging time and token counts. Legal users are especially wary of black boxes; a number they can read and challenge builds more trust than a fluent paragraph.

Measure the bottleneck before choosing a judge. Had I kept tuning fusion weights this round, it would have been another wasted effort; 15 dead variants, plus the diagnosis that "91/95 answers were already in the pool", is what surfaced the "swap the discriminator" path.

## Reproduce

Code and the full measurement log live at [github.com/1438388098-glitch/statute-rag](https://github.com/1438388098-glitch/statute-rag); the report is at `docs/retrieval-jev-rerank.md` in the repository. Core commands:

```bash
# three-way parallel evaluation (local pipeline + Jev + chat judge); the first run persists the candidate pools
STATUTE_RAG_JEV_KEY=... STATUTE_RAG_JEV_MODEL=jev-1.13 \
  py -3.13 scripts/eval_jev_rerank.py --workers 5 \
    --pools data/flk/tmp/pools --tag paid_choice

# online demo (the rerank judge defaults to Jev)
py -3.13 scripts/app.py --corpus data/corpus_v7.jsonl
```

The unit tests added 19 cases, all offline: 17 for the judge layer (contract, both modes, failure fallback, tie stability, environment-variable configuration) + 2 for the interface layer (displaying scores).
