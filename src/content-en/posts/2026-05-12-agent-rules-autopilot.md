---
title: "Reading the new agent policy against my overnight self-iteration"
description: "Three agencies' May 8 Implementation Opinions on AI Agents: regulation is moving from governing models to governing actions. I checked every requirement against my own defenses for running Agent Git self-iteration overnight."
category: 工程方法论
tags: [Agent, AI监管, 自动化]
pubDate: 2026-05-12
---

On May 8, the Cyberspace Administration of China, together with the NDRC and the Ministry of Industry and Information Technology, issued the Implementation Opinions on the Regulated Application and Innovative Development of AI Agents (《智能体规范应用与创新发展实施意见》) — the first time regulation has systematically set rules for AI agents. One Tsinghua scholar gave an accurate summary in the commentary: China's AI regulation is moving from governing models to governing actions.

My first reaction to the news was a bit odd: relief mixed with a sense of having seen this before. I once built a project that lets an Agent self-iterate a Git repository overnight; the longest run went 20 rounds — surveying, picking work, coding, verifying, committing, looping until dawn. Walking every requirement in the Implementation Opinions against the defenses I had actually written, I found that the institutions the regulatory document describes are ones engineers had already started building for themselves in code.

## The regulator wants registration and audit trails; my version makes every step auditable

The Opinions propose exploring a registration platform for AI agents, offering digital identity management, capability declarations and similar services.

My version is far more modest: every automatic iteration starts by generating a run_id, all work is isolated on a dedicated branch named after that id, state goes into state.json, and every action (start work, commit, rollback, config change) is appended to log.jsonl. When I want to know what the Agent did last night, I do not scroll back through the terminal; reading those two files is enough.

A registration regime solves the same problem: an actor that cannot be audited after the fact does not deserve trust. For the national regulator and for me, that is the same sentence.

## The regulator wants authorized scope; in engineering this is called refuse-what-is-out-of-bounds

The Opinions require ensuring users have the right to know and the final decision over an agent's autonomous choices, that executed operations never exceed the user's authorization, and they separate three boundaries: decisions reserved to the user alone, decisions requiring user authorization, and decisions the agent may make autonomously.

This is the requirement my engineering lands most concretely, split into three gates:

- **Dangerous-action blacklist**: history resets, force pushes, commit rewrites — these go into system-level prohibitions; even when the model wants to touch them, the tool layer blocks it;
- **Outbound off by default**: outward-facing actions like pushing to a remote are forbidden by default and allowed only once the owner explicitly flips the config on;
- **Blast-radius cap**: any single-round change beyond the agreed size must be split up, so one bad round cannot take the whole repository down with it.

As for final decision authority, my design never hands it to the model at all. The budget (deadline, max rounds, token cap) is entirely hard-coded in config by the owner; the model does not know when it should stop, and it should not be the one deciding. Letting it judge when to halt was one of the early deaths: it declared "no work left" and then idled itself to timeout — a pitfall I have written about before, no need to expand here.

## The regulator wants tiered governance; in engineering this is called tiered verification

The Opinions say to carry out tiered governance prudently according to application scenario and potential impact, with admission, testing, filing, auditing and recall configured by scenario intensity.

In engineering language: the thickness of verification should be proportional to how dangerous the action is. My automatic iteration verifies at two levels: ordinary rounds run only lightweight checks (syntax, types, seconds-fast); at verification milestones and commit rounds it runs the full set (test suite, type check, complete build). Before every commit there is an extra secret scan — keys are the one thing that should never enter version control.

And recall, once something breaks? My answer is written into the tool's name: undo-round. A broken commit gets offset forward with git revert; history only advances, never rewrites. The cheaper the recall, the lower the psychological bar for letting the Agent run loose — these two things come as a set.

## The regulator asks for accountability; engineering asks about blast radius first

The Opinions require users to bear responsibility for safe use, lawful use and prudent authorization. I agree completely, and want to add an engineer's footnote: the size of the responsibility depends on the blast radius.

My automatic iteration currently runs locally, on single-person repositories; the worst case is my own headache for an hour the next morning. The same setup attached to a production system, operating real data on users' behalf, changes the nature entirely. To be honest, my Agent currently holds full shell permissions on my machine — an efficiency choice in a personal project, completely unacceptable in the scenarios the Opinions envision. The permission sandboxes and per-scenario admission thresholds the document calls for are exactly the missing plank between toy and production.

## Closing

One ordering is worth savoring: engineering practice appeared first, the regulatory document arrived after — as if stamping the industry-wide engineering checklist. The Implementation Opinions are still policy guidance and the clauses are still coarse; the previous measures on anthropomorphic interaction went from publication to effect in only three months. From governing what is said to governing what is done, the transition period is roughly this year.

For people writing Agent engineering, the best preparation has no other version: build your own cage first. The day detailed rules land, you will find that most of the clauses inside are ones you already met in your own code.
