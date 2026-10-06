---
title: "A citation guardrail for legal Q&A"
description: "Deterministic rules that catch AI-invented statutes: does the provision exist, is the quote faithful, are claims backed."
category: 技术笔记
tags: [法律AI, AI幻觉, 评测]
pubDate: 2026-08-31
---

The most dangerous failure in legal Q&A often wears the most reliable costume: the model writes, dead seriously, "according to Article 103 of the Such-and-Such Law", in a confident tone, while that law never reached 103 articles. When a model admits "I don't know", the reader stays on guard; but facing this kind of firmly asserted fictional provision, an ordinary reader neither grows suspicious easily nor can afford the cost of checking.

To address this I wrote a lightweight validation tool, `legal-hallu-guard`, doing deterministic interception on legal answers that carry citation markers.

Governing LLM hallucination usually means several lines of defense: retrieval grounding, format constraints, consistency checks, confidence filtering. Among them, "citation checking" is the layer best closed with deterministic logic: it needs no further LLM call for semantic inference, and pure text comparison grades it. The tool's idea is direct: **the answer text and the statute index are inputs to a pure function; the same input always yields the one and only verdict.**

## Three rules, each guarding one failure

The tool currently defines three typical defects, each with a simple rule:

1. **FABRICATED_CITATION:** the answer marks `【Law name, Article X】`, but the corpus index contains no such entry.
2. **MISQUOTED_TEXT:** the quote excerpted in the answer, compared against the stored provision with whitespace stripped, is not a contiguous substring of the original. A changed digit, a swapped synonym, or two paragraphs stitched together are all caught here.
3. **UNCITED_CLAIM:** the sentence contains a strong assertion word (shall, shall not, has the right, constitutes, void, deemed, responsible, bears) but is positionally associated with no citation marker.

This works without any model because none of the verdicts needs "understanding context": whether a provision exists is a table lookup, whether a quote is faithful is substring matching, whether an assertion is backed is a wordlist plus positional overlap. Bring an LLM into the judgment and you buy latency, cost and fresh uncertainty; string comparison reproduces one hundred percent on any machine.

## Stress-tested on 14,212 rows of real corpus

Writing the rules is easy; controlling false positives is not. A guardrail that constantly frames correct answers is one nobody dares switch on in production.

I built a baseline test over `statute-rag`'s real corpus: 238 statutes and regulations, 14,212 rows of corpus text (that version was sliced by page blocks, not provisions). With a fixed random seed I constructed 550 test answers: 250 fully compliant, the other 300 injected with different typical defects. After fixing the known edge cases, the compliant group ended at 0.0% false positives and all three defect families at 100% recall.

That live run also caught a real bug in my code: some statutes carry multiple historical revisions in the corpus, and indexing silently overwrote old provisions with newer arrivals, so verdicts depended on text read order; the first live round produced 5 false positives (2.0%). The fix keeps every historical snapshot of a provision in the index, a quote passing against any valid version counts, and a regression test locks it in.

## What the tool is, and where it ends

On the engineering side I kept **zero external dependencies**, Python standard library only; it runs as a CLI script for batch jobs or as a module inside a service.

But the boundary must be said plainly: **it governs whether citations are faithful, not whether anyone's legal argument is right.**

A perfectly real provision, a verbatim excerpt, a properly formatted marker, can still support wildly opposed legal conclusions; that is beyond deterministic comparison by definition. Also, the assertion wordlist is a static enumeration and occasionally misses; and if the model quotes a phrase from the original out of context, literal comparison is blind as long as the phrase is a contiguous substring. These physical limits are written directly into the repository docs; when you use it as a safety net, know what it cannot see.
