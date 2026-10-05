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
  shared: {} as Shared, // everything the host screen owns (deck, rules, phase, marks…)
  assign: {} as Record<string, string>, // player name -> dealt role key
  dealt: false,
};

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
  const taken = (n: string) => room.players.some(p => p.id !== selfId && p.name.toLowerCase() === n.toLowerCase());
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

/** What one phone is allowed to know. */
function playerView(p: Player) {
  const sh = room.shared;
  const mark = (sh.status || {})[p.name];
  const fate = !mark ? 'none' : mark.how === 'night' ? 'killed' : mark.how === 'voted' ? 'voted' : 'none';
  const role: string | null = (sh.override || {})[p.name] || room.assign[p.name] || null;

  const counts: Record<string, number> = {};
  Object.values(room.assign).forEach(k => { counts[k] = (counts[k] || 0) + 1; });
  const deck = Object.entries(counts);

  // Custom roles + host edits for any role this phone might show (its own card + the guide list)
  const keys = new Set([...Object.keys(counts), ...(role ? [role] : [])]);
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
      // host-written text wins over the phone's translations; untouched library roles stay translatable
      edited: !!edit || (!!custom && !custom.lib),
    };
  }

  return {
    joined: true,
    name: p.name,
    dealt: room.dealt && !!role,
    role,
    phase: sh.phase || 'night',
    fate,
    roomLang: sh.roomLang || 'en',
    showRoles: !(sh.rules && sh.rules.showRoles === false),
    deck,
    roleDefs,
    playerCount: room.players.length,
  };
}

function hostView() {
  return {
    players: room.players.map(({ name, color, connected, fake }) => ({ name, color, connected, fake: !!fake })),
    assign: room.assign,
    dealt: room.dealt,
  };
}

// ---------- server ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

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
  app.use(express.static(dist));
  app.use((req, res, next) => (req.method === 'GET' && !req.path.startsWith('/socket.io') ? res.sendFile(path.join(dist, 'index.html')) : next()));
}

function pushAll() {
  io.to('host').emit('room', hostView());
  for (const p of room.players) io.to(`p:${p.id}`).emit('player:view', playerView(p));
}

io.on('connection', (socket: Socket) => {
  const auth = socket.handshake.auth || {};

  if (auth.role === 'host') {
    socket.join('host');
    socket.emit('host:init', { shared: room.shared, room: hostView() });

    socket.on('host:patch', (patch: Shared) => {
      Object.assign(room.shared, patch);
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
    socket.on('host:deal', (keys: string[]) => {
      const deck = shuffle(keys);
      room.assign = {};
      shuffle(room.players).forEach((p, i) => { if (deck[i]) room.assign[p.name] = deck[i]; });
      room.dealt = true;
      pushAll();
    });
    socket.on('host:end', () => {
      room.assign = {};
      room.dealt = false;
      pushAll();
    });
    return;
  }

  // ----- players -----
  let me: Player | undefined = room.players.find(p => p.id === auth.playerId);
  const attach = (p: Player) => {
    me = p;
    p.connected = true;
    socket.join(`p:${p.id}`);
    socket.emit('player:view', playerView(p));
    pushAll();
  };
  if (me) attach(me);
  else socket.emit('player:view', null);

  socket.on('player:join', ({ name }: { name: string }, ack?: (r: { playerId: string; name: string }) => void) => {
    // Same name as a seat whose phone has dropped (new browser, cleared storage…) → take that seat back, card included
    const seat = !me && room.players.find(p => !p.connected && p.name.toLowerCase() === name.trim().slice(0, 18).toLowerCase());
    if (seat) {
      me = seat;
    } else if (me) {
      me.name = room.dealt ? me.name : uniqueName(name, me.id); // names are locked once cards are dealt
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
