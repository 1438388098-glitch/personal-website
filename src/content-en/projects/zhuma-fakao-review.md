---
title: "zhuma-fakao-review: a review assistant for Zhuma bar-exam wrong answers"
summary: "Turns every wrong answer in your Zhuma bar-exam book into per-subject, recitation-ready knowledge-point PDFs: full fetch through read-only interfaces, six-dimension review by subagents, and defensive engineering with atomic writes and circuit breakers."
group: 法律主线
date: 2026-08-12
featured: false
order: 4
relatedPosts:
  - 2026-08-22-zhuma-fakao-review
metrics:
  - label: Wrong-answer scale
    value: '1,655 questions'
    detail: "Unique missed questions across 18 subjects and 180 chapters that contain questions; the internal read-only interface fetched them all in about 9 minutes"
  - label: Parallel generation
    value: '39 subagents'
    detail: "Note generation ran in five parallel batches; 2 units were handwritten by the main agent after 429 rate limits"
  - label: Output
    value: '18 volumes + 129 pages'
    detail: "Per-subject PDFs total 8.3MB; the master volume is 4.2MB with cover, table of contents and bookmark jumps"
  - label: Automated tests
    value: '22 cases'
    detail: "node:test covers atomic writes, process locks, splitting and the fake-green-light guard, with temp-directory CLI end-to-end runs"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/zhuma-fakao-review
---

## Problem and boundary

What makes a wrong answer worth reading is the knowledge point it keeps pointing at. This skill turns every wrong answer in the Zhuma bar-exam book into per-subject, recitation-ready knowledge-point PDFs: reverse-engineering high-frequency exam points from wrong answers, adding error-prone and confusable points, and adjusting depth to your weak subjects, review progress and study habits. Boundary: an unofficial tool for personal study, unaffiliated with the platform; read-only toward the platform (no submissions, no touching answer records), fetching only your own account's wrong answers; objective questions only, since the essay wrong-answer book has a different structure and is not adapted.

## Mechanism

A seven-stage flow orchestrated autonomously by the agent per SKILL.md: after QR login it fetches everything through the internal read-only interface (stems, options, correct answers, full official explanations, serially with a default 150ms gap), splits by subject into units of at most 55 questions for parallel subagent note generation, then runs a six-dimension parallel review per subject × dimension (statutory accuracy, answer consistency, coverage completeness, format compliance, learner fit, cross-unit continuity), aggregates a revision list where P0 issues must be fixed and re-reviewed, and only then renders the PDF. Defensive engineering runs throughout: atomic JSON writes, process locks against concurrency, resumable runs, circuit-breaker backoff; subagent prompts carry anti-injection clauses and a write-path whitelist; when the aggregation script cannot parse issue entries it errors out outright, never producing a fake green light of "no revisions needed".

## Verification

Measured scale of one full run: 1,655 unique missed questions (18 subjects, 180 chapters containing questions), 41 processing units, about 9 minutes of fetching; 39 note-generation subagents in five parallel batches (2 units handwritten by the main agent after 429 rate limits); output of 18 per-subject PDFs totaling 8.3MB plus a 129-page master volume at 4.2MB. npm test runs 22 cases covering argument parsing, atomic writes, stale process-lock takeover, unit splitting against the manifest, and fake-green-light protection (a report present but zero parsed issues must exit 2), all verified through temp-directory CLI end-to-end runs. The repository also went through two rounds of independent code review plus re-review acceptance (security audit, line-by-line review, documentation consistency check), with the process on the record in git history and the security audit document.

## Known failures

The interface does not expose "my wrong choice": userOptions and userAnswer are always null, so you know which questions you missed but not which option you picked. The tool depends on Zhuma's internal interface; a frontend redesign can break it, and login sessions expire, requiring a fresh QR scan. In the master PDF each unit's chapter numbering is independent and restarts, mitigated with "Part N (continued)". Two data paths leave the machine, and you should know: wrong-answer content and study behavior are sent as prompts to your model provider, and --desktop copies the master PDF to the desktop, which lands in the cloud if your desktop syncs.
