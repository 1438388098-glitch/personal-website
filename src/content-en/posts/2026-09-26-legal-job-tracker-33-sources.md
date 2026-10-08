---
title: "Job-hunting season: I set a scraper to watch 33 official sites"
description: "33 official job sources: dedup that would rather miss than merge wrongly, fake green lights, the daily two-to-five-minute run."
category: 技术笔记
tags: [求职, 工程方法, 检索]
pubDate: 2026-09-26
---

This autumn's recruiting season I am targeting legal positions: law firms, the system within the establishment and public institutions, local SOEs, and in-house counsel. But in practice, revising a CV takes little effort; what actually consumed my energy was finding the announcements.

Legal hiring information is scattered, with no official hub that covers it all:

- provincial courts post contract-staff and support-role recruitment under their court columns;
- public-institution exams are mixed into the notice feeds of city-level human-resources bureaus;
- lawyers associations periodically publish firms' hiring needs;
- SOE legal positions sometimes live on a second-level page of a local SASAC website;
- and plenty of grassroots government posts appear exactly once, via a WeChat account.

These announcements carry short application windows; miss a few days and there is no make-up. Campus-recruiting aggregators, meanwhile, center on internet and big-company hiring, with essentially no coverage of grassroots courts and procuratorates in the Pearl River Delta, local SOEs, or local law firms.

On September 15, after several days of manually flipping through dozens of websites, I stopped and spent a few days writing a program: every site that can be scraped automatically gets a monitoring script; channels that cannot be automated go onto a fixed manual-follow-up list. One core goal: never again lose an opportunity to a missed announcement.

## Mapping the channels: adapting and pruning 33 sources

The first step was the target list. I went through the human-resources bureaus, courts, procuratorates, lawyers associations and provincial authorities across the Pearl River Delta, recording each page's structure and scrapability, and settled on 33 entries worth long-term monitoring.

Testing sorted the sites into three classes:

**Directly scrapable (13)**: mostly the provincial HR department's column, city HR bureaus, and the Foshan and Huizhou lawyers associations. The pages are ordinary static renders, but old sites carry plenty of detail problems:

- one provincial government site has a broken HTTPS certificate configuration, so requests must downgrade to HTTP or skip verification;
- a few old sites still serve GB2312, needing manual transcoding before parsing to avoid mojibake;
- Shaoguan's HR bureau's regular full-pinyin domain `shaoguan.gov.cn` is unreachable; the working domain is `www.sg.gov.cn`.

**Abandoned automation**: the Shenzhen lawyers association renders everything client-side in JS, so plain HTML scraping yields nothing; the CUPL career site sits behind a strict WAF and answers 403 to programs. Breaking these with headless browsers or bypass tricks costs more to maintain than it saves, so I dropped them for scheduled manual follow-up.

**WeChat-account-only channels**: no fixed web page; these join the manual pipeline, with scattered announcements entered into the database for unified management.

For the 13 scrapable pages I wrote adapters as "config + CSS/XPath selectors". Small page adjustments later usually mean editing selector rules in the config, not reworking the scraper core.

## The rakes stepped on in real operation

Getting the scripts running locally is easy; running them unattended exposed edge cases I had not predicted.

### 1. Job dedup: rather redundant than wrong

I first wrote cross-source dedup to merge the same posting forwarded across sites. But the "short title" field I chose often came back empty, disabling dedup entirely.

After fixing that field, a worse failure appeared: two different firms posting a "paralegal" role on the same day, with identical titles, got silently merged into one.

A job-hunting tool's core is information completeness; a tidy UI is secondary. I tore up the merge rule and replaced it with a strictly four-condition gate: cross-source, title at least 10 characters, highly similar bodies, and publication dates within 45 days, all required to merge. Two similar cards in the list now and then beats one lost job.

### 2. The monitoring page's "fake green light"

While maintaining some adapters I had written the exception handling too loosely. When an interface failed outright, from anti-scraping or the network, the function returned an empty list, the system read it as "no new announcements today from this site", and the monitoring page stayed green.

An offline test reproduced it, and I restructured the logic: if every target-keyword request in a run dies, the program must raise explicitly and mark the source faulty, so silent failure cannot hide missed updates.

### 3. Code overwriting wiped a field

After one config adjustment, every newly ingested job's "category" field came in empty. An hour of digging found the cause: during a batch edit I had left two functions named `main()` in `seed_sources.py`, and the later, empty one silently overwrote the earlier logic. Since then, a global symbol check after batch edits is on my pre-commit checklist.

### 4. SQLite's concurrent read-write lock

During the scraper's minutes of bulk writes, clicking "mark read" on the frontend would spam the console with `database is locked`. The fix: enable SQLite's WAL (write-ahead logging) mode and raise the timeout parameters, which resolved the write-versus-read lock conflict completely.

## The current workflow

After a few rounds of grinding, the tool now runs a full scrape on schedule daily. Some government sites respond slowly, so slow sources get a 90-second timeout, and the whole run finishes within 2 to 5 minutes.

Daily use has been compressed to almost nothing:

- **Deadline first**: the page opens sorted by deadline ascending; jobs closing within 3 days highlight automatically, and a desktop notification reports how many close today;
- **Query expansion**: a synonym bank for legal roles, so searching the targeted-civil-service short form auto-links the full form; recall for law-firm postings rose from 28 early on to 89;
- **Experience parsing, with guardrails**: the CV parser strictly separates education from internships by paragraph, avoiding the "campus years counted as work years" bug common in résumé tools;
- **Percent-score screening**: city, role type, major, skills and degree requirements compile into a fixed 100-point scoring rule. I set no universal pass line and let scores draw the gradient: of the 353 currently valid postings, 63 score above 60 and the top is 79; I watch that batch first each day;
- **Local body archive**: announcement bodies and requirements are all stored locally. Government and SOE postings are sometimes deleted outright after applications close, and the local copy guarantees the original recruiting notice is on hand for interviews and qualification review.

## Closing

The tool has run 7 minor-version iterations, all 192 unit tests pass, and daily operation needs essentially no maintenance. The platforms I could not scrape, for encrypted interfaces or risk control, are recorded in my sheet for regular manual checking.

I did not write this to ship a polished product, only to solve the most concrete pain in front of me. Handing the mechanical page-refreshing to code saves an hour or two a day, which goes back into course review and interview prep.
