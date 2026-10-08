---
title: "legal-hallu-guard: a citation guardrail for legal answers"
summary: "Three deterministic checks for cited legal answers: does the provision exist, is the quote verbatim, are claims backed; plus a wrong-citation-rate metric."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-08-24
featured: false
order: 6
relatedPosts:
  - 2026-08-31-legal-hallu-guard
  - 2026-09-14-baidu-ai-hallu-libel
  - 2026-09-09-supreme-court-ai-24
  - 2026-10-08-ai-hallu-court
metrics:
  - label: False-positive rate
    value: '0.0%'
    detail: "250 faithfully cited answers built on statute-rag's real corpus (the version at construction time: 14,212 rows, 238 statutes and judicial interpretations; that version is page-block level, not provision level): zero false positives"
  - label: Three-family violation detection
    value: '100%'
    detail: "The constructed evaluation hit all 120 fabricated article numbers, 120 tampered quotes and 60 unbacked assertions"
  - label: Dependencies
    value: '0'
    detail: "Pure Python standard library; 9 unit tests cover the three check families"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/legal-hallu-guard
---

## Problem and boundary

In legal QA the most dangerous failure is not refusing to answer; it is answering fluently while citing a statute that does not exist. In the usual layering of hallucination governance, "verifiable citation" is the most deterministic layer: it needs only comparison, no model judgment. This tool checks citations only; it never rules on whether a legal conclusion is right. The assertion vocabulary is the closed v0.1 set (shall, shall not, has the right, constitutes, void, deemed, responsible, bears); phrases outside the list require extending it; the built-in self-check corpus is entirely fictional text. Citation format follows statute-rag's Citation convention, so its exported corpus can be consumed directly.

## Mechanism

Each of the three check families is a pure function: if the cited (statute name, article number) is not in the corpus index, the citation is fabricated; if the quote is not a contiguous substring of the cited provision (whitespace-insensitive comparison), it is stitched or rewritten; if a sentence containing an assertion word overlaps no citation block, it is unbacked. The first real-corpus evaluation exposed a real bug: when the corpus contained duplicate (statute name, article number) pairs, the index silently kept the last one, so verdicts depended on JSONL row order and false positives hit 2%. After the fix, the index keeps every version and a quote matching any version counts as faithful, locked in by a regression test. The construction method, the per-case false-positive analysis and the boundary statement are in the repository's docs/baseline-report.md, reproducible in one command.

## Verification

All 550 constructed samples come from deterministic rules over statute-rag's real corpus (the version at construction time: 14,212 rows, 238 statutes and judicial interpretations; page-block level, not provision level; the corpus has since changed sources and gained statutes, so its size has moved), with a fixed seed of 20260928; every verdict is string arithmetic, reproducible in one command. The four sample groups each have a job:

- grounded, 250 cases: verbatim fragments from provision openings plus correct citations, testing false positives;
- fabricated, 120 cases: article numbers pushed out of range starting at "Article 9001", testing fabrication detection;
- misquoted, 120 cases: quotes rewritten through three strategies (digit substitution, synonym substitution, stitching), each rewrite verified beforehand to be a non-substring of the original after whitespace removal;
- uncited, 60 cases: whole sentences containing assertion words with no citation markers at all.

Results: grounded false positives 0.0% (0/250); fabricated, misquoted and uncited detection all 100.0% (120/120, 120/120, 60/60); each group triggered only its own target rule, no cross-talk. The first live run produced 5 false positives (2.0%), which was exactly the duplicate-article-number bug described above; after the fix it went to zero with detection unchanged. Construction method, per-case false-positive analysis and boundary statement are in the repository's docs/baseline-report.md.

## Known failures

The constructed evaluation contains no model-generated step: it measures the guard's own detection and false-positive ability, and must not be read as any model's wrong-citation rate in legal QA; evaluating real model QA output needs a model API and has not been done. Misquoted detection at 100% is a construction artifact: every sample was verified at build time to be a non-substring, and the check is exactly substring comparison, so this 100% validates that the pipeline works end to end, not any rewriting-recognition power. Two known blind spots:

- a quote that is a contiguous substring of the original but quoted out of context: substring comparison cannot catch it;
- when one article number carries multiple revised versions in the corpus, whether the answer cites the currently effective version is outside the scope of v0.2's deterministic checks.

Uncited detection is bounded by the closed v0.1 assertion vocabulary; phrasing outside the list is outside the evaluation, and a domain-specific vocabulary is pending. Unfinished plans from the original roadmap, parked here:

- chaining with clause-scope risk findings (risk flags carrying statute citations automatically, then re-checked by this tool) is not implemented;
- the v0.3 plan for a "refuse when retrieval finds nothing" strategy evaluation and a hallucination-guardrail regression set have not started.
