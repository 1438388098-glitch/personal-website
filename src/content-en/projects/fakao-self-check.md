---
title: "fakao-self-check: a scoring-point checklist for bar exam essays"
summary: "A static page turning AI grading rules into 54 self-check items: walk the conclusion, authority and analysis points; ticks stay local."
group: 法律工具
disclaimer: A personal study aid; it is not the official scoring standard.
date: 2026-10-07
featured: false
order: 5
metrics:
  - label: Checklist size
    value: '54 items'
    detail: "General answering rules plus six subjects in 17 groups, each group covering one common way to lose points"
  - label: Grading method
    value: 'three point types'
    detail: "Conclusion, authority and analysis points, reusing fakao-grader's scoring design of full marks, half marks and no deduction"
  - label: Data boundary
    value: 'fully local'
    detail: "Tick progress lives in browser localStorage; no account, no server, one-click clear"
links:
  - label: Use it online
    url: https://iweistoicqc5.top/exam/checklist/
---

## Problem and boundary

AI grading (fakao-grader) is strict, but running an agent over every question is heavy, and the score only arrives after the fact, so it never trains the exam-day move of grading yourself first. This checklist translates the grading rules into self-check items: after finishing a question and before submitting it for grading, walk the conclusion, authority and analysis points one by one; whatever stays unticked is a likely place to lose points. Boundary: the content is a hand-organized study method, with no real question text, no scoring data from any question bank, and no specific article numbers, you write those yourself in the answer; tick progress stays in the local browser and uploads nowhere.

## Mechanism

A static page (/exam/checklist/), no backend. The data has a single source in src/data/self-check.ts: general answering rules plus criminal law, criminal procedure, the integrated civil and commercial paper, administrative law, commercial law and theory of law, 17 groups and 54 items in all; both the page and the exam tab card derive their numbers from SELF_CHECK_AGG rather than hardcoding them. Ticks are keyed by item id in localStorage (key fakao-self-check:v1); progress counts sit at the top and beside each group title, with one-click clear and printing (printing hides the toolbar and keeps subjects from breaking across pages). The three point types follow the grading rules: conclusion points score independently, authority points score on the key content without requiring an article number, and analysis points that give only a conclusion count as half.

## Verification

Data integrity is locked by a vitest suite (src/data/self-check.test.ts): aggregate counts match a real traversal, ids are globally unique (a localStorage key collision would silently overwrite one item with another), text is non-empty and free of leading or trailing whitespace, and one content red line, no item may contain a specific article number of the "Article N" form. The size golden sample (7 subjects, 17 groups, 54 items) is locked together with the project page metrics, so changing content means changing both places.

## Known failures

- Tick state is restored by JS, so there is a moment before the script loads where every item shows as unticked.
- The content is an organized method, not the official scoring standard; for real questions the scoring points follow the officially published answers, and the checklist only reminds you which kind of points to write.
- The checklist does not update itself when new exams appear; changing content means editing the data module and syncing the test golden sample and the project page numbers.
- The static page is not in the site search index (the index only collects content collections).
