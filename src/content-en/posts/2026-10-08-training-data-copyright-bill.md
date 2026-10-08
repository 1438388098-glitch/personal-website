---
title: "The copyright bill for training data arrives at the input end"
description: "The copyright bill for training data has reached the input end: Munich held model memorization is infringement, California split training from sourcing, Anthropic paid 1.5 billion dollars, and Shanghai wrote LoRA fine-tuning into infringement."
category: 热点快评
tags: [AIGC, 判例]
pubDate: 2026-10-08
---

The copyright chain of AI content has three segments: whether a generated work is protected is the output end; how content travels is the distribution end; where the training data came from is the input end. I have written about [two domestic cases on the output end](/en/blog/2026-05-27-aigc-copyright-two-ends/), and about [the liability boundary of retrieval tools](/en/blog/2026-09-18-rag-search-liability/) on the distribution end. The input end long had plenty of opinion and no bill. This year the bills started arriving, and none of them is small.

## Munich: memorizing is infringing

On November 11, 2025, the Munich regional court in Germany ruled that OpenAI infringed copyright by training on nine song lyrics from the catalog of GEMA, the German music licensing society, without authorization. The court's reasoning took a step further: the model's memorization of the lyrics, and ChatGPT's reproduction of them in its output, each constitute infringement. OpenAI argued that its models "do not store or copy specific data, they only reflect what they have learned"; the court did not accept it. The ruling can be appealed, but it has nailed down an intuition that used to float: absorbing a protected work during training is itself within copyright's reach.

## California: training and sourcing are judged separately

The American route split the question in two. In June 2025, the Northern District of California, in the authors' case against Anthropic, held that training a language model on lawfully acquired books is transformative and can be fair use, but downloading and permanently retaining pirated copies is itself infringement. Per court filings, Anthropic had downloaded more than 7 million books from pirate libraries such as Library Genesis. On July 20, 2026, the court approved a 1.5-billion-dollar class settlement covering roughly 500,000 works, about 3000 dollars each, the largest copyright payout in American history; the deal also requires destroying the downloaded copies. Same defendant, same books: how the goods were obtained cost far more than what the training was for.

## Shanghai: fine-tuning counts as use

The bill does not only reach model vendors. On November 3, 2025, the Jinshan District Court in Shanghai issued a first-instance judgment in the city's first AI-model copyright case: a user captured some twenty images of the character Medusa from the anime Battle Through the Heavens, fine-tuned a LoRA model with a platform feature, and published it. The court found infringement of the reproduction right and the right of communication through information networks, awarding 50,000 yuan. The model provider, having promptly taken the model down and updated keyword filters after receiving the complaint, was held to have fulfilled its notice-and-takedown duty and bears no joint liability. An individual hobbyist's "I was just fine-tuning" meets the same sentence pattern as Anthropic's "we were just downloading".

## The rulemakers are catching up

Rule supply is following. In March 2026, Li Jian, head of the Supreme People's Court's third civil division, revealed that the SPC is drafting a judicial policy document to clarify the originality test for AI-generated works and the legal nature of training on data. Publishing moved earlier: since September 2026, publishers have been printing "no use for AI training" notices on copyright pages, and 22 publishing and media organizations have jointly advocated "license first, use later". In extreme cases the criminal red line applies too; Article 217 of the Criminal Law sits in the same range.

## The logic of the bill

Read side by side, the three jurisdictions are doing the same thing: taking apart the intuition that "training equals learning". What falls out are three independent questions: where the data came from (lawful sources or pirate libraries), how it was used (memorizing reproduction or transformative use), and who answers for it (the vendor, the fine-tuner, or the platform). Munich answered the European version of the second question; California answered the first and the second separately; Shanghai brought the first question down to the individual.

For anyone building products, the way to read this bill is plain: a dataset's source list will become standard issue, like an ingredients label. Before fine-tuning on your own captures, think of Medusa's 50,000 yuan; before weighing a training corpus, think of the 7 million books that compounded into 1.5 billion dollars. The era of unexamined inputs is over. The reason is plain: the bills have been delivered.
