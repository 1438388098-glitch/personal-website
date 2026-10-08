---
title: "My Chinese bar exam preparation is an AI workflow"
description: "Preparation is broken into eight stages, each handed to a tool I built: the plan check-in, the wrong-answer pipeline, statute retrieval, essay-question practice with self-checks and grading, AI evaluation, and the AI coding collaboration that built them."
type: 方法论
date: 2026-10-07
draft: false
---

## Starting point: the pain in every stage is the same

Wrong answers pile up inside an app with no way to review them, essay questions leave me guessing what score I would actually get, statutes blur because the original text will not stay in memory, and AI answers found online come with no idea how much to trust them. These pains share one shape: the stage itself is repetitive, the rules are explicit, and the data is my own. Repetition plus explicit rules means it should be a tool; the data being mine means it should stay in my hands.

## Eight stages, eight tools

The base of the loop is the plan check-in. What to study today is not scheduled by hand; it goes to [fakao-tracker](/en/projects/fakao-tracker/), which runs locally: it ships with a multi-stage preparation plan, spreads the timetable into a local database on first run, ticks off each day's four blocks of tasks as they are finished, and checks in at night; there is also an online instance now, where [phone or computer can check in directly](https://iweistoicqc5.top/daka/). Wrong answers, starting with the objective phase, go to [zhuma-fakao-review](/en/projects/zhuma-fakao-review/), which fetches them all automatically, reviews each one, and binds them into recitation notes in per-subject volumes; statutes that were memorized and then forgotten go to [statute-rag](/en/projects/statute-rag/), which returns only original text with article numbers and says so plainly when it cannot find anything — it is live now, [no installation needed, query directly](https://iweistoicqc5.top/law/), and for more precision there is a deep-rerank toggle beside the search box. For essay questions, practice lives on the self-hosted [fakao-shuati](https://github.com/1438388098-glitch/fakao-shuati). After answering, don't rush to an AI for grading: the [scoring-point self-check list for essay questions](/en/exam/checklist/) translates the grading rules into self-check items, walked through one by one across the three kinds of points — conclusion, grounds, analysis — and whatever stays unchecked is where points are lost; once the self-check is done, [fakao-grader](/en/projects/fakao-grader/) grades strictly against the official scoring points, and any verdict it is not sure of is forcibly re-examined. Whether these tools actually work is not for AI to say on its own: [cn-judbench](/en/projects/cn-judbench/) tests them first against 323 public questions. And the maker of these seven tools is the eighth stage: AI coding collaboration such as Claude Code.

## Four principles

One, model output counts only as a first draft; official rules and human judgment have the final word. Two, when retrieval finds nothing, refuse to answer — never fabricate. Three, the AI takes the exam before it goes on duty: scoring standards are published in advance, and grading follows the standard machine. Four, learning data stays on this machine; leaving for the network happens in only two places, scoring and note generation.

## Does this count as the right way to prepare

I don't know; I am a sample of one. But the outputs can be checked: the wrong-answer pipeline's measured scale (18 subjects, 41 units, about 9 minutes a round), the check-in plan's timetable scale, the self-check list's item scope, the grader's verdict criteria and estimated score bands, retrieval's hit rate — all of it written into the corresponding project pages, one click away, item by item for reconciliation. The Chinese bar exam has not been sat yet, but the tools have already turned my review process into a string of checkable numbers.
