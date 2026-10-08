---
title: "The gate rejected my own signal line"
description: "The platform has a pre-export gate requiring a signal's historical IC of at least 0.10. My own short-cycle line measured 0.0756 full-sample and 0.0461 for 2026, and the gate rejected it all the same. I did not go change the number; I demoted the line to a comparison line instead."
category: 经济观察
tags: [量化, 工程方法, 踩坑记]
pubDate: 2026-09-17
---

I run an A-share quant platform for my own use, maintained by one person plus a few AI agents. The database holds more than 5,800 A-shares and over 16 million rows of daily bars, spanning January 2000 through August 2026. The platform carries two signal chains and one factor-mining research line, auto-running on the machine every night and producing a stock-picking list for the next day when done.

Of the two chains, the mid-cycle one runs five to twenty trading days and is the only source of the live-trading list; the other, called E5, runs a short cycle of one to five trading days. One morning in September, the pipeline reached its final stage and exited with code 1. The stage failed because of the measured numbers on my E5 line: full-sample IC 0.0756, 2026 IC 0.0461 — neither reached the threshold, so the gate stopped it.

## What the gate is actually stopping

Before any export, a gate script `verify_v7.py` must pass. It runs a set of checks: whether artifacts are complete, whether the source contains look-ahead, whether the backtest net value is positive, plus an IC floor. Each check is written into a result JSON as pass or false, with one detail line attached. The IC item's detail is the most blunt — just two numbers: `full=0.0756 y2026=0.0461`.

The threshold is 0.10. The rule requires the full-sample IC and the 2026 IC to sit at or above this line at the same time before release. Both of E5's numbers are below the line, so this item fails, and the whole gate fails. The export script calls it before exporting, it is on by default, and a non-zero return prints one line refusing export, then exits.

This result does not come from any single day's jitter. A model review in August already had both numbers on record, and the gate was already failing then. Rerun in September, the numbers had not moved, and the gate still stopped it. The real problem is that this line's signal quality has been persistently low, and I had never dealt with it head-on.

## The two chains are separated

To be clear: the rejected E5 produces no live-trading signals. Since some rebalance period, the live-trading authority seat has belonged to the mid-cycle chain, with E5 stepped off to the side. The two chains are independent of each other, and an E5 export failure does not block the mid-cycle chain from producing its list.

The isolation is deliberate, and a contract test in the repository locks it in specifically: the gate is allowed to appear only in E5's export path, and the mid-cycle chain and its model scripts may not mention the gate at all. The reason for adding this test is practical — I do not want to one day casually hang the gate onto the production chain and let a comparison line's failure hold hostage the line that is actually placing bets. The same test locks one more thing: the gate can be turned off with an environment variable, but the default must be on, so that the debugging switch cannot be mistaken for the daily passage.

## I did not go fix the number

Three options were on the table: lower the threshold from 0.10 so the line just barely passes; kill the gate with the environment variable and force one export; or admit that this line's positioning has changed and demote it from live-trading authority to comparison line.

The first amounts to shortening the ruler. The second has actually happened once in the repository's history: earlier, in order to export one day's list, historical signal artifacts were cleaned out, and the gate was bypassed once via the environment variable. The episode was later written into the handover document and kept as a negative example, reminding the next person not to hollow out verification for that day's output. So this round I neither went around it nor touched the threshold.

I took the third. Now that E5 no longer produces live-trading signals, it stays in the daily schedule, keeps running, and keeps being evaluated by the gate. Its identity now is tool line and comparison line: I use it to look sideways at short-cycle signal performance, and I no longer bet on it. The rejection is written down; I did not smooth it away.

## What a rejected line is for

A gate only counts once it has actually stopped something. Whether a gate that has never rejected a single artifact since the day it was built is working as designed — nobody actually knows. My line being stopped by my own gate hands it exactly one living specimen: every time the pipeline reaches the export stage, it re-measures 0.0756 and 0.0461 and rules "fail" once more. The threshold is genuinely in effect, not a declaration in a document.

Delete the line, or delete the gate, and the red goes away. The cost is that from then on, nobody tests this threshold. A below-threshold signal line left in the schedule answers the same question for me every day: can this check still stop things.

## The gate itself once failed to speak

In the same stretch, the gate also exposed another flaw, unrelated to IC.

Around then, the backtest artifacts had been cleaned out, and the gate's old code for reading that JSON had no fallback — it threw a bare FileNotFoundError. The pipeline log that night held nothing but a traceback: which file was missing could not be seen, let alone how to regenerate it. A gate's duty is to say clearly why it refuses; that night it failed even at that.

The fix was to fold artifact reading into one unified fallback function: missing file or parse failure both get recorded as a structured failure, with the filename in the detail line and a regeneration command attached. The missing-artifact item in the result JSON now reads MISSING plus one command, no longer a bare exception. The change also carries a contract test, locking three things: missing artifacts must produce a structured failure, the refusal message must state that only the short-cycle tool line is affected, and the gate may not spread to the mid-cycle chain.

A gate that cannot explain its refusal teaches the next person it stops to go hunting for the environment variable. The converse holds too: the better a gate can explain itself, the less it gets treated as an obstacle to route around.

## The threshold does not know its author

The number 0.10 was set before I finished writing that signal line. Its measured value later fell to 0.0756, and the gate went by the numbers, leaving me no exception of any kind. The only choices I had were to raise the number, or admit that the line's positioning should change. I did not raise the number; I admitted the positioning.

The rejected line stays where it is. Its daily run record is the evidence that this gate still works.

In the same week I also ran into a quieter matter: the production chain stood stalled for six full trading days, without a sound. That one is recorded in [another post](/en/blog/2026-09-17-six-silent-trading-days/).
