# Moonfall — notes for Claude Code

Werewolf party game for one room on local Wi-Fi. The host runs the game from a phone (`/host`);
players join from their own phones (`/`). Night actions, discussion and votes happen in person —
the app only deals cards, shows each player their card, switches night/day backgrounds, and gives
the host a guide (wake-up order, special-case reminders, win check).

## Run
- `npm install`
- `npm run dev` → room server on :3000 + Vite on :5173 (host: http://<LAN-IP>:5173/host)
- `npm run build && npm start` → one server on :3000 serving the built app (http://<LAN-IP>:3000/host)
- `npm run typecheck`

## Layout
- `server/index.ts` — Express + Socket.IO room server, in-memory state. One room per server.
  - host events: `host:patch` (mirror of host-owned state), `host:kick`, `host:deal` (role keys → shuffled & assigned by name), `host:end`
  - player events: `player:join` ({name}) → ack {playerId}; server pushes `player:view` (only that player's own role)
- `src/HostApp.tsx`, `src/PlayerApp.tsx` — socket wiring; render the views inside `PhoneFrame`
  - `/host` is behind a PIN (`HOST_PIN` env, default 6969), checked by the server on the host socket; the phone remembers it
  - the host's phone keeps a copy of the whole room (`host:snapshot` → localStorage); if the server comes back empty
    (restart / redeploy / sleep) it sends it back with `host:restore` and players' phones reconnect (`room:restored`)
- `src/main.tsx` — lazy-loads HostApp or PlayerApp (separate chunks), adds the app manifest (`public/manifest*.webmanifest`, icons in `public/icons`) and `public/sw.js` (installable; caches nothing)
- `src/wakeLock.ts` — keeps phones' screens on during a game
- `src/halloween.tsx` (+ `html.halloween` rules in `src/global.css`) — the Halloween theme: the host's 🎃 header button sets shared `theme`;
  the server sends it to every phone (`theme` in views, `/api/theme`, live `room:theme`). A decoration layer (no taps) + card frame touches.
- `src/brand.ts` — `DONATE_URL` (Ko-fi / PayPal.me; empty hides every "Support Moonfall" button) and the sponsor/support lines in 7 languages.
  Sponsor: host → Players screen → Sponsor (name, offer, link, logo; saved in the host phone's localStorage `moonfall.sponsor`), shared as
  `sponsor` + `sponsorLogo`; phones get `sponsorView()` (server) — splash, join, waiting, end card — and the logo from `/api/sponsor/logo`.
  Or with no host sponsor switched on: files in the repo's `sponsor/` folder (`info.txt`, `logo.*`, `banner.*`, see sponsor/README.md), served at `/sponsor/…`.
- `scripts/build-pages.ts` — runs in `npm run build` after Vite: writes crawlable pages into dist/ (`/how-to-play`, `/roles`, `/<lang>/…` for 7 languages,
  `sitemap.xml`, `robots.txt`) from the app's own guide text, role cards and tips. `SITE_URL` env sets the absolute URLs (default moonfall.onrender.com).
  `public/privacy.html` is the privacy policy (`/privacy`).
- `src/PhoneFrame.tsx` — designs are 390×844; scaled to fit any phone, height stretched to fill
- `src/views/HostView.tsx`, `src/views/PlayerView.tsx` (+ `.css`) — the UI, generated from the design canvas
- `design/*.dc.html` — the design sources exported from the Claude design canvas
- `tools/dc2tsx.py` — converts a design file into a React class component (logic class kept verbatim, template → JSX)
- `tools/wire.py` — swaps the designs' mock data for live room data (every change is tagged `// NET:`)

## Working on the UI
Two options — pick one and stick to it:
1. **Edit the views directly** (`src/views/*.tsx`). Simplest from now on. Don't run `npm run views` afterwards or your edits are overwritten.
2. **Keep the design canvas as the source of truth**: export updated `.dc.html` into `design/`, then `npm run views`
   (convert + wire). If `wire.py` stops matching, update the matching string in `tools/wire.py`.

Views use inline styles and are `// @ts-nocheck` (generated code). Role catalogs, house rules,
host-guide text and the 7-language player translations all live inside the view classes
(`catalog()`, `roleText()`, `ui()` …).

The role library (Browse role library, presets, name auto-fill) is hand-written in `src/views/roleLibrary.ts`;
its player-phone translations are `src/views/i18n/roles.<lang>.ts` (keyed by the English role name, plus the
newer UI lines `goalLoner` / `reconnecting`). Adding a library role means adding it in all six files.
Role strategy tips (shown on the role card, one per peek) are in `src/views/roleTips.ts` with translations in
`src/views/i18n/tips.<lang>.ts` — a new role needs tips there too (or it falls back to its team's tips).

## Conventions
- Players are keyed by **name** (server makes names unique). Host-side maps `status`, `override` are name-keyed.
- Never send other players' roles to a player's phone — `playerView()` in the server is the only place that builds player data.
  Exception by design: people who join after the deal are **spectators** (`room.spectators`, `spectatorView()`) and see every role,
  the status marks and the host's log; `host:end` turns them into players for the next game.
- Host-owned fields mirrored to the server are listed in `HostView.SHARED`.
- Spirit Realm (server-authoritative, `server/index.ts` → "the Spirit Realm"): dead players chat (`spirit:say`, `room.spiritChat`).
  The host calls the one Spirit Council (`host:council` → `callCouncil()`; suggested at ceil(30% of the starting players) dead): each spirit at that moment gets a secret
  faction (good / evil / neutral, `room.council.spirits[name].faction`) and may `spirit:whisper` once to a living player (anonymous
  `spiritWhispers` on that phone). Role and faction are separate: the role never changes; for winning, a dead spirit's old team stops
  counting — good wins with the village, evil with the wolves, neutral if its whisper target is alive (`spiritWon`; host mirrors it in
  `winnersAll`). Phones get only their own `spirit` view; the host gets everything via `hostView().spirits`. Phone text: `src/views/i18n/spirit.ts`.
  A dead player's card: death side first, then (10 s, `spiritTimer`) the spirit side instead of the role — faction shown only after the Council.
- Bluff cards: the deck may hold up to one extra card per werewolf card. `dealNow` deals by priority (wolf side, then solo roles,
  then village) and leaves the extras out at random among village cards (never a Mason); shared `pool` = every selected card (what phones list as the round's roles), `unused` = not dealt (host only).
  The wake-up order still calls roles nobody holds (not dealt, or the player was turned) as "fake it" steps, so it never gives anything away.
- Master controls (secret: tap the "N alive" counter 5 times on the Play screen): force any ending (`state.forced`, never saved
  to the Hall of Fame), give anyone any library role (via `override`), set any fate/death card, shuffle roles, revive, change round,
  scenario presets + a simulator (`simNight`/`simDay`/`simAll` drive the real host screens through `this._v`), and secret messages
  (shared `notes[name] = {id, text}` → that player's `note` only).
