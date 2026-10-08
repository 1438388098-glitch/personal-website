---
title: "Trillion-parameter models at cabbage prices: the open-source wave's new scoreboard"
description: "From late August into September, Qwen, Zhipu, Hunyuan and ModelBest released open weights one after another. The parameter-comparing race has died down; the new scoreboard is activation cost, engineering gains and intelligence density. Notes from an independent developer watching from the sidelines."
category: 技术笔记
tags: [开源, 大模型]
pubDate: 2026-09-11
---

From August into September, the open-source cadence of Chinese LLMs got too dense to chase: Qwen's Qwen3.8-Max opened its weights for the first time, 2.4 trillion total parameters; Zhipu shipped GLM-5.3; Tencent Hunyuan open-sourced Hy4; and on September 8 ModelBest, together with OpenBMB, open-sourced MiniCPM5-2B. Flip back two more months and Moonshot's Kimi K3 had opened weights at 2.8 trillion parameters, the first open-source model in the 3T class; and back in April, DeepSeek-V4's preview launch open-sourced the flagship right along with it.

Watching the spectacle is easy; reading the substance means swapping in a new pair of eyes first: in this open-source wave, the scoreboard for comparison has already been replaced.

## Scoreboard one: from total parameters to activation cost

Total parameter count used to be the first metric for judging a model; that logic is now being dismantled. The new flagships are uniformly sparse MoE: Kimi K3 at 2.8 trillion total, Qwen3.8-Max at 2.4 trillion, per-token activation held around a hundred billion; Tencent Hunyuan 3.0 is the cleaner case, 295B total parameters with only 21B active, paired with a 256K context. Flagship capability bought at extremely low activation cost.

In plain words: the library keeps being built bigger, but each visit only pulls the few volumes you need, and the power bill barely rises. For downstream callers, the direct felt change from this shift is price. The unit price of flagship capability has been beaten down, and the first beneficiaries are individual developers like me who have no budget allocation.

## Scoreboard two: from piling on compute to competing on engineering

Even more worth watching is that the source of capability has changed. GLM-5.3 lifted coding ability by half with the base model untouched, through post-training alone; Hunyuan Hy4 has the model participate in auto-optimizing its own training methods and data strategy, with inference throughput up more than thirty percent; DeepSeek-V4-Pro rivals top closed models on math, STEM and competitive coding — and not through brute force either.

The industry calls this play "from stacking compute to competing on engineering", and the iteration cycle has compressed from half a year to a month or two. Among the three principles Hunyuan set when rebuilding its post-training, one is evaluation truthfulness — I smiled when I saw the term: my own starting point for building a grading agent was running out of patience with unverifiable capability claims, putting anti-cheating anchors on the evaluation itself first. Now the top vendors write this into their methodology, which means everyone has been tortured by the same problem.

## Scoreboard three: intelligence density replaces parameter scale

At the other end of the open-source list, small models are improving at an even more startling pace. Since August, Alibaba open-sourced a 27B dense model, Ant open-sourced the 7.9B Bailing, and on September 1 iFlytek released the Spark X2.5 on-device model in 4B and 1.7B sizes, with native support for a 1M-token context. ModelBest's MiniCPM5-2B beats the best model of the 4B tier on average score across 34 benchmark evaluations.

The industry calls this intelligence density: more capability in the same size. Cloud trillion-parameter flagships, on-device 10B-class, lightweight models handling office automation — a tiered matrix has taken shape. For my privacy-sensitive scenarios like handling legal documents, an on-device model means there is a road that never touches the network, and the value of that cannot be scored by any benchmark.

## Where I stand in this wave

My toolchain design has always had one obsessive lean: whatever a program can judge never goes through a model. Statute verification is three pure string checks; the retrieval foundation is zero-dependency BM25, running clean over the 14,212-row corpus. Where a model is unavoidable (grading, evaluation), I hold reproducibility as a hard constraint: prove the evaluation itself does not cheat first, talk capability after.

This wave is a two-way win for me: call costs fall along with activation cost, and after the industry turned toward evaluation truthfulness, a small developer's "reproducible numbers" vocabulary finally speaks in sync with the industry. One line of detail worth noting: DeepSeek-V4 officially supports Ascend and Cambricon. Compute autonomy written into a release announcement as product strength — unthinkable two years ago.

## Closing

Scoreboard swapped from parameters to cost, from compute to engineering, from scale to density — all pointing at the same trend: the price of capability is collapsing, and the way capability gets proven is converging onto numbers. Collapsing prices put capability within an individual developer's reach; converging proof lets a small team speak with nothing but one clean evaluation table. The scoreboard will change again, but the direction of "turning capability into reproducible numbers" is, most likely, never going back.
