---
title: "The search surfaced pirated links, and the court held the AI search engine not liable"
description: "The RAG debate inside the Supreme People's Court's typical cyberspace cases: a cloud-drive pirated link ranked first, and both instances held the platform not liable. The judgment's syllogism is an architecture checklist for retrieval-augmented applications."
category: 技术笔记
tags: [检索, 判例, AIGC]
pubDate: 2026-09-18
---

On September 16, during National Cybersecurity Awareness Week, the Supreme People's Court published a batch of typical cases on cyberspace rule of law. One of them reads as if written for the entire RAG industry: a user searched two TV dramas on an AI search engine, and the top-ranked result was a pirated share link on a third-party cloud drive. The copyright holder sued the platform; at first instance and on appeal, the platform won both times.

Taken apart, the judgment's syllogism is worth far more than the conclusion itself.

## The facts take three lines

A network technology company built an AI search engine on top of a large language model (one that had completed algorithm filing with the Cyberspace Administration of China under the generative-synthesis category); its core is retrieval-augmented generation: retrieve from the public internet first, then have the model organize the results.

On November 28, 2024, a culture company discovered that two TV dramas over which it holds the right of online dissemination returned third-party cloud-drive share links as the first result in this engine, with matching content behind the links. On December 5, the copyright holder notified the platform for takedown, and the platform deleted them the same day. The copyright holder sued anyway, seeking damages.

## The court's syllogism

First instance at the Shanghai Xuhui District Court, appeal at the Shanghai Intellectual Property Court, same conclusion: the cloud-drive links did infringe, but the platform bears no liability. The reasoning splits into three layers:

**No direct infringement**, because the links came from public internet web pages and the platform never actively uploaded any pirated content;

**No contributory infringement** — the judgment's own words say that "with technology at the current stage, infringing information cannot be automatically identified", and the platform had already fulfilled its model-algorithm filing obligation;

**Due care was discharged**, because upon learning of the infringing information the platform handled it effectively the same day.

Anyone familiar with copyright law will see that this essentially carries the "safe harbor" rule into the generative era: technological neutrality itself grants no exemption; filing and response speed are the elements that earn immunity. The interesting part is that the court in effect credited the RAG architecture: when the content has a retrieval source and the platform's role is that of a "presenter", a liability boundary can be drawn.

## Read against my own engineering, this is an architecture checklist

I build a statute retrieval foundation (statute-rag) that supplies the QA layer above it with mandatory provision citations: every result must carry the statute name, article number, original text and id, and citing the wrong provision is worse than failing to answer. Reading this case against my own engineering yields three very practical lessons.

**Traceable provenance is the precondition of a liability boundary.** The platform's winning move in this case was the architectural fact that "the content comes from retrieval over public web pages". Had the same platform answered generatively, "spitting" pirated links out of model weights, the nature of the matter changes at once — which echoes the two-instance judgments in March's Baidu AI hallucination case: when the content is "processed and synthesized" by the platform, the platform bears liability. A provenance-carrying architecture grows a liability shell by nature, and that shell is worth money.

**Filing is not formalism.** "Has fulfilled the model-algorithm filing obligation" went into the no-liability reasoning in the judgment's own black and white. Many independent developers treat filing as an administrative burden; this judgment shows that in litigation it is a real, load-bearing element of the defense.

**Response speed is an engineering metric.** Deleted the same day as notified, and due care is discharged. Worked backward into system design, receiving, locating and taking down infringement notices should be an automated pipeline, not a ticket waiting for a human to spot. My rule for my own scraping scripts is that failures must be reported explicitly and silently returning an empty list is forbidden — the same idea: in scenarios like this, silence itself is risk exposure.

## "Current technology cannot identify it" is a line that moves

What grips me most in the judgment is the phrase "at the current stage". The boundary the court drew for the platform rests on the current state of identification capability, which means the line moves as the technology moves. Once techniques like copyright content fingerprinting and cross-platform matching mature to the point of "could identify but did not", half of the immunity rationale collapses.

For exactly this kind of string-level exact matching, my legal toolbox already has a working prototype: legal-hallu-guard verifies statute citations inside AI answers using the naive rule that "a quote must be a contiguous substring of the corresponding provision", evaluated with constructed tests over 14,212 rows of real corpus, with zero false positives on normal answers. Moving the same idea to copyright matching faces no technical obstacle.

So my conclusion: do not treat immunity obtained for free today as permanent. Investment in identification capability — the earlier, the steadier.

## Closing

For anyone building retrieval-augmented applications, this judgment deserves a spot on the cubicle wall: let content carry provenance honestly, complete the filing in earnest, and build notice-and-response into an engineered pipeline. The R in RAG has always been retrieval, and retrieval means being able to say clearly "where I learned this from". The court, in effect, used the judgment to confirm one sentence: only those who can state their sources get to talk about liability.
