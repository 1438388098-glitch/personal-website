---
title: "headphone-logger: a headphone usage logger"
summary: "A Windows tray resident that logs how long you wore headphones each day, which pair, and in what context: it records only while sound plays, tags concurrent contexts honestly, and the stats page renders offline in WebView2 plus ECharts."
group: 工程侧证
date: 2026-09-28
featured: false
order: 3
metrics:
  - label: Tests
    value: '65 cases'
    detail: "xUnit covers the context rule engine, the session state machine (fake audio devices / foreground drivers), stats aggregation and detail editing"
  - label: Contexts
    value: '6 kinds'
    detail: "Music / video / games / online class / meetings / coding; one segment can carry multiple tags (music plus gaming)"
  - label: Data boundary
    value: 'fully local'
    detail: "SQLite storage, no cloud sync; the stats page's localized ECharts works offline"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/headphone-logger
---

## Problem and boundary

You want to know where your time goes, headphones take the biggest share, and manual time tracking never sticks. This tool lives in the tray: plugging in headphones starts a session, a segment opens in the current context only while sound plays, and switching to a silent window (WeChat, QQ) records nothing and bothers nobody. Boundary and scope are written in the README: it records the default output device, so speakers-as-default counts as a session; concurrent tags are sampled at context-switch moments, not tracked in real time; "audible time" and "worn time" are two different scopes (the device page includes silent time, the overview counts audible only), and the mismatch is by design, not a bug. All five known simplifications are listed, accidental unplugs under 60 seconds are auto-discarded.

## Mechanism

.NET 10 plus WinForms: NAudio watches default-output-device changes, Core Audio COM enumerates processes making sound, Win32 polls the foreground window for context matching, and SQLite WAL stores segments aggregated across midnight by the local day boundary. A toast confirmation appears only when switching contexts while the target window is actually audible (confirm / retag / later, auto-committed after 3 minutes idle); false records are guarded by unplug debouncing and audio hysteresis. The stats window has four pages: overview cards with a context pie, a 7×24 heatmap, per-headphone stats, and a multi-filter detail list (editable, deletable, CSV export); context rules live in a table, and new rules written on the detail page take effect hot.

## Verification

Correctness is locked by 65 xUnit unit tests, rerunnable with one command, `dotnet test`. Counting the local tests directory file by file: context rule engine 14, session state machine 30, stats repository and aggregation 20, smoke test 1, totaling 65, matching the README badge "Tests 65 passing" and the prose numbers. The tests deliberately never touch real hardware: audio devices and the foreground window are replaced with fakes, isolating the state machine and rule engine from the Windows API so the pure logic runs repeatably. Aggregation cases concentrate where mistakes are easy: overlapping concurrent-context durations, splitting cross-midnight segments by the local day boundary, grouping by device; detail editing and deletion are covered too.

## Known failures

The README admits five simplifications, the data-affecting ones:

- toasts that time out, get ignored or deferred are marked unconfirmed (confirmed=0) but still counted in stats;
- concurrent tags are a sample taken when the context switches or sound starts, so a tag can linger after the music stops;
- the detail view ships only the most recent 3,000 rows;
- context rules have no full graphical management UI.

Two more structural limits:

- It only knows the Windows default output device; if speakers are the default endpoint, the session is booked as "headphones".
- Plug events depend on NAudio reporting through the driver; sleep-wake and driver resets lose events. The fallback assigns end times to dangling sessions at startup, but the middle of the gap is unrecoverable, and the 2.5-second debounce window exists to absorb driver jitter.

Sound detection samples the Core Audio session every 2 seconds; a segment closes only after 2 consecutive silent samples (about 4 seconds), so very short sounds inside the sampling gap are not guaranteed to become segments. Platform scope: Windows 11 primary, Windows 10 19041+ works but needs the WebView2 runtime installed; auto-start writes a registry Run key and foreground scanning uses Win32, so this dependency set never leaves Windows.
