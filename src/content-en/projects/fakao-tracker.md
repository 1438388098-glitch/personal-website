---
title: "fakao-tracker: bar exam study check-ins"
summary: "A local-first Flask app for bar exam prep: ships the 2026 multi-stage plan, lays out four daily blocks; check-ins and backups stay local."
group: 法律工具
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-09-29
featured: false
order: 2
metrics:
  - label: Plan stages
    value: '4+ stages'
    detail: "Stage one is 45 days of lecture videos; real-question plus recitation, sprint, exam day and essay stages schedule themselves afterwards"
  - label: Daily blocks
    value: '4 blocks'
    detail: "Morning video notes, afternoon videos plus real questions, evening real questions, and a nightly review, each with its effective-duration note"
  - label: Data boundary
    value: 'fully local'
    detail: "First run auto-creates the database (SQLite) and seeds the schedule; check-ins and backups upload nowhere"
links:
  - label: Live instance
    url: https://iweistoicqc5.top/daka/
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/fakao-tracker
---

## Problem and boundary

The execution problem of exam prep is not material; it is that nobody schedules what to study today. This tool ships a multi-stage bar exam plan and, on first run, spreads the whole schedule into local SQLite by date; from then on each day opens onto that day's four blocks, you tick them off, and check in at night. Boundary: the repository holds no personal study data (the data directory is in .gitignore); to change the plan you edit the seed script and delete the database, which regenerates on restart, a local tool in the "data ships with it" school. Users with no Python environment download and double-click the launcher; dependencies install automatically.

## Mechanism

The dashboard shows the day in four blocks (morning / afternoon / evening plus review), each with its raw duration and an effective-duration suggestion (video at 1.5 to 2x); if you run ahead or behind, shift buttons move the whole plan. One-click backup into data/backups, dark mode included. Since 2026-10-07 there is also an online instance for the site owner's own use (the [/daka/](https://iweistoicqc5.top/daka/) subsite), running on the owner's server; check-in data lands in that machine's local SQLite, and the design boundary is unchanged.

## Verification

The repository has no automated tests; correctness rests on the determinism of seeding and self-check numbers on the pages.

- The schedule is generated deterministically by seed.py: 8 subjects; the 45-day lecture stage slices morning, afternoon and evening tasks per day from gen_excel_v3's per-subject data, with the start date settable by the FAKAO_START_DATE environment variable so the whole table shifts; later stages pin to fixed offsets (real questions plus recitation from day 45, a 12-day sprint from day 86, the objective exam on day 98 as two consecutive days including a spare day, 4 essay subjects at 7 days each plus a 6-day wrap-up, the essay exam on day 134).
- After first run you can verify by hand: the schedule page groups everything by stage, month and week; the history page computes a "plan adherence rate", check-ins inside planned dates divided by days you should have studied so far (rest days excluded).
- Check-ins are idempotent: resubmitting the same day updates the original record and returns a repeated flag; an undo endpoint exists.
- The backup button writes two files into data/backups: all check-ins as CSV (utf-8-sig, opens directly in Excel) plus a full copy of the SQLite file, auto-pruned to the latest 20 (10 CSVs and 10 database copies); a database copy is itself a complete, restorable database.

## Known failures

- One person, one machine: no accounts; check-ins book against the machine's local date, and data and backups never leave the machine (the README says plainly that nothing uploads). Switching devices means switching databases; there is no sync.
- Changing the plan means deleting the database: the only way to adjust the schedule is editing the seed script and deleting data/fakao.db to rebuild, which voids old check-in history; there is no migration path.
- The second half of the plan is hardcoded: only the lecture stage comes from per-subject data day by day; real-questions-plus-recitation, sprint and essay stages are written into seed.py as fixed text blocks (the source comments label them "simplified") with study durations filled at a uniform 420 or 480 minutes. Worse, the real-questions-plus-recitation block's schedule entries sum to 30 days while the comment says about 41 days; the two do not match.
- Zero tests: the repository has no test files; first-run verification is a manual pass through every page.
