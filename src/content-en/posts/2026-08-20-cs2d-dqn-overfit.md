---
title: "My AI learned to game the system"
description: "The tactical AI stacked together from hand-written rules hit its ceiling; after the switch to reinforcement learning, the model spent a few hundred thousand steps learning to play the demolition mode as a mindless brawl."
category: 游戏手记
tags: [游戏, 强化学习, 踩坑记]
pubDate: 2026-08-20
---

After taking the traditional hardcoded-rule AI as far as it would go, I found I had hit a ceiling.

Looking back at the code from that stretch, the tactical patches had piled up into a mountain: the playbook grew to nine tactics, alternating between hard rush, split push and fake executes each round; bots entering rooms learned to clear angles with pre-aims; grenades landed on route-timed spots; defenders knew to smoke before rotating, and even quietly checked whether the clock allowed a defuse before going for it. Each step was reasonable on its own, but in real matches the bots stayed mediocre, with win rates on the official maps glued listlessly around fifty percent.

Hand-writing rules one by one was just about spent. To make them look like they could actually play tactics, I changed the approach: hand the tactical decisions of the five attacking (T) players to reinforcement learning (DQN) to explore on its own. Shooting, movement and the other basic operations stayed under code control; the model only had to learn the core macro calls: **which site to hit, which route to take**.

## How to teach it to do the right thing

The network makes a decision every 0.3 seconds, picking one option from a set of route-and-play combinations.

Training was unstable at first; the real turning point was **finer-grained rewards and penalties**. Five players on one team means wins and losses cannot be settled as one lump sum: someone up front pulls the gunfire line, someone behind cleans up kills, the books have to be kept straight. When a defender goes down, the kill reward goes only to the teammate standing closest, adjacent ones get assist credit; plants and lost plants are scored separately too. Once the books were straight, the training loss curve visibly began to converge, and T's win rate climbed from an initial 33% all the way to 52%.

## The trick behind the 52% win rate

It did not last: the pretty 52% was soon exposed.

The defending side (CT) in the training environment still ran the old hand-written rules: two players to each of the two bomb sites, one patrolling mid, positions pinned forever at fixed depths, chasing only the movement right in front of them. Against real players, this positioning counts as unremarkable; to a neural network that had soaked in it for hundreds of thousands of steps, it was an exam sheet laid open on the desk.

Once it had the pattern down, the model never learned any clever rotations at all; it devoted itself entirely to milking the rules' loopholes to the extreme:

* **No split pushes at all:** five players stack into one blob almost every round and dive brainlessly down the same route.
* **Never touches the bomb:** even though the rules defined a "big plant reward" mechanism, the model ignored it completely. It found that five players blob-rushing and wiping out those by-the-book defending bots on the spot gave the best winning odds at lower risk. A perfectly good demolition round got played, by force, into an annihilation match.

More interesting still: testing the model checkpointed at 100k steps, its tactical variety was actually better than the final version at 200k. The longer it trained, the deeper it burrowed into the loophole. The 52% win rate it posted was, bluntly, just **total mastery of the rigid opponent in front of it**, with not one bit of team-level coordination learned.

## Force it to face human-like opponents

The only fix was to introduce adversarial pressure: **build it a constantly changing opponent library**.

I added an opponent-pool mechanism to the training pipeline. The main process keeps copies of several historically strong models at all times; every so often the best-performing weights go into the pool, and the worst-performing old versions get cut.

That way, during training the attacking side faces the traditional old-rule defense in half its rounds, and in the other half randomly draws a historical model of its own past training. On the reward side I also nudged the shaping: planting pays, and after the plant, holding it steady pays continuous positive feedback every single second, forcibly breaking its habit of preferring a firefight to planting the bomb.

## Set the metrics before you touch anything

Before restarting this training, I put the hard acceptance criteria out in the open:

* **Against the regular rule-based defense:** win rate steady above 55%.
* **Against its own historical mirrors:** win rate no lower than 48%, so it neither only wins civil wars nor gets countered by old versions.
* **Plant rate:** dragged back from near zero to at least 15%.
* **Attack routes:** the five-man single-blob single-route pattern must shrink, showing at least a basic division of labor.

This is the most interesting and most tormenting part of letting a model learn on its own: it can always hit your mathematical target in the most opportunistic way possible, while throwing your actual intent to the winds. Until the opponent pool truly proves its generalization, that loophole-earned 52% can hang in the code repository as a warning bell.
