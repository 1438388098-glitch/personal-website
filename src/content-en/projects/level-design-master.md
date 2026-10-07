---
title: "level-design-master: an AI skill for level design"
summary: "An AI skill for 2D platformer and metroidvania design: 15 knowledge docs, five workflow stages, 20 critique gates, three-persona simulation."
group: 实验
date: 2026-08-11
featured: false
order: 4
disclaimer: A personal skill project, for study and exchange only.
metrics:
  - label: Knowledge base
    value: '15 documents'
    detail: "61 named design philosophies, 57 anti-pattern red lines, 10 spatial-pattern cards, conversion tables from movement physics to reachability envelopes"
  - label: Critique gates
    value: '20 checks'
    detail: "Any failure enters a revision round; plus simulation reports from three personas (novice, speedrunner, explorer)"
  - label: Hard validators
    value: 'stdlib only'
    detail: "Connectivity and ability-gate locks, reward reachability, beat-sheet numeric assertions; Python 3.6+, zero dependencies"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/level-design-master
---

## Problem and boundary

LLM-generated levels have three chronic defects: jump distances exceeding the parameter table, unreachable exits, rewards buried in walls; one-shot finalization with no iteration; and claiming "this level has rhythm" without producing a beat sheet. This skill plugs all three with hard validators, critique gates and forced iteration: the LLM reasons at the structure layer, spacing and thresholds must be derivable from the movement parameter table, and every number carries an evidence grade. Boundary: 2D platformer and metroidvania; 3D levels are out of scope.

## Mechanism

Levels use a five-layer representation language: meta (constraints), graph (reasoning), grid (rendering), markers (guidance) and beat (rhythm). The beat sheet is a first-class citizen; the rhythm skeleton is written before geometry and enemies. The workflow has five stages: requirement parsing locks the movement parameter table (geometry is never generated without it), paper design (direct coordinate generation forbidden), white-box generation as pure JSON, a triple-checked critique gate, and a revision loop changing only 1 to 3 variables per round with a hard stop. Review mode accepts an existing level.json, runs the gates and reports; only the word "improve" enters a revision round.

## Verification

Verification comes in four layers, all on the record in the repository. First, validator self-tests: all three validators support --self-test, passing 3/3 before delivery; the sample level world1-1 (a white-box replica of SMB 1-1's teaching structure) passes all three. Second, regression and adversarial tests: 13 negative regressions plus 12 adversarial inputs (NaN, Infinity, type attacks, structure attacks) are all caught correctly, with no bare tracebacks and no silent numeric swallowing producing false passes. Third, external review: two rounds totaling 15 parallel expert reviews (5 then 10, covering game-design knowledge, agent workflows, code correctness, schema consistency, robustness testing and more), with all fixes from both rounds completed. Fourth, the gates themselves: 40 structured error codes across the three validators; revision rounds backfill by error code plus coordinates; delivery requires validator exit 0, full PASS from all three personas, and a diff log across 3 to 5 revision rounds. To be clear: all of this verification happens at the white-box JSON layer. There is no human playtest in a real game engine; the player's view is simulated by the novice / speedrunner / explorer personas.

## Known failures

The most important limitation: this skill has not yet produced one runnable complete level in a real engine. The Roadmap's end-to-end demos (a Celeste-style full level, a Hollow Knight-style metroidvania area) are unfinished, and the knowledge base covers 2D platformers and metroidvania only, with 3D explicitly out of scope. Review round one deleted or re-graded 4 dubious literature citations; the remaining thresholds all carry evidence grades, but some values still lack solid academic sources and lean on industry-experience approximations. The three-persona simulation is an LLM playing reviewer roles, not human playtesting; beat-sheet assertions constrain white-box numbers, not feel and fun, and WARN-level issues do not change validator pass/fail.
