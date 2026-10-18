// Moonfall room server — one room per server, meant to run on the host's laptop / phone hotspot
// on the same Wi-Fi as everyone else. Holds the game state in memory and pushes each phone
// only what it is allowed to see (players never receive other players' roles).
import express from 'express';
import http from 'node:http';
import os from 'node:os';
import dgram from 'node:dgram';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Server, type Socket } from 'socket.io';
import QRCode from 'qrcode';

const PORT = Number(process.env.PORT || 3000);
// The host screen asks for this PIN (set HOST_PIN in the environment to change it).
const HOST_PIN = String(process.env.HOST_PIN || '6969');
const PROD = process.env.NODE_ENV === 'production';
// In dev the phones load the Vite dev server (5173), which proxies /socket.io + /api here.
const WEB_PORT = PROD ? PORT : Number(process.env.WEB_PORT || 5173);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

type Player = { id: string; name: string; color: string; connected: boolean; fake?: boolean };
type Shared = Record<string, any>;

// Names for test players the host adds from the invite screen (they have no phone).
const FAKE_NAMES = ['Luna', 'Felix', 'Iris', 'Oscar', 'Hazel', 'Milo', 'Nora', 'Theo', 'Ruby', 'Jasper',
  'Ivy', 'Leo', 'Clara', 'Finn', 'Mabel', 'Otto', 'Wren', 'Silas', 'Juno', 'Arlo'];
const PALETTE = ['#c9a7ff', '#ff9fb0', '#9fd0ff', '#8fe0b8', '#ffc98a', '#f2b6e6', '#b8c4ff', '#e8d3a0', '#a6eedd', '#ffb38a',
  '#d8e08a', '#f29a7a', '#8fd3e8', '#c48aa0', '#f2d06b', '#b45cc7', '#9fd6b8', '#f08fb8', '#a58ad6', '#ffd3a8'];

const room = {
  players: [] as Player[],
  spectators: [] as Player[], // joined while a game was running; they watch, and join the next game
  shared: {} as Shared, // everything the host screen owns (deck, rules, phase, marks…)
  assign: {} as Record<string, string>, // player name -> dealt role key
  dealt: false,
  ballot: null as null | { nominee: string; votes: Record<string, 'kill' | 'spare'> }, // one accused player at a time
  // the Spirit Realm (dead players): their own chat, and the one Spirit Council per game — kept on the server only
  spiritChat: [] as { from: string; text: string; at: number }[],
  council: null as null | Council,
};
type Faction = 'good' | 'evil' | 'neutral';
type Council = { at: number; round: number; phase: string; start: number; spirits: Record<string, { faction: Faction; to?: string; text?: string; at?: number }> };

// ---------- helpers ----------
// Public deployments (Render sets RENDER_EXTERNAL_URL; PUBLIC_URL works anywhere) join via that URL instead of the LAN IP.
const PUBLIC_URL = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/+$/, '');

/** Base URL phones use to reach this server, e.g. http://192.168.0.5:3000 or https://moonfall.onrender.com.
 *  Worked out per request, so the QR follows the host onto a different Wi-Fi without a restart. */
async function joinBase(): Promise<string> {
  if (PUBLIC_URL) return PUBLIC_URL;
  const host = process.env.PUBLIC_HOST || (await lanAddress());
  return `http://${/:\d+$/.test(host) ? host : `${host}:${WEB_PORT}`}`;
}

async function lanAddress(): Promise<string> {
  const prefer = (n: string) => (/^(en|wl|eth|wlan|Wi-Fi|Ethernet)/i.test(n) ? 0 : 1);
  let ifaces: ReturnType<typeof os.networkInterfaces> = {};
  try { ifaces = os.networkInterfaces(); } catch { /* Android (Termux) denies this */ }
  const all = Object.entries(ifaces)
    .flatMap(([name, list]) => (list || []).filter(a => a.family === 'IPv4' && !a.internal).map(a => ({ name, address: a.address })))
    .sort((a, b) => prefer(a.name) - prefer(b.name));
  return all[0]?.address || (await routeAddress()) || 'localhost';
}

/** Local IP of the interface the default route uses. Connecting a UDP socket sends nothing,
 *  and unlike os.networkInterfaces() it is allowed on Android. */
function routeAddress(): Promise<string | undefined> {
  return new Promise(resolve => {
    const sock = dgram.createSocket('udp4');
    const done = (ip?: string) => { clearTimeout(timer); try { sock.close(); } catch { /* already closed */ } resolve(ip); };
    const timer = setTimeout(() => done(), 1000);
    sock.on('error', () => done());
    sock.connect(53, '8.8.8.8', () => { try { done(sock.address().address); } catch { done(); } });
  });
}

function uniqueName(raw: string, selfId?: string): string {
  const base = raw.trim().slice(0, 18) || 'Player';
  const taken = (n: string) => room.players.concat(room.spectators).some(p => p.id !== selfId && p.name.toLowerCase() === n.toLowerCase());
  if (!taken(base)) return base;
  for (let i = 2; ; i++) if (!taken(`${base} ${i}`)) return `${base} ${i}`;
}

function nextColor(): string {
  const used = new Set(room.players.map(p => p.color));
  return PALETTE.find(c => !used.has(c)) || PALETTE[room.players.length % PALETTE.length];
}

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Custom roles + host edits for the given role keys (what a phone needs to draw those cards). */
function roleDefsFor(list: string[]) {
  const sh = room.shared;
  const keys = new Set(list);
  const roleDefs: Record<string, any> = {};
  for (const k of keys) {
    const custom = (sh.custom || []).find((c: any) => c.key === k);
    const edit = (sh.edits || {})[k];
    if (!custom && !edit) continue;
    const src = { ...(custom || {}), ...(edit || {}) }; // host edits apply to their own roles too
    roleDefs[k] = {
      ...(src.name ? { name: src.name } : {}),
      ...(src.team ? { team: src.team } : {}),
      ...(src.color ? { color: src.color, rgb: src.rgb } : {}),
      ...(src.icon ? { icon: src.icon } : {}),
      ...(src.blurb ? { desc: src.blurb } : {}),
      ...(custom ? { motto: '', custom: true } : {}),
      ...(custom && custom.lib ? { lib: custom.lib } : {}), // library role → the phone shows it in its own language
      ...(src.wolf === false ? { wolf: false } : {}), // wolf helpers don't count as wolves
      // host-written text wins over the phone's translations; untouched library roles stay translatable
      edited: !!edit || (!!custom && !custom.lib),
    };
  }

  return roleDefs;
}


/** How many players died during the current round's night (picks the morning sound: none / one / more). */
function dawnDeaths() {
  const sh = room.shared;
  return Object.values((sh.status || {}) as Record<string, any>).filter(m => m && m.phase === 'night' && m.round === (sh.round || 1) && m.how !== 'removed').length;
}

/** A role key that is the library's Drunk. */
function isDrunk(k: string) {
  const c = (room.shared.custom || []).find((x: any) => x.key === k);
  return !!(c && c.lib === 'Drunk');
}

// night deaths with their own death card on the phone (see src/deathCauses.ts)
const FATES = ['slain', 'knife', 'burned', 'betrayed', 'staked', 'revealed', 'misfire', 'vengeance', 'deathcurse', 'kingshot', 'starved', 'ghost', 'sacrifice'];

/** What one phone is allowed to know. */
// ---------- sponsor ----------
// Two ways to set one: the host's Sponsor screen (wins when switched on), or files in the repo's sponsor/ folder:
//   sponsor/info.txt   lines "name: …", "offer: …", "link: …"
//   sponsor/logo.png   (or .jpg / .jpeg / .webp) — square
//   sponsor/banner.png (or .jpg / .jpeg / .webp / .gif) — wide, 3:1
// No files (and nothing set by the host) → no sponsor anywhere; the folder is re-read every 30 s.
const SPONSOR_DIR = path.join(ROOT, 'sponsor');
const IMG = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
let fileSponsorCache: { at: number; v: ReturnType<typeof readFileSponsor> } = { at: 0, v: null };
function readFileSponsor() {
  try {
    if (!fs.existsSync(SPONSOR_DIR)) return null;
    const find = (base: string) => IMG.map(e => base + '.' + e).find(f => fs.existsSync(path.join(SPONSOR_DIR, f)));
    const url = (f?: string) => (f ? '/sponsor/' + f + '?v=' + Math.round(fs.statSync(path.join(SPONSOR_DIR, f)).mtimeMs) : '');
    const info: Record<string, string> = {};
    const txt = path.join(SPONSOR_DIR, 'info.txt');
    if (fs.existsSync(txt)) for (const line of fs.readFileSync(txt, 'utf8').split(/\r?\n/)) {
      const m = /^\s*(name|offer|link)\s*[:=]\s*(.*?)\s*$/i.exec(line); if (m) info[m[1].toLowerCase()] = m[2];
    }
    const logo = url(find('logo')), banner = url(find('banner'));
    if (!info.name && !logo && !banner) return null;
    return { name: info.name || '', offer: info.offer || '', link: info.link || '', logo, banner };
  } catch { return null; }
}
const fileSponsor = () => { if (Date.now() - fileSponsorCache.at > 30000) fileSponsorCache = { at: Date.now(), v: readFileSponsor() }; return fileSponsorCache.v; };
const webLink = (l: string) => { const x = String(l || '').trim(); if (!x) return ''; const u = /^https?:\/\//i.test(x) ? x : 'https://' + x; return /^https?:\/\/[^\s]+\.[^\s]+/i.test(u) ? u : ''; };

/** The sponsor for players' phones: name, offer, link, logo, banner (images are plain URLs). */
function sponsorView() {
  const sp = room.shared.sponsor;
  if (sp && sp.on && String(sp.name || '').trim())
    return { name: String(sp.name).slice(0, 60), offer: String(sp.offer || '').slice(0, 140), link: webLink(sp.link), logo: room.shared.sponsorLogo ? '/api/sponsor/logo?v=' + (sp.logoV || 0) : '', banner: '' };
  const f = fileSponsor();
  return f ? { ...f, name: f.name.slice(0, 60), offer: f.offer.slice(0, 140), link: webLink(f.link) } : null;
}

function playerView(p: Player) {
  const sh = room.shared;
  const mark = (sh.status || {})[p.name];
  // which death card the phone shows
  const fate = !mark ? 'none' : mark.how === 'voted' ? 'voted' : mark.how !== 'night' ? 'none'
    : (({ poison: 'poisoned', hunter: 'shot', heartbreak: 'heartbreak' } as Record<string, string>)[mark.cause] || (FATES.includes(mark.cause) ? mark.cause : 'killed'));
  // Cupid's lovers know each other: their card shows a heart and the partner's name
  const lovers: string[] | null = sh.lovers || null;
  const lover = lovers && lovers.includes(p.name) && room.dealt ? lovers.find(n => n !== p.name) || null : null;
  let role: string | null = (sh.override || {})[p.name] || room.assign[p.name] || null;
  // the Drunk believes they're a plain Villager until the host hands them their real role on night 3
  if (role && !(sh.override || {})[p.name] && isDrunk(role)) role = 'villager';

  const counts: Record<string, number> = {};
  Object.values(room.assign).forEach(k => { counts[k] = (counts[k] || 0) + 1; });
  // Before the deal, phones see the deck the host is building (live, as the host taps); after it, the dealt cards.
  const showRoles = !(sh.rules && sh.rules.showRoles === false);
  const hidden: string[] = sh.hidden || [];
  const draft: [string, number][] = showRoles
    ? [...Object.entries((sh.counts || {}) as Record<string, number>), ...((sh.picked || []) as string[]).map(k => [k, 1] as [string, number])]
        .filter(([k, n]) => n > 0 && !hidden.includes(k))
    : [];
  // with bluff cards the phones see the whole selected deck (sh.pool), never which cards were actually dealt
  const poolCounts: Record<string, number> = {};
  if (room.dealt && Array.isArray(sh.pool) && sh.pool.length) sh.pool.forEach((k: string) => { poolCounts[k] = (poolCounts[k] || 0) + 1; });
  const deck = room.dealt ? Object.entries(Object.keys(poolCounts).length ? poolCounts : counts) : draft;

  // roles named in this player's night answer too (e.g. the Drunk's real role, which was never dealt)
  const wh = (sh.whispers || {})[p.name] || {};
  const roleDefs = roleDefsFor([...deck.map(([k]) => k), ...(role ? [role] : []), ...(wh.role ? [wh.role] : []), ...(Array.isArray(wh.roles) ? wh.roles : [])]);

  return {
    joined: true,
    name: p.name,
    dealt: room.dealt && !!role,
    role,
    phase: sh.phase || 'night',
    fate,
    roomLang: sh.roomLang || 'en',
    showRoles,
    dawnDeaths: dawnDeaths(),
    round: sh.round || 1,
    winner: room.dealt ? sh.winner || null : null,
    sponsor: sponsorView(),
    spirit: spiritView(p.name), // only when this player is dead
    // whispers spirits sent to this living player (anonymous)
    spiritWhispers: room.council && !isSpirit(p.name) ? Object.values(room.council.spirits).filter(x => x.to === p.name && x.text).map(x => ({ id: 'sw' + x.at, text: x.text })) : [],
    note: (sh.notes || {})[p.name] || null, // a secret message from the host to this player only
    whisper: room.dealt && sh.whispers && sh.whispers[p.name] && sh.whispers[p.name].round === (sh.round || 1) && (!sh.whispers[p.name].key || sh.whispers[p.name].key === sh.awake) && (sh.phase || 'night') === 'night' ? sh.whispers[p.name] : null,
    timer: room.dealt && sh.timer ? sh.timer : null,
    now: Date.now(),
    ballot: room.dealt && room.ballot && !(sh.status || {})[p.name] ? { nominee: room.ballot.nominee, mine: room.ballot.votes[p.name] || null, ...(room.ballot.nominee === p.name ? { accused: true } : {}) } : null,
    ivory: !!(room.dealt && sh.ivory === p.name),
    lover,
    deck,
    roleDefs,
    playerCount: room.players.length,
  };
}

/** A spectator sees everything: every player's role, who is out, and the host's timeline. */
function spectatorView(sp: Player) {
  const sh = room.shared;
  const roleOf = (name: string) => (sh.override || {})[name] || room.assign[name] || null;
  const players = room.players.map(p => ({ name: p.name, color: p.color, role: roleOf(p.name), status: (sh.status || {})[p.name] || null }));
  const keys = players.map(p => p.role).filter(Boolean) as string[];
  return {
    spectator: true,
    sponsor: sponsorView(),
    dawnDeaths: dawnDeaths(),
    name: sp.name,
    dealt: room.dealt,
    phase: sh.phase || 'night',
    round: sh.round || 1,
    winner: room.dealt ? sh.winner || null : null,
    timer: room.dealt && sh.timer ? sh.timer : null,
    now: Date.now(),
    roomLang: sh.roomLang || 'en',
    players,
    log: sh.log || [],
    roleDefs: roleDefsFor(keys),
    deck: Object.entries(keys.reduce((c: Record<string, number>, k) => ((c[k] = (c[k] || 0) + 1), c), {})), // for the game guide
    showRoles: true,
    playerCount: room.players.length,
  };
}

// ---------- the Spirit Realm ----------
// Dead players are spirits: they chat with each other on their phones. Once ceil(30% of the starting players) are dead,
// the Spirit Council happens (once per game): every spirit at that moment secretly gets a new faction — good, evil or
// neutral — which replaces their old team for winning (their role itself never changes), and may whisper one message
// to one living player. Factions, the chat and who whispered stay on the server: a phone only ever gets its own part.
const startCount = () => Object.keys(room.assign).length;
const councilNeed = () => Math.max(1, Math.ceil(startCount() * 0.3));
const isSpirit = (name: string) => { const m = (room.shared.status || {})[name]; return room.dealt && !!m && m.how !== 'removed'; };
const livingNames = () => room.players.filter(p => room.assign[p.name] && !(room.shared.status || {})[p.name]).map(p => p.name);
function checkCouncil() {
  if (!room.dealt || room.council || !startCount()) return;
  const dead = room.players.map(p => p.name).filter(isSpirit);
  if (dead.length < councilNeed()) return;
  const order: Faction[] = shuffle(['good', 'evil', 'neutral'] as Faction[]);
  const spirits: Council['spirits'] = {};
  shuffle(dead).forEach((nm, i) => { spirits[nm] = { faction: order[i % 3] }; }); // a fair spread of the three
  room.council = { at: Date.now(), round: room.shared.round || 1, phase: room.shared.phase || 'night', start: startCount(), spirits };
}
/** Did this spirit win? good → with the village, evil → with the werewolves, neutral → the player they whispered to is alive. */
function spiritWon(name: string): boolean | null {
  const s = room.council && room.council.spirits[name]; const w = room.shared.winner;
  if (!s || !w || !isSpirit(name)) return null;
  if (s.faction === 'good') return w.side === 'village';
  if (s.faction === 'evil') return w.side === 'wolves';
  return !!s.to && !(room.shared.status || {})[s.to];
}
function spiritView(name: string) {
  if (!isSpirit(name)) return null;
  const c = room.council, mine = c && c.spirits[name];
  return {
    chat: room.spiritChat.slice(-80),
    council: c ? (mine ? { faction: mine.faction, to: mine.to || null, text: mine.text || null, living: livingNames(), won: spiritWon(name) } : { late: true }) : null,
    need: councilNeed(), dead: room.players.map(p => p.name).filter(isSpirit).length,
  };
}

function hostView() {
  return {
    spectators: room.spectators.filter(p => p.connected).length,
    players: room.players.map(({ name, color, connected, fake }) => ({ name, color, connected, fake: !!fake })),
    assign: room.assign,
    dealt: room.dealt,
    ballot: room.ballot ? {
      nominee: room.ballot.nominee,
      kill: Object.values(room.ballot.votes).filter(v => v === 'kill').length,
      spare: Object.values(room.ballot.votes).filter(v => v === 'spare').length,
      voted: Object.keys(room.ballot.votes).length,
      voters: room.players.filter(p => !(room.shared.status || {})[p.name] && p.name !== room.ballot!.nominee).length, // the nominee doesn't vote on themselves
    } : null,
    // the host sees the whole Spirit Realm (it runs the game); players never get this
    spirits: room.dealt ? { chat: room.spiritChat, council: room.council, need: councilNeed(), dead: room.players.map(p => p.name).filter(isSpirit).length,
      won: room.council ? Object.fromEntries(Object.keys(room.council.spirits).map(nm => [nm, spiritWon(nm)])) : {} } : null,
  };
}

// ---------- server ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use('/sponsor', express.static(SPONSOR_DIR, { maxAge: '1h' })); // the sponsor folder's pictures
// the sponsor before a phone has joined (splash + join screen), and its logo as a plain image
app.get('/api/sponsor', (_req, res) => res.json(sponsorView()));
app.get('/api/sponsor/logo', (_req, res) => {
  const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(String(room.shared.sponsorLogo || ''));
  if (!m) return res.status(404).end();
  res.type(m[1]).set('Cache-Control', 'public, max-age=86400').send(Buffer.from(m[2], 'base64'));
});

// which commit is running (Render sets RENDER_GIT_COMMIT) — handy to check a deploy went out
app.get('/api/version', (_req, res) => res.json({ commit: (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7) }));

app.get('/api/info', async (_req, res) => {
  const base = await joinBase();
  const host = base.replace(/^https?:\/\//, '');
  const url = `${base}/player`; // QR → player screen (any path except /host renders it)
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320, color: { dark: '#140b22', light: '#ede6f7' } });
  res.json({ host, url, qr });
});

if (PROD) {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) console.warn('⚠  dist/ not found — run `npm run build` first.');
  app.use(express.static(dist, { extensions: ['html'] })); // /how-to-play, /ko/roles … → the built guide pages (scripts/build-pages.ts)
  app.get('/privacy', (_req, res) => res.sendFile(path.join(dist, 'privacy.html'))); // the privacy policy (static page in public/)
  app.use((req, res, next) => (req.method === 'GET' && !req.path.startsWith('/socket.io') ? res.sendFile(path.join(dist, 'index.html')) : next()));
}

/** Everything needed to rebuild the room. The host's phone keeps a copy, so a server restart
 *  (redeploy, crash, free-plan sleep) doesn't end the game: the host sends it back when it reconnects. */
function snapshot() {
  return { at: Date.now(), players: room.players, spectators: room.spectators, shared: room.shared, assign: room.assign, dealt: room.dealt, spiritChat: room.spiritChat, council: room.council };
}
const isFresh = () => !room.players.length && !room.dealt && !Object.keys(room.shared).length;

function pushAll() {
  io.to('host').emit('room', hostView());
  io.to('host').emit('host:snapshot', snapshot());
  for (const p of room.players) io.to(`p:${p.id}`).emit('player:view', playerView(p));
  for (const sp of room.spectators) io.to(`p:${sp.id}`).emit('player:view', spectatorView(sp));
}

io.on('connection', (socket: Socket) => {
  const auth = socket.handshake.auth || {};

  if (auth.role === 'host') {
    if (String(auth.pin || '') !== HOST_PIN) {
      socket.emit('host:denied');
      setTimeout(() => socket.disconnect(true), 100);
      return;
    }
    socket.join('host');
    socket.emit('host:init', { shared: room.shared, room: hostView(), fresh: isFresh() });
    socket.emit('host:snapshot', snapshot());

    // after a restart the room is empty: the host's phone sends back its last copy of the game
    socket.on('host:restore', (snap: ReturnType<typeof snapshot>) => {
      if (!isFresh() || !snap || !Array.isArray(snap.players)) return;
      const seat = (p: Player): Player => ({ id: String(p.id), name: String(p.name), color: String(p.color || nextColor()), connected: !!p.fake, ...(p.fake ? { fake: true } : {}) });
      room.players = snap.players.map(seat);
      room.spectators = (snap.spectators || []).map(seat);
      room.shared = snap.shared || {};
      room.assign = snap.assign || {};
      room.dealt = !!snap.dealt;
      room.spiritChat = Array.isArray(snap.spiritChat) ? snap.spiritChat : [];
      room.council = snap.council || null;
      socket.emit('host:init', { shared: room.shared, room: hostView(), fresh: false, restored: true });
      io.emit('room:restored'); // phones reconnect and find their seat (and card) again
      pushAll();
    });

    socket.on('host:patch', (patch: Shared) => {
      if (patch.timer && patch.timer.running) patch.timer = { ...patch.timer, endsAt: Date.now() + Math.max(0, Number(patch.timer.leftMs) || 0) };
      Object.assign(room.shared, patch);
      if (patch.status) checkCouncil(); // a death may call the Spirit Council
      pushAll();
    });
    // secret phone vote, one nominee at a time: open with their name, close with null (the host only sees counts)
    socket.on('host:ballot', (nominee: string | null) => {
      room.ballot = typeof nominee === 'string' && nominee ? { nominee, votes: {} } : null;
      pushAll();
    });
    socket.on('host:kick', (name: string) => {
      const p = room.players.find(x => x.name === name);
      if (!p) return;
      room.players = room.players.filter(x => x !== p);
      delete room.assign[p.name];
      io.to(`p:${p.id}`).emit('player:kicked');
      pushAll();
    });
    socket.on('host:fake', (count: number) => {
      const n = Math.max(0, Math.min(20, Math.floor(Number(count)) || 0));
      for (let i = 0; i < n; i++) {
        const name = uniqueName(FAKE_NAMES[room.players.filter(p => p.fake).length % FAKE_NAMES.length]);
        room.players.push({ id: `fake-${randomUUID()}`, name, color: nextColor(), connected: true, fake: true });
      }
      pushAll();
    });
    socket.on('host:unfake', () => {
      room.players.filter(p => p.fake).forEach(p => delete room.assign[p.name]);
      room.players = room.players.filter(p => !p.fake);
      pushAll();
    });
    socket.on('host:deal', (keys: string[], fixed?: Record<string, string>) => {
      // Roles the host fixed to players are handed out first (each takes one card of that role from the deck);
      // the remaining cards are shuffled among everyone else.
      room.assign = {};
      room.ballot = null;
      const rest = keys.slice();
      for (const [name, key] of Object.entries(fixed || {})) {
        const i = rest.indexOf(key);
        if (i >= 0 && room.players.some(p => p.name === name)) { room.assign[name] = key; rest.splice(i, 1); }
      }
      const deck = shuffle(rest);
      shuffle(room.players.filter(p => !room.assign[p.name])).forEach((p, i) => { if (deck[i]) room.assign[p.name] = deck[i]; });
      room.dealt = true;
      room.spiritChat = []; room.council = null;
      pushAll();
    });
    socket.on('host:end', () => {
      room.ballot = null;
      room.assign = {};
      room.dealt = false;
      room.spiritChat = []; room.council = null;
      for (const sp of room.spectators) room.players.push({ ...sp, color: nextColor() }); // they join the next game
      room.spectators = [];
      pushAll();
    });
    return;
  }

  // ----- players -----
  let me: Player | undefined = room.players.find(p => p.id === auth.playerId) || room.spectators.find(p => p.id === auth.playerId);
  const attach = (p: Player) => {
    me = p;
    p.connected = true;
    socket.join(`p:${p.id}`);
    socket.emit('player:view', room.spectators.includes(p) ? spectatorView(p) : playerView(p));
    pushAll();
  };
  if (me) attach(me);
  else socket.emit('player:view', null);

  // secret phone vote: each living player chooses eliminate or spare for the nominee; they can change until it closes
  socket.on('player:vote', (choice: 'kill' | 'spare') => {
    if (!me || !room.ballot || !room.players.includes(me) || (room.shared.status || {})[me.name]) return;
    if (choice !== 'kill' && choice !== 'spare') return;
    if (me.name === room.ballot.nominee) return; // no voting on yourself
    room.ballot.votes[me.name] = choice;
    pushAll();
  });

  // the Spirit Realm: dead players talk among themselves…
  socket.on('spirit:say', (text: string) => {
    if (!me || !room.players.includes(me) || !isSpirit(me.name)) return;
    const t = String(text || '').trim().slice(0, 200); if (!t) return;
    room.spiritChat.push({ from: me.name, text: t, at: Date.now() });
    if (room.spiritChat.length > 300) room.spiritChat = room.spiritChat.slice(-300);
    pushAll();
  });
  // …and at the Spirit Council each one whispers once to one living player
  socket.on('spirit:whisper', (msg: { to: string; text: string }) => {
    const s = me && room.council && room.council.spirits[me.name];
    if (!me || !s || s.to || !isSpirit(me.name)) return;
    const to = String(msg && msg.to || ''), t = String(msg && msg.text || '').trim().slice(0, 160);
    if (!t || livingNames().indexOf(to) < 0) return;
    s.to = to; s.text = t; s.at = Date.now();
    pushAll();
  });

  socket.on('player:join', ({ name }: { name: string }, ack?: (r: { playerId: string; name: string }) => void) => {
    // Same name as a seat whose phone has dropped (new browser, cleared storage…) → take that seat back, card included
    const seat = !me && room.players.find(p => !p.connected && p.name.toLowerCase() === name.trim().slice(0, 18).toLowerCase());
    if (seat) {
      me = seat;
    } else if (me) {
      me.name = room.dealt ? me.name : uniqueName(name, me.id); // names are locked once cards are dealt
    } else if (room.dealt) {
      // the game is already running: watch it, and play in the next one
      me = { id: randomUUID(), name: uniqueName(name), color: '#c7a8ff', connected: true };
      room.spectators.push(me);
    } else {
      me = { id: randomUUID(), name: uniqueName(name), color: nextColor(), connected: true };
      room.players.push(me);
    }
    ack?.({ playerId: me.id, name: me.name });
    attach(me);
  });

  socket.on('disconnect', () => {
    if (!me) return;
    const stillHere = [...(io.sockets.adapter.rooms.get(`p:${me.id}`) || [])].length > 0;
    if (!stillHere) {
      me.connected = false;
      pushAll();
    }
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  const base = await joinBase();
  console.log(`\n  🌕 Moonfall is running\n`);
  console.log(`  Host (open on your phone):  ${base}/host`);
  console.log(`  Players join at:            ${base}/player\n`);
});
