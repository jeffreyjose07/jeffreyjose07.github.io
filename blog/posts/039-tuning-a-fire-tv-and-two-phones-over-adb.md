---
title: "Tuning a Fire TV and Two Phones Over ADB, and the One Setting That Broke Settings"
date: "2026-11-15"
slug: tuning-a-fire-tv-and-two-phones-over-adb
tags: ["android", "adb", "fire-tv", "debloat", "performance", "dns", "battery", "ai-agents", "homelab"]
description: "One evening, three devices, all over Wi-Fi ADB. I disabled 15 preinstalled apps on a 2 GB Fire TV, measured a DNS ad-blocker and rejected it, checked my phone's battery wear and my wife's Pixel for malware. Every change was reversible. The only thing that broke was the setting I thought was safest: animator_duration_scale, which left the TV's Settings tile dead after a reboot."
---

Our living room TV is a 43-inch Xiaomi FX Pro, Fire TV Edition. It runs Fire OS 8.1.8.5 (Android 11 underneath) on four Cortex-A55 cores with 2 GB of RAM. Menus lag, apps cold-start slowly, and the home screen is a wall of promoted tiles.

I spent an evening on it and on two phones, my Nothing Phone (2) and my wife's Pixel 7a, using nothing but `adb` from a Mac over Wi-Fi. Claude Code drove most of the commands while I made the decisions. It turned out that matters for one of the lessons.

The device changes were small. The process, and the one thing that went wrong, are worth writing down.

---

## Rules before commands

Before the first command, I set three rules:

1. **Disable, never uninstall.** `pm disable-user --user 0 <package>` stops an app from running or appearing without deleting it. `pm enable` brings it back in a second. On the Fire TV, which is not rootable on this firmware, a mistake with a system package could otherwise mean a factory reset.
2. **Write the undo before the change.** Every disabled package went into a timestamped log, and a restore script that re-enabled everything existed before the first package was disabled.
3. **One change, then check.** Disable one package, press Home over ADB, and confirm the launcher came back.

And a list of packages never to touch, whatever they look like: `tv.launcher`, `firehomestarter`, `venezia` (the Appstore), `tv.livetv`, anything in `tv.settings.*`, `tv.ime` (the on-screen keyboard), `webview.chromium`, the `alexa*` packages, and anything with `ota` in its name. Disabling the wrong one of those gives you a blank home screen and no keyboard to fix it with.

## Connecting

On the Fire TV, ADB over the network is a toggle under **Device & Software → Developer Options**, and it listens on port 5555:

```bash
adb connect <tv-ip>:5555
adb devices -l
```

Phones on Android 11+ use **wireless debugging** instead, which needs a one-time pairing. The phone shows a pairing port and a six-digit code. After pairing it advertises itself over mDNS on a **random** port that changes whenever wireless debugging restarts:

```bash
adb pair <phone-ip>:<pairing-port> <code>
adb mdns services          # find the current connect port
adb connect <phone-ip>:<connect-port>
```

One trap cost a few minutes on the Pixel: the pairing dialog has to **stay open on the phone's screen** until `adb pair` finishes. If it closes, from a screen timeout or switching apps, pairing fails with an unhelpful `protocol fault`.

## The Fire TV: 15 packages

I listed every enabled package, sorted out what was what, and disabled them one at a time with the Home check after each:

```bash
r=$(adb -s $S shell pm disable-user --user 0 $p 2>&1 | tr -d '\r')
adb -s $S shell input keyevent KEYCODE_HOME; sleep 3
adb -s $S shell dumpsys activity activities | grep -m1 mResumedActivity
```

The first batch was twelve packages: Amazon miniTV, the shopping app, the game hub, the music and photos apps (`bueller.*`), the store-display demo content, two onboarding tutorials, a browser for casting web pages, ZEE5, `sneakpeek` (preview autoplay on the home row) and `tv.acr`.

`tv.acr` is the one I most wanted gone. ACR stands for automatic content recognition: on smart TVs it is the component that fingerprints what is on screen so viewing can be identified. The TV's ad settings were already all off. The package was still installed.

A second batch took out three more preinstalled streaming apps: Dailymotion, Fawesome and Mi TV+. SonyLIV looked just as preinstalled but stayed, because we actually use it. The TV's usage stats had no entries for any of the four, so "unused" was my claim to make, not something the device could tell me. **A device can show you what's installed, but only you know what you use.**

## Animation scales, and the setting that broke Settings

Android has three animation speed settings: `window_animation_scale`, `transition_animation_scale` and `animator_duration_scale`. Setting them to 0.5 halves animation time, and the UI feels much quicker. On phones it's the standard first tweak. It changes nothing about how fast the device works, only how long it spends animating.

I set all three to 0.5 and read them back. The home screen felt noticeably quicker.

Then we restarted the TV, and the **Settings tile did nothing**. You could select it, press OK, and nothing opened.

I had just disabled twelve system-adjacent packages, so everyone, me and the agent included, suspected the packages. That theory looked good: some Fire OS components only show their dependencies at boot, and the Home check had only proven that the launcher could draw itself on an already-running system. A reboot rebuilds everything, and a missing content provider could plausibly block Settings. The plan became to re-enable all twelve and add them back one at a time with a reboot in between.

The system log disagreed before we got that far. The launcher was logging that it was **finishing an activity "to prevent stuck menu"**. The launcher's slide-out menu waits for its open animation to finish before taking focus. With the animator running at half duration, that handshake no longer happened at the moment the launcher expected, so the menu gave up and closed every time.

Setting one value back fixed it:

```bash
adb shell settings put global animator_duration_scale 1.0
```

On the next click, Settings opened, with `MainSettingsActivity` displayed in 211 ms. The twelve packages stayed disabled, and window and transition scales stayed at 0.5. Those two only affect how the system animates windows. `animator_duration_scale` changes the timing of every app's internal animations, including the launcher's, so it can break an app whose code depends on that timing.

Three things I took from this:

- **My check tested the wrong state.** "Press Home and see the launcher" verifies a system that is already running. The bug only appeared when the launcher started fresh and read the new setting at startup. A change that a process reads at startup needs a restart to test.
- **I suspected the riskiest-looking change and ignored the one I thought was harmless.** Animation scale is a tweak every Android guide recommends. Disabling system packages sounds dangerous. The actual cause was the harmless-looking one.
- **The logs beat the theory.** The package theory was reasonable and would have cost an hour of reboots. `logcat` had the answer immediately.

## Did it help?

Free memory went from **621 MB** before the changes to about **710–740 MB** after a restart.

That comparison isn't fair, and I'm not going to claim the difference. The 621 MB was measured after the TV had been on for a long time. The later readings came minutes after a fresh boot, and any Android device has more free memory just after booting. I didn't take a clean baseline after a reboot before changing anything, so I can't separate the effect of disabling apps from the effect of restarting.

What I can say: the home row no longer autoplays previews, ACR is gone, the app list is shorter, and with window and transition animations at 0.5 the UI feels faster. Whether it *is* faster I didn't measure, and that's the honest answer.

## The ad blocker I didn't keep

The remaining annoyance was the promoted tiles on the home screen. Without root, the one practical lever is DNS: Android 9+ supports **Private DNS** (DNS-over-TLS on port 853), configurable per device without touching the router, so the TV could resolve through an ad-blocking resolver like AdGuard DNS.

Before committing to it, I measured lookups both ways from the TV:

| Lookup | Router DNS | AdGuard DNS |
| --- | --- | --- |
| Netflix, YouTube | 6 ms | ~44 ms |
| Hotstar, SonyLIV | 6 ms | 114–130 ms |
| Amazon Prime Video | 6 ms | **764 ms** |

Slower lookups are an annoyance on app launch. The second problem was worse. CDNs pick which video server to send you to based on **where your DNS resolver is**. Through the router, Hotstar's video edge was **9 ms** away. Through AdGuard, which had no resolver in the country at the time, Hotstar sent the TV to an edge **43 ms** away, almost five times farther, for every video segment of every stream.

That's a bad trade for the TV: the home-screen ads are static tiles that no longer autoplay or personalise. Free, ad-supported streams can also refuse to play when their ad server doesn't resolve. I rolled it back and left DNS on the router.

## My phone: the number that actually matters

The Nothing Phone (2) didn't need speeding up. Its animations were already at 0.5, including the animator, which works fine on the phone. Nothing OS ships with very little bloat. So I checked battery health instead:

```bash
adb shell dumpsys batterystats | grep -E 'Estimated battery capacity|Last learned battery capacity'
```

The battery's learned capacity was **3,592 mAh** against a design capacity of **4,700 mAh**, about **76%** after roughly three years. Replacement is usually recommended somewhere around 70–80%. That one number explained the phone's shorter days better than any tweak could, and it means slowing further wear (charging to 80%, Android's adaptive charging) is worth more than anything else.

I also uninstalled 14 apps that I named myself from the list, with `adb uninstall --user 0`, and logged each one with its Play Store link. My rule here was strict: only apps I named. A long list of other candidates was left alone, including several multi-gigabyte ones, because large isn't the same as unused.

The phone also has a managed work profile, a second Android user. Nothing in it was touched or listed. `pm list users` shows it exists, and that was all I needed to know.

## My wife's Pixel: the problem was storage

Her Pixel 7a felt slow, and the cause was obvious within a minute: **97 of 110 GB used**. Videos took 27.5 GB, photos 22.7 GB, YouTube downloads 11 GB and app caches 6.9 GB. A phone that is nearly full has less room to work with, and no animation setting will change that.

The only change I made was animations to 0.5. Clearing caches would have been safe, since cache is data apps can rebuild, but she said not now. Which apps or videos to delete is her decision, not mine and not the agent's, so nothing was removed.

What I did do was check it for malware, because when a phone feels slow the next question is usually whether something is wrong with it:

- **Where apps came from.** Every user app's installer was listed with `pm list packages -3 -i`, to spot anything not installed from the Play Store.
- **Play Protect** was on.
- **Verified boot** was green, the bootloader locked, no `su` binary, and the security patch level was from October 2026. Malware that could hide from the other checks would normally have to modify the system, and that would turn verified boot orange or red.
- **The permissions malware uses:** accessibility services, notification listeners, device admins, draw-over-other-apps, usage access, always-on VPN, the default SMS app and user-installed CA certificates. Each was listed and checked.

It was clean. The phone is just nearly full.

## Close the doors

ADB over Wi-Fi is a remote control for a device. Anything paired can install apps, read storage and send input over the network. When the work was done, every device got it switched off again:

```bash
adb -s $TV    shell settings put global adb_enabled 0       # Fire TV
adb -s $PHONE shell settings put global adb_wifi_enabled 0  # phones
```

Then I confirmed that the TV's port 5555 was closed and that neither phone was still advertising wireless debugging over mDNS. Android revokes a paired computer after seven days without a connection anyway, but there's no reason to leave it open for seven days.

## What I'd keep

- **Disable instead of uninstall, and write the restore script first.** It cost nothing and meant every decision could be reversed in seconds.
- **Test a change in the state it takes effect in.** If a setting is read at startup, restart the device to test it.
- **Measure before adding a "fix".** The DNS blocker sounded like a clear win until it sent every Hotstar segment five times farther.
- **Find the actual problem.** The TV needed less running in the background. My phone needed a battery. My wife's phone needed space. One fixed list of tweaks would have missed two of the three.
- **Use an agent for commands, not decisions.** It ran every command, read every log and kept the restore script current. Which apps go, and on whose phone, stayed decisions for the people who own the devices.
