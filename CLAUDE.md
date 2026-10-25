# Moonfall — notes for Claude Code

Werewolf party game on local Wi-Fi or a public server (Render), with any number of independent rooms. The host runs the game from a phone (`/host`);
players join from their own phones (`/`). Night actions, discussion and votes happen in person —
the app only deals cards, shows each player their card, switches night/day backgrounds, and gives
the host a guide (wake-up order, special-case reminders, win check).

## Run
- `npm install`
- `npm run dev` → room server on :3000 + Vite on :5173 (host: http://<LAN-IP>:5173/host)
- `npm run build && npm start` → one server on :3000 serving the built app (http://<LAN-IP>:3000/host)
- `npm run typecheck`

## Layout
- `server/index.ts` — Express + Socket.IO room server, in-memory state. Many rooms per server (`rooms` map, keyed by room code):
  every helper takes the `room` it works on, Socket.IO channels are `<code>:host`, `<code>:p:<playerId>` and `<code>:all`, and the
  HTTP endpoints take `?room=<code>` (`/api/info`, `/api/theme`, `/api/sponsor`, `/api/sponsor/logo`, `/api/room` = does it exist). Rooms idle 12 h are dropped.
  - host events: `host:patch` (mirror of host-owned state), `host:kick`, `host:deal` (role keys → shuffled & assigned by name), `host:end`
  - player events: `player:join` ({name}) → ack {playerId}; server pushes `player:view` (only that player's own role)
- `src/HostApp.tsx`, `src/PlayerApp.tsx` — socket wiring; render the views inside `PhoneFrame`
  - `/host` asks for a room name + password (`HostRoom`): a new name creates that room with that password, an existing one needs its
    password (checked by the server on the host socket). The phone remembers it (`moonfall.hostRoom`); the 🔒 button leaves the room.
  - players join a room from the QR link (`/player?room=<code>`) or by typing its name (`RoomPick`); their seat is kept per room (`moonfall.playerId.<code>`)
  - the host's phone keeps a copy of the whole room (`host:snapshot` → localStorage `moonfall.room.<code>`); if the server comes back empty
    (restart / redeploy / sleep) it sends it back with `host:restore` and players' phones reconnect (`room:restored`)
- `src/main.tsx` — lazy-loads HostApp or PlayerApp (separate chunks), adds the app manifest (`public/manifest*.webmanifest`, icons in `public/icons`) and `public/sw.js` (installable; caches nothing)
- `src/wakeLock.ts` — keeps phones' screens on during a game
- `src/sound.ts` — synthesized sounds (Web Audio, no files): howl, dawn, timer. `src/roleSounds.ts` — a theme per night role, played on
  the host's phone when a wake-up step is tapped (`playRoleTheme(libraryName)`): hand-made themes for the main roles, a motif generated
  from the name for every other role. All synthesized in code, so there are no audio licences to track.
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
- The Atheist (Blood on the Clocktower): with it in the deck, every wolf-side card is shown in the role list but never dealt (bluffs);
  village, special and neutral cards are dealt. "Atheist" preset = the Atheist + random non-wolf roles (new mix every tap, no Werewolf cards).
  The host fakes the Werewolves step and may lie (no automatic phone answers). An Atheist game never ends because no evil is left.
  The vote can nominate the host (`HOST = '__host__'`, `mech.hostOut`): voted out in an Atheist game with nobody evil alive → village wins;
  with someone evil alive (a turned player) or without an Atheist → wolves win. Otherwise the imaginary wolves win at 2 players left.
  Phones never see the Atheist: it's listed as a Villager, and its holder's card shows a Villager until the game ends (server `playerView`).
- Spirit Realm (server-authoritative, `server/index.ts` → "the Spirit Realm"): dead players chat (`spirit:say`, `room.spiritChat`).
  The host calls the one Spirit Council (`host:council` → `callCouncil()`; suggested at ceil(30% of the starting players) dead): each spirit at that moment gets a secret
  faction (good / evil / neutral, `room.council.spirits[name].faction`; all good in an Atheist game; phones see it only after the host taps Reveal factions, `host:council:reveal`) and secretly chooses one living player
  (`spirit:whisper` {to} — no message, nothing reaches that phone). The host can undo it (`host:council:undo`) and call it again. Role and faction are separate: the role never changes; for winning, a dead spirit's old team stops
  counting — good wins with the village, evil with the wolves, neutral if the player it chose is alive (`spiritWon`; host mirrors it in
  `winnersAll`). Phones get only their own `spirit` view; the host gets everything via `hostView().spirits`. Phone text: `src/views/i18n/spirit.ts`.
  A dead player's card: death side first, then (10 s, `spiritTimer`) the spirit side instead of the role — faction shown only after the Council.
- Bluff cards: the deck may hold up to one extra card per werewolf card. `dealNow` deals by priority (wolf side, then solo roles,
  then village) and leaves the extras out at random among village cards (never a Mason); shared `pool` = every selected card (what phones list as the round's roles), `unused` = not dealt (host only).
  The wake-up order still calls roles nobody holds (not dealt, or the player was turned) as "fake it" steps, so it never gives anything away.
- Host-only helpers on the Play screen (`HostView.renderVals` view object): **Bluff cards** (`bluffView`, from `unused`; collapsible, never sent to phones),
  the **lover popup** (`loverPop`: the moment a lover is out, however it happened, and again at dawn if it happened at night; seen keys in shared `loverSeen`),
  the **🃏 Roles in play** sheet in the header (`rolesInPlay` view value: every card of the round with its full description, to read out), and the **Atheist story** card + sheet in an Atheist game (`HostView.atheistStory()`,
  steps n1/d1/n2/d2/nX/dX/end; the host picks follow / own way, kept in `mech.athPlan`).
- Death notices: on every `host:patch` that changes `status`, the server (`noteDeaths`) works out who newly died and emits `room:death`
  {id, names} to `:all` (night deaths wait until the day phase). Phones and the host show `DeathNotice` ("<name> died", never the cause or killer).
- Player role card: shown only while held (`holdCard` pointer handlers in PlayerView); game UI has `user-select: none` (inputs excepted).
- Lobby chat: players before the deal (`lobby:say` → `room.lobbyChat`, last 100, in `playerView` until dealt).
- Votes: the host taps who nominated each nominee (`vote.noms[].by`, logged with each vote as `noms`); phones get anonymous totals
  (`voteResultView`: counts per nominee, never who voted). Log `out` events carry `byWho`, `act` events carry `who` (+ `found` for checks),
  so the History reads "Seer (Alex)".
- Match recap: `src/recap.ts` `buildRecap()` (rule-based, only from the recorded log: votes, nominations, eliminations, saves, spirits) runs
  on the host when there is a winner and is shared as `recap`; the server only sends it to phones once `winner` is set (`recapView`).
  Shown by `src/views/RecapView.tsx` (auto-opens once on phones). English only for now.
- Interactive tutorial: `src/Tutorial.tsx`, after the splash for a new phone (`moonfall.tutorialSeen`), again from the guide / join screen.
- Remembered name: `device` in `src/net.ts` (localStorage device id + last name) pre-fills the join field.
- Custom role pictures: the role editor's "Picture" (only roles you create) stores a resized data URL on the custom role (`img`);
  phones load it from `/api/role-img?room=&key=` (fitted with `object-fit: contain` over a blurred copy).
- Newer player-phone strings (7 languages): `src/views/i18n/extra.ts`.
- Master controls (secret: press and hold the "N alive" counter on the Play screen for about a second): force any ending (`state.forced`, never saved
  to the Hall of Fame), give anyone any library role (via `override`), set any fate/death card, shuffle roles, revive, change round,
  scenario presets + a simulator (`simNight`/`simDay`/`simAll` drive the real host screens through `this._v`), and secret messages
  (shared `notes[name] = {id, text}` → that player's `note` only).
