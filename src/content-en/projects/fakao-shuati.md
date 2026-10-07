---
title: "fakao-shuati: a self-hosted practice platform for bar exam essays"
summary: "Self-hosted practice for bar exam essays: question-bank management, point-by-point AI grading, review reports, mistake book, recitation cards."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-09-28
featured: false
order: 7
metrics:
  - label: Grading scope
    value: '✓ / △ / ✗'
    detail: "Per scoring point: equivalent, tangential or missed, with a review report of point-by-point comparison, cascading-loss warnings and improvement advice"
  - label: Integration modes
    value: '3 modes'
    detail: "Direct to an OpenAI/Anthropic-compatible API, via a local CLI paired with the fakao-grader skill, or manual import of third-party reports"
  - label: Data boundary
    value: '0 questions'
    detail: "A pure tool repository: no copyrighted questions, answers, explanations or scoring points; users bring their own bank"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/fakao-shuati
---

## Problem and boundary

Essay preparation lacks a place to practice repeatedly and get graded against scoring points immediately: commercial platforms have fixed question sets and your own missed questions don't stick. This platform is self-hosted, you load your own bank, and one click after answering sends it to AI point-by-point grading. The boundary comes first: the repository is a pure tool with no questions, answers, explanations or scoring points (copyright boundary); question data must be fetched with your own lawful account on the question-bank platform; AI grading is practice reference only and differs from real grading. Deployment assumes a private service: site-wide password protection, noindex response headers, a random token for the worker API; exposing it unprotected to the public internet is not recommended.

## Mechanism

The answering page is two-column: the stem pinned on the left, an independent answer box per sub-question, autosave every 5 seconds, plus an exam-day countdown and a mock timer. Grading follows fakao-grader's scoring-point scope: the AI returns structured scores plus a Markdown review with point-by-point comparison, loss-type distribution (conclusion / basis / analysis) and an answer-versus-response diff. The mistake book derives automatically from lost scoring points and clears on a passed redo; the recitation module turns scoring points into flashcards you can mark as mastered. A stats panel shows scoring rates, scoring-point hit trends and per-subject coverage. Accounts are isolated, so sharing one server with friends works.

## Verification

- Correctness rests on smoke tests plus structural assertions: the repository ships 5 smoke tests (npm test), and the README lists coverage as question-bank loading, the auth data chain, report capture into the database, Markdown rendering, and the full end-to-end grading flow.
- The end-to-end test boots a fake OpenAI-compatible endpoint locally and walks the complete processOne grading flow, asserting the prompt actually contains the stem, scoring points and whitelist equivalents; the report's marker sections must parse, a missing section or field returns null, and finally the score lands in the database with the Markdown report on disk.
- The same suite runs in GitHub Actions CI (Node 22).
- To be clear: grading accuracy itself has no automated evaluation. Whether the AI grades well depends on subKeyWord data quality and the configured model; the README calls subKeyWord "the core of grading quality", and the disclaimer states results differ from real grading.
- In practice three channels back each other up: direct API, local CLI with the fakao-grader skill, and manual paste on the report-import page. Every path funnels into the same ingestion function, so third-party grading results can be cross-checked.

## Known failures

- Grading subjectivity has a boundary: AI grading is practice reference only and differs from real scoring (README disclaimer); a wrong characterization triggers cascading loss, and how well that verdict works depends on the quality of the scoring points' blackList entries.
- It is private by design: express single process, SQLite WAL single writer, no horizontal scaling; the server listens on 127.0.0.1 by default, built as a private site between friends. The README explicitly advises against unprotected public exposure; a public deployment needs your own reverse-proxy auth.
- Grading quality floats with the configured model: a failed task is marked failed with no automatic retry (worker claim or manual retry), each grading times out at 15 minutes, and CLI and worker modes depend on the AI CLI and skill config on that machine.
- Two data cautions: the gradings table stores only report file paths, so the data directory must move as a whole; question-bank file edits take effect immediately with no versioning; API keys live in local SQLite and the settings page echoes only the last 4 characters.
