---
title: "bilibili-progress-tracker: a course-progress extension for Bilibili"
summary: "A Chrome MV3 extension recording Bilibili course progress: collections auto-identified, parts tracked separately, daily time and streaks, local storage."
group: 工程侧证
disclaimer: This project is for technical research only; its output is not legal advice.
date: 2026-09-28
featured: false
order: 4
metrics:
  - label: Tracking interval
    value: '5 s'
    detail: "Playback polling interval, adjustable in settings"
  - label: Completion rule
    value: '98% by default'
    detail: "Threshold adjustable, so end-of-video seeking or preloading is not miscounted as done"
  - label: Dependencies
    value: '0'
    detail: "Pure native JS: a service worker, a content script and a standalone dashboard window"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/bilibili-progress-tracker
---

## Problem and boundary

Bilibili does not keep your books: which episode of a course collection you are on, or how many hours you have put in. This extension records progress on the page automatically: visiting a collection or playlist page identifies and imports it as a course, multi-part videos track each part independently, and courses can be created manually from a list of BV ids. Boundary: a local browser extension, data in IndexedDB, nothing uploaded; identification depends on Bilibili's page structure, so a redesign may require selector updates.

## Mechanism

Manifest V3 architecture: a background service worker owns data and message routing, a content script listens for playback and identifies page types, and content-patch applies a shadow-DOM patch at document_start; the dashboard is a standalone window (position and size remembered) fed in real time over a chrome.runtime.connect long connection. Stats cover today's study time and streak days; full JSON backup, CSV export and JSON restore are all present. On the dev side: icon generation and syntax-check scripts, plus two revisions of design documents.

## Verification

There are no automated tests: the repository's tests/ directory is marked "later" in the design docs, and the only check script today is scripts/check-syntax.js, which compiles all 13 JS files one by one and reports OK or ERROR. Correctness rests on manual verification: load unpacked in Chrome and actually watch on Bilibili.

Identification covers three page shapes:

- collection pages (URLs like /list/ml123456) import as a course in one click;
- multi-part video pages import each part independently;
- single video pages attach manually to an existing or new course.

Page type is decided by four URL patterns (/video/BV, /list/ml, /medialist/play/ml, /channel/collectiondetail); anything unmatched is never recorded. content.js carries [BT]-prefixed console logs (extractVideoData ok on success, fallback on the degraded path) so a misidentification points to the layer that came up empty. Behavior is defined in the design docs and implemented:

- progress polls every 5 seconds, completion at the threshold (98% by default);
- seeks longer than 10 seconds do not count as watch time;
- playback speed converts to effective time via playbackRate;
- the same video open in several tabs takes the maximum progress;
- pause events plus visibilitychange both stop counting.

## Known failures

- Page-structure dependence is the biggest fragility: collection video lists are scraped with hardcoded class names (.video-list-item, .video-item, .title, .duration and friends), and the video element requires piercing shadow DOM (bpx-player, bwp-video host tags, with content-patch flipping closed shadow roots to open at document_start). If Bilibili changes classes or the player implementation, identification and recording can break outright until selectors are updated.
- Data extraction prefers window.__INITIAL_STATE__; when unavailable it degrades to digging the BV id from the URL and the cid from the player src, at which point the title is just document.title and cover and uploader fields stay empty.
- When Bilibili's API rate-limits or blocks cross-origin, DOM parsing takes over without blocking; but manual course creation completes titles and durations asynchronously via the API, and when that fails you are left with a bare column of BV ids.
- Data lives only in local IndexedDB with no cloud sync; clear browser data without exporting a JSON backup and progress is unrecoverable.
- Installation is developer-mode unpacked only; not on the store, and not verified on Firefox or any other browser.
