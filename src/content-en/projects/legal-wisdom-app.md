---
title: "legal-wisdom-app: a local statute library for legal research"
summary: "A desktop statute library of 257 Chinese statutes: FTS5 search, cross-references, AI Q&A grounded in the current provision; rebuilds from public data."
group: 法律主线
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-04-20
featured: false
order: 8
metrics:
  - label: Corpus size
    value: '257 statutes'
    detail: "70 statutes, 132 administrative regulations, 53 judicial interpretations, 2 supervision regulations; data current to 2026"
  - label: Data reproducibility
    value: '87MB'
    detail: "The database stays out of the repository (size and redistribution boundary); docs/repro.md rebuilds it from official public sources in one pipeline"
  - label: Interface languages
    value: 'zh / en'
    detail: "Switchable from the title-bar menu; covers UI strings only, statute text is never translated"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/legal-wisdom-app
---

## Problem and boundary

Looking up statutes needs to be fast, offline, and aware of which provisions relate to which. This desktop app packs 257 Chinese statutes and regulations into local SQLite; search, reading, bookmarks and AI Q&A all happen on the machine. Two boundary points stated plainly: full-text search is a hybrid of FTS5 and LIKE, where the unicode61 tokenizer treats a run of Chinese characters as one token, so Chinese substring queries fall back to LIKE; this is keyword retrieval, not semantic retrieval, and the citation-tracing hybrid evolved in statute-rag. Core codes (the Constitution, the Civil Code, Criminal Law) are not yet in the library (missing from the source corpus); the screenshots use a demo library of 7 public-law excerpts.

## Mechanism

A PySide6 desktop app: the built-in reader highlights chapter headings and article numbers automatically; reading a provision suggests related provisions with one-click jumps; the AI panel switches between DeepSeek, OpenAI, SiliconFlow and Zhipu, and "answer with the current provision" grounds the model in what you are reading. Search hits are highlighted; frequent provisions can be pinned. PDF/DOCX ingestion uses pdfminer and python-docx; the main retrieval path and provision references have unit tests. The database directory defaults to the user's home and can be redirected by environment variable; no release binaries, the PyInstaller script is do-it-yourself.

## Verification

Quality checks come in three layers; there is no automated retrieval-quality evaluation. Corpus scope is verified by the ingestion pipeline: the source corpus holds 263 (70 statutes, 132 administrative regulations, 59 judicial interpretations, 2 supervision regulations); 6 judicial interpretations failed to import, leaving 257 in the library, with the gap recorded in section 5 of docs/repro.md. The 87MB database stays out of the repository, and the rebuild pipeline (full import, provision-level splitting, cross-reference indexing) is three documented steps, with data current to 2026. Retrieval correctness rests on unit tests: 3 files, 33 cases in tests/, covering Chinese substrings via LIKE, English tokens hitting FTS with highlighting, FTS syntax injection not crashing, category filters, snippet extraction, and provision references: short and full names matching, repealed laws mapping to the Civil Code, reference direction, no self-references. Run with python -m unittest discover -s tests -v, including temporary-database unit tests and local real-database smoke cases. The bilingual UI has its own key-and-placeholder alignment tests. Retrieval recall is currently judged by human use; the golden-set evaluation lives in statute-rag. Screenshots are real PySide6 offscreen renders of the 7-statute demo library, not the full corpus.

## Known failures

Missing core codes is the most practical pitfall: the Constitution, the Civil Code, Criminal Law, the Administrative Litigation Law, the Labor Law and other workhorse statutes are absent; repro.md conjectures they were missing or failed at the source-corpus stage, with neither exact nor fuzzy title matches hitting. Judicial interpretations have a gap: 6 of the source 263 failed to import; the README's historical count says 59, the library actually holds 53. Search has a structural blind spot: unicode61 treats runs of Chinese as single tokens, so Chinese substring queries lean on LIKE while FTS serves English and numeric tokens; this is keyword lookup, not semantic retrieval. The documented improvement direction is the FTS5 trigram tokenizer (needs SQLite 3.34+ and an FTS table rebuild), not yet implemented. Language switching touches UI strings only; statute text is never translated. No release binaries; build the exe yourself with PyInstaller.
