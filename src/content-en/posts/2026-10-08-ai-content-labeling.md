---
title: "AI content now ships with a birth certificate"
description: "Since September 1, 2025, AI-generated content in China must carry two kinds of labels: a notice users can see, and production facts hidden in the file metadata. The EU regulates disclosure; China regulates traceability."
category: 热点快评
tags: [AI监管, AIGC]
pubDate: 2026-10-08
---

On March 14, 2025, the Cyberspace Administration of China, joined by the Ministry of Industry and Information Technology, the Ministry of Public Security and the National Radio and Television Administration, published the Measures for Labeling AI-Generated Synthetic Content, effective September 1. The document sets up a birth-certificate system for AI-generated text, audio, images and video: every file must carry two kinds of labels.

## Two labels, one pipeline

The explicit label is for users: a notice presented inside the generated content or the interaction interface, in text, sound or graphics, plainly perceptible. The "AI-generated" badges you already see on video platforms are this kind.

The implicit label is for machines: a technical marker written into the file's metadata, carrying the generation-synthesis attribute, the provider's name or code, and a content number. The first two answer "is this AI-generated, and by whom"; the third answers "which exact generation was it". When a file is downloaded, copied or exported, the explicit label must still be present in the file; the implicit label lives in the metadata and travels with it anyway.

A companion mandatory national standard, Cybersecurity Technology - Labeling Method for AI-Generated Synthetic Content, was approved and published alongside, so how labels are written, where they sit and in what format is no longer left to each vendor's taste.

## Platforms are the gatekeepers

The obligation does not stop at the generation side. App distribution platforms, when reviewing an app for listing, must ask whether it provides AI generation-synthesis services and verify its labeling materials. Platforms providing content-distribution services must take technical measures to keep the spread of synthetic content in check. Labeling thus stops being "generator's self-discipline" and becomes a pipeline with inspection points in the middle.

## Tampering with the label is itself a red line

The Measures devote a clause to this: no organization or individual may maliciously delete, tamper with, forge or conceal the labels, may provide tools or services for doing so, and may not use improper labeling to harm others' lawful rights.

That middle clause deserves a second look. "No providing tools" pushes governance from the generation end to the tool end: software whose purpose is to strip watermarks or wipe metadata is itself within reach of the rules. A watermark lost to screenshots and re-encoding is the shared weakness of every content-labeling technique; the answer here is not to fight the technology but to choke the tools.

## The EU side of the coin

Three months before this took effect, I wrote about the transparency duties in the EU AI Act: interactive AI must announce itself, deepfake content must carry machine-readable marks, and AI-generated text on matters of public interest must declare its nature. Both documents regulate "labels"; they aim at different targets.

The EU's target is the right to know: the user must be able to tell machine from human, and the reader must be able to tell synthetic from real. China's target is the chain of traceability: attribute, provider and content number written into metadata, platforms verifying at the entrance, with label-scrubbers and tool-makers both within reach of penalties. One faces the user; the other faces enforcement. The same AI-generated file must be able to prove "I am synthetic" in the EU context, and to reveal "whose I am and which number I carry" in the Chinese context.

For anyone shipping products, the two are two pages of one checklist: for the EU market, interface disclosure and text declarations are unavoidable; for the domestic market, every export button must make sure the label travels with the file.

## For tool builders

My own tools live on the retrieval and evaluation side; they do not generate synthetic content and are outside the reach of the labeling duty. But the moment a product grows an "AI-generated summary" feature, the exported file's metadata has to carry the production facts per the national standard. A label has moved from a front-end string to file-level metadata, and that step was settled by legislation, not by engineering fashion.

A birth certificate does not raise the child. It answers one question: when something goes wrong, there is someone to find.
