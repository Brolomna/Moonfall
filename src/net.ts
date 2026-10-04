import { io, type Socket } from 'socket.io-client';

const KEY = 'moonfall.playerId';

export const playerId = {
  get: () => { try { return localStorage.getItem(KEY) || undefined; } catch { return undefined; } },
  set: (id: string) => { try { localStorage.setItem(KEY, id); } catch { /* private mode */ } },
  clear: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } },
};

export function connect(role: 'host' | 'player'): Socket {
  return io({ auth: role === 'host' ? { role } : { role, playerId: playerId.get() }, transports: ['websocket', 'polling'] });
}
