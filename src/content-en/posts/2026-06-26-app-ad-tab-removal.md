---
title: "I blocked the ads but couldn't delete that tab"
description: "Probing package names, reading logs, staking out /proc for ad endpoints, using RethinkDNS to resolve ad domains to 0.0.0.0; when I tried to remove the app's ads-rewards tab, I stalled on the hardening shell and signature checks."
category: 技术笔记
tags: [踩坑记, 工程方法, 安全]
pubDate: 2026-06-26
---

An app on my phone throws vulgar ads over the splash screen and task pages; it looks like it shipped with a virus. Once it was plugged into the computer, my goal changed several times over: first read its logs, then block the ads, and finally delete that "points" tab at the bottom.

The ads ended up blocked, verified — every ad domain resolved back as `0.0.0.0`. The tab did not come off; I stalled on the hardening shell and signature verification. Along the way I reached conclusions twice on "is it shelled or not", and both were wrong.

## Find it first

Nothing in the package list matched any pinyin, and the Chinese display name and package name did not correspond either, so the only way was to open the system settings' app management list and scroll one by one. The search box would not take Chinese: typing `adb` into it just sat on the placeholder "Search apps"; pinyin finally surfaced one.

The app info page does not show the package name. I reverse-searched by version 3.1.9 and got two candidates; the "currently running" clue locked it in: package `com.cloudora.android`, process PID 7005, holding 698MB of memory.

## Logs readable only halfway

`adb shell logcat --pid 7005` runs, and the buffer holds 1,340 lines for this process, but the content is all system-framework events: it opened splash ad pages, a billing page, a settings page, plus touch and key records. The app itself never printed a single tag; none of the business internals are visible.

The external data directory could be browsed directly. The only real log was `files/yltmbad/log/syad.log`, 2.18MB, still being written at the time — and its content was hexadecimal ciphertext; three other log directories were empty. The rest was ad SDK cache: several big files with base64 long names that were in fact cached MP4 videos.

The private directory under `/data/data/` needs root; no way in.

## Stake out /proc for the ads

To tell whether those assets came down over the network, the most direct check is who it connects to at startup. The `/proc/net/tcp` table carries uid; filtered by the app's uid (10319) and sampled for 75 seconds: at the moment of startup it fired connections at 82 distinct remote endpoints, with a pile of concurrency on 443 and 80. Several ad networks bidding at once must look about like this.

The device still held assets it had cached: `files/lmb_adx_rp_files/.../*.0` are JPEG ad images with EXIF, and `cache/video-cache/` holds two MP4s. Deleting local files is useless, but the network layer can be cut.

Before blocking I wanted to reverse-resolve the captured IPs into domains and build an attribution table, which ran into a string of small annoyances. Domestic IPs mostly have no PTR records; the `nslookup` output came back with Chinese field labels, which my English regexes could not match; bare `python` was still Anaconda 3.6.5, which does not support the flag I used, and the query got swallowed into empty output — `py -3` finally worked. The attribution table never got made: CDN resolution drifts, and the computer and the phone were handed different edge IPs. For the domains to block, pulling them statically from the package is enough.

## Install an interceptor

The three routes differ a lot in cost, and I picked the cheapest: an interceptor on the phone, open-source, root-free, a local VPN taking over DNS, and scopeable to a single app. Installed RethinkDNS 0.5.7.

All the real effort went into UI automation:

- MCP's tap does not work on its custom dialogs; only `adb shell input tap` lands;
- Tapping an input field pops the soft keyboard and shoves the whole dialog up by 476px. I was still tapping "Block" at the pre-shift coordinates, actually hitting the keyboard; of a batch of 28 rules, only 1 went in;
- Another 8 got tapped into "Trust" instead of "Block" and had to be fixed one by one from the rule detail pages;
- Tapping "Block" did nothing for a while; I assumed the button was disabled — even accessibility taps got no response. Reading the XML's `enabled` attribute made it clear it was enabled: duplicate domains or an invalid TLD get silently rejected, and the dialog does not even close.

Hand-writing domain rules costs too much to maintain, so I switched to DNS-layer blocklists: downloaded a list bundle of about 60MB (over mobile data), enabled 30 lists, blocking by suffix — the ad networks swap subdomains and still get caught. Resolver set to system DNS: its default DoH does not connect in mainland China and cuts the network outright; then started the VPN and added it to the battery-optimization whitelist to stay alive.

Verification by resolution result: `log-api.pangolin-sdk-toutiao.com`, `jp.ad.gameley.com` all come back `0.0.0.0`. At first, with pure-domain rules only, subdomains like `log-api.` still went through; the suffix lists were what plugged it.

Cleanup: restored the three input methods temporarily disabled for automation, and deleted the test rules. In connection statistics this app ranks first with 21 active connections; second place is WeChat with 3.

## Now, that tab

With the ads settled, the target moved to the four bottom tabs. The "points" tab opens into a full page of "watch ads, watch videos, earn points" task wall.

The bottom nav is a native widget, a `LinearLayout` wrapping `ImageView`s and `TextView`s, four equal cells at x=150/450/750/1050. After mapping it out I concluded without touching anything: undeletable — hardened, no root, and no uninstalling allowed. That conclusion came too early.

When I actually went to modify it, my own judgment flipped twice. First I saw `classes.dex` at 69MB and concluded that a package this big cannot be shelled — full code, repackaging feasible. Digging deeper found the opposite: `apktool` yields only 30 smali classes, all under `com/antsafe/sec/wrapper/` — `Entry`, `MyApplication`, `MyJni`, that set. Checking back on the dex header: only 133 types and 519 methods declared, and set against the 69MB file size, the surplus is encrypted payload.

I also tried carving the payload out. Its entropy is only 5.3 to 6.2 bit/byte; the file holds 6 `PK\x03\x04` headers; it looks like the original APK was stuffed whole into the dex tail — plaintext `Lcom/ilife/` class names can be found 2,992 times, and 40 to 42MB is one solid class-name table. The method bodies are encrypted; it will not unpack as a zip; the real code waits for a native library to decrypt and load at runtime.

## Repackaged, but it will not install

The resources are not shelled — that is the seam left open. `res/layout/activity_main.xml` is 25 lines in total, four equal-width blocks `mLlHome`, `mLlScore`, `mLlService`, `mLlMe`. I set `mLlScore` to `gone` rather than deleting the block outright, afraid of a null pointer when the code fetches the widget; added a `.clean` suffix to the package name, repacked, and signed with a debug certificate. Packaging succeeded, with the original 69MB dex left in the package untouched.

At install time the two routes hit different walls. Same package name, re-signed, install over the top: `INSTALL_FAILED_UPDATE_INCOMPATIBLE`, signatures do not match — a different signature may not overwrite; uninstall first, mandatory. Different package name: `INSTALL_FAILED_DUPLICATE_PERMISSION` — it declares a custom download-broadcast permission whose name is held by the original package; further down, a batch of provider authorities collide too, and force-installed, push and file sharing would probably break. That conflicts with "the original app must keep working". Abandoned.

No other locks on the device side: `dpm list-owners` shows no device admin — "cannot uninstall" was my own requirement. The shell's anti-tamper got confirmed too: strings encrypted, logic inside the native library, and the binary contains `frida` 6 times, `checkSignature` 12 times, `getPackageInfo` 33 times. The package can be built but not installed; even installed, the signature has changed and the shell blocks that too.

## About root

I also checked what root would buy. For this app, it skips the fight with the shell: at runtime, Frida or LSPosed could lift out the segment that builds the bottom nav and switch off the ad SDK's init along with it — original package untouched, account and login state preserved. For the whole phone: global ad removal, full-package backups, freezing preinstalls.

I do not plan to root, so I re-walked the root-free paths: whether an official older build signed by the same vendor key could install directly over the top, no uninstall and no data loss; and whether the app hides a settings switch for that hidden tab. Barely started; not finished.

## Closing

The whole thing happened only on my own phone; the modified package was not distributed and will not be. The gate of hardening shell plus signature verification exists precisely to stop someone from repacking and passing it around.

The tab did not come off in the end. What can be shut off is the ad requests; what cannot is that button.

To judge whether an app is worth cracking open, I now check the class count declared in the `classes.dex` header first, then compare against the file size; a mismatch means shelled, and I stop burning time on it. Both of my judgments were spoken first and overturned after; impressions do not count as conclusions. The same-vendor older-version route is still unchecked; I will pick it up when there is time.
