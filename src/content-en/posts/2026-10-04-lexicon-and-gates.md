---
title: "Added 240 synonym entries to statute retrieval; only 2 more questions right"
description: "The synonym lexicon grew from 127 entries to 367; the bottom retrieval layer gained only 2 more hits and the two layers above did not move at all. The same day also reworked the retrieval page against real-device screenshots, and traced why CI had been red five days straight."
category: 技术笔记
tags: [检索, 评测, 踩坑记]
pubDate: 2026-10-04
---

Today's main line on this project was swapping the rerank layer's judge, pushing the second-round blind-written questions from 66.0% to 92.0% — that got [its own post](/en/blog/2026-10-04-jev-rerank/). Most of the rest of the day went three ways: spreading the synonym lexicon from 127 entries to 367, reworking the retrieval page against real-device screenshots, and tracing why CI had been red five days running.

Not one of the three could move that 92.0% by a notch. But each left behind a conclusion more useful than I expected.

## The lexicon more than doubled; only 2 more questions hit

The first layer of statute retrieval is lexical. Users ask in colloquial speech — "my boss won't pay my social insurance, what do I do" — while the provisions say "social insurance premiums"; the literal strings do not match. So the lexical layer keeps a dedicated channel that retrieves once more with the synonym-expanded question, expanding "won't pay social insurance" into "social insurance premiums". This channel only adds, never modifies: the original sentence keeps its own channel, the expanded phrasings open another, and both count. The mapping table is `statute_rag/synonyms.json`.

v1 had only 127 entries, the most conspicuous batch of colloquialisms: doing prison time, visiting an inmate, social insurance, landlords. This round spread it across what people actually ask in daily life: labor and social insurance (paying into social insurance, the five insurances, medical insurance, pension, unemployment benefits), marriage and family (an affair, custody, visitation rights, adoption, bride price), consumption (seven-day no-reason returns, order brushing, deposits, prepaid cards), housing and property (the second landlord, the owners' committee, forced demolition, keeping a dog), traffic (running red lights, hit-and-run, license-plate cloning, vehicle impoundment), lending (the IOU, upfront interest deductions, compounding interest, online loans, the guarantor, pig-butchering scams, violent debt collection), criminal matters (a criminal record, the assistance-to-cybercrime offense, laundering proceeds for others, release on bail pending trial, administrative detention, serving a sentence outside prison, pyramid schemes) — plus the evidence-and-procedure category: recordings filed under audio-visual materials, chat logs under electronic data, failing to appear at trial filed under default judgment. All told, 367 entries.

What the scores bought: the lexical baseline on the second round's 100 blind-written questions moved from 31.0% to 33.0%, two more questions retrieved. The real questions' 52.6% on 38 questions did not move, nor did the synthetic set's 100.0% on 177 questions.

What is truly worth recording is that not one downstream number moved. The semantic layer was re-tested in full against three golden sets: real 71.1%, holdout 66.0%, synthetic 99.4% — flat to the digit. The rerank layer's 92.0% held the same way. The only number that moved was the first round's tuning set, 90.0% down to 89.0%, one question fewer; recorded as is.

Only one explanation holds water: the 2 newly retrieved questions had already been merged into the candidate pool by the semantic layer, and the rerank layer would have lifted them to the front anyway. The lexical layer's extra step got absorbed downstream, twice over. What this means is that a lexical baseline stuck at 33.0% is not the most urgent thing to fix. The pool's water level is held up by the semantic layer and the rerank layer; scooping two more from inside the pool does not show on the report card.

## The lexicon was checked entry by entry against the corpus

v1 contained 13 mappings whose phrasings could not be found in the corpus even once. The table said "driving under the influence of alcohol"; the corpus's only phrasing was "driving after drinking alcohol". The table said "real estate ownership certificate"; the corpus has "real estate ownership title certificate". The table said "online catering"; the corpus has "online food trading". The table said "treble damages"; the corpus has only "treble". Entries like these look plausible sitting in the table, never hit at retrieval time, and hold a slot while doing no work.

So this round's expansion began with a rule: every new entry gets a substring-hit check against the corpus, and zero hits means rewriting it into the phrasing the corpus actually uses. Those 13 stale v1 phrasings above were fixed exactly this way.

Working the other direction, some entries deserved deletion. "Street vending" mapped to "occupying roads for business", but no provision in the corpus could receive it — deleted. Several other candidates were rejected before being written during the expansion: paternity leave, black housing agents, teachers — same reason, no provision behind them. The health-supplement category was more troublesome: measured gain net zero, and it brought back a known ranking regression, so it did not stay either.

## The retrieval page: reading the sentences smooth, line by line

No new features in the interface this round; every change was read off real-device screenshots one by one.

Hit terms used to be blue underlines, visually identical to in-site links. Three or four occurrences in a paragraph read like a run of broken links. They are now a light-blue wash, a shape distinct from links. The wash marks exactly the span the literal channel actually matched — not drawn freehand.

The body used to open by repeating the article number: the line above already says "Article X of [statute]", and the body started over with the same number. Fixed in the display layer only; what gets copied out is still the API's original text.

"Recently searched" used to be one item per line, the sentence filling half a line and throwing off a large blank to the right; seven or eight items filled the first screen. Now a two-column grid, with a hairline pressed over each item.

Channel labels (literal, expanded) went from blue outline to gray. They are provenance metadata and should not fight the provision text for attention.

The canvas narrowed from 60rem to 54rem, and body line-height went to 1.8. A line used to run nearly ninety characters; reading it was tiring.

The "deep rerank" status moved from beside the corpus badge in the top bar into the result status line. The top-bar badge says how many provisions the library holds in total, which has nothing to do with this query; when it covered the status, information was being lost.

Restored the main-site entry. The page hangs under the personal site's `/law/`; there used to be a way in but no way back.

Narrow screens measured at 375px with no horizontal overflow; the input box takes a full line, with the depth toggle and the button lined up on a second row; the numbering is fixed-width, 1 and 10 occupying the same width.

## A gate that had been red for five days

Pushed the changes and CI was red. Habit says suspect this change first, but the two failed checks had nothing to do with what changed this time. Scrolling back, the last green was September 28: from that afternoon's two commits (the interface rework, switching the API to relative paths) onward, every commit was red, and nobody looked in between.

The root cause was two things biting each other. The repository has a gate script whose only job is to verify that the unit-test count declared in the README matches what actually runs. But 17 cases in `tests/test_app.py` depend on the demo corpus; when the corpus is absent the whole batch is skipped, and skipped cases never enter `Ran N`. The demo corpus, meanwhile, is a generated artifact listed in `.gitignore`. And CI's step order happened to be "run the full test suite first, verify the count next, and only then generate the demo corpus" — so on the CI machine the demo corpus necessarily does not exist, and those 17 cases necessarily get skipped. Local: 237 cases; CI: 220. Whichever value the README declared, it could not match, and the gate necessarily failed.

The fix extracts demo-corpus generation from the script into a `build()` shared by the command-line entry and the tests; when the tests find the corpus missing they generate it on the spot instead of skipping. The count is therefore pinned at 237. Both situations verified: corpus present and corpus absent, both read `Ran 237 tests OK`; the generator script's command-line behavior is unchanged, and fixed seeds produce byte-identical files.

This one beats the previous two for the notebook. A gate that stays red long-term is no gate. For five days, every push that showed red drew the first reaction "this change broke something", and nobody asked whether the ruler itself had broken.

## What these three things have to do with the 92%

What actually pushed the number up today was the judge swap, and its gain came not from finer algorithm tuning but from a model that judges better. The lexicon, the interface, the gate — none of the three touches that 92.0%.

But whether that 92.0% can stand depends on them. With the lexicon verified entry by entry against the corpus, the retrieved article numbers are not decoration; with the gate alive, the counts in the README are worth believing; with the interface reading smooth, users will open a provision to read the original text. The ceiling is set by discriminative power; credibility is set by this work that moves no score.

The retrieval page is live, and this rework is on it: [iweistoicqc5.top/law](https://iweistoicqc5.top/law/).
