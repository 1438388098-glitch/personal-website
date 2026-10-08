---
title: "After August 2, your AI has to identify itself"
description: "The EU AI Act's transparency obligations and GPAI rules take effect: chatbots must disclose what they are, deepfakes must carry machine-readable marks, and nudify/face-swap apps are banned by statute for the first time. Extraterritorial reach means Chinese developers are in range too."
category: 热点快评
tags: [欧盟AI法, AI监管]
pubDate: 2026-08-05
---

On August 2 the EU AI Act entered its new phase: the obligations targeting AI transparency, and the rules for providers of general-purpose AI models, began to be enforced. To most people this is a foreign wire item; to anyone building AI products, it is the effective-dated notice that a compliance checklist has come due.

The most tangible item on the checklist: your chatbot must clearly tell users they are talking to an AI.

## The transparency obligations come in three layers

The first layer covers conversation: interactive AI systems must identify themselves as such, and users are entitled to know whether the other side of the screen is a human or a model.

The second layer covers audio and video: AI-generated or AI-modified images, video and audio — deepfake content — must be labeled, in a machine-readable form that helps identification. Machine-readable means a hidden watermark is not enough; the mark has to be written into the content carrier itself.

The third layer covers text, and regulates it most finely: writers and bloggers who use AI to generate summaries, produce text, or rewrite style and structure must label it. Where AI-generated or significantly AI-enhanced text involves matters of public interest — public administration, justice and law enforcement, public safety, health, environment, consumer safety — its AI-generated nature must be stated explicitly.

One more line worth recording, from MEP McNamara: this is the first time the EU has explicitly banned nudify and face-swap apps by legislation. The worst uses of deep synthesis are now in written law.

## The real teeth are extraterritorial

The rules' scope does not stop at big companies: individuals, legal persons, media organizations, NGOs and ad agencies are all covered. The more decisive part is extraterritorial effect: as soon as an AI system or its generated content enters the EU market, the service provider is inside the regulatory perimeter — based in the EU or not, charging money or not.

Put into a Chinese developer's terms: the obligations attach the moment your app goes live in an EU-region app store. No European subsidiary needed, no paying European users needed; getting listed is enough to be reached.

Regulation is also sinking down to the models themselves: the EU AI Office has begun enforcing regulatory requirements on providers of general-purpose AI models, and advanced models that may pose systemic risk carry additional obligations covering cyberattack, loss of control, harmful manipulation and infringement of fundamental rights. The regulatory target has moved from the application layer down to the foundation models themselves.

## China's route runs on a different clock

Putting the Chinese and European lines side by side is instructive.

China legislates by scenario: generative AI services have a dedicated measures document, anthropomorphic interaction has a dedicated measures document, agents have an implementation opinion — one matter, one rule, chasing each scenario as it appears, fast to issue and finely sliced. The EU legislates in one unified act with phased effect: one law governs end to end, releasing obligations by risk tier and timetable — broad coverage, slow cadence.

For a developer's actual daily experience, the two routes mean two working modes. For the Chinese market, watch scenarios: building AI companionship means studying the anthropomorphic measures, building agents means studying the implementation opinion. For the EU market, watch the checklist: the transparency obligations are universal, and the full set applies the moment you enter the market.

## Three engineering changes you can make now

The checklist looks long, but at the engineering layer three items give the best return:

- **State the AI's identity on a conversation product's first screen**: one line saying "you are talking to an AI" costs almost nothing and satisfies the first-layer obligation outright;
- **Attach machine-readable marks at the content-generation exit**: write the metadata into the generation pipeline now, instead of retrofitting when a downstream party demands it;
- **Cut nudify and face-swap features outright**: it is statute in the EU, and on the Chinese side the personality-rights cases are lining up for verdicts this year — high-voltage lines on both ends.

## Closing

What is interesting is that the core word on the EU checklist is the same one in Chinese regulation and in the key phrases of the Baidu case's judgment: say it clearly. Say clearly that the other side is an AI, that the content is generated, where the source is. August 2 is one milestone; the high-risk system obligations of later phases are still in transit, and the checklist only grows. Building "labelable, traceable" into the product as a native capability beats waiting for the next notice.
