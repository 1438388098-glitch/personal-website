---
title: "auto-iterate-project: an autonomous project-iteration workflow"
summary: "Iterates any git project autonomously in an agent session: evidence-backed candidates, value-ranked, small verified steps, budgets and hard-stop gates."
group: 工程侧证
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-05-06
featured: false
order: 1
relatedPosts:
  - 2026-06-18-auto-iterate-project
metrics:
  - label: Test scale
    value: '~190 cases'
    detail: "Pure-stdlib helper tests; CI covers Python 3.8 and 3.13 × Ubuntu and Windows"
  - label: Evidence scanners
    value: '7'
    detail: "Markers, swallowed exceptions, syntax errors, test gaps, hotspots, dead exports, doc drift; judgment-based expansion is second wave only"
  - label: Bootstrap validation
    value: '20 rounds'
    detail: "Version 1.6.0 was produced by letting it iterate overnight on its own repository, self-hosted"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/auto-iterate-project
---

## Problem and boundary

Telling an agent to "keep improving this project" usually dies one of two ways: idling and claiming there is nothing to do, or spinning without verification. This skill makes the loop deterministic: visible backlog, per-candidate verification, batched commits, hard early-stop gates, and an anti-idling contract. Boundary: git is the only external dependency; it never rewrites history, never pushes by default, refuses to absorb the user's own uncommitted changes into its commits, and a secret-pattern scan runs on every staged diff. The four budget dimensions (rounds, minutes, tokens, absolute deadline) can change mid-run.

## Mechanism

One round, five steps:

- check (deterministic stop conditions and budget);
- mine (seven scanners turn repository facts into evidence-backed candidates; judgment-based deep expansion rotates through 16 lenses and never runs first wave);
- rank (scoring by expected value per round, with diversity quotas, a value floor, dependency unlocking and a transparent score breakdown);
- implement → verify → commit (each candidate is an independent unit; full verification is mandatory before commit);
- record (round history, token ledger, a stage report every 10 rounds, a closing retrospective).

State lives in the .autopilot directory, restorable and portable, with one generation of backup on every write; the "all goals met" stop condition refuses to fire while any goal is unverified, and finish is rejected when real work is outstanding. A 127.0.0.1 read-only observation panel comes along: every round's cards beside the evolution tree, replayable.

## Verification

The object under test is the deterministic helper: scripts/autopilot_state.py, Python 3.6+, stdlib only; every decision in the loop lands on disk through it. The suite is about 190 cases by the README's count and 209 test methods by the suite's own counting expression; CI runs the full suite on four combinations (Python 3.8 and 3.13, Ubuntu and Windows), plus a --smoke quick pass that finishes a mock round loop in about 15 seconds depending on the machine.

- The suite carries a meta-guard case: the number of collected cases must equal the number defined in source, or the build fails. The origin: two test classes once shared a name, the second silently shadowed the first, and 14 cases never ran while the suite stayed green.
- The security paths have a paper trail: secret scanning covers AWS, private keys, GitHub, Slack, Google, sk-* and JWT patterns; the sk-proj- and sk-ant- forms once slipped through, and after the fix 8 pattern-parameterized tests were added. config.json writes carry a SHA-256 fingerprint and check warns when tampered.
- The project ran a six-dimension self-review (U-01 to U-49) with fix records stating how each batch was verified: full tests plus manual end-to-end scenarios (init, backlog, begin, commit, complete, check, finish, plus secret redaction and path guards), on a then-green baseline of 155 cases; the review also added the previously missing CI.
- Version 1.6.0 came out of letting it iterate on its own repository overnight.

## Known failures

- The token budget is an estimate: computed from diffs at 500 per round, 12 per text line, 100 per binary file, not actual LLM usage.
- Deep Expansion's subagent cost happens in sub-sessions, invisible to diffs, so max_expansion_waves exists as a cap guard; the docs say plainly that without a cap a single run can blow through every configured budget while check still reports healthy. The panel's token stats are likewise a "change-equivalent" proxy.
- The verification gate has one documented blind spot: if check_commands pipes output through tail, head or grep, the exit code comes from the pipeline's last element (always 0), so a fully failing test reports green; the troubleshooting guide asks users to break a test on purpose to prove the gate actually works.
- Judgment-based expansion depends on the host runtime providing subagent tools; without them it degrades to serial in-process per-lens work, at reduced capability.
- The six-dimension review left 20 P3 todos, handled opportunistically "when touching the file" rather than as standalone work items.
