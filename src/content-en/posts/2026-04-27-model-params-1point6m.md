---
title: "A court prices model parameters for the first time: 1.6M yuan"
description: "Full details of China's first AI model infringement case: someone copied your comic-effect model, similar imaging output alone makes a substantive substitute, and the Anti-Unfair Competition Law awards 1.6M yuan. Model weights are now things that sit on a balance sheet."
category: 热点快评
tags: [大模型, 法律AI, 判例]
pubDate: 2026-04-27
---

On April 23, a press briefing at the Beijing Chaoyang District Court disclosed the details of the "Comic Transform Effect" case. The case carries two national firsts: the first AI model infringement case, and the first case to explicitly protect the structure and parameters of an AI model. The outcome is a very concrete number: the defendants were ordered to pay 1.6 million yuan in total for economic losses and reasonable expenses, upheld on second-instance appeal.

The case in one sentence: the plaintiff built a "comic transform" effect, the defendant built a "shojo-comic" effect, the imaging results of the two effects were highly similar, and the court found this constituted a substantive substitution of the plaintiff's competitive interest — unfair competition established.

## What this judgment fills is a gap in protected subject matter

First, a question of legal technique: when a model gets copied, why did it take such a long detour to reach a verdict?

Copyright law protects expression; model parameters are a pile of floating-point numbers and do not amount to a work. Patents require a grant and public disclosure of the technical solution, and most model training routes either never apply or cannot qualify. The trade-secret route demands confidentiality measures, which open-source or service-facing models can hardly satisfy. Not one of these three drawers fits a set of model weights.

The Chaoyang court's solution is the general clause of the Anti-Unfair Competition Law: model parameters and structure formed through data training, optimization and tuning can deliver innovative advantage and business gains, and constitute a competitive interest the law protects. Translated: when a copied model puts a substantive substitute into the market, that is appropriating someone else's business results without the labor — and the Anti-Unfair Competition Law reaches it.

The value of this route is that it works as a backstop. It does not answer the big question of "what kind of IP subject matter a model is", but it first answers the smaller, more urgent one: copy a model, pay damages.

## For an independent developer, model assets get a price anchor for the first time

I care about this case purely from my own ledger.

The model-related assets among my small tools fall into two kinds: pure program modules deliberately built to be zero-dependency, and targeted fine-tuning configurations made for open-source models. When people used to ask me what happens if these get taken, my answer was rather sheepish: open-source repos, take them and use them as you like.

This judgment gives a new angle: the law protects "competitive interest", premised on the substitution causing market harm. Weights released open-source — the author has given up exclusivity, so there is no harm to speak of. But the tuning behind a closed-source service, once scraped wholesale and made into a rival product, now has 1.6 million yuan to cite as a price anchor. "A model is an asset" has just received its first RMB-denominated quote from a judgment.

The damages logic deserves a note: what the court compared was the similarity of the "imaging results", asking whether the output end formed a substantive substitution; layer-by-layer code comparison receded to second place. This matches the evidence-gathering intuition of model infringement: weights are hard to compare layer by layer, behavioral features are the fingerprint.

## Closing

Do not over-read the price of a first case: 1.6 million is this case's price, not the industry's price list. But it has nailed one sentence into precedent: model parameters and structure are a competitive interest, and copying them means paying. For people who build models, this is the cheapest legal lesson of the year.
