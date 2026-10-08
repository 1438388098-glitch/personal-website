---
title: "I turned my Zhuma wrong-answer book into a recitation notebook"
description: "A fully automated pipeline that reorganizes Chinese bar exam wrong answers into recitation-ready per-subject PDFs, with six-dimension cross review and a guard against silent errors."
category: 工程方法论
tags: [法考, Agent, 工程方法]
pubDate: 2026-08-22
---

When preparing for the Chinese bar exam, the wrong-answer book is the most valuable personal asset a candidate holds. My Zhuma bar-prep account had accumulated 1,655 wrong answers, but drilling them directly inside the app is a fragmented experience: the questions sprawl by attempt time or chapter, the same test point may sit scattered across dozens of questions, and the explanations are folded under a click layer — flipping back and forth never builds a coherent memory system.

So I wrote `zhuma-fakao-review`, an automated pipeline that scrapes, clusters and distills the whole wrong-answer bank, and finally typesets it into per-subject PDFs you can print and recite from directly.

## The main pipeline, four steps

The toolset keeps its footprint on the platform as light as possible:

1. **Authentication and scraping:** scan-to-login once in the local browser, save the local profile, reuse it afterward. Scraping calls only three read-only endpoints, single-threaded serial with rate limiting throughout, with exponential backoff and failure circuit-breaking, so as not to add load to their service. The 1,655 questions took about 9 minutes to scrape, and any interruption along the way resumes from the breakpoint.
2. **Study-profile Q&A:** before a run starts, the script asks a few key questions: which subject is weakest, which review round this is, how many days until the exam, how many hours a day you can recite. These study data go straight into the prompts of all downstream agents. For weak subjects, the generated knowledge-point sections automatically expand to 1.3 to 1.5 times the usual length; when the exam is under a month away, each subject opens by converging directly on the TOP 5 test points to recite first.
3. **Test-point merging:** drop the question-centered view and deduplicate and merge with the knowledge point as the minimal unit. High-frequency, easily-missed points that have been tested many times get tagged automatically, and how often a point has been tested directly decides how far it gets expanded.
4. **Typeset output:** the final render is per-subject PDF volumes plus a single combined edition of a hundred-odd pages. Contrast and grayscale are tuned specifically for black-and-white printers, key confusable points come with light-blue highlight blocks, and native bookmarks and a jumpable table of contents are included.

These four steps are the human-facing trunk; internally the agents are actually orchestrated into seven stages: scan-to-login, scraping, unit splitting, generation, six-dimension review, aggregation, rendering. Details on the [project page](/en/projects/zhuma-fakao-review/).

## Built for recitation, so it tolerates zero errors

For notes a candidate will recite, one hallucinated passage from a large model, or one statute pinned on the wrong article, means endless trouble downstream.

In the generation stage I designed a subject-by-dimension cross review: the finished content is dispatched to different sub-agents, each watching one of six dimensions — **statute accuracy, answer consistency, key-point coverage, typesetting format, study-profile fit, chapter cohesion**. Each review node has a single duty, and any P0-level legal error it finds forces a mandatory return, rewrite and re-review.

Here I also added an "anti-fake-green-light" gate for myself: the easiest mistake for automation scripts to make is for an upstream stage to throw an exception or fail format parsing while the aggregation script treats it as "no problems" and skips right along. I hardcoded the check into the merge logic: **as long as any downstream report has not been parsed completely, the script immediately hard-crashes with a non-zero exit code — a deceptively serene fake report is never allowed to be produced.**

## Running inside the compliance and safety boundary

After finishing the project, I did my customary round of self-review, and it slapped me on the spot: I found the early login script had saved state containing a 256-bit auth token in plaintext inside a redundant temporary file. Nothing ever went out, but it was a pure security hole; rated high severity, deleted immediately, with the auth state fully confined to the local isolated profile. I had originally given myself a high mark of 95; after the re-check I docked it to 90 in the audit document on my own initiative.

The boundary sits just as clearly in the README: the tool only processes wrong answers from my own legitimate account, the endpoints are strictly read-only; the generated notes are for personal offline study only, and no original question-bank content gets redistributed.

The biggest takeaway from building this pipeline: in application engineering on top of large models, do not put faith in the "one-prompt generation" black-box miracle. Constrain the boundaries, slice the process fine, make failures explicit — only then is the output something you truly dare feed to a printer.
