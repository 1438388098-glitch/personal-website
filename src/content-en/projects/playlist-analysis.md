---
title: "playlist-analysis: deep playlist analysis"
summary: "Scrapes playlists from four platforms and analyzes 20+ dimensions: scripts compute the statistics, AI subagents write the semantic annotations."
group: 实验
date: 2026-09-28
featured: false
order: 3
disclaimer: A personal tool, for study and exchange only.
metrics:
  - label: Platforms
    value: '4'
    detail: "NetEase Cloud, QQ Music, Kugou, Kuwo; Kuwo's anti-scraping is strictest, with built-in fallback attempts"
  - label: Analysis dimensions
    value: '20+'
    detail: "Pure stats (duration / era / language / artist frequency / concentration HHI) plus semantic annotations (genre / mood / scene / lyric themes)"
  - label: Division of labor
    value: 'compute to scripts, understanding to AI'
    detail: "No keyword tables guessing genre: measured 96% of songs would land in pop/other, which is analysis in name only"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/playlist-analysis
---

## Problem and boundary

Mainstream playlist analyzers stop at play counts and artist tallies, or guess genre from keyword tables. This tool separates the two jobs: scraping, chunking, and pure computation (duration, era, language, artist frequency, HHI concentration) go to scripts; dimensions that require "listening" (genre, mood, type, scene) go to AI subagents annotating song by song, with the main agent synthesizing genre readings, taste portraits and insights. Boundary: platform page structures are load-bearing, so redesigns require parser updates; Kugou's m-site parses by regex, Kuwo often refuses requests, and on failure the tool suggests switching platforms. Output: report.md, a high-motion HTML report, and analysis.json.

## Mechanism

A three-stage pipeline: stage one is the data channel (optionally fetching NetEase lyrics); stage two has the main agent dispatch per-chunk annotation under the SKILL.md subagent protocol and aggregate JSON; stage three renders the report from the AI results. Dimensions cover a genre × era heatmap, artist generations and influence tiers, overlooked gems, collaboration-network edges, style redundancy, mood curves and narrative arcs, and ordering-logic detection, closing with Top 30 picks (with reasons) and share copy. The subagent input/output protocol, artist aggregation rules and cross spot-checks are specified in SKILL.md.

## Verification

First, how quality is backstopped: pure statistics are computed by script, AI annotations go through spot checks, and missing data is never invented. Layer one: every pure-statistics number is computed by script, with aggregation also fixed in merge_ai.py; genre shares, diversity, redundancy and the genre × era cross never pass through AI, and a rerun reproduces the same numbers. Layer two: AI annotations face a cross spot-check, where the main agent dispatches an independent subagent to re-review a random 5% of songs for genre consistency; above a 10% mismatch rate the whole block is re-annotated; a subagent must cover every song index in its block (one miss is failure), a failed block retries once, and persistent failure falls back to defaults, noted in the report. Layer three: no invented data; fields the platform does not provide are marked as such, interpretation fields the AI cannot write are omitted, and scripts fall back to defaults. Human verification compares the three outputs (report.md, report.html, analysis.json) item by item: statistics reconcile to source data, and AI annotations are labeled in the report as "inferred tendencies", not official platform data.

## Known failures

Anti-scraping and redesigns are the main risks. Kuwo's defenses are strict and often return "The request is illegal"; the script carries 3 fallback attempt groups and then suggests a different platform. Kugou's m-site is HTML parsed by regex, and a page redesign falls back to the older JSON interface. Platform APIs error occasionally; one failed retry leads to the advice to switch platforms or supply a track list by hand. AI-side instability is acknowledged: genre and mood are the model's inferences from artist, album and song names, not official platform data; when a block's annotation is missing, aggregation falls back to 0.5 and "neutral". Collaboration detection reads feat., & and × in song titles, so titles containing those words without an actual collaboration misfire; a small error rate is accepted. Data availability varies by platform: year and popularity come only from NetEase, and missing dimensions are labeled as missing, never fabricated.
