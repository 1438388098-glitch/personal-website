---
title: "How the map-tuning route got falsified"
description: "Attack-side win rate on atrium spiked past 80%, and five versions of map changes did nothing. In the end the disease turned out not to live in the map at all."
category: 游戏手记
tags: [游戏, 工程方法]
pubDate: 2026-08-18
---

A while back I was running the routine bot-vs-bot tests on my CS2D project, three 5v5 games per map. When it came to `atrium`, one number jumped out and made my heart skip: the attackers' (T) win rate had shot up to 83%. By the standard I set — anything between 30% and 70% counts as reasonable — 83% was badly out of balance.

To rule out luck, I let it run 12 more games, and the result was stable: T's win rate sat at 80% to 81%, and the bomb-plant rate ran as high as 76% to 85%. The map was systematically favoring the attackers.

When map makers hit this kind of problem, the reflex is always to touch the terrain: nudge the bomb sites, narrow the corridors, adjust the spawn distance to the sites. I did exactly that, tried five versions of changes in total, and every one came to nothing. The whole ordeal ended up as a pure record of walking the wrong path.

## Five experiments that skewed it further

The changes stacked step by step, each one a small tweak on the previous version:

First I moved both the A and B bomb sites a few tiles toward the defenders' (CT) side; seeing no improvement, I narrowed the west entrance of A from five tiles to three and added a dogleg wall in the descending corridor to block sightlines and slow the pace; then, judging the dogleg wall a mistake, I removed it and tested the narrowed entrance alone; next I widened the CT route to B; and finally I went all the way and moved the CT spawn straight to the mid lobby so they could reach the scene faster.

The data, however, did not move at all. Across five rounds, T's win rate kept circling between 81% and 92%, and the dogleg-wall version even spiked to 92% — the completely wrong direction. After the full detour, I had to revert every map change.

## The key clue: they arrive, but they lose the fight

The turnaround was hiding in exactly that spawn-move change.

After moving the CT spawn forward, the plant rate fell straight from the previous version's 89% to 55%. The time gap had genuinely been closed: CT could reliably get set up ahead of T, and the rounds where T sneaked a plant dropped by more than half.

The strange part: T's overall win rate was still as high as 92%.

The reason is brutal: CT arrived on time, but the moment a head-on firefight started, the kill ratio between the sides (CT to T) was 17 to 60 — on contact, CT died almost instantly.

That comparison yanked the root cause into the open: **the defense can get there, but cannot win the fight.**

The problem is a conflict between the sightline structure and the bots' combat logic. `atrium` has extremely long sightlines with far too little cover to lean on along the way. In head-on fights across long corridors and open ground, a grouped-up attacking push wins by nature, exposing the site-holding bots' raw aim weakness completely. No amount of moving two walls or changing a door width patches that.

## Moving the weight onto the AI

Once that clicked, I decided to stop all blind map micro-tuning, roll back every change, and hand the problem to the bots' logic layer.

The effort after that went into repairing the defending bots' angle-holding and target-acquisition logic: better reaction behavior at long sightlines, plus coordinated crossfire judgment between defenders. By mid-September, with this cooperative-defense logic merged at the code level, the map itself was untouched, and both sides' attack-defense win rates came back inside the balance band on their own.

## Don't get fooled by small samples

The postmortem left one side lesson: **hand-run tests of a few games at a time carry enormous random error.**

When the imbalance first surfaced, each map ran only 3 games — 83% was fine as an alarm signal — but when evaluating specific changes, 81% and 92% look far apart while inside a small sample both sit within normal noise. Conclude hastily from that, and you take noise for progress.

There is no shortcut to balance: run enough games for the numbers to mean something, then judge. That lesson is now carved into the project's process for real.
