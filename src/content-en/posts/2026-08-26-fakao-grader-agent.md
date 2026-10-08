---
title: "Why I built a grading agent for Chinese bar exam scoring"
description: "For AI scoring of bar exam essay answers, the hard part is aligning scoring points. The design trade-offs in fakao-grader: point-by-point rubrics, confidence tiers, and a second-pass review."
category: 工程方法论
tags: [法考, Agent, 评测]
pubDate: 2026-08-26
---

## The problem: AI scores are untrustworthy because it scores the total

When a model scores an essay question directly, the score itself cannot be audited. Chinese bar exam marking awards points by scoring points, so AI grading should judge point by point too, not slap down a single total.

## Mechanism

fakao-grader splits the official scoring points into a point-by-point rubric, with configurable whitelists and blacklists of scoring points, and supports chained-deduction rules; its output carries a confidence tier, and low-confidence results are forced into a second-pass review.
(For mechanism details and the design documents, see the fakao-grader repository README.)

## Boundary

Scoring assistance only, not a replacement for human marking; the output counts as a first draft, with the official scoring rules and human judgment as the final authority.

## Validation

A small-sample consistency evaluation: agreement across repeated gradings of the same answer, and alignment against the reference scoring points;
the numbers and samples live in the repository's examples/ and the evaluation notes. Failure modes (such as "reasoning reads smoothly but scoring points were missed")
are archived separately, as input for the next round of optimization.
