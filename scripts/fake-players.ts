// Testing aid: joins N fake players to a Moonfall room, exactly like real phones, and keeps them
// connected until you press Ctrl+C.
//   npm run fake                                       → asks how many, joins the local server (:3000)
//   npm run fake -- 6                                  → 6 players on the local server
//   npm run fake -- 6 https://moonfall.onrender.com    → 6 players in the deployed room
// Each fake player's card is printed when the host deals, so you can check the deal and the host guide.
import readline from 'node:readline/promises';
import { io, type Socket } from 'socket.io-client';

const NAMES = ['Luna', 'Felix', 'Iris', 'Oscar', 'Hazel', 'Milo', 'Nora', 'Theo', 'Ruby', 'Jasper',
  'Ivy', 'Leo', 'Clara', 'Finn', 'Mabel', 'Otto', 'Wren', 'Silas', 'Juno', 'Arlo'];
const MAX = 30;

type View = { name: string; dealt: boolean; role: string | null; fate: string } | null;

async function askCount(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`How many fake players? (1-${MAX}) `);
  rl.close();
  return answer;
}

function fakePlayer(url: string, name: string): Socket {
  const socket = io(url, { auth: { role: 'player' }, transports: ['websocket', 'polling'], forceNew: true });
  let kicked = false;
  let shown: string | null = null; // last card/fate printed, so each change is logged once

  socket.on('player:view', (v: View) => {
    // null = the server doesn't know us (first connect, or it restarted) → join (again)
    if (!v) {
      if (kicked) return;
      socket.emit('player:join', { name }, (r: { playerId: string; name: string }) => {
        socket.auth = { role: 'player', playerId: r.playerId }; // reconnects re-attach to the same seat
        console.log(`  + ${r.name} joined`);
      });
      return;
    }
    const now = v.dealt ? `${v.role}${v.fate !== 'none' ? ` (${v.fate})` : ''}` : null;
    if (now === shown) return;
    if (now) console.log(`  🃏 ${v.name.padEnd(10)} ${now}`);
    else if (shown) console.log(`  ↩ ${v.name} — cards collected`);
    shown = now;
  });
  socket.on('player:kicked', () => {
    kicked = true;
    console.log(`  − ${name} was removed by the host`);
    socket.disconnect();
  });
  return socket;
}

async function main() {
  const [countArg, urlArg] = process.argv.slice(2);
  const url = (urlArg || process.env.MOONFALL_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const count = parseInt(countArg ?? (await askCount()), 10);
  if (!(count >= 1 && count <= MAX)) {
    console.error(`Give a number from 1 to ${MAX}, e.g.  npm run fake -- 6`);
    process.exit(1);
  }

  console.log(`\n  Joining ${count} fake player${count > 1 ? 's' : ''} to ${url} …`);
  if (url.includes('onrender.com')) console.log('  (A sleeping Render server can take up to a minute to wake up.)');

  let warned = false;
  const sockets = Array.from({ length: count }, (_, i) => {
    const s = fakePlayer(url, NAMES[i] || `Bot ${i + 1}`);
    s.on('connect_error', () => {
      if (!warned) console.log(`  … can't reach ${url} yet — still trying (is the server running?)`);
      warned = true;
    });
    return s;
  });
  console.log('  Press Ctrl+C to disconnect them.\n');

  process.on('SIGINT', () => {
    sockets.forEach(s => s.disconnect());
    console.log('\n  Fake players disconnected. (They stay in the host list as offline until removed.)');
    process.exit(0);
  });
}

main();
