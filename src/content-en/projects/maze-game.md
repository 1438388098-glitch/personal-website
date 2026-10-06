---
title: "maze-game: maze generation and pathfinding, gamified"
summary: "A minimal keyboard-only 2D maze game: Growing Tree parameterized generation plus MCMC simulated-annealing topology tuning, seven quality metrics, six difficulties, six modes, two engines, zero dependencies, zero build."
group: 实验
date: 2026-09-28
featured: false
order: 2
disclaimer: A personal game project, for study and exchange only.
metrics:
  - label: Generation algorithm
    value: 'α ∈ [0,1]'
    detail: "Growing Tree blends DFS (long corridors, high winding) and Prim (branchy, low winding) continuously; each difficulty pins its own α"
  - label: Tuning method
    value: 'MCMC'
    detail: "Metropolis-Hastings local wall flips plus simulated annealing (temperature 0.3 → 0.01), replacing random retry"
  - label: Quality metrics
    value: '7'
    detail: "Winding factor, dead-end rate, dead-end depth, branching factor, decision entropy, fractal dimension, loop count"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/maze-game
---

## Problem and boundary

Most maze games only care about "generating a playable grid"; maze quality carries no numbers. This project turns the generation algorithm into something quantitatively evaluable: the α parameter tunes topology continuously, MCMC fine-tunes against a weighted loss over seven metrics, and every maze's quality can be stated in numbers like winding factor and dead-end rate. Boundary: pure 2D planar mazes, no 3D; the algorithms serve teaching and game feel, not computational optimality.

## Mechanism

Six difficulties (15×15 to 100×100, with fake trunk corridors at hell and above) pair with six modes: standard, torch (forced fog with ring vision), treasure (collect gems to unlock the exit), blackout (no map memory), collapse (the maze crumbles behind you, no way back), ghost (race your own best path). The generator offers standard v1 or experimental v2. Scoring normalizes time by speed tier with per-mode multipliers; Splitmix32 deterministic seeds guarantee same-seed-same-maze, supporting daily challenges and seed sharing. Finishing auto-checks 14 achievements; trails, fog, ghost paths, hints and backtrack are standard-mode assist layers. Canvas 2D rendering plus Web Audio effects; scores and preferences in localStorage; drop it on any static server and it runs.

## Verification

Each of the seven metrics has a mathematical definition: winding factor is solution path length over the Manhattan distance between start and exit; dead-end rate is dead-end cells over total corridor cells; decision entropy sums log₂(branch count) at each junction and spreads it across the map; fractal dimension uses box counting on the grid. Every maze is scored against its difficulty's target range at generation time: the minimal tier requires winding 1.0 to 2.2 and dead-end rate 20% to 45%; the hell tier 2.0 to 6.0 and 28% to 60%; out-of-range counts toward the loss. MCMC uses this loss as its energy function for light tuning: each step flips one random wall while preserving connectivity, accepts per the Metropolis criterion, anneals from 0.3 to 0.01 exponentially, with iterations around 1.5% of cell count (about 30 flips for the hell tier at 45×45). Splitmix32 makes evaluation reproducible: the engine-comparison report in the repository's paper directory pins seed #10001 and lists both generators' metrics side by side across the four difficulties from minimal to hell (minimal tier: v1 dead-end rate 9.3%, decision entropy 1.209; v2: 16.0% and 1.071). An in-game "maze metrics" panel shows the current maze's numbers live, and the history page charts scores, times and efficiency in three line graphs. The repository has no automated tests: generation quality rests on fixed-seed reproduction plus manual checks against the metrics panel, and the rest on play regressions.

## Known failures

The browser-compatibility floor is 2020: ES Modules need native support, older browsers cannot open it; the flip side of zero build is that all three official launchers (start.bat, python, node) start a local HTTP server, so double-clicking the HTML file does not work. Data lives only in localStorage: scores, leaderboards, achievements and preferences never leave the browser; no accounts, no cloud sync, and a device switch or cache clear resets to zero. The README lags the code: it still says four difficulties, four modes and a single engine, while the repository's actual code has six difficulties, six modes and an engine switch; the README's project-structure list also omits maze-gen-v2.js, charts.js and history-ui.js. The experimental engine has not proven dominant: the comparison report shows wins and losses against v1 (normal tier winding 2.29 vs 3.46 in v2's favor, dead-end rate 20.2% vs 10.1% against), so both engines ship and the player chooses. MCMC tuning is one light pass: the code comments call it a "light optimization pass", the hell tier runs about 30 iterations, and the mathematical guarantee of a stationary distribution does not mean any single maze reaches a global optimum.
