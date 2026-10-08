---
title: "My GitHub portfolio checkup: a full-repo deep audit, reviewed"
description: "A full audit of my own 25 repositories: three checklists — security red lines, narrative consistency, verifiability — and every disposition."
category: 工程方法论
tags: [工程方法, 安全]
pubDate: 2026-07-08
---

## Why audit myself

A portfolio holds up on "viewable, testable, questionable"; the number of projects proves nothing. An interviewer's three questions in a row — what does the retrieval run on, who is responsible when the answer is wrong, can it be handed to legal colleagues — squeezed out this full-repo checkup.

## Three checklists

Security red lines: leaked API keys revoked the same night, scrubbed across all history with filter-repo, sensitive repos flipped to private. Narrative consistency: README claims reconciled repo by repo against actual state — "FTS5 retrieval augmentation" no longer written up as RAG; half-finished work pulled out of the featured list. Verifiability: every flagship repo got its three-piece set completed (runnable entry point + metrics table + known failure cases).

## Results and lessons

In total, 85 test cases all green, 2 CIs live, 3 real bugs fixed in passing; the gap checklist got matched up name by name: clause-scope grew straight out of the checklist, legal-hallu-guard was created outright because of it; statute-rag was built earlier than both, and this audit focused its next step onto the Chinese embedding channel.

The biggest lesson: close out before you package, metrics before features, and weak repos sinking to the bottom beats a facade forced to look full.
