---
title: "Standing at the eve of the tech explosion, part 3: one paper, three hours of compute"
description: "OpenAI posted 722 math manuscripts in one drop: three hours of compute per result, 162 Lean-verified. Still before RSI."
category: 杂谈
tags: [大模型, RSI, 数学]
pubDate: 2026-10-07
---

The average production cost of one math manuscript here is three hours of ChatGPT Pro-tier thinking compute. On October 6, OpenAI put 722 such manuscripts on the public web in a single drop: [github.com/openai/math](https://github.com/openai/math), grouped by discipline into 372 families, with an official note titled "Sharing AI progress in mathematics". The README opens flatly, like routine business: "As part of model development, we evaluate our models on open research problems. We expanded these evaluations after performance on our existing mathematical evaluations saturated."

The second half of that sentence is worth a pause. The old exam papers were maxed out; the new exam is problems nobody has ever solved. The yardstick for selecting frontier models has moved to "can it produce new knowledge".

The repository carries three numbers. Over the evaluation period the model was posed about 4,000 open problems; output was aggregated and filtered for significance, leaving 722 manuscripts; the average cost per result was three hours of Pro-tier thinking compute. For scale: a math PhD spends five years producing three or four papers, which on a fifty-hour week puts the human labor per paper in the thousands of hours. Four thousand problems in, seven hundred papers out, three hours each: the economics of this assembly line and the human workshop are no longer in the same order of magnitude.

## What the title pages say

Plenty of heavyweight names among the 722. All of the following are paper titles:

- "Catalan's constant is irrational"
- "The irrationality exponent of pi is 2"
- "The Quasi-Riemann Hypothesis" (two versions)
- "The Mahler Conjecture for General Convex Bodies"
- "The rational Hodge conjecture for CM abelian varieties"
- "Global classical solutions of the three-dimensional relativistic Vlasov–Maxwell system"
- "A Counterexample to Kaplansky's Direct-Finiteness Conjecture in Characteristic Two"
- "Computation under Rapidly Vanishing Navier–Stokes Forcing"

Whether Catalan's constant is rational has hung for over a hundred and fifty years; for the irrationality exponent of pi, the best human upper bound still sits near 7.1 while the common guess is that the true value is 2; the Mahler conjecture dates to 1939 and is an elder statesman of convex geometry; the Hodge conjecture is one of the seven Millennium Problems, and CM abelian varieties are among its few special cases with concrete progress; global classical solutions for the relativistic Vlasov–Maxwell system is a decades-old open problem of mathematical physics. The disciplinary spread is not staged either: the Langlands program, the Penrose inequality of general relativity, a magnetization law for the quantum Heisenberg ferromagnet, ergodicity of triangular billiards, a page of the catalog reads like a graduate seminar's topic list. The last item is the most interesting: building computation inside Navier–Stokes flows, the opposite direction from September's "we proved NS smoothness" affair. Same family of equations; one end attacks a Millennium Problem, the other proves the flow can act as a universal computer.

A title is not a theorem, of course. The README is blunt: the results are at different stages of verification, not all have Lean formalizations, and "some of the unformalized results could have issues. We will endeavor to fix any such issues quickly." So far 162 papers have main results passing machine verification in Lean; the other 560 rest on their own consistency, awaiting human review.

## 162 past the machine, 560 still in line

First, the weight of "Lean-verified". Lean is a formal proof assistant: a proof must be written line by line in its grammar, the compiler checks every step, and passing means passing, with no room for "I think this step is fine". The math community's trust in machine verification was ground out by two old cases. In 1976 the four color theorem fell to a computer-assisted proof; referees could not check the thousand-plus pages of machine enumeration line by line, the dispute ran nearly thirty years, and only in 2005 did Georges Gonthier settle it with a Coq formalization. The Kepler conjecture proof was announced complete in 1998; after submission the referees' verdict was "99% certain" correct, Thomas Hales launched the Flyspeck project, some twenty people worked eleven years, and the full formalization closed in 2014. Formalizing one theorem used to be a community's decade-long engineering project.

This time it was 162 papers, shipped together with the results.

For managing the state of the other 560, OpenAI's conduct this month was a step up from early September. On September 8 it announced an internal model had "proved" smoothness of the Navier–Stokes equations; the mathematician Tristan Buckmaster publicly accused the effort of improper conduct, and an open letter signed by mathematicians criticized the use of open problems as an AI benchmark. On September 23, OpenAI announced it was working with an independent Advisory Group on Mathematics and AI: members from École Normale Supérieure, the Institute for Advanced Study, Cambridge, Oxford, Stanford, Harvard and elsewhere; the group operates independently, members are not paid by OpenAI, its duties include assessing significance and gatekeeping how results are announced, and it may publicly dissent. This release is a product of that mechanism: revisions recorded as new versions, old versions permanently accessible, a citation format attached to every manuscript; the README admits unformalized results may have issues and promises quick fixes, and explores community-hosted repositories. The process brings version-control semantics into mathematical publishing: history is immutable, corrections leave a trail.

## One paper, three hours

The production process is highly standardized: the vast majority of results follow one procedure, run by an unreleased internal model, three hours of Pro-tier thinking compute per problem on average. Two exceptions took a special path: the improved zero-free region for the Riemann zeta function (Re(s) > 11/12), and the Hodge conjecture on CM abelian varieties; the zeta manuscript was also human-edited for readability.

The ten reasoning summaries released with the repository are worth more than the papers themselves. I picked the one with the most startling title, "The irrationality exponent of pi is 2", forty-two pages, and nearly all of it is a record of dead ends: arctangent Padé approximants blowing the height budget, Chudnovsky series elimination costs that will not come down, the BBP formula hitting least-common-multiple blowup, elliptic continuations tripping over nuisance periods, interpolation determinants running into dimension barriers. One verbatim line reads "This kills approach by dimension alone"; a colder one: "Roth height threshold far tinier than analytic contact codim". The summary has two parts: the first chases an intermediate bound of 62/25, and the famous Flint Hills series convergence problem is exactly equivalent to pushing pi's exponent below 5/2, a step no human has managed; the second jumps straight to the endpoint, 2. Between 7 and 2 lies a change of orders of magnitude; whether it holds, the mathematicians will rule.

The citation chain says more about the model's caliber than the proof would. The reading list has Viazovska's Fourier interpolation (she later won the Fields Medal), the 2025 JAMS paper on the Unbounded Denominators Conjecture by Calegari–Dimitrov–Tang, the Zeilberger–Zudilin paper that ground pi's bound to 7.1032 in 2020; also a seven-year-old preprint by an independent researcher that never entered a journal, the model reads literature without snobbery. The two self-references are the most striking: one is signed OpenAI outright, "Catalan's constant is irrational"; the other is last month's preprint pushing pi's bound to 7.1018. Humans ground the bound from 7.6063 (2008) to 7.1032 (2020), half a step in twelve years; this September it moved again, to 7.1018. Standing on that chain, the model declares the endpoint is 2. The repository adds a note: some outputs build on earlier results produced by the models.

What I read in that summary is not "AI can do math"; it is that a researcher's way of working now runs end to end within hours: propose an auxiliary form, estimate heights, hit a wall, switch paths, hit another. Those forty-two pages record at least twenty dead ends, each with the cause of death. Human mathematicians work the same way; the only difference is that a human runs out of PhD after a few rounds, while the machine can afford the deaths. And the dead ends are published: human research logs never print their failures. This is the first time I have seen failure itself become citable literature.

## Four years, and nothing has ignited yet

Flatten the timeline. On November 30, 2022, ChatGPT launched on GPT-3.5, a model that fumbled arithmetic; five days after launch Stack Overflow banned its answers for being too often wrong. By the time these manuscripts went online, three years and ten months had passed. Packed in between: July 2024, DeepMind's AlphaProof scores at silver-medal level on the International Mathematical Olympiad; summer 2025, two labs successively report IMO gold-medal-level results; May 2026, an OpenAI model produces a counterexample to Erdős's unit distance conjecture; August 1, ten open-problem results all with Lean proofs; September 8, a Navier–Stokes announcement draws the math community's fire; October 6, 722 manuscripts shipped in one drop.

Not one step on this timeline used recursive self-improvement. My "nothing has ignited" call rests on three layers. First, the weights were not rewritten: these manuscripts are evaluation output, the model's parameters stayed frozen during evaluation, its work did not become its own training data. Second, posing stayed human: who chose the 4,000 problems and who filtered the 722 papers are OpenAI employees. Third, transfer is unproven: proving Catalan's constant irrational and designing better RL algorithms are two different abilities, and the parameter r in the [paper I read last time](/blog/2026-10-05-tech-explosion-eve-2/) (when R&D input doubles, how much does output multiply, historical central estimates 1.2 to 1.9) is about the latter. How much math ability transfers into R&D ability is exactly r's core unknown. These repositories prove the molecule exists; whether r exceeds 1, the manuscripts themselves give no evidence.

But the fuel is in the chamber. Math is the research field closest to ignition conditions: verification is cheap, the Lean compiler is the referee; it is pure software, results can feed straight back into training; the supply of problems is nearly unlimited, millennia of accumulated open conjectures will burn for a long time. Verification cost sets the order in which the flood arrives; math is simply the first room to go under.

## RSI is the explosion moment

The first piece in this series noted that recursive self-improvement is turning from a sci-fi premise into an engineering problem. This one states my judgment more specifically: RSI is AI's tech-explosion moment itself; there is no sequence between them, they are two names for the same moment.

Every gain today, these 722 included, is powered from outside the system: humans tune architectures, humans feed data, humans pose the problems, humans review, humans pay the power bill. An explosion has one definition: the power source moves inside, research output becomes research capability, the improver starts improving the improvement process itself. What the loop looks like inside code repositories, the previous two pieces could only describe in words; this piece has an artifact anyone can clone, and "AI does research" is no longer a metaphor.

The ignition conditions sit in last time's paper; what remains is time. Three years or ten, the second paper dismantled its own numbers: r's confidence intervals are startlingly wide, the widest spanning 0.38 to 3.21. I am no better positioned than those twenty-two authors to prophesy; the one thing I am sure of is that before ignition, every indicator will keep refreshing the way they do now, one by one, month by month.

## Are the referees still in the room

Two buckets of cold water.

First, digestion. Beyond the 162, the ruling power rests with human mathematicians, and reading 722 manuscripts takes months. Terence Tao's September comments make a good coordinate: Lean's job is to be a "formal proof assistant", checking proofs humans have already worked out; machine brute-force exploration of new proofs, in his image, is a "brute cartographer", drawing an unfathomable map of millions of dead ends. These reasoning summaries are exactly samples of that map. Exploring for new proofs used to be guarded by human taste; now it shows up on the machine's output list too.

Second, the significance filter. From 4,000 problems down to 722 papers, the "appropriate level of significance" filter in between is OpenAI's own: which results enter the catalog and which are dropped cannot be audited from outside. For centuries the sieve was operated by journals and peer review; it now has a rival for the first time, and the rival's mesh size is not public. One line in the README deserves a close watch: "exploring community-hosted repositories". If the community takes over hosting, the power to filter gets a chance to move out of the company's hands.

Cold water poured, one line remains from the announcement: OpenAI is working to responsibly release the model that produced these results. The model itself has not left the building. On the day it does, who sits in the pose-the-problems and review-the-output seats matters more than which manuscript holds up.

## The flood nearest my desk

For someone who writes code and reads statutes, the sharpest thing in this repository is the contrast in verification cost. Code has the compiler, math has Lean, a verification round takes seconds; the verification cost of legal judgment sits almost entirely on the human side: a statute's current force, the hierarchy between provisions, the measure of value-balancing in an individual case, each needs someone with a license to stand behind it, and the person standing behind it bears consequences. I build legal retrieval tools and fight model hallucination daily: it can invent a statute that does not exist, format flawless, source nowhere. On the math side hallucination does not pass Lean; on the law side it can walk all the way into a complaint.

So the flood will cross the two fields differently. In math, production and verification are automated together; in law, only generation goes under first, case finding, precedent retrieval, document drafts, evidence sorting, the three-hours-of-compute versions of these are already on the shelf, while the responsibility end does not move, every "shall" in a judgment still needs a signature. China's measures on labeling AI-generated content are already in force; regulators treat "this was machine-written" as serious business. More serious than labeling is signature. When output is as cheap as three hours a paper, the expensive thing left is responsibility itself: law schools teach output; the market has always bought responsibility. Where that repricing takes the legal profession I cannot predict, but the direction is clear.

Three pieces in, this series finally has an artifact to flip through: the first was atmosphere, the second one paper's parameters, this one is 722 manuscripts on GitHub that anyone can clone. For the next few months, watching four things is enough: how far Lean coverage climbs from 162; whether the Catalan and pi titles get a public ruling; whether the model that produced these results is released; whether community-hosted repositories land. Which of these manuscripts ultimately stand, we will know within months.
