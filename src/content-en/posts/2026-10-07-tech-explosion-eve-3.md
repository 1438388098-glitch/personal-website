---
title: "Standing at the eve of the tech explosion, part 3: one paper, three hours of compute"
description: "OpenAI posted 722 math manuscripts in one drop: three hours of compute per result, 162 Lean-verified. Still before RSI."
category: 杂谈
tags: [大模型, RSI, 数学]
pubDate: 2026-10-07
---

On October 6, OpenAI published "Sharing AI progress in mathematics" and put a repository on the public web: [github.com/openai/math](https://github.com/openai/math). Inside are math papers produced by its internal frontier model: 722 manuscripts, grouped by discipline into 372 families. The README opens flatly, like routine business: "As part of model development, we evaluate our models on open research problems. We expanded these evaluations after performance on our existing mathematical evaluations saturated."

The second half of that sentence is worth a pause. The old exam papers were maxed out, so the new exam became problems nobody has solved. The yardstick for selecting frontier models has moved to "can it produce new knowledge".

The repository carries three numbers. Over the evaluation period the model was posed about 4,000 open problems; the output was aggregated and filtered for significance, leaving 722 manuscripts; the average cost per result was three hours of ChatGPT Pro-tier thinking compute.

## What the title pages say

Plenty of heavyweight names among the 722. All of the following are paper titles:

- "Catalan's constant is irrational"
- "The irrationality exponent of pi is 2"
- "The Quasi-Riemann Hypothesis" (two versions)
- "The Mahler Conjecture for General Convex Bodies"
- "The rational Hodge conjecture for CM abelian varieties"
- "Global classical solutions of the three-dimensional relativistic Vlasov–Maxwell system"
- "A Counterexample to Kaplansky's Direct-Finiteness Conjecture in Characteristic Two"

Whether Catalan's constant is rational has hung for over a hundred and fifty years; for the irrationality exponent of pi, the best human upper bound still sits near 7.1, while the common guess is that the true value is 2. The model wrote its titles straight at the finish line.

A title is not a theorem, of course. The README is blunt about it: the results are at different stages of verification, not all have Lean formalizations, and "some of the unformalized results could have issues. We will endeavor to fix any such issues quickly." So far 162 papers have main results that pass machine verification in Lean; the other 560 rest on their own consistency, awaiting human review. To manage that state, OpenAI consulted the independent Advisory Group on Mathematics and AI at the Institute for Advanced Study on release protocols: revisions recorded as new versions, old versions permanently accessible, a citation format attached to every manuscript. The storm over the Navier–Stokes announcement in early September seems to have done its work.

## One paper, three hours

The production process is highly standardized: the vast majority of results follow one procedure, run by an unreleased internal model. Two exceptions took a special path: the improved zero-free region for the Riemann zeta function (Re(s) > 11/12) and the Hodge conjecture on CM abelian varieties; the zeta manuscript was also human-edited for readability.

The ten reasoning summaries released with the repository are worth more than the papers themselves. I picked the one with the most startling title, "The irrationality exponent of pi is 2", and it reads as a record of dead ends: Padé approximants blowing the height budget, interpolation determinants hitting dimension barriers, and one verbatim line, "This kills approach by dimension alone". The model laid two bricks under itself in the citation chain: one is last month's preprint pushing the upper bound for the irrationality exponent of pi down to 7.1018, the other is signed by OpenAI outright, "Catalan's constant is irrational". The repository notes also state that some outputs build on earlier results produced by the models. Humans ground the bound from 7.6063 (2008) to 7.1032 (2020), half a percentage point in twelve years; this September it moved again, to 7.1018. This manuscript's title says 2 outright. Between 7 and 2 lies a change of orders of magnitude; whether it holds, the mathematicians will rule.

What I read in that summary is not "AI can do math"; it is that a researcher's way of working now runs end to end within a few hours: propose an auxiliary form, estimate heights, hit a wall, switch paths, hit another. A human runs out of PhD after a few rounds of that; the machine can afford the deaths.

## Four years, and nothing has ignited yet

Flatten the timeline. On November 30, 2022, ChatGPT launched on GPT-3.5, a model that fumbled arithmetic. By the time these manuscripts went online, three years and ten months had passed. Packed in between: May 2026, an OpenAI model produces a counterexample to Erdős's unit distance conjecture; August 1, ten open-problem results all with Lean proofs; September 8, a Navier–Stokes announcement draws the math community's fire; October 6, 722 manuscripts shipped in one drop.

Not one step on this timeline used recursive self-improvement. The [paper I read last time](/blog/2026-10-05-tech-explosion-eve-2/) defined a parameter r: when R&D input doubles, how much does output multiply, with historical central estimates between 1.2 and 1.9; above 1, R&D self-accelerates. Math is the field closest to that condition: verification is cheap, the Lean compiler is the referee; it is pure software, and results can feed straight back into training. That loop now runs, and it ran without the model's own weights being rewritten by its research output: posing, filtering, publishing, all still held in OpenAI's hands.

So my judgment from the first piece in this series gets more specific: RSI is AI's tech-explosion moment, itself. Every gain today, these 722 included, is powered from outside the system: humans tune architectures, humans feed data, humans pose the problems, humans review. An explosion is defined by the power source moving inside, research output becoming research capability. The fuel is in the reaction chamber and the ignition conditions sit in someone else's paper; what remains is time.

## Are the referees still in the room

Two buckets of cold water.

First, digestion. Beyond the 162, the ruling power rests with human mathematicians, and reading 722 manuscripts takes months. Terence Tao's September comments make a good coordinate: Lean's job is to be a "formal proof assistant", checking proofs humans have already worked out; machine brute-force exploration of new proofs, in his image, is a "brute cartographer", drawing an unfathomable map of millions of dead ends. These reasoning summaries are exactly samples of that map. Exploring for new proofs used to be guarded by human taste; now it shows up on the machine's output list too.

Second, the significance filter. From 4,000 problems down to 722 papers, the "appropriate level of significance" filter in between is OpenAI's own; which results enter the catalog and which are dropped cannot be audited from outside. Before any explosion, two things are worth watching: whether Lean coverage climbs from 162, and a plainer indicator, whether anyone publicly rules on the Catalan and pi titles within months. The announcement ends by saying OpenAI is working to responsibly release the model that produced these results. The model itself has not left the building. On the day it does, who sits in the pose-the-problems and review-the-output seats matters more than which manuscript holds up.

Three pieces in, this series finally has an artifact to flip through: the first was atmosphere, the second one paper's parameters, this one is 722 manuscripts on GitHub that anyone can clone. From GPT-3.5 to them, three years and ten months. Which of these manuscripts ultimately stand, we will know within months.
