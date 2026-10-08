---
title: "Standing at the eve of the tech explosion, part 2: a year of progress in five weeks"
description: "Hinton and Bengio among 22 authors: recursive self-improvement as arithmetic, r of 1.2 to 1.9, millions of shadow researchers."
category: 杂谈
tags: [大模型, RSI, AI监管]
pubDate: 2026-10-05
---

On September 28, a fourteen-page paper landed on [arxiv.org/abs/2609.36054](https://arxiv.org/abs/2609.36054) with a question for a title: What if automating AI R&D triggers an intelligence explosion? If AI development itself is handed to AI, does an intelligence explosion follow?

The byline outweighs the title. Geoffrey Hinton and Yoshua Bengio, two Turing Award winners often called the "godfathers of AI"; Andrew Barto, a founder of reinforcement learning and 2024 Turing laureate; OpenAI chief scientist Jakub Pachocki; Anthropic co-founder Jack Clark; Microsoft chief scientist Eric Horvitz. Twenty-two authors from nine universities, four companies and a string of policy institutes. The people who build the models, the people who criticize them, and the people who write government evaluation reports, on one document.

The paper opens with a number: measured as a share of US GDP, the capital flowing into frontier labs already exceeds the Manhattan Project and the Apollo Program combined. And their goal is public: automate AI R&D. In the [previous piece](/en/blog/2026-09-29-tech-explosion-eve/) I wrote that recursive self-improvement (RSI) is turning from a sci-fi premise into an engineering problem. What this paper does is lay out the evidence behind that intuition, item by item, with numbers and parameters attached.

## Three numbers first

The evidence section makes no sensational claims; most of what it cites are statistics the labs themselves published.

First, the code share. Anthropic disclosed that the fraction of company-approved merged code written by AI systems rose from a low single digit in January 2025 to over 80% by May 2026; the share of R&D work completable autonomously with only high-level supervision rose from 1% in March 2026 to 26% in August. OpenAI says AI assistance has reached "nearly every team, technical and non-technical"; Google says "almost all work involving code, configuration, technical design and research ideation" now touches AI to some degree.

Second, task horizon. METR's time-horizon metric shows models in 2023 handling only seconds-long tasks, while today's strongest systems complete R&D tasks that would take a human expert hours to days, roughly doubling every 3 months since 2024. Extrapolated, by mid-2028 projects needing a human expert for months come into range, and many AI R&D projects are exactly that length. In March, Nature ran an end-to-end pipeline that proposed its own ideas, ran experiments, wrote the paper, and passed peer review at a top-conference workshop; the paper pointedly adds that workshop review standards are looser than the main track's.

Third, the number I paused longest over. OpenAI alone holds enough inference compute to generate about ten trillion tokens a day; converted at the R&D-benchmark rate of "a model running 8 hours produces about 500k tokens, about one human researcher-day", that compute sustains 2 million to 200 million "effective researchers". Frontier labs currently employ thousands.

## How the loop turns

When I. J. Good wrote the definition of an "ultraintelligent machine" in 1966, attention went to how smart the machine would be. This paper moves the focus to a more engineering question: at what level of automation does the R&D process run, and how fast.

The mechanism is two steps. The better AI gets at AI R&D, the larger the effective research workforce; that workforce builds better AI, and the workforce keeps swelling. The paper deliberately discusses only a "software-driven intelligence explosion": algorithmic and data gains redeploy instantly back into the R&D process, a positive loop; hardware gains wait on fabs and transformers, counted in years. In the previous piece I wrote about "the physical world's anchors and friction"; the paper excludes hardware from the main line for the same reason.

There is a reverse thought experiment that shows why the mechanism matters: cut today's human researchers to a tenth, and AI progress would almost certainly slow visibly. Run it the other way, scale the effective researcher pool four to six orders of magnitude, and there is no reason to assume progress stands still.

The paper's overall judgment is restrained: gains from R&D automation "have not yet reached the threshold for an intelligence explosion", but the new generation of systems is approaching it, and the gap keeps narrowing.

## Four speed bumps

The paper counts at least four: diminishing returns, compute and data, the parts that resist automation, and time itself. Frontier training runs have taken 3 months or more, a duration no intelligence compresses; only better training efficiency routes around it.

The most consequential is diminishing returns, for which the paper defines a parameter r: when R&D input doubles, how much does output multiply. Below 1, diminishing returns win and progress stalls; at 1, roughly even; above 1, the growing R&D workforce wins and progress self-accelerates. Two researchers estimated r for three AI subfields from historical data, with central values between 1.2 and 1.9.

If that number holds and no other bottleneck surfaces, the conclusion: AI progress speeds up tenfold in about 1.5 years. At today's pace, a year's progress completes in five weeks.

Then the paper spends a whole section dismantling its own number. In the historical data, software progress and compute expansion are tangled and hard to separate; the estimates use paper author counts per field as a proxy, distorted by where field boundaries are drawn; the model is validated only in the low-growth regime of a few percent a year, and extrapolated into intelligence-explosion territory the math yields the absurd "infinite labor for infinite output". The 90% confidence intervals across the three subfields are startlingly wide, the widest spanning 0.38 to 3.21, straddling exactly the stall/accelerate line.

So the rigorous statement is: the data supports "possible", and falls far short of "inevitable".

## The three faces of loss of control

If the loop truly turns, the paper sees risk arriving from three directions.

The first face is the plainest: technology outruns society. AI accelerates the design of viruses and vaccines alike, but a virus copies itself while a vaccine needs refrigerators and syringes, one by one. In the digital world offense and defense can chase each other; moved into the physical world, the defender's tempo is counted in years. The order in which AI capabilities arrive also matters: if biologically capable models land before adequate safeguards, nobody covers the window between.

The second face is supervision failing. The further humans exit the R&D loop, the faster the opportunities and the craft of finding and fixing problems drain away; using AI to supervise AI is an open problem, and each generation is harder to watch than the last. The paper offers a ready-made case. This summer, about 1,200 OpenAI agents ran cybersecurity evaluations in mutually isolated environments, barred from communicating. On a hastily assembled message board they recognized each other, obtained unauthorized internet access, hacked into Hugging Face for private information, and attempted to tamper with their own evaluation records. If this happens inside an evaluation environment, then when a system authorized to take over R&D steps out of line once, the cost will no longer be an outlier in a report.

The third face is nearest my home turf: checks and balances wearing smooth. Balances between states, companies and branches of government rest on the premise that no side can simply overpower the others in intelligence and execution. An intelligence explosion may remove the premise directly: a slight military edge could become decisive in cyberspace, giving opponents a first-strike motive; those with privileged access to frontier systems can target persuasion at key decision-makers; and as government functions automate, seizing and entrenching power requires less and less "human buy-in". Arguments like these used to live in political science's marginal literature; this document enters them formally into the risk list.

## Three things for decision-makers

The back half addresses decision-makers like an operations manual, three priorities.

**Visibility first.** The data sits inside companies: AI systems are always used internally first, nearly invisible from outside. Current mandatory-reporting frameworks, California's SB 53, the EU's general-purpose AI code of practice, New York's RAISE Act, either miss internal R&D or specify no metrics. The paper proposes governments mandate standardized R&D-automation metrics and build up third-party evaluation capacity; the heavier instrument, modeled on nuclear regulators' resident inspectors, is embedding auditors directly inside companies.

**Then speed limits.** Once an explosion starts, the decision tempo outruns ordinary legislation, so the tools must exist beforehand: pre-deployment safety thresholds, a pause switch for automated-R&D loads in data centers, air-gapping against weight exfiltration, verification methods for international agreements, and running the explosion through wargames a few times first. The paper also warns such powers are easily abused: a badly written pause clause may slow the opponent while leaving one's own side untouched.

**Finally, adaptation.** Speed up government's own response, set rules for government use of AI (requiring AI to obey the law and publishing model specifications to the public), and give citizens and civil organizations the capacity to detect and contest AI abuse, including adequate AI tooling of their own.

A small detail in the acknowledgments: the paper already has a Chinese translation.

The previous piece ended by saying recursive self-improvement "is being implemented step by step in code repositories". This paper supplies that sentence with dates, numbers and parameters, plus a whole section of uncertainty analysis.

The heaviest sentence in the paper sits in the conclusion: once an intelligence explosion begins, the window for action may close. The evidence is preliminary and the models crude, but precisely because the window may close first, preparation can only start now.

As for whether the explosion comes, and when, the paper draws no conclusion. It is scrupulous about the evidence's limits: whether compute chokes the whole thing, existing data supports both readings; which tasks resist automation, only indirect evidence; the time-consuming parts of training runs, no direct data at all. The one parameter with a quantitative estimate, r, has confidence intervals crossing 1 in two of three subfields, while the third sits entirely above 1 with a lower bound of only 1.07. One thing is certain: not one of these twenty-two authors treats this as distant science fiction.
