import { io, type Socket } from 'socket.io-client';

const KEY = 'moonfall.playerId';

export const playerId = {
  get: () => { try { return localStorage.getItem(KEY) || undefined; } catch { return undefined; } },
  set: (id: string) => { try { localStorage.setItem(KEY, id); } catch { /* private mode */ } },
  clear: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } },
};

export function connect(role: 'host' | 'player'): Socket {
  // auth is a callback so every reconnect (e.g. after the phone was locked) sends the playerId saved at join
  const socket = io({ auth: cb => cb(role === 'host' ? { role } : { role, playerId: playerId.get() }), transports: ['websocket', 'polling'] });
  // Phones drop the connection while locked; reconnect as soon as the page is visible again instead of waiting for the backoff
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !socket.connected) socket.connect();
  });
  return socket;
}
