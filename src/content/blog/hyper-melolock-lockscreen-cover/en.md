---
title: Hyper MeloLock Immersive Music Lock Screen
pubDate: 2026-10-09T14:00:00+08:00
draft: false
description: "Hyper MeloLock is a HyperOS 3 lock-screen music module: full-screen album cover as the real wallpaper, dynamic color extraction, and full playback controls, with download links and install steps."
image: "/img/hyper-melolock/lockscreen-colors.jpg"
slugId: hyper-melolock-lockscreen-cover
category: 技术
pinTop: 0
---

Hyper MeloLock is an open-source, free HyperOS 3 lock-screen music module: when music is playing, the lock screen switches to large time digits, a full-screen album cover, and a full playback control bar. The cover is the actual wallpaper, not a layer drawn on top of the lock screen, so the system's liquid-glass clock and frosted-glass notification cards can sample colors from the album art.

The module injects System UI through the Vector / LSPosed framework. It does not modify any music player or system APK. It is off by default and fails safe: if the lock-screen view cannot be found or the media data is invalid, it immediately falls back to the stock lock screen.

![Lock screen effect with four color schemes](/img/hyper-melolock/lockscreen-colors.jpg)

## 1. Download and Install

### Download links

- GitHub Releases: [https://github.com/zuige66/Hyper-MeloLock/releases](https://github.com/zuige66/Hyper-MeloLock/releases)
- Direct APK link (latest): [Hyper-MeloLock-v0.3.1.apk](https://github.com/zuige66/Hyper-MeloLock/releases/download/v0.3.1/Hyper-MeloLock-v0.3.1.apk)

Only download the officially signed package from GitHub Releases. The module hooks the system lock-screen interface, so repacked builds from unknown sources are risky.

### Requirements

| Item | Requirement |
| --- | --- |
| OS | HyperOS 3 (Android 16) |
| Device | Redmi Note 9 Pro (`gauguinpro`) |
| Framework | Vector / LSPosed (provided by SukiSU Ultra) |
| Player | Any music app that provides a standard media session |

The module gates by exact build fingerprint. If the device or OS version does not match, it will not activate and will gracefully defer to the stock lock screen — no black screen or freeze.

### Installation steps

- After installing the APK, enable Hyper MeloLock in the Vector manager and check these two scopes. Missing either will break the corresponding feature:
  - `com.android.systemui` — the lock-screen overlay itself, mandatory;
  - `com.miui.miwallpaper` — turns the cover into a real wallpaper; without it the cover cannot pick up the system frosted-glass effect.
- Reboot the phone. Checking scopes in the manager is only a declaration; injection does not happen until the process restarts.
- Open the Hyper MeloLock app, tap the status card on the home page to turn the module on, and confirm it shows "Activated".
- On the "Apps" page, check the music players you actually use. Nothing is selected by default; unchecked players will not trigger the lock-screen takeover.
- Play a song that has album art, then turn the screen off and back on.

Success signs: the lock screen shows large time digits and a full-screen cover, with a playback control bar at the bottom; the configuration app shows the system version and "Activated".

<table>
<tr>
<td align="center" width="50%"><img src="/img/hyper-melolock/app-home.jpg?v=2" width="300" alt="App home page"/><br/><b>App home</b><br/>Switch status · Enabled apps · System info</td>
<td align="center" width="50%"><img src="/img/hyper-melolock/app-about.jpg?v=2" width="300" alt="About page"/><br/><b>About</b><br/>Developer info · Check for updates</td>
</tr>
</table>

## 2. What You Can Customize

Every item on the Appearance page can be adjusted in real time; changes take effect as soon as you return to the lock screen — no reboot required. Basic options:

- Time: font size, weight, roundedness, color, top margin, and optional outline;
- Cover: scale and corner radius;
- Player card: corner radius, top margin, background color (seven levels, including dynamic color extraction);
- A line above the clock showing "Gregorian date + weekday + lunar date" and a custom signature, each togglable independently.

<table>
<tr>
<td align="center" width="50%"><img src="/img/hyper-melolock/app-appearance.jpg" width="300" alt="Appearance groups"/><br/><b>Appearance groups</b><br/>Color · Date · Signature · Time · Cover · Player</td>
<td align="center" width="50%"><img src="/img/hyper-melolock/app-appearance-picker.jpg" width="300" alt="Time color picker"/><br/><b>Time color</b><br/>Follow cover / Fixed · Style (M3E / Vivid)</td>
</tr>
</table>

### Color extraction: let the lock screen follow the album

Instead of picking a fixed color, you can toggle "follow album cover" independently for time, date line, signature line, player background, entry text, and entry background. Colors change automatically when the track changes.

There are two extraction styles with very different looks:

- **Muted matte (M3E)**: picks the dominant color from the cover, then darkens and desaturates it to a Morandi-like soft tone. Large time digits sit comfortably on this background without eye strain.
- **Vivid raw**: uses the dominant color from the cover directly, giving a punchier, poster-like look. Best for covers with a clean palette.

There are also two ways to choose the dominant color:

- **Most vivid first**: takes the single most saturated color in the whole image;
- **Largest share first**: looks at the top five color blocks in the cover, then picks the most vivid among them, staying closer to the main subject and avoiding stray edge colors.

When not following the cover, time color and player background each have fixed palettes: time has white, black, light gray, warm yellow, sky blue, and pink; player background has seven levels, one of which is also dynamic cover extraction.

## 3. Known Limitations

- So far it has only been tested on Redmi Note 9 Pro (`gauguinpro`) + HyperOS 3. Other devices are unverified. The module gates by exact build fingerprint and will fall back to the stock lock screen when the fingerprint does not match.
- The "Xposed framework" line always shows "Unknown". This is a limitation of the reading method, not a bug.

## Related Links

- Source code: [https://github.com/zuige66/Hyper-MeloLock](https://github.com/zuige66/Hyper-MeloLock)
- Issue tracker: [GitHub Issues](https://github.com/zuige66/Hyper-MeloLock/issues)
- Project is open-sourced under AGPL-3.0; UI components come from HyperIsland (MIT License)
