// Moonfall room server — runs on the host's laptop / phone hotspot (same Wi-Fi as everyone else) or on Render.
// Holds any number of independent rooms in memory, each with its own host password, and pushes each phone
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

const newRoom = (code: string, password: string) => ({
  code,
  password, // the host's room password (chosen when the room is created)
  touched: Date.now(), // last activity, for clearing out abandoned rooms
  players: [] as Player[],
  spectators: [] as Player[], // joined while a game was running; they watch, and join the next game
  shared: {} as Shared, // everything the host screen owns (deck, rules, phase, marks…)
  assign: {} as Record<string, string>, // player name -> dealt role key
  dealt: false,
  ballot: null as null | { nominee: string; votes: Record<string, 'kill' | 'spare'> }, // one accused player at a time
  // the Spirit Realm (dead players): their own chat, and the one Spirit Council per game — kept on the server only
  spiritChat: [] as { from: string; text: string; at: number }[],
  council: null as null | Council,
  // players chatting on the waiting screen before a game starts
  lobbyChat: [] as { from: string; text: string; at: number }[],
  // deaths marked during the night are announced on every phone at dawn (never who did it)
  deathQueue: [] as string[],
  deathSeq: 0,
});
type Room = ReturnType<typeof newRoom>;
type Faction = 'good' | 'evil' | 'neutral';
type Council = { at: number; round: number; phase: string; start: number; revealed?: boolean; spirits: Record<string, { faction: Faction; to?: string; text?: string; at?: number }> };

// ---------- rooms ----------
// Every room is separate: its own players, deck, game and host. A host opens a room with its name and password
// (a new name creates it); players join with the room name (the QR code carries it).
const rooms = new Map<string, Room>();
/** A room name as typed → its code: lower case letters, digits and dashes (2–24). '' if it can't be one. */
const roomCode = (raw: unknown) => { const c = String(raw || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 24); return c.length >= 2 ? c : ''; };
// rooms nobody has used for 12 hours are forgotten (the host's phone still keeps its copy of the game)
setInterval(() => {
  for (const [code, r] of rooms) if (Date.now() - r.touched > 12 * 3600 * 1000 && ![...(io.sockets.adapter.rooms.get(code + ':all') || [])].length) rooms.delete(code);
}, 3600 * 1000).unref();

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

function uniqueName(room: Room, raw: string, selfId?: string): string {
  const base = raw.trim().slice(0, 18) || 'Player';
  const taken = (n: string) => room.players.concat(room.spectators).some(p => p.id !== selfId && p.name.toLowerCase() === n.toLowerCase());
  if (!taken(base)) return base;
  for (let i = 2; ; i++) if (!taken(`${base} ${i}`)) return `${base} ${i}`;
}

function nextColor(room: Room): string {
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

/** A role picture as the host's phone sends it: a small data: URL (png / jpeg / webp). */
const roleImg = (v: unknown) => typeof v === 'string' && v.length < 400000 && /^data:image\/(?:png|jpeg|webp);base64,/.test(v) ? v : '';
const imgTag = (v: string) => v.length.toString(36) + v.slice(-12).replace(/[^a-z0-9]/gi, '');

/** Custom roles + host edits for the given role keys (what a phone needs to draw those cards). */
function roleDefsFor(room: Room, list: string[]) {
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
      // the host's own picture for a hand-made role (never for standard roles): a plain URL, so phones fetch it once
      ...(custom && !custom.lib && roleImg(custom.img) ? { img: '/api/role-img?room=' + room.code + '&key=' + encodeURIComponent(k) + '&v=' + imgTag(custom.img) } : {}),
      // host-written text wins over the phone's translations; untouched library roles stay translatable
      edited: !!edit || (!!custom && !custom.lib),
    };
  }

  return roleDefs;
}


/** How many players died during the current round's night (picks the morning sound: none / one / more). */
function dawnDeaths(room: Room) {
  const sh = room.shared;
  return Object.values((sh.status || {}) as Record<string, any>).filter(m => m && m.phase === 'night' && m.round === (sh.round || 1) && m.how !== 'removed').length;
}

/** A role key that is the library's Drunk. */
function isDrunk(room: Room, k: string) {
  const c = (room.shared.custom || []).find((x: any) => x.key === k);
  return !!(c && c.lib === 'Drunk');
}
/** A role key that is the library's Atheist. */
function isAtheist(room: Room, k: string) {
  const c = (room.shared.custom || []).find((x: any) => x.key === k);
  return !!(c && c.lib === 'Atheist');
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
function sponsorView(room: Room) {
  const sp = room.shared.sponsor;
  if (sp && sp.on && String(sp.name || '').trim())
    return { name: String(sp.name).slice(0, 60), offer: String(sp.offer || '').slice(0, 140), link: webLink(sp.link), logo: room.shared.sponsorLogo ? '/api/sponsor/logo?room=' + room.code + '&v=' + (sp.logoV || 0) : '', banner: '' };
  const f = fileSponsor();
  return f ? { ...f, name: f.name.slice(0, 60), offer: f.offer.slice(0, 140), link: webLink(f.link) } : null;
}

function playerView(room: Room, p: Player) {
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
  if (role && !(sh.override || {})[p.name] && isDrunk(room, role)) role = 'villager';
  // the Atheist never shows on a phone — its holder sees a Villager card until the game is over
  if (role && isAtheist(room, role) && !sh.winner) role = 'villager';

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
  const deck0 = room.dealt ? Object.entries(Object.keys(poolCounts).length ? poolCounts : counts) : draft;
  // the Atheist never shows in the players' role list (it would give the twist away): it's listed as a Villager
  const atheistKeys = (sh.custom || []).filter((c: any) => c.lib === 'Atheist').map((c: any) => c.key);
  const hiddenN = deck0.filter(([k]) => atheistKeys.includes(k)).reduce((a, [, c]) => a + Number(c), 0);
  const deck = hiddenN ? deck0.filter(([k]) => !atheistKeys.includes(k)).map(([k, c]) => [k, k === 'villager' ? Number(c) + hiddenN : c] as [string, number]).concat(deck0.some(([k]) => k === 'villager') ? [] : [['villager', hiddenN] as [string, number]]) : deck0;

  // roles named in this player's night answer too (e.g. the Drunk's real role, which was never dealt)
  const wh = (sh.whispers || {})[p.name] || {};
  const roleDefs = roleDefsFor(room, [...deck.map(([k]) => k), ...(role ? [role] : []), ...(wh.role ? [wh.role] : []), ...(Array.isArray(wh.roles) ? wh.roles : [])]);

  return {
    joined: true,
    name: p.name,
    dealt: room.dealt && !!role,
    role,
    phase: sh.phase || 'night',
    fate,
    roomLang: sh.roomLang || 'en',
    showRoles,
    dawnDeaths: dawnDeaths(room),
    round: sh.round || 1,
    winner: room.dealt ? sh.winner || null : null,
    sponsor: sponsorView(room),
    theme: room.shared.theme || null, // the host's look (e.g. 'halloween')
    spirit: spiritView(room, p.name), // only when this player is dead
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
    lobbyChat: room.dealt ? null : room.lobbyChat.slice(-80), // the waiting screen's chat
    voteResult: voteResultView(room),
    recap: recapView(room),
  };
}

/** The day's vote once the host has closed it: each nominee's total only — never who voted for whom. */
function voteResultView(room: Room) {
  const sh = room.shared, v = sh.vote;
  if (!room.dealt || sh.winner || !v || !v.closed || !v.result || v.round !== (sh.round || 1) || (sh.phase || 'night') !== 'day') return null;
  const r = v.result, tally: [string, number][] = Array.isArray(r.tally) ? r.tally : [];
  const count = (nm: string) => Number((tally.find(x => x[0] === nm) || [nm, 0])[1]) || 0;
  const noms = (Array.isArray(v.noms) ? v.noms : []).map((n: any) => ({ name: String(n.name), count: count(n.name) }))
    .concat(tally.filter(x => !(v.noms || []).some((n: any) => n.name === x[0])).map(x => ({ name: String(x[0]), count: Number(x[1]) || 0 })))
    .sort((a: any, b: any) => b.count - a.count);
  const id = [v.round, r.out || '', r.why || '', (r.tie || []).join('+'), noms.map((n: any) => n.name + ':' + n.count).join(',')].join('|');
  return { id, noms, out: r.out || null, tie: Array.isArray(r.tie) ? r.tie : null, why: r.why || null };
}

/** The post-game recap the host's phone builds from the game's record — only once the game is over. */
function recapView(room: Room) {
  const sh = room.shared;
  return room.dealt && sh.winner && sh.recap && Array.isArray(sh.recap.cards) ? sh.recap : null;
}

/** "<name> died" on every phone — never who or what killed them. Deaths marked at night wait for the morning. */
function noteDeaths(room: Room, before: Record<string, any>) {
  const sh = room.shared, now = sh.status || {};
  if (!room.dealt) { room.deathQueue = []; return; }
  const night = (sh.phase || 'night') === 'night';
  const dead = (m: any) => !!m && m.how !== 'removed';
  const fresh = Object.keys(now).filter(nm => dead(now[nm]) && !dead(before[nm]));
  room.deathQueue = room.deathQueue.filter(nm => dead(now[nm])); // brought back before dawn: nothing to announce
  const later = night ? fresh.filter(nm => now[nm].phase === 'night') : [];
  room.deathQueue.push(...later.filter(nm => room.deathQueue.indexOf(nm) < 0));
  const say = fresh.filter(nm => later.indexOf(nm) < 0).concat(night ? [] : room.deathQueue);
  if (!night) room.deathQueue = [];
  if (!say.length) return;
  // a moment's wait, so a mark the host corrects right away isn't announced
  setTimeout(() => {
    const st = room.shared.status || {};
    const names = say.filter((nm, i) => say.indexOf(nm) === i && dead(st[nm]));
    if (names.length && room.dealt) io.to(room.code + ':all').emit('room:death', { id: ++room.deathSeq, names });
  }, 1500);
}

/** A spectator sees everything: every player's role, who is out, and the host's timeline. */
function spectatorView(room: Room, sp: Player) {
  const sh = room.shared;
  const roleOf = (name: string) => (sh.override || {})[name] || room.assign[name] || null;
  const players = room.players.map(p => ({ name: p.name, color: p.color, role: roleOf(p.name), status: (sh.status || {})[p.name] || null }));
  const keys = players.map(p => p.role).filter(Boolean) as string[];
  return {
    spectator: true,
    sponsor: sponsorView(room),
    theme: room.shared.theme || null,
    dawnDeaths: dawnDeaths(room),
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
    roleDefs: roleDefsFor(room, keys),
    deck: Object.entries(keys.reduce((c: Record<string, number>, k) => ((c[k] = (c[k] || 0) + 1), c), {})), // for the game guide
    showRoles: true,
    playerCount: room.players.length,
    voteResult: voteResultView(room),
    recap: recapView(room),
  };
}

// ---------- the Spirit Realm ----------
// Dead players are spirits: they chat with each other on their phones. When the host calls it (suggested once
// ceil(30% of the starting players) are dead), the Spirit Council happens (once per game): every spirit at that moment secretly gets a new faction — good or
// evil — which replaces their old team for winning (their role itself never changes), and secretly chooses one
// living player (no message is sent). Phones see their faction only once the host reveals the factions
// (`host:council:reveal` — tapped before the Council, it calls the Council and reveals at once). In an Atheist game there
// are no evil players, so every spirit becomes good. Factions, the chat and who whispered stay on the server: a phone only ever gets its own part.
const startCount = (room: Room) => Object.keys(room.assign).length;
const councilNeed = (room: Room) => Math.max(1, Math.ceil(startCount(room) * 0.3));
const isSpirit = (room: Room, name: string) => { const m = (room.shared.status || {})[name]; return room.dealt && !!m && m.how !== 'removed'; };
const livingNames = (room: Room) => room.players.filter(p => room.assign[p.name] && !(room.shared.status || {})[p.name]).map(p => p.name);
/** An Atheist was dealt (no evil players this game). */
const atheistGame = (room: Room) => {
  const keys = (room.shared.custom || []).filter((c: any) => c.lib === 'Atheist').map((c: any) => c.key);
  return keys.length > 0 && Object.values(room.assign).some(k => keys.includes(k));
};
function callCouncil(room: Room) {
  if (!room.dealt || room.council || !startCount(room)) return;
  const dead = room.players.map(p => p.name).filter(nm => isSpirit(room, nm));
  if (!dead.length) return; // needs at least one spirit
  const order: Faction[] = atheistGame(room) ? ['good'] : shuffle(['good', 'evil'] as Faction[]);
  const spirits: Council['spirits'] = {};
  shuffle(dead).forEach((nm, i) => { spirits[nm] = { faction: order[i % order.length] }; }); // a fair spread of the two
  room.council = { at: Date.now(), round: room.shared.round || 1, phase: room.shared.phase || 'night', start: startCount(room), spirits };
}
/** Did this spirit win? good → with the village, evil → with the werewolves, neutral → the player they chose is alive. */
function spiritWon(room: Room, name: string): boolean | null {
  const s = room.council && room.council.spirits[name]; const w = room.shared.winner;
  if (!s || !w || !isSpirit(room, name)) return null;
  if (s.faction === 'good') return w.side === 'village';
  if (s.faction === 'evil') return w.side === 'wolves';
  return !!s.to && !(room.shared.status || {})[s.to];
}
function spiritView(room: Room, name: string) {
  if (!isSpirit(room, name)) return null;
  const c = room.council, mine = c && c.spirits[name];
  return {
    chat: room.spiritChat.slice(-80),
    council: c ? (mine ? { at: c.at, faction: c.revealed ? mine.faction : null, to: mine.to || null, living: livingNames(room), won: c.revealed ? spiritWon(room, name) : null } : { late: true }) : null,
    need: councilNeed(room), dead: room.players.map(p => p.name).filter(nm => isSpirit(room, nm)).length,
  };
}

function hostView(room: Room) {
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
    spirits: room.dealt ? { chat: room.spiritChat, council: room.council, need: councilNeed(room), dead: room.players.map(p => p.name).filter(nm => isSpirit(room, nm)).length,
      won: room.council ? Object.fromEntries(Object.keys(room.council.spirits).map(nm => [nm, spiritWon(room, nm)])) : {} } : null,
  };
}

// ---------- server ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use('/sponsor', express.static(SPONSOR_DIR, { maxAge: '1h' })); // the sponsor folder's pictures
/** The room a request asks about (?room=…), if it exists. */
const roomOf = (req: express.Request) => rooms.get(roomCode(req.query.room));
// the sponsor before a phone has joined (splash + join screen), and its logo as a plain image
app.get('/api/sponsor', (req, res) => { const room = roomOf(req); res.json(room ? sponsorView(room) : null); });
app.get('/api/theme', (req, res) => res.json({ theme: roomOf(req)?.shared.theme || null }));
// does this room exist (the join screen checks the name before asking for the player's)
app.get('/api/room', (req, res) => res.json({ exists: !!roomOf(req) }));
app.get('/api/sponsor/logo', (req, res) => {
  const room = roomOf(req);
  const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(String(room?.shared.sponsorLogo || ''));
  if (!m) return res.status(404).end();
  res.type(m[1]).set('Cache-Control', 'public, max-age=86400').send(Buffer.from(m[2], 'base64'));
});

// a hand-made role's picture (uploaded by the host when creating / editing the role)
app.get('/api/role-img', (req, res) => {
  const c = (roomOf(req)?.shared.custom || []).find((x: any) => x.key === String(req.query.key || '') && !x.lib);
  const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(roleImg(c && c.img));
  if (!m) return res.status(404).end();
  res.type(m[1]).set('Cache-Control', 'public, max-age=604800, immutable').send(Buffer.from(m[2], 'base64'));
});

// which commit is running (Render sets RENDER_GIT_COMMIT) — handy to check a deploy went out
app.get('/api/version', (_req, res) => res.json({ commit: (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7) }));

app.get('/api/info', async (req, res) => {
  const code = roomCode(req.query.room);
  const base = await joinBase();
  const host = base.replace(/^https?:\/\//, ''); // players who type it in are asked for the room name
  const url = `${base}/player${code ? '?room=' + encodeURIComponent(code) : ''}`; // QR → this room's player screen (any path except /host renders it)
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
function snapshot(room: Room) {
  return { at: Date.now(), players: room.players, spectators: room.spectators, shared: room.shared, assign: room.assign, dealt: room.dealt, spiritChat: room.spiritChat, council: room.council, lobbyChat: room.lobbyChat };
}
const isFresh = (room: Room) => !room.players.length && !room.dealt && !Object.keys(room.shared).length;

// Socket.IO channels are per room: `<code>:host`, `<code>:p:<playerId>`, and `<code>:all` (every phone that opened the room)
function pushAll(room: Room) {
  room.touched = Date.now();
  const c = room.code;
  io.to(c + ':host').emit('room', hostView(room));
  io.to(c + ':host').emit('host:snapshot', snapshot(room));
  for (const p of room.players) io.to(`${c}:p:${p.id}`).emit('player:view', playerView(room, p));
  for (const sp of room.spectators) io.to(`${c}:p:${sp.id}`).emit('player:view', spectatorView(room, sp));
}

io.on('connection', (socket: Socket) => {
  const auth = socket.handshake.auth || {};
  const code = roomCode(auth.room);

  if (auth.role === 'host') {
    // the host opens a room with its name and password; a name nobody uses yet creates the room with that password
    const password = String(auth.password || '');
    const deny = (reason: string) => { socket.emit('host:denied', reason); setTimeout(() => socket.disconnect(true), 100); };
    if (!code) return deny('name');
    if (password.length < 4) return deny('short');
    let room = rooms.get(code);
    const created = !room;
    if (!room) { room = newRoom(code, password); rooms.set(code, room); }
    else if (room.password !== password) return deny('password');
    const c = code;
    socket.join([c + ':host', c + ':all']);
    socket.emit('host:init', { shared: room.shared, room: hostView(room), fresh: isFresh(room), created, code });
    socket.emit('host:snapshot', snapshot(room));

    // after a restart the room is empty: the host's phone sends back its last copy of the game
    socket.on('host:restore', (snap: ReturnType<typeof snapshot>) => {
      if (!isFresh(room) || !snap || !Array.isArray(snap.players)) return;
      const seat = (p: Player): Player => ({ id: String(p.id), name: String(p.name), color: String(p.color || nextColor(room)), connected: !!p.fake, ...(p.fake ? { fake: true } : {}) });
      room.players = snap.players.map(seat);
      room.spectators = (snap.spectators || []).map(seat);
      room.shared = snap.shared || {};
      room.assign = snap.assign || {};
      room.dealt = !!snap.dealt;
      room.spiritChat = Array.isArray(snap.spiritChat) ? snap.spiritChat : [];
      room.council = snap.council || null;
      room.lobbyChat = Array.isArray(snap.lobbyChat) ? snap.lobbyChat.slice(-100) : [];
      socket.emit('host:init', { shared: room.shared, room: hostView(room), fresh: false, restored: true });
      io.to(c + ':all').emit('room:restored'); // phones reconnect and find their seat (and card) again
      pushAll(room);
    });

    socket.on('host:patch', (patch: Shared) => {
      if (patch.timer && patch.timer.running) patch.timer = { ...patch.timer, endsAt: Date.now() + Math.max(0, Number(patch.timer.leftMs) || 0) };
      const before = room.shared.status || {};
      Object.assign(room.shared, patch);
      if ('status' in patch || 'phase' in patch) noteDeaths(room, 'status' in patch ? before : room.shared.status || {});
      if ('theme' in patch) io.to(c + ':all').emit('room:theme', room.shared.theme || null); // every phone, joined or not, follows the host's theme
      pushAll(room);
    });
    // secret phone vote, one nominee at a time: open with their name, close with null (the host only sees counts)
    // the host calls the Spirit Council when the game is ready for it (once per game)
    socket.on('host:council', () => { callCouncil(room); pushAll(room); });
    // …and can undo it (called by mistake): factions and choices are forgotten, it can be called again
    socket.on('host:council:undo', () => { room.council = null; pushAll(room); });
    // …and reveals the factions on the spirits' phones (whenever the host likes: without a Council yet, it calls it first)
    socket.on('host:council:reveal', () => { if (!room.council) callCouncil(room); if (room.council) { room.council.revealed = true; pushAll(room); } });
    socket.on('host:ballot', (nominee: string | null) => {
      room.ballot = typeof nominee === 'string' && nominee ? { nominee, votes: {} } : null;
      pushAll(room);
    });
    socket.on('host:kick', (name: string) => {
      const p = room.players.find(x => x.name === name);
      if (!p) return;
      room.players = room.players.filter(x => x !== p);
      delete room.assign[p.name];
      io.to(`${c}:p:${p.id}`).emit('player:kicked');
      pushAll(room);
    });
    socket.on('host:fake', (count: number) => {
      const n = Math.max(0, Math.min(20, Math.floor(Number(count)) || 0));
      for (let i = 0; i < n; i++) {
        const name = uniqueName(room, FAKE_NAMES[room.players.filter(p => p.fake).length % FAKE_NAMES.length]);
        room.players.push({ id: `fake-${randomUUID()}`, name, color: nextColor(room), connected: true, fake: true });
      }
      pushAll(room);
    });
    socket.on('host:unfake', () => {
      room.players.filter(p => p.fake).forEach(p => delete room.assign[p.name]);
      room.players = room.players.filter(p => !p.fake);
      pushAll(room);
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
      room.spiritChat = []; room.council = null; room.deathQueue = [];
      pushAll(room);
    });
    socket.on('host:end', () => {
      room.ballot = null;
      room.assign = {};
      room.dealt = false;
      room.spiritChat = []; room.council = null;
      for (const sp of room.spectators) room.players.push({ ...sp, color: nextColor(room) }); // they join the next game
      room.spectators = [];
      pushAll(room);
    });
    return;
  }

  // ----- players -----
  // a phone belongs to one room (from the QR link or the room name typed on the join screen)
  if (code) socket.join(code + ':all'); // hears room:restored / room:theme even before the room exists again
  const room = code ? rooms.get(code) : undefined;
  if (!room) {
    // no such room (wrong name, or the server restarted and the host hasn't come back yet)
    socket.emit('player:view', null);
    socket.emit('room:none', code || null);
    socket.on('player:join', (_msg: unknown, ack?: (r: { error: string }) => void) => ack?.({ error: 'no-room' }));
    return;
  }
  const c = code;
  let me: Player | undefined = room.players.find(p => p.id === auth.playerId) || room.spectators.find(p => p.id === auth.playerId);
  const attach = (p: Player) => {
    me = p;
    p.connected = true;
    socket.join(`${c}:p:${p.id}`);
    socket.emit('player:view', room.spectators.includes(p) ? spectatorView(room, p) : playerView(room, p));
    pushAll(room);
  };
  if (me) attach(me);
  else socket.emit('player:view', null);

  // secret phone vote: each living player chooses eliminate or spare for the nominee; they can change until it closes
  socket.on('player:vote', (choice: 'kill' | 'spare') => {
    if (!me || !room.ballot || !room.players.includes(me) || (room.shared.status || {})[me.name]) return;
    if (choice !== 'kill' && choice !== 'spare') return;
    if (me.name === room.ballot.nominee) return; // no voting on yourself
    room.ballot.votes[me.name] = choice;
    pushAll(room);
  });

  // the waiting screen's chat: players talk before the cards are dealt
  socket.on('lobby:say', (text: string) => {
    if (!me || room.dealt || !room.players.includes(me)) return;
    const t = String(text || '').trim().slice(0, 200); if (!t) return;
    room.lobbyChat.push({ from: me.name, text: t, at: Date.now() });
    if (room.lobbyChat.length > 100) room.lobbyChat = room.lobbyChat.slice(-100);
    pushAll(room);
  });

  // the Spirit Realm: dead players talk among themselves…
  socket.on('spirit:say', (text: string) => {
    if (!me || !room.players.includes(me) || !isSpirit(room, me.name)) return;
    const t = String(text || '').trim().slice(0, 200); if (!t) return;
    room.spiritChat.push({ from: me.name, text: t, at: Date.now() });
    if (room.spiritChat.length > 300) room.spiritChat = room.spiritChat.slice(-300);
    pushAll(room);
  });
  // …and at the Spirit Council each one secretly chooses one living player (no message — nothing reaches that phone)
  socket.on('spirit:whisper', (msg: { to: string }) => {
    const s = me && room.council && room.council.spirits[me.name];
    if (!me || !s || s.to || !isSpirit(room, me.name)) return;
    const to = String(msg && msg.to || '');
    if (livingNames(room).indexOf(to) < 0) return;
    s.to = to; s.at = Date.now();
    pushAll(room);
  });

  socket.on('player:join', ({ name }: { name: string }, ack?: (r: { playerId: string; name: string }) => void) => {
    // Same name as a seat whose phone has dropped (new browser, cleared storage…) → take that seat back, card included
    const seat = !me && room.players.find(p => !p.connected && p.name.toLowerCase() === name.trim().slice(0, 18).toLowerCase());
    if (seat) {
      me = seat;
    } else if (me) {
      me.name = room.dealt ? me.name : uniqueName(room, name, me.id); // names are locked once cards are dealt
    } else if (room.dealt) {
      // the game is already running: watch it, and play in the next one
      me = { id: randomUUID(), name: uniqueName(room, name), color: '#c7a8ff', connected: true };
      room.spectators.push(me);
    } else {
      me = { id: randomUUID(), name: uniqueName(room, name), color: nextColor(room), connected: true };
      room.players.push(me);
    }
    ack?.({ playerId: me.id, name: me.name });
    attach(me);
  });

  socket.on('disconnect', () => {
    if (!me) return;
    const stillHere = [...(io.sockets.adapter.rooms.get(`${c}:p:${me.id}`) || [])].length > 0;
    if (!stillHere) {
      me.connected = false;
      pushAll(room);
    }
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  const base = await joinBase();
  console.log(`\n  🌕 Moonfall is running\n`);
  console.log(`  Host (open on your phone):  ${base}/host   (pick a room name and password)`);
  console.log(`  Players join at:            ${base}/player?room=<room name>  (or scan the host's QR code)\n`);
});
