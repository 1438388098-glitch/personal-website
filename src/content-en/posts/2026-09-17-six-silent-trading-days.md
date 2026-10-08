---
title: "Six trading days of silent standstill in the production pipeline"
description: "On September 7 I manually disabled the nightly production task and lent the machine to mining. The production pipeline then went six trading days without an update and without an error. A heartbeat hung on the very chain it watches is no heartbeat at all."
category: 经济观察
tags: [量化, 数据工程, 自动化, 踩坑记]
pubDate: 2026-09-17
---

On September 7, I gave the machine's night slot to a factor-mining sprint. The move was simple: manually disable the 05:00 nightly production task and let the heavy job own memory and CPU exclusively. The mining pipeline ran as usual and produced results every night.

Only six trading days later did I discover that the production pipeline had not updated since September 4. The quote cache, the stock pool, the downstream trimmed cache — the latest date on all three was stuck at September 4. No errors, no alerts; the state files were simply old. I found the standstill only by laying the two pipelines' artifact dates side by side and comparing them by hand.

## Why a standstill can be silent

A scheduled task being disabled is a different thing from failing. The task never starts, so it never throws an exception, never returns a nonzero exit code, never writes a log. Every state file in the production pipeline is written only after a run finishes; when the pipeline does not run, nobody writes state. The next morning you look and see a blank, and a blank triggers no alert.

A crash at least leaves a traceback line, a place to look. A disabled task leaves a quiet log directory that looks as if this week simply had nothing going on.

## The heartbeat was written on the very chain it watches

There was a heartbeat check, and the problem was where it lived: inside the master orchestrator, which is exactly the thing the scheduled task invokes. What it checked was "did the production pipeline run last night". Once the task is disabled, that code never executes at all.

It is a self-referential loop. The check only runs on the premise that the chain being checked has already run; it can confirm the chain is running and can never confirm the chain is not. The fault it wants to report is precisely the condition that keeps it from running.

## Move the check onto another pipeline's tail

The first fix hung the health check on the tail of the mining pipeline. The mining pipeline ran every night during the sprint, so a production stall would be caught the same evening. The check is direct: read the timestamp of the newest production log, read the latest trading day in the quote cache, and alert when nothing has moved for more than forty-eight hours.

Alongside it I wrote a rule I must follow whenever I lend the machine out: for an intentional pause, drop a pause marker into the log directory first, stating the reason. When the check reads that marker, it downgrades the same "too long without updates" finding to a notice instead of an alert. If I lent the machine out on purpose, it should not count as a failure. The marker is itself a record: later I can trace which stalls were planned.

The hook is fail-open: whatever goes wrong inside it, it only prints; it never touches the mining pipeline's exit code, and it never lets a guardian's own bug drag down the pipeline actually doing the work that night.

## Piggybacking on another pipeline is still not enough

The first fix handled my particular incident, but it still lives parasitically on one pipeline. If someday the mining pipeline stops too — the machine powers off, the disk fills up — the hook will not run either, and a production stall goes back to being known by no one.

Later I added an independent layer: a read-only caretaker script that runs every two hours, checking the newest production log time, the latest trading day in the quote cache, the freshness of each state file, and whether any alert failed to deliver. Its rule: look and report only, never start any pipeline. With three layers of care laid side by side, the shared premise is finally dismantled: the first two layers must themselves be running; the third depends on no business chain at all.

One more layer sits further out, watching the scheduled task itself. It runs no pipeline and asks only two questions: is the task disabled, and are the artifacts stale. Either one wrong and it alerts with a nonzero exit code. This layer came later, because after the first fix the same task got disabled once more, the piggybacked fallback failed along with it, and two days passed without a single signal. As long as a check still hangs on the object it monitors, it stops together with that object.

## Another silent pit in the same week

During those stalled days a related bug surfaced, same in nature: a conditional quietly canceling work that was supposed to happen.

Every morning the production pipeline computes a target trading day and compares it against the newest date in the cache, backfilling when behind. The old code skipped the entire fetch whenever the target day fell on a weekend. The catch is that the target day is computed as the previous day: run early Monday morning and the target is Sunday; run a manual backfill during the day and it computes Sunday again. So every backfill initiated on a Monday was silently canceled on the grounds that "the target day is a weekend", and the data never came back.

The fix rolls the target day back to the nearest weekday and leaves "fetch or not" to a single judgment: whether the cache's newest date lags the target. Weekends and holidays no longer cancel the action on their own; a holiday simply has no new data, so the cache date naturally stays put. The change ships with regression tests covering a Sunday that crosses a month boundary and the early-Monday scenario, plus one locked invariant: the rolled-back date always lands on Monday through Friday.

## The default shape of this class of failure

For a scheduled data pipeline, the default failure mode is silence. A task someone watches, one that crashes in front of people, gets found fast; a task that is disabled, skipped, or quietly vetoed by a conditional just looks like a few quiet days. The first kind leaves clues; the second leaves nothing.

An even easier point to miss: most monitoring answers "did this run succeed", while what I needed answered was "is it still running". The answers to those two questions do not live in the same place. For the answer to be reliable, the check cannot live on the very chain it monitors.

After the stall ended I went back through those days' logs, and the last production log happens to stop at an export rejected by the gate, its traceback vague about what exactly was missing. That incident is recorded in [another post](/en/blog/2026-09-17-gate-rejected-my-signal-line/).
