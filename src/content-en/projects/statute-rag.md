---
title: "statute-rag: a hybrid statute retrieval foundation"
summary: "25,987 statutes ingested as discrete provisions; multi-channel hybrid BM25 plus mandatory citations make statute QA evaluable and traceable."
group: 法律主线
date: 2026-05-20
featured: true
order: 1
relatedPosts:
  - 2026-07-28-statute-rag-recall
  - 2026-10-04-jev-rerank
  - 2026-10-04-lexicon-and-gates
  - 2026-09-18-rag-search-liability
metrics:
  - label: Blind holdout recall@5
    value: '92.0%'
    detail: "Measured on 100 isolated blind-written questions: 66.0% for the local pipeline, 92.0% with the LLM rerank layer, exactly the candidate-depth ceiling; the chat judge and the judge model Jev both score 92.0%, with Jev sharper at the top (R@1 84.0%), 1.3 s per question, $0.00037; lexical baseline 33.0%"
  - label: Real-question recall@5
    value: '71.1%'
    detail: "Measured on 38 real questions from the web: lexical 52.6% up to 71.1%; 89.5% with a larger-model rerank layer (that set is a tuning sample, reference only)"
  - label: Deep-recall ceiling recall@30
    value: '97.4%'
    detail: "Top 30 of the same ranking: only 1 of the 38 questions falls outside"
  - label: Corpus size
    value: '25,987 provisions'
    detail: "444 statutes; Criminal Law is the consolidated version including all 12 amendments, and two later rounds added the full text of 13 missing statutes"
links:
  - label: Live retrieval (no install needed)
    url: https://iweistoicqc5.top/law/
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/statute-rag
  - label: Jev rerank layer in practice (quality / speed / cost)
    url: https://github.com/1438388098-glitch/statute-rag/blob/main/docs/retrieval-jev-rerank.md
  - label: Evaluation details (real questions, one by one)
    url: https://github.com/1438388098-glitch/statute-rag/blob/main/docs/real-question-eval.md
---

## Problem and boundary

The most dangerous failure in legal QA is citing the wrong provision; a slow answer is a lesser problem. The boundary here is equally clear: this project builds the retrieval foundation and citation tracing only, not end-to-end legal advice. Every result must carry a verifiable source (statute name, article number, original text). A mis-cited article is worse than answering "not found".

## Mechanism

The corpus passes through three quality gates and is then ingested with the provision as the retrieval unit. Retrieval has three layers.

The first layer is lexical hybrid: character-bigram BM25 over the original query (inverted index, about 13 ms per query), BM25 over a synonym-expanded query (a 367-entry general dictionary mapping colloquial phrasing to legal language; expansion only adds terms, never removes), and exact LIKE matching, fused with weights. This layer has zero third-party dependencies and is bit-identical whether or not the semantic layer is installed.

The second layer is semantic reranking (optional dependency, runs on CPU): two Chinese embedding models (bge-small and bge-base, 512/768 dimensions) precompute vectors for every provision offline; at query time each candidate takes the better of the two models' ranks, the semantic top 50 joins the recall pool, the pool is fused with the lexical ranking by weights, and a cross-encoder reranks the top 10. All outputs carry provision IDs so upstream applications can jump back and verify.

The third layer is precision reranking (optional, off by default): the pipeline's top 50 candidates go to a judge together with the question, which lifts the at-most-5 best-answering provisions to the top. The contract matches the rest of the pipeline: the model may only reorder, never invent a provision that is not on the list; if the API fails or returns a malformed payload, the whole layer is skipped and results pass through in the original order, so retrieval never dies because of this layer. The judge has two interchangeable implementations:

- **General LLM judge**: an OpenAI-compatible API where the model returns a JSON array of rank numbers. Production ran the free-tier longcat model through OpenCode: about 4k tokens per call at zero cost, with tail-latency requests reaching 23 seconds.
- **The judge model Jev** (TypeSafe's System One model): it does not write prose, it only makes decisions, returning a structured verdict per candidate (single-choice probability, a 0 to 3 score, or yes/no). All 50 candidates are judged in one call and sorted by probability. On the paid tier: 1.3 s per question, about $0.00037 for 8,755 input tokens, holdout recall@5 identical to the LLM judge at 92.0% but sharper at the top (R@1 84.0% vs 82.0%). The frontend shows each result's verdict score and the model's confidence.

Configuration is entirely environment-variable driven; model keys live only in a root-only env file on the server, never in the repository, never in the code directory, never in any API response.

The retrieval page is live, no installation required: [iweistoicqc5.top/law](https://iweistoicqc5.top/law/). The "precision rerank" switch right of the search box enables the third layer (production currently runs the Jev judge, measured at 1.3 to 2 seconds per call); with the switch off you get the lexical layer (a couple of dozen milliseconds, offline, zero cost). The third layer sends only candidate provision numbers and text, no user identity; when the server has no model key configured, the switch disables itself and says so honestly. With the switch on, each result shows a "Jev score" bar, and hovering reveals the confidence for this question and the tokens spent: the grounds for the verdict are laid out, not black-boxed.

**The live demo and the repository measure 92.0% on different configurations**, and this needs to be said plainly. The 92.0% is the full local pipeline (lexical → semantic reranking → LLM rerank layer) on holdout questions. The demo server has 2 cores and its memory is exhausted into swap; it cannot host the three semantic models (about 1.6GB combined), so production runs only the lexical and LLM-rerank layers. The same 100 holdout questions score 57.0% on this reduced setup: the lexical layer gets 57 questions into the top-50 candidate pool, and the rerank layer lifts all 57 into the top five, none lost; the missing 43 were never retrieved at all. In other words, the rerank layer did its job and the bottleneck is recall; the semantic layer not fitting on that machine is the entire gap between the live and repository numbers. The 57.0% was measured with the free chat judge; after the switch to Jev neither corpus nor config changed, and the reduced setup has not been re-measured with Jev, so I will not pre-credit it a number here.

Two lessons are worth recording. Treating semantic results as a "fourth retrieval channel" and fusing them directly lets the semantic top 100 march in as a bloc and pushes out correct provisions with weak lexical evidence; real-question accuracy dropped as the weight rose. The right structure is two stages: semantics only reorders what lexical fusion already produced. And simply swapping in bigger models (a 4x larger embedding model, a 24-layer reranker) gained nothing; the real increment came from two different models' ranks covering for each other.

## Verification

### Where the numbers come from

Three golden sets, three measurement scopes, all public, every number reproducible from the repository docs: the evaluation report is generated into the database by script, metrics.json is the single source of numbers, and CI verifies both READMEs against it on every push.

### What each golden set measures

**Real-question golden set, 38 questions** (verbatim questions from the web): lexical hybrid recall@5 is 52.6%; with semantic reranking 71.1% (27/38); the top 30 of the same ranking reaches 97.4%, only 1 of 38 outside. Per-question details are public in the repository docs.

**Blind-written isolation set, 100 questions** (the primary scope, expanded below): two rounds, same configuration, measured once each.

**Synthetic golden set, 177 questions** (the questions are distinctive phrases from the provisions themselves): from 100% to 99.4%; the one lost question is a correct provision pushed out of the top five by semantic reranking, the honest price of the mechanism.

### Blind isolation set, round one: two contamination findings

Round one, 100 questions (the question writers never saw the corpus or the code): lexical hybrid hit 70, and 90 with semantic reranking. A post-hoc review found two contaminations:

- 32 question stems overlapped the target provision by 8+ characters (median 6, longest 24, nearly verbatim statute text). Sorted by the same yardstick, the lexical layer hit 96.9% in the "nearly verbatim" band but only 29.0% in the "true paraphrase" band.
- The fusion weights between the semantic layer and the cross-encoder were tuned on exactly this question set.

So round two was written under isolation discipline: four question writers, each unaware of the others, 25 questions each, forbidden from reading any file of this project or of the user directories; every stem a natural-language paraphrase (at most 5 overlapping characters with the target provision, none reaching 8). Of round two's 100 questions, 95 were testable (for the other 5, the cited statute text was not in the corpus: Trademark Law, Price Law, Road Traffic Safety Law, Regulations on Paid Annual Leave for Employees, Law on Prevention of Juvenile Delinquency). Recall@5 on the same configuration: 64.2% (61/95), with the lexical baseline at 28.4%.

### Blind-written finals after the corpus gap was closed

Those 5 gaps (plus 1 alternate pointing at the Anti-Domestic Violence Law) were filled into the corpus through the same mirror gates as the original ingestion: 6 statutes, 361 provisions. **Corpus v7 = 25,987 provisions / 444 statutes**, a pure append: not one provision id or line number moved, and the lexical numbers on all three old golden sets are bit-identical to v6. With the gap closed, all 100 round-two questions became testable, and the same configuration measured:

- lexical baseline: 33.0%
- local pipeline (lexical + semantic reranking): **66.0% (66/100), the blind-written number with no tuning suspicion.**
- with the LLM precision layer (third layer): **92.0% (92/100)**

### From 66% to 92%: what was tried and why this worked

To push 66% toward 90%, I first built a systematic experiment bench ("one budget, sweep parameters in seconds"; it is calibrated to reproduce runtime numbers bit for bit, and any conclusion from an uncalibrated bench is discarded) and swept 15 variants: cross depth and weights, rerank that only promotes, best-rank fusion, semantic-first, semantic rank aggregation methods, pool depth, query variants, embedding model combinations, a bigger cross-encoder, a third embedding family. **All flat or worse.** The LLM and the third embedding family measured 37 s per query and 3.4 h per full-corpus pass; abandoned on sight.

The diagnosis: 91 of the 95 questions already had their right answer inside the recall pool, and 29 of the 34 missed questions had their answer within the semantic top 30. The bottleneck is the ranker's ability to tell "semantic neighbor" from "actual answer", which is where small CPU models max out.

The 90% finally came from the third layer: the pipeline's top 50 go to an LLM that picks the 5 best. Configuration chosen only on the tuning set, each configuration measured exactly once on the holdout (a single temperature-0 run jitters by plus or minus 2 questions). The free longcat and the paid reference deepseek both scored 92.0% (92/100), exactly the candidate-depth ceiling; all 26 questions originally ranked 6 to 50 were rescued, none pushed out. For the remaining 8, the golden answer was never inside the top 50 (7 not even in the top 100): all colloquial paraphrases of abstract rules, a recall gap that no better rerank model can fix. The per-question list and the improvement directions (indexing chapter headings, among others) are in the repository docs.

### Two corpus blood-transfusions and one pure append

- The earliest 14,212 rows were not provisions but page blocks sliced by length from two-column gazette PDFs. They were replaced wholesale with verified provision-level text: 130 golden-sample statutes restored verbatim at 7,339/7,340, and 26 statutes matched provision-for-provision against an independent compilation.
- The Criminal Law main text was swapped for the consolidated version with all 12 amendments, making 53 "之N" provisions (drunk driving, the aiding-cybercrime offence, the personal-information offence) searchable for the first time.
- Gaps measured by the blind-written set were filled with the full text of 7 statutes: Social Insurance Law, Work Injury Insurance Regulations, Copyright Law, Patent Law, Environmental Protection Law, Tax Collection and Administration Law, Consumer Rights Protection Law; the testable rate went from 89/100 to 100/100.

The golden sets themselves then passed a new structural gate: the validator caught 8 migration artifacts ("the interpretation of 21 provisions labeled as Article 48") and 4 stale-law evidence entries, since aligned verbatim to current text (Public Security Administration Punishments Law 2025, Civil Procedure Law 2023, Labor Dispute Interpretation (II) 2025), each with audit fields.

### Ablation log and the one disclosed tuning decision

- The lexical expansion-channel weights were re-swept on the v6 corpus and landed at 1.5.
- Four candidate designs for the semantic layer (fourth channel, raw cosine scores, pure-Python vector lookup, a bigger model) measured no gain or harm; all removed under discipline, joining the earlier BM25 tuning entries on the negative-results list.
- The one tuning decision to disclose: the fusion weight between semantic and cross-encoder ranks was chosen on round one's blind-written questions. From low to high the weight mapped to 87 through 90 hits, a monotone climb that says the direction is real; but the specific 90% figure contains tuning, and real-question scores were flat across that range.

The honest level after removing both contaminations is round two's 66.0% (lexical 33.0%, corpus v7); the two layers of the gap are quantified in the repository docs: about 20 points from near-verbatim stems, about 10 points from in-sample optimism.

### The cross-rerank ledger

Cross-encoder reranking nets a gain on written questions (the round-one true-paraphrase subset +6.4 points, round two +7 hits) and nets a loss on real colloquial questions (real 38: 71.1% with it, 81.6% without). It stays because the target scope is the blind-written set; a product serving real questions should turn it off.

## Known failures

- **One statute could not be extracted cleanly.** The Supreme People's Court reply on the conditions for advance payment from the basic medical insurance fund: the gazette interleaves the "notice" block with two-column body text. Better absent than polluted; the statute is missing from the corpus and recorded in the gap list.
- **79 statutes have a single public mirror source**, never verified verbatim against the official database (it needs a browser session; scripts get blocked).
- **34 round-two questions missed the top five.** With the LLM rerank layer attached, every miss whose answer was inside the top-50 pool was rescued (26, none pushed out); for the remaining 8 the answer was never inside the top 50 (7 not even in the top 100): illegal absorption of public deposits, probation conditions, tort jurisdiction, pre-litigation preservation, the scope of administrative litigation acceptance, refusal to execute detention, the voluntariness of people's mediation, trade-secret infringement. All are colloquial paraphrases of abstract rules whose semantic neighbors are procedural provisions of the same field: a recall-side gap. Better recall measures (indexing chapter headings, for example) are the fix; a better rerank model is not.
- **5 more questions cited statutes whose text was not in the corpus** (before the fill): no algorithm can return those. All 6 statutes have since been added, and round two's 100 are now fully testable.
- The colloquial question "do you go to jail for drunk driving" now retrieves Article 133-1 of Criminal Law, but **pure scenario descriptions are still stolen by adjacent-field provisions**.
- **The mock questions (synthetic golden set) are near saturation on the clean corpus, by construction**: the stems are distinctive phrases from the provisions, so this set guards against catastrophic damage, not fine-grained regression; the other two golden sets cover discrimination.
