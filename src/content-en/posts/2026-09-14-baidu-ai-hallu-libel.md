---
title: "AI 'sentenced' a lawyer to three years; the court ordered Baidu to apologize"
description: "Baidu's AI search fabricated a lawyer's three-year prison sentence; both instances found reputation infringement as the three defenses — technological neutrality, unforeseeable hallucination, leading questions — were sealed off one by one. From an engineer who built a statute verification tool."
category: 热点快评
tags: [AI幻觉, 判例, 司法]
pubDate: 2026-09-14
---

Search Baidu for "how many years was lawyer Li Xiaoliang sentenced to", and the AI search box once popped out this passage: "Three years. Lawyer Li Xiaoliang was sentenced to three years of fixed-term imprisonment. According to exploration results, the defendant Li Xiaoliang was sentenced to three years of imprisonment for the crime of explosion."

The best part: next to the text sat a neatly formatted formal portrait of Li Xiaoliang himself, wearing his lawyer's robe.

Li Xiaoliang is a fully licensed practicing lawyer in Nanjing. His connection to "the crime of explosion" and "three years of imprisonment" has an utterly absurd basis: the AI made it up off the top of its head.

The case fought its way to second instance, and in March this year the Nanjing Intermediate People's Court upheld the original ruling: Baidu committed reputation infringement and must publish a written letter of apology to Li Xiaoliang. The judiciary's attitude was crisp and clean: when the machine talks nonsense, the platform underneath does not get to shift the blame.

## An absurd timeline

The whole thing actually started from a purely passive position.

On September 25, 2024, Li Xiaoliang typed in the Baidu search box, and the autocomplete suggestions showed, in plain sight, "how many years was Nanjing's lawyer Li Xiaoliang sentenced to". On September 30, he clicked in and searched along the thread, and the AI smart summary flatly issued that absurd "explosion crime, three years" from the opening of this post.

From the victim seeking redress to the final ruling took a full year and a half. After the judgment took effect, Baidu was in no hurry to comply, the settlement talks collapsed, and only in May this year, when Li applied for enforced execution, did the story finally become impossible to contain and hit the press.

## How the judges sealed off Baidu's defenses one by one

The hearings were worth watching; the court sliced through Baidu's three lines of defense very finely.

**First line of defense: technological neutrality.** Baidu insisted it only does indexed search, never tampered with data, and cannot govern every third-party page on the whole web. The judge drew the distinction precisely: if it were only the search suggestion terms and the related web links below, there would indeed be nothing to fault; but the "AI smart answer" block at the top is different in kind: it is a processed synthesis, the algorithm kneading texts from different sources together with the portrait photo and piecing them back together. Once you have done the synthesizing with your own hands, you carry the producer's liability.

**Second line of defense: hallucination is a defect the industry cannot foresee.** Baidu's argument sits well with technical ears: "Every AI at the present stage hallucinates, no one can foresee it — how does that count as fault on my part?" The judge's counter-question cut deeper: if it is an industry-wide condition, why did the same question typed into Doubao or DeepSeek not fabricate a lawyer who commits explosion crimes? Legally speaking, this is lethal. In engineering, hallucination may be an occasional probability; but once the probability turns into a concrete fact of infringement landing on a victim, in the judge's eyes, this is called fault.

**Third line of defense: the user was asking leading questions.** Baidu blamed the plaintiff for "repeatedly using leading phrases" that dragged the model astray. But look at the sequence of events and it turns comic: a loaded autocomplete entry like "how many years sentenced" was pushed by Baidu's own algorithm in the first place. The algorithm handed the user a knife, the user clicked along it once, and the platform turned around to accuse the other side of malicious inducement — a logic that hangs itself.

Beyond these three, Baidu also solemnly reminded the court in the hearing: this was "the nation's first foundation-model infringement case", the breadth of the ruling would gravely implicate the growth room of an emerging industry, and the court was asked to show restraint.

The final judgment: Li Xiaoliang's claims for economic loss and emotional damages failed for insufficient evidence, the court ordered only a public apology, and not one yuan of economic compensation was awarded. The "industry-devastating" catastrophe Baidu braced for landed as a single sheet of apology letter.

The calibration is restrained. The judge did not club foundation models to death with one blow, did not follow the fashion of astronomical damages, but the red line drawn is rigid beyond doubt: however many times you invoke the "technological exploration period", once the platform has stepped into reassembly and processing, forget about getting blanket immunity.

## Why this case grips me

In my spare time I have been building retrieval aids for legal provisions, grappling with large-model hallucination at close quarters every day. This year I built a tool called [legal-hallu-guard](/en/projects/legal-hallu-guard/) on a deliberately simple idea: shatter the statutes in an AI reply into fragments and slam each one, head-on, against a database holding 14,212 rows of statute corpus.

Invented provision numbers, patchwork legal jargon, baseless inferential assertions — all intercepted by deterministic rule logic, with no large model anywhere in the loop. Across 550 nasty test cases, the interception rate for the three fabrication classes is 100%, with zero false kills on legitimate provisions.

While writing the code I keep turning one question over: how exactly should hallucination be defined in law?

From an engineer's seat, it always looks like nothing more than a bad case — add a constraint to the context, stack on a few more validation layers, fixed. Baidu's legal team probably rode this same mental model into litigation.

The court, however, laid out the harsher side of reality: in a code repository, a technical bug is a to-do item; once it enters a written judgment, its name is "infringement fault".

The two worlds are not actually in conflict. Engineering tools probe the safety boundary; judges weigh the cost of harm. For people who work in technology, the priceless thing in this judgment is the characterization carried by the phrase "processed synthesis". It means: no matter how many rows of gray disclaimer fine print you add up front, however elaborate the RAG architecture in the back, however fast you delete data after the incident, none of it offsets the basic duty of care owed at the moment the finished product is delivered.

## Closing

On September 7 this year, the Supreme People's Court issued adjudication rules involving artificial intelligence, and the standard for pursuing liability over AI-generated infringement finally has a unified reference.

Li Xiaoliang's fight against Baidu spread this messy ledger fully under the sunlight: for the first time, the judiciary has put a price tag on AI gibberish. Even if the opening bill is only one thin page of apology, the rule now stands, and the cost of writing bad checks will only climb from here.
