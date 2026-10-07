---
title: "clause-scope: deterministic contract clause extraction and risk flags"
summary: "A zero-dependency rule engine turns a contract into a clause list plus risk findings, spans jump back to source; no LLM, every verdict reproducible."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-08-28
featured: false
order: 5
metrics:
  - label: Clause classification accuracy
    value: '100%'
    detail: "Fictional labeled corpus (3 contracts, 25 clauses): 25/25"
  - label: Span jump-back validity
    value: '100%'
    detail: "25/25, every output carries source offsets"
  - label: Risk detection rate (recall)
    value: '100%'
    detail: "4/4, likewise on fictional labeled samples"
  - label: Risk flag precision
    value: '80%'
    detail: "4/5; the false positive is documented: a conditional termination right counted as unilateral termination"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/clause-scope
---

## Problem and boundary

The first step of contract review is knowing what the contract says and what it omits; only then come recommendations: which of the 8+ critical clause families (price, delivery, confidentiality, breach liability, dispute resolution and more) sits in which article and what the original text is; missing mandatory clauses (no breach-liability clause, a risk visible without legal training); unbalanced rights (a termination right or penalty binding one side only); vague wording (a jurisdiction clause that never pins the connecting factor). Every risk finding must carry source-text evidence or an explicit "missing" marker; unevidenced flags are never emitted. The v0.1 boundary is blunt: a rule engine is not an LLM and complex wording can slip through; the current evaluation corpus is 3 entirely fictional labeled contracts, so it validates rule behavior only. Real-contract evaluation is on the roadmap and outside current claims.

## Mechanism

- The extractor does numbered segmentation, classification and span offsets: title patterns are strong signals and classify directly; full-text keyword voting per family is a weak signal (at least 2 hits to count); with no numbered structure the whole document degrades to a single fallback clause, and content is never silently dropped.
- Risk rules have three levels: MISSING (a mandatory family absent; breach-liability absence is P0), IMBALANCE (termination right granted to one side only, penalty binding one way), VAGUE (jurisdiction without a pinned connecting factor), output sorted by severity.
- Span jump-backs are a hard constraint: all extraction output carries source offsets, and the report layer attaches source excerpts to every finding.
- Termination rights are assessed across clauses: when both parties appear in one clause, the judgment is who was granted the right and whether the other side holds a symmetric one; how many parties a clause mentions counts for nothing.
- The v0.2 LLM-assisted classification has interface stubs ready: inject classify_fn, the LLM only backstops rules, spans are immutable, every output must carry a reason; 6 contract tests lock this in.

## Verification

Evaluation runs on fictional labeled samples with the numbers' nature stated as-is: 3 fictional contracts, 25 clauses; clause classification 100% (25/25); span jump-back validity 100% (25/25); risk detection (recall) 100% (4/4); risk precision 80% (4/5). The sub-perfect precision has a clear source: a conditional termination right ("Party A may terminate if...") was counted as unilateral termination; the finer distinction between conditional and arbitrary termination belongs to v0.2, noted in both rules and report. 18 unit tests cover rule behavior; the v0.1 engine has zero third-party dependencies (Python standard library only), verified on Python 3.13. The real-contract acceptance gate (at least 30 contracts, field accuracy no lower than 85%) gets no pre-filled numbers until the corpus arrives.

## Known failures

A rule engine's coverage of implicit clauses is limited: a heading saying "loss compensation" that actually serves as breach liability can slip through; LLM-assisted classification is v0.2. The current evaluation validates rule behavior only and proves nothing about real contracts. The v0.3 plan to chain with statute-rag (risk findings feeding statute-basis retrieval automatically, then comparison against a position baseline library) has not happened yet.
