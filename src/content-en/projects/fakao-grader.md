---
title: "fakao-grader: an AI grader for Chinese bar exam essay questions"
summary: "Grades bar exam essays point by point against official scoring points in an agent CLI, with structured rubrics, white/blacklists and cascading-loss chains."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-08-16
featured: true
order: 3
relatedPosts:
  - 2026-08-26-fakao-grader-agent
metrics:
  - label: Judgement method
    value: '✓ / △ / ✗'
    detail: "Three verdicts per scoring point: equivalent wording gets full credit, tangential gets half, a wrong characterization loses nothing retroactively; holistic impressions are refused"
  - label: Exam-day estimate band
    value: '±3 points'
    detail: "One of two score scopes, converted the way real graders work (set the band first, count points inside it); the AI grading variance is declared in every report"
  - label: Deterministic tests
    value: '15 cases'
    detail: "node --test covers question sampling, scoring-point parsing, white/blacklists and CLI end to end, running on every push"
  - label: v1 question-bank boundary
    value: '34 real questions'
    detail: "The local question-bank system; about a fifth of sub-questions have no structured scoring points, so the AI splits points from the reference answer itself"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/fakao-grader
---

## Problem and boundary

The pain of bar exam essay preparation: you answer, nobody grades, and you never learn where you lost points. A holistic total score is useless; losses must be located point by point against official scoring points. Boundary: this is a grading tool only and contains no questions, answers or explanations (copyright boundary); question data must be fetched with your own lawful account on the question-bank platform; it does not predict scores and does not replace official grading. AI grading varies by ±3 points, and the tool's role is a generator of loss-point lists.

## Mechanism

- The key design reuses the subKeyWord field in the question bank's export, which is itself a structured rubric: every scoring point carries its point value, a whitelist of equivalent phrasings and a blacklist of contradictions.
- extract.js turns that into a grading worksheet; the AI grades against SKILL.md rather than impression, and in practice the sum of scoring-point values matches the question's stated points exactly.
- Three verdicts: ✓ meaning-equivalent (whitelist hit, full credit), △ tangential (half), ✗ not covered or wrongly characterized (no retroactive deduction).
- Scoring points are tagged as conclusion, basis or analysis, so "recited the rule right but flipped the conclusion" is separated precisely; when a wrong characterization collapses later sub-questions, the chain of cascading losses is drawn explicitly.
- Output is two scores: scoring-point credit (the training scope) plus the exam-day estimate band.
- Stability mechanisms: built-in calibration samples anchor the strictness scale, every scoring point carries a confidence, mid/low-confidence points force a second review, and doubts resolve leniently.

## Verification

The deterministic part has tests: 15 node --test cases covering question sampling, scoring-point parsing, white/blacklists and CLI end to end, run automatically by GitHub Actions on every push. The AI part has a protocol but no numbers: a grading-consistency evaluation protocol (N=10 independent gradings; point-level agreement, total-score standard deviation, estimate-band overlap) is defined and awaits a real question bank; the repository explicitly ships no evaluation numbers it has not actually run. examples/ provides a fully fictional end-to-end example (fictional bank through report form), where worksheet extraction is deterministic script behavior reproducible in one command.

## Known failures

AI grading varies by ±3 points, declared in every report: rerunning the same grading can move the total by a band width, and point-level verdicts can flip, so the reliable part of the output is loss-point localization; the score itself is reference only. About a fifth of sub-questions lack structured scoring points and are split by the AI from the reference answer, with somewhat lower objectivity. v1 covers only the 34 real questions of the local bank; a custom-question mode (bring your own rubric) is pending. Theory-subject essay grading by keyword points is mechanical; the "set the band first" mechanism partially compensates, but human review is still recommended.
