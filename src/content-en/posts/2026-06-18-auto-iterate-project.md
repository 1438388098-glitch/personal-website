---
title: "Letting an Agent refactor code overnight: every way it dies"
description: "An engineering practice for driving an Agent to iterate a Git project autonomously: candidate-pool ranking, multi-level verification, hard budgets, and the pits I stepped in."
category: 工程方法论
tags: [Agent, 自动化, 工程方法]
pubDate: 2026-06-18
---

"Go keep optimizing this repository."

Broad tasks handed to an AI Agent sound wonderful, but in engineering practice the deaths are remarkably consistent. Either the model works ten minutes and declares "I have read everything and found nothing obviously in need of change", then idles in place until the session times out; or it turns reckless, changes things wholesale with no verification, and when you open the laptop the next morning the entire Git repository's code has long been refactored into paralysis.

To let an Agent actually run autonomous iteration stably through the night, I wrote `auto-iterate-project`. Within a single session it takes over a Git repository: survey the project's current state, pick out high-value problems, code in small steps, run verification, commit, keep the books — round after round until the goal is met or the resources run out.

The core of making this pipeline work is turning the four kinds of "death" I had already stepped into hard engineering defenses.

## Death one: idling in place, claiming there is no work to do

Often the model wants to work but its context has emptied and it does not know what comes next, so it just keeps re-running `git status`.

We built the scheduling protocol as three-layer drive:

* **Supply layer (Mine):** seven built-in scanners — test coverage blind spots, high-frequency change hotspots, deprecated symbols never exported, documentation drifting from implementation, and more — every scan turns static code facts into concrete improvement candidates. When the Agent is lost, its first move must be to dig for candidate tasks; improvising out of thin air is forbidden.
* **Command layer (Check):** the state machine returns exactly one clear instruction per round (start work, mine, deep-dive and expand, halt), so the loop's pointer always has a definite next step.
* **Dynamic quota ranking:** early versions ranked by "value/effort", and the model farm-scored cheap, boring chores — typo fixes, added comments; now there is an expected-yield estimate, per-type task quotas (at most two tasks of the same type per round), and a minimum value bar, forcing it at the hard bones.

## Death two: changing without running tests, committing on blind confidence

To keep the model from refactoring the code into ruin, the pipeline makes verification a breathing rhythm:

Every candidate change must stand as its own chapter. Between rounds only lightweight syntax and static type checks run (smoke); before a commit and at wrap-up, the full test suite runs by force. Once a test fails, priority goes to in-place repair; past the repair retry limit, the round is marked blocked outright; two consecutive blocks and the whole autonomous run trips its own breaker to survive.

We even guard against the "false green": sometimes a test command, mishandled through Bash pipes, still exits 0 at the end even though cases failed, and the Agent believes all is green and keeps running. The constraint now requires proving, before entering the loop, that your check script really does report a non-zero error when fed bad code.

## Death three: declaring "mission accomplished" with no evidence

The v1.6.0 release notes record one embarrassing incident: with five hours still left before the set deadline, an autonomous iteration suddenly threw out "the backlog is fully cleared" and knocked off early, without so much as a blush.

Leaving the right to declare "done" to the model is unreliable; it must be made a hard gate at the code level: while the set termination conditions are unmet, or ready candidates remain in the task pool, or the scanners are not yet exhausted (exhaustion means two consecutive scans with zero new findings), the system simply refuses to exit; when the model claims "such-and-such goal is complete", it must return the corresponding verification round number and Diff evidence, otherwise the claim is dismissed wholesale — no gap left for slacking.

## Death four: no hard budget, the death loop runs away

Under automated guarding, a run without an exit condition is absolutely forbidden to start. We draw the boundary on four dimensions: max rounds, relative timeout, a token soft-budget ceiling, and absolute system time (say, pinned hard to "off shift before 08:00 tomorrow morning").

Budget control has pits of its own. An early version once had a `NaN` passed into `--max-minutes`, the floating-point comparison held forever, and the loop would not stop; when a deep-dive expansion's sub-Agents had their costs left uncollected, they could punch straight through the main process's token budget; now time validation, multi-wave caps, and token bookkeeping on a monotonic water level all carry production-grade safeguards underneath.

This engineering logic finally passed its own bootstrap test: version 1.6.0 of `auto-iterate-project` itself was produced by leaving this exact system running overnight for 20 rounds of self-iteration. Soldering the rules into the pipeline is what turns an AI from an unreliable luck-dependent toy into a dependable night-shift buddy.
