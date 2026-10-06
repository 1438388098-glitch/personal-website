---
title: "CS2D: top-down Counter-Strike"
summary: "A from-scratch HTML5 top-down 5v5 tactical shooter: defusal on A/B sites with the CS2 economy, grenades, AI bots, multiple maps and cameras, plus career, ranked and esports-manager modes. Zero dependencies, ES Modules."
group: 实验
date: 2026-08-10
featured: false
order: 1
relatedPosts:
  - 2026-08-18-cs2d-atrium-balance
  - 2026-08-20-cs2d-dqn-overfit
disclaimer: A personal game project, for study and exchange only.
metrics:
  - label: Economy
    value: 'CS2 rules'
    detail: "$800 start, $16,000 cap, half-time reset; kill / round-win / loss-bonus compensation aligned with CS2, death clears equipment but keeps money"
  - label: ADR cadence
    value: '5 ADRs + 16 batches'
    detail: "Key decisions recorded in 5 architecture decision records; new gameplay landed in 16 autonomous iteration batches under gates"
  - label: Modes
    value: '8+'
    detail: "Defusal, Major tournament, battle royale, roguelike dungeon, boss fights, career, ranked (MMR ladder), 1v1, esports manager"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/CS2D
---

## Problem and boundary

The question: can a tactically complete shooter with real game feel be built with browser technology alone, no game engine? This CS2D is written from zero in ES Modules: switchable top-down and follow cameras, an economy implementing CS2's rules (kill rewards by weapon tier, team-scaled loss bonuses, equipment cleared on death), and AI bots providing a sparring ladder. Boundary: pure 2D top-down; the first-person and 3D renders were retired and archived; zero dependencies means rendering, pathfinding and netcode are all handwritten, and low-end devices drop render resolution automatically to hold framerate.

## Mechanism

The match layer carries full competitive detail: a crosshair that changes with weapon and state, hit-stop with damage numbers and headshot callouts, smooth AWP scoping with lens sway, C4 and round countdowns, and automatic top-down spectating on death. The follow camera does weighty acceleration, adjustable sensitivity and a "reduce camera motion" option for motion sickness, honoring prefers-reduced-motion-style considerations. Among the fun modes the esports manager is the deepest: run a five-person squad (transfers, training, finances, owner pressure), watch matches live with the game AI, and use a built-in HLTV-style rating system (per-match scores, event MVPs, annual Top 20) on a timeline of advancing dates and monthly paydays. Development discipline rests on the CONTRIBUTING iron rules, ADRs in docs/, and a playtest acceptance document per batch.

## Verification

Three local gates run before every commit: full-file syntax checks, an architecture-cycle guard (circular dependencies in new modules are refused outright), and the homegrown test runner over the full suite (CHANGELOG counts 217+ files). After push, CI runs check, arch, test and a training smoke. New gameplay landed through exactly these gates in 16 autonomous batches. The tests' foundation is the deterministic simulation contract (ADR-0005): game logic may not call Math.random; all randomness flows through the seed-driven ctx.rand, so double runs on the same seed support fingerprint regression, and effects decompose into pure spec functions for assertions.

AI and balance each have an evaluation line.

- Evolutionary training uses a genetic algorithm (16 genomes per population; fitness weighted over round wins, defuses, kills and survival). Acceptance demands both a monotone training curve and large-sample win rates over 96 rounds: stage S1 validated convergence direction over 768 games (fitness rising from 29 to 101), and H11 evolved from zero for 24 generations to a 55% win rate against the normal baseline; every rung's measured result from H1 to H11 is recorded in train/README.
- Balance uses map-balance.mjs, sampling full 5v5 bot matches per map; a T win rate outside the 30% to 70% sane band flags imbalance (non-zero process exit). LAN results upload to logs/matches.jsonl for match-stats.mjs to aggregate, plus multi-map, multi-difficulty soak tests and a CDP live 60fps smoke.

Automation cannot test feel, so docs/PLAYTEST.md defines a 10-minute manual smoke checklist; each batch merges only after running it.

## Known failures

AI has a hard ceiling: DQN does not converge in this environment (13-dimensional continuous state, 6 macro actions, long-horizon sparse rewards; at γ=0.95 the win reward never propagates back to the start, and 0.995 makes TD variance explode). The dqn-fresh experiment is falsified and kept only as a control; the parameter-level genetic algorithm is the working engine. Fixed-rule opponents also let the network overfit at 200k steps, win rate sliding from a 52% peak to 48%; a self-play opponent pool is still planned.

- Evaluation itself stepped on a rake: early fitness seeds differed by only 1 between individuals, so the population memorized those 6 maps to perfection (fitness 99.7, all wins), while a fresh-seed test measured only a 17% win rate. That lesson is now an acceptance iron rule.
- Balance has a public failure: atrium's T win rate hovered around 80%, outside the sane band, and 5 rounds of structural tuning (site shifts, delayed walls, wider doors, spawn moves to mid) all failed and reverted; the spawn change dropped the plant rate from 89% to 55% without moving the T win rate, and CT lost face-to-face fights 17 to 60. The bottleneck is the interaction between the bot aim AI and that map's structure, falsified in ADR-0004. forge (62% to 71%) and harbor (71%) sit in the borderline-T zone and get no data-blind tuning per the same ADR.
- Measured hell-ladder win rates are non-monotone: H8 (48%) lands below H4 through H7. The 100-million-game training plan has completed only S1's 768 games; S2 through S4 have not started.
- Automated tests cannot catch "looks wrong": the two worst visual bugs in history (a flashbang whiting out the screen from the player's own view, and illegal particle colors silently ignored by canvas) were both caught by human eyes in playtests.
- One known quirk: metro's sampling reports a 111% plant rate, a double count in simulate.js at overtime and reset boundaries, unrelated to balance.
