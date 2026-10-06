---
title: "legal-job-tracker: an aggregator for legal-job postings"
summary: "Legal-job scraping and application tracking that runs on your own machine: 33 official sources, strict dedup, resume matching where every point carries its reason, deadline alerts and export. Data never leaves the machine."
group: 法律工具
date: 2026-09-20
featured: false
order: 1
relatedPosts:
  - 2026-09-26-legal-job-tracker-33-sources
metrics:
  - label: Data sources
    value: '33 sources'
    detail: "Law firms, civil-service exams, in-house counsel, internships and SOE official channels across the Pearl River Delta plus Shaoguan; config-plus-selector driven, so a site redesign means editing config, not code"
  - label: Unclassified job rate
    value: '2.8%'
    detail: "7 of 252 measured postings unclassified; in the title-keywords-only era the rate was 47%"
  - label: Organization-name coverage
    value: '98%'
    detail: "Government listing pages carry no organization field; extracted from the title head, left empty when extraction fails rather than guessed"
  - label: Scrape duration
    value: '2 to 5 min first run'
    detail: "33 sources at 6 concurrent, 90 s per-source budget; daily increments about 10 s"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/legal-job-tracker
---

## Problem and boundary

Legal job-hunting information is scattered across dozens of official sites, and after announcement day two thirds of it is result publication rather than open enrollment, all mixed together. This tool runs locally (FastAPI + SQLite, no frontend build chain), scrapes once at 08:05 and once at 20:05, and uploads nothing. Matching and scoring put explainability first: target city, role type, skill hits (title hits count double), education hard gates; every point gained or lost states its reason, and a degree below the requirement is visibly down-weighted with the cause laid out.

## Mechanism

Two dedup layers, on the principle of rather missing a merge than making a wrong one. Announcements split into three classes (open enrollment / result publication / other); in government channels, measured result publication is 23%, and by default only the first class is shown. Search has synonym expansion: the colloquial short form lüsuo now hits the full term lüshi shiwusuo (law firm), and xuandiao hits xuandiaosheng (the targeted-selection civil-service program); recall for the short form went from 28 postings to 89. SOE sources go through the SASAC "million talents" aggregate column and the provincial HR-and-social-security SOE zone, routing around the reality that 7 of 9 provincial first-tier group sites are unreachable or JS-rendered. The snapshot page lifts key lines (deadlines, contacts, degree requirements) into first-screen cards and segments the body by official-document font sizes. 32 of 33 sources have real-page fixture regressions, so selector rot gets caught by tests. Tests cover dedup wrong-merge regressions, date parsing, classification, matching scores, snapshot structuring and routing.

## Verification

There is no independent evaluation set for accuracy; the evidence comes in three layers: automated tests, live scrape statistics, and derived fields you can recompute.

- 192 pytest cases all green, including regressions for three classes of historical wrong merges (the same announcement published in 6 installments, same-named announcements from different years, the generic title "paralegal" from different firms); CI runs a separate full-suite gate.
- 32 of 33 sources have real-page fixtures recorded in September 2026 (ggfw_gq pending); fixtures pin a baseline date so tests do not drift with the calendar; a site redesign breaks selectors here first.
- The live scope has numbers to point at: unclassified rate fell from 47% in the title-keywords era to 2.8% (7 of 252); organization-name coverage for open postings is 98%; deadlines misread 70 of 213 in the early version and only 3 of 79 are suspect after the rules tightened.
- Changing classification rules needs no re-scrape: reclassify.py recomputes derived fields from local snapshots to compare old and new scopes. Each source's last success time, consecutive failures and last error are recorded on the /health page; one source failing does not affect the rest.

## Known failures

- Selector drift is found only after the fact: a redesign cuts the source off, and fixture regressions catch "already broken", not "about to break".
- JS-rendered sites (Shenzhen and Guangzhou courts, Dongguan lawyers association, China Southern Power Grid) cannot be integrated; upstream aggregates and a paste-in box fill the gap. GDUFS and Guangzhou University detail pages are likewise JS-rendered, so the "major requirement" field is unavailable.
- Deadlines carry no guarantee: only sentences containing 截止/报名/申请 and similar words are trusted, and 3 of 79 remain suspect. The principle is rather empty than wrong, because a wrong deadline manufactures a false red urgency alert.
- The matcher errs conservative: the ZUEL interface filters by legal keywords in the job title, so a law-oriented "management trainee" posting is filtered out entirely, in exchange for bank-teller and supply-chain noise staying out.
- Local Shaoguan sources are mostly court service announcements, about 2 job postings per page; Shaoguan jobs rely mainly on provincial centralized recruitment announcements.
- Cross-source merging happens only at ingestion: duplicates already in the database before a rule fix do not auto-merge; one of them must be archived by hand.
