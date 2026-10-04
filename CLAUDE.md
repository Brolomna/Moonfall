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

## Conventions
- Players are keyed by **name** (server makes names unique). Host-side maps `status`, `override` are name-keyed.
- Never send other players' roles to a phone — `playerView()` in the server is the only place that builds player data.
- Host-owned fields mirrored to the server are listed in `HostView.SHARED`.
