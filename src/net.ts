import { io, type Socket } from 'socket.io-client';

// a phone's seat is remembered per room, so the same phone can play in different rooms
const key = (room: string) => 'moonfall.playerId.' + room;

export const playerId = {
  get: (room: string) => { try { return localStorage.getItem(key(room)) || undefined; } catch { return undefined; } },
  set: (room: string, id: string) => { try { localStorage.setItem(key(room), id); } catch { /* private mode */ } },
  clear: (room: string) => { try { localStorage.removeItem(key(room)); } catch { /* ignore */ } },
};

/** Room names as the server keeps them: lower case letters, digits and dashes. */
export const roomCode = (raw: string) => raw.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 24);

export function connect(role: 'host', room: string, password: string): Socket;
export function connect(role: 'player', room: string): Socket;
export function connect(role: 'host' | 'player', room: string, password?: string): Socket {
  // auth is a callback so every reconnect (e.g. after the phone was locked) sends the playerId saved at join
  const socket = io({ auth: cb => cb(role === 'host' ? { role, room, password } : { role, room, playerId: playerId.get(room) }), transports: ['websocket', 'polling'] });
  // Phones drop the connection while locked; reconnect as soon as the page is visible again instead of waiting for the backoff
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !socket.connected) socket.connect();
  });
  return socket;
}
