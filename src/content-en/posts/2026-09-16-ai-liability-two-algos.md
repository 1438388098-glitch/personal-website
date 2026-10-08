---
title: "Two algorithms for AI liability"
description: "At an Illinois hearing, OpenAI testified for a bill waiving liability once deaths exceed 100; in the same weeks, a Nanjing court ordered Baidu to apologize in writing for an AI hallucination. The two liability designs are really managing two different failure modes."
category: 杂谈
tags: [法律AI, 比较法]
pubDate: 2026-09-16
---

Put two news items a few weeks apart side by side, and a strange sense of dislocation appears.

One comes from April, in Illinois, USA: OpenAI testified in support of a bill named SB3444, which sets up liability waivers for advanced AI developers. The waiver's threshold is quite concrete: as long as a safety report has been published, if a model causes over one hundred deaths or over one billion dollars in losses, the developer can be exempt from liability. The bill targets "frontier models", with the admission line drawn at training compute costs above one hundred million dollars — which basically means the few laboratories everyone can name.

The other comes from March, in Nanjing, China: Baidu's AI smart answer fabricated a lawyer "convicted of the crime of explosion and sentenced to three years"; both instance courts found reputation infringement, Baidu owes the victim a written apology, not one yuan was awarded, and even the apology letter has to be pushed along by enforced execution.

In the same quarter, on the question of who answers for AI's accidents, the two shores of the Pacific are running two entirely different algorithms.

## The first: disclosure in exchange for immunity

First, read the American algorithm's logic clearly. The immunity has a consideration attached: you must publish a safety report, hand over a mapped-out picture of your risks, and in exchange get liability immunity for extreme incidents. It is incentive design, betting that companies, in order to win immunity, will build their safety engineering solid and write their reports thick.

Outside Capitol Hill, this design polls poorly: a Secure AI survey found 90% of Illinois respondents against immunity for AI companies, and the bill's prospects of passing are indeed dim. But do not file it away as an isolated specimen too fast: the "voluntary AI regulatory framework" the White House settled in August invited OpenAI, Anthropic, Google and their peers to deliberate — the philosophy is same-sourced: government sets the questions, companies hand in the homework, and responsibility is left mostly for the market to digest.

## The second: fault grown out of individual cases

China has not set an industry-wide immunity clause; it takes the other road: adjudicate one case at a time.

A search engine's AI invented a lawyer's crime, and the court rejected the platform's defenses point by point — "all AI hallucinate" buys no exemption from fault, and the judge asked in open court: the same question put to other vendors' models, why no such statements? Face-swappers, content stealers, AI image-launderers pay out one case at a time, and the Beijing High Court even sent AI-generated infringing images into criminal court. By September, the Supreme People's Court used a 24-article opinion to gather these scattered points into unified adjudication rules.

The core move of this algorithm is peer comparison: other models' behavior is used to define your fault. Responsibility is deferred to judicial discretion, and the line gets drawn on the spot, case by case.

## Two algorithms, two failure modes

My own read is that these two designs are often compared as opposites, but they are actually managing different failure modes.

Disclosure-for-immunity handles low-frequency, high-severity risk: frontier models out of control, or turned to large-scale harm. The feature of this kind of risk is that courts have no time to adjudicate it case by case; only ex-ante disclosure duties and safety assessments have room to work.

Case-by-case peer comparison handles high-frequency, small-amount harm: a hallucination wounding one person's reputation, a face swap stealing one person's face. These cases carry small single losses, nowhere near the "one hundred deaths" waiver threshold, and the market's mechanisms will not seek redress for ordinary people — only judicial cases can catch them.

Look back at China's institutional arrangement, and both blocks are actually being laid: high-frequency harm goes to the Civil Code and case-by-case accountability, low-frequency high-severity to administrative ex-ante procedures such as safety assessments and algorithm filing. The "filing" and "assessment" language filling the anthropomorphic-interaction measures corresponds precisely to the latter kind of risk. Two algorithms coexisting in tiers within one legal system — that is probably the most honest answer available at present.

## Closing

As someone who studies law and writes code at the same time, I keep one very practical question for myself: which algorithm reaches me first?

The answer is obvious. Tools like mine will never come near the "one hundred deaths" waiver threshold, and what I will actually encounter day to day are all small Nanjing-type cases: say what should not have been said, admit the fault. So however Washington's bill gets amended, the action guide for an independent developer has not changed: state your sources clearly, treat hallucination as fault to be governed. Under both algorithms, that is the safe item.
