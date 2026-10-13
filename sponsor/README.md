# Sponsor

Put a sponsor's files in this folder and every player sees them in Moonfall.
Nothing here (or only this README) → no sponsor is shown and the game works as normal.

| File | What it is | Size tips |
|---|---|---|
| `info.txt` | The sponsor's name, offer and link (see below) | — |
| `logo.png` | Square logo (`.jpg`, `.jpeg` and `.webp` work too) | 512 × 512, under 300 KB |
| `banner.png` | Wide picture, 3 : 1 (`.jpg`, `.jpeg`, `.webp`, `.gif` work too) | 1200 × 400, under 500 KB |

Every file is optional — use any mix. A banner alone is enough.

`info.txt` looks like this (one line each, leave out what you don't need):

```
name: Café Luna
offer: Winners get 10% off tonight
link: instagram.com/cafeluna
```

Where players see it:
- **Opening splash** — the banner (or the logo) with "Tonight's game is brought to you by …"
- **Join screen** — a small "brought to you by" badge
- **Waiting screen** — the banner, plus a card with logo, name, offer and a Visit button
- **End-of-game card** — the offer, the name and a Visit button

To change sponsors, replace the files (keep the same names). To stop, delete them.
Changes appear after Render redeploys (a minute or two); a server started from Termux picks them up on its next start (git pull).

If the host sets a sponsor on the Players screen in the app and switches it on, that one is shown instead of this folder.
