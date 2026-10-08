---
title: "From LIKE to hybrid retrieval: two evolution lines of a statute foundation's recall"
description: "What FTS5 unicode61 does to Chinese, synthetic vs real golden sets, what 44.7% vs 98.9% mean. Postscript: the current numbers."
category: 技术笔记
tags: [检索, 评测]
pubDate: 2026-07-28
---

## Starting point: does FTS5 count as RAG

In the legal-wisdom-app era I built retrieval-augmented QA on SQLite FTS5 and was challenged that "this is not RAG". The challenge was right: no vectors, no reranking, no evaluation. Still, for article-number and explicit-term hits, keyword retrieval is controllable, explainable and auditable. The problem was that I never used numbers to state its boundary.

## Evidence: what unicode61 actually does to Chinese

SQLite's unicode61 tokenizer does not segment Chinese into words; a whole sentence becomes one giant token, and colloquial question recall collapses. On statute-rag's real-question golden set v1 (38 questions), the LIKE baseline measured Recall@5 of 0%: across 38 real questions, the top five results never once contained the correct provision. That number forced the retrieval layer's rewrite.

## Two evolution lines, never to be mixed

On the synthetic golden set (177 questions): LIKE baseline (simulating FTS5 unicode61 behavior) 77.4%, hybrid retrieval (RRF fusion of original-query BM25 + synonym-expanded BM25 + LIKE) 98.9%, MRR 0.984. The former asks whether the right provision is anywhere in the top five; the latter asks where it ranks on average, and 0.984 means almost always first or second; combined, 21.5 points above baseline. On the real-question golden set (38 questions): hybrid v0.1 26.3%, and 44.7% after adding the synonym dictionary (127 entries), a gain of 18.4 points. The two lines have different scopes: the former a conservative synthetic distribution, the latter a small-sample real distribution; passing either number off as the other is dishonest.

## Next steps

Grow the real-question golden set, wire in a Chinese embedding channel (v0.2 roadmap), provision/article/paragraph multi-level chunking (v0.3), and 100% jump-back verification of citations.

## Postscript: what it grew into by October

Those two evolution lines later grew several more layers; the current state is recorded here, with the historical numbers above left as written, accurate at the time.

The corpus had a blood transfusion first: the earliest 14,212 rows were actually page blocks sliced by length from two-column gazette PDFs, later replaced wholesale with verified provision-level text, then two more rounds added missing statutes; it now stands at 25,987 provisions across 444 statutes.

Retrieval gained two layers on top of hybrid. One is semantic reranking: two Chinese embedding models each rank the whole library, the better rank per provision brings the top 50 into the recall pool, and a cross-encoder reorders the front ten. The other is the LLM precision layer: the pipeline's top 50 candidates go to the model with the question, which lifts the 5 most relevant to the top. Both layers keep the same contract: reorder only, never invent provisions; on API trouble, fall back to the original order.

The numbers: real questions, 38 of them, went from 52.6% to 71.1% recall@5; the deciding set is the blind holdout (100 questions, writers fully isolated from the system), where the local pipeline hits 66 and the precision layer lifts it to 92. The precision layer's judge started as a free-tier LLM, about 4k tokens per query at zero cost, and the free and paid tiers measured the same 92.0%; but the free tier's tail requests time out (429 rate limits), so production now runs the judge model Jev (paid tier, about 1.3 s and $0.00037 per question). Along the way one systematic optimization ran to nothing: 15 algorithm variants all flat or worse, with the diagnosis that the bottleneck is the ranker's power to tell "semantic neighbor" from "actual answer", the edge of local small models; what actually pushed it up was swapping in a judge that reads the original text.

The four "next steps": the real-question golden set grew (to 38 questions, done); the Chinese embedding channel exists, it is the semantic layer above; provision/article/paragraph chunking and citation jump-back verification are still undone.

The retrieval page is live: [iweistoicqc5.top/law](https://iweistoicqc5.top/law/).
