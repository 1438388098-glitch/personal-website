---
title: "stock-db: an A-share quant platform"
summary: "A personal A-share quant platform: data pipeline to multi-leg model to production picks, plus a GP factor-mining line; honest numbers are the floor."
group: 工程侧证
date: 2026-09-14
featured: false
order: 0
disclaimer: A personal quant research project; the repository is private and not public. Nothing on this page is investment advice.
metrics:
  - label: Data scale
    value: '16.74M rows'
    detail: "Daily bars for 5,824 A-share stocks, 2000-01 to 2026-08, incremental daily ingestion"
  - label: Authoritative live signal
    value: 'the freq30 mid-term chain'
    detail: "Top20 equal weight, semi-monthly rebalance, max 4 per industry, ST and limit-up filters; the E5 short-cycle line was demoted to a reference tool"
  - label: Model legs
    value: '5'
    detail: "Three base legs (fwd5/10/20), a sub leg reserving a promotion channel for mined factors, and a stacking meta leg"
  - label: Quality gate
    value: 'IC threshold 0.10'
    detail: "VERIFY_GATE has actually blocked the platform's own E5 line: signal quality below the bar means the export is refused; the gate plays no favorites"
links: []
---

## Problem and boundary

The two terrors of personal quant work: dishonest numbers, and a data chain nobody manages. This platform writes discipline into the structure: a private repository where data is the asset and models are outputs, and any externally claimable signal must pass a deterministic gate. Boundary: strictly personal use, no signals offered to anyone; the repository is private because production scheduling and personal data directories hang inside it; since the 2026-08-21 period the E5 short-cycle line has ceded to freq30 and serves only as reference and tooling, producing no live signals.

## Mechanism

Three lines, each in its place. The freq30 mid-term chain is the live authority: daily cross-sectional rank labels (fwd5/10/20), an ensemble of 5 model legs, `ens50 = 0.5·r_stack + 0.5·r_sub`, auto-retrain at a 14-day expiry with 10 automatic backups, and a hard data-freshness check before inference (stale beyond 7 days fails outright). Production scheduling rides a 05:00 daily scheduled task; the mid-term chain's one-click pipeline carries a mutex and a memory pre-check, and artifacts export to date-archived directories. GP factor mining is the research line, with per-day IC tracking fail-open onto the main chain; until the promotion switch opens, mined factors never enter the production signal path.

## Verification

Correctness rests on the test baseline and the gate's real interception record. Test baseline: 688 passed, 0 failed (measured 2026-09-15; in the earlier "554 + 8 known failures", 7 cases of the retired E2 chain were re-marked xfail and 3 rechunk tests had their parameters fixed, bringing failures to zero, with the reasoning recorded in the commit history of 2026-09-09 and 09-14), plus 52 standalone tests for the factor_mining module. core/paths.py is the repository's single path authority, and hardcoded absolute paths are caught on the spot by gate tests. The hardest evidence that the gate plays no favorites: it blocked the platform's own line, refusing E5's export (full IC 0.0756, 2026 IC 0.0461, both under the 0.10 threshold). Signal quality below the house bar means no stock list leaves the building.

## Known failures

From 2026-09-07 the production scheduled task was manually disabled to free the machine for a mining sprint, and the production chain silently stood down for 6 trading days while the mining chain ran normally; the divergence surfaced only in a manual comparison. After the incident, watchdog logic attached to the mining chain's wrap-up: the production chain stalling past evening now alerts, deliberate handovers first write a pause marker, and the check degrades to a notice. Also fixed was a silent bug: the backfill target date now rolls back to the nearest working day, so weekends and catch-up runs no longer quietly skip ingestion, with a regression test. The E5 line remains refused by the house gate; by design it stays a reference tool and will not be repaired, kept as a living specimen of the gate working. The biggest limitation is privacy: data scale, test baselines and gate numbers cannot be publicly reproduced; visitors can only take the numbers written here.
