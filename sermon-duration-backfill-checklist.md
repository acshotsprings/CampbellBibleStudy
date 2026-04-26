# Sermon Duration Backfill Checklist

Fill in the duration in **minutes** (just the number) next to each entry, then either send it to me to apply, or paste the value yourself into `data-duration-min=""` on the matching `<article>` tag in `sermons.html`.

The page will auto-format on render:
- Under 60 → `38 min`
- 60+ → `1h 30m` or `2h` (no `0m` shown when on the hour)
- Empty/0/blank → no pill shown (clean fallback)

---

## How to fill this in

For each entry below, write the duration in minutes after the dash. Examples:

```
[ ] #17 — 4/26/26 — Just in Time (Pastor Matt Scully) — 38
[ ] #16 — 4/20/26 — Seven Churches, Seven Feasts & the Spirit (Group Study) — 180
```

If you don't remember the exact length, ballpark is fine. Skip any you can't recall — they'll just show no pill until you fill them in later.

---

## All 17 entries

```
[ ] #1  — 3/22/26 — Imitate Christ's Example (Pastor Matt Scully, Trinity Church) — ___
[ ] #2  — 3/25/26 — Judgment Seat & Marriage of the Lamb — ___
[ ] #3  — 3/25/26 — Ezekiel: Invasion & End — ___
[ ] #4  — 3/26/26 — Ezekiel 38–39 continued (partial) — ___
[ ] #5  — 3/27/26 — Antichrist & End Times (Audio Teaching) — ___
[ ] #6  — 3/31/26 — Tribulation & Judgment — End Times Chronological (Ron Rhodes) — ___
[ ] #7  — 4/1/26  — End-Times Tribulation (Audio Teaching) — ___
[ ] #8  — 4/2/26  — Jewish & Essene Calendar History (Audio Teaching Series) — ___
[ ] #9  — 4/3/26  — Mount of Olives Return (Josh Howerton) — ___
[ ] #10 — 4/3/26  — Essene Calendar Debate (Audio Teaching) — ___
[ ] #11 — 4/6/26  — Feast of Tabernacles & DSS Calendar (Audio Teaching) — ___
[ ] #12 — 4/6/26  — Epicenter — Netanyahu, Russia-Iran Axis (Joel C. Rosenberg) — ___
[ ] #13 — 4/9/26  — Ezekiel 38 & Russia — Identifying Gog (Rosenberg, Ezekiel Option Ch.7) — ___
[ ] #14 — 4/14/26 — Discernment & End Times — Group Discussion (Jack Hibbs) — ___
[ ] #15 — 4/15/26 — Daniel 9 & End-Time Signs (Jack Hibbs) — ___
[ ] #16 — 4/20/26 — Seven Churches, Seven Feasts & the Spirit (Group Study) — ___
[ ] #17 — 4/26/26 — Just in Time / Living in Time Msg 1 (Pastor Matt Scully) — ___
```

---

## How the field works in HTML

Each `<article>` tag now has a `data-duration-min=""` attribute. To populate, just put the minutes between the quotes:

```html
<article class="sermon-card" data-num="17" data-date="20260426" data-duration-min="38">
```

That's it. No other code changes needed. The `renderDurations()` function reads the attribute on page load and builds the pill.

---

## Format examples

| Minutes | Renders as |
|---------|-----------|
| 28      | `28 min`  |
| 45      | `45 min`  |
| 59      | `59 min`  |
| 60      | `1h`      |
| 75      | `1h 15m`  |
| 90      | `1h 30m`  |
| 120     | `2h`      |
| 180     | `3h`      |
| 195     | `3h 15m`  |
