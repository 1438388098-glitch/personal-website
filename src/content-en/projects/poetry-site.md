---
title: "poetry-site: Strangers, a personal poetry site"
summary: "A personal poetry site, 2021 to 2026: pure PHP plus JSON, no framework or database; browsing, a random pick, a guestbook, per-poem likes."
group: 实验
date: 2026-09-28
featured: false
order: 5
disclaimer: A personal works site, for study and exchange only.
metrics:
  - label: Works span
    value: '2021 to 2026'
    detail: "Modern poems and classical-style pieces, all original"
  - label: Stack
    value: 'PHP + JSON'
    detail: "No framework, no database; poem data lives in JSON files; the frontend is native HTML/CSS/JS"
  - label: Deployment
    value: 'Aliyun ECS'
    detail: "Nginx plus PHP, served under the domain; credentials stay out of the repo, passwords via password_hash"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/poetry-site
---

## Problem and boundary

Years of poems need a corner that belongs to no platform and answers only to you. This site is that corner: poems.js holds the poem data, pure PHP serves the guestbook, likes, visit stats and the publishing backend, there is no build tooling, and double-clicking index.html reads every poem. Boundary: interactive features (guestbook, stats) need the PHP backend; visitor data serves statistics only and is never shared; backend credentials are managed via a config template plus hashes and never enter version control.

## Mechanism

Features: chronological browsing, a random poem, dark mode, search, and independent like counts per poem; the backend publishes new works under /admin/. Visit stats run through track.php; access control is check_access.php's job.

## Verification

Stated honestly: the repository has no automated tests, no CI, no data-validation scripts, and the README never mentions testing. That layer is empty. Real verification runs on three paths. First, it runs locally: the README's startup is php -S localhost:8080, or skip the backend and double-click index.html to read every poem, a manual smoke path. Second, the deployment path is explicit: the site runs on Aliyun ECS under Nginx plus PHP, reached by domain; backend credentials are configured by hand from the admin/config.example.php template, password hashes generated via php -r calling password_hash, and nothing enters version control. Third, it runs in production: verified on October 1, 2026, the live /poems/ path returns HTTP 200, the page subtitle states the span 2021 through 2026, matching the README. The backend is 5 PHP files (check_access, guestbook, likes, log_search, track), each doing one job, keeping the troubleshooting surface small.

## Known failures

All interactivity rides on the PHP backend: the README says plainly that double-clicking index.html only reads poems, and the guestbook, likes and visit stats all require the backend; without it you have a static reading page. Full deployment requires a PHP server environment (the README says "Requires a PHP server environment"); a machine without PHP cannot run it. Publishing and credentials are fully manual: copy the config template, generate the hash, fill it in; miss a step and the backend is unusable. New works publish by hand through /admin/, with no bulk import or automation. The data layer is JSON files only, no database, and the README offers no concurrency, backup or recovery story; none of that is promised. The security posture is narrow: the privacy section only promises visitor data stays statistical and unshared; abuse prevention and rate limiting are entirely absent from the README. One live leftover: the site's meta description still says it collects modern poems and pastiches from 2021 to 2023, behind the actual 2021 to 2026 span.
