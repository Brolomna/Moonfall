import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, roomCode } from './net';
import { PhoneFrame } from './PhoneFrame';
import { HalloweenLayer } from './halloween';
import { HostView } from './views/HostView';
import { installAudioUnlock, playDawn, startAmbience, stopAmbience } from './sound';
import { useWakeLock } from './wakeLock';
import { useInstall } from './install';
import { DeathNotice } from './views/DeathNotice';

const SOUND_KEY = 'moonfall.hostSound';

type RoomInfo = { spectators?: number; players: { name: string; color: string; connected: boolean; fake?: boolean }[]; assign: Record<string, string>; dealt: boolean };

const ROOM_KEY = 'moonfall.hostRoom'; // { room, password } of the room this phone hosts
const SNAP_KEY = (room: string) => 'moonfall.room.' + room; // last copy of that room, to put the game back after a server restart
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode / full */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
type Creds = { room: string; password: string };
const savedCreds = (): Creds | null => { try { const c = JSON.parse(store.get(ROOM_KEY) || 'null'); return c && c.room && c.password ? c : null; } catch { return null; } };

/** The host opens a room by name and password (checked by the server); a new name creates that room.
 *  Each room is its own game, so several hosts can run games on the same server at once. Remembered on this phone. */
export function HostApp() {
  const [creds, setCreds] = useState<Creds | null>(savedCreds);
  const [denied, setDenied] = useState<string | null>(null);
  if (!creds) return <HostRoom denied={denied} last={(() => { try { return store.get(ROOM_KEY + '.last') || ''; } catch { return ''; } })()}
    onEnter={c => { setDenied(null); store.set(ROOM_KEY, JSON.stringify(c)); store.set(ROOM_KEY + '.last', c.room); setCreds(c); }} />;
  return <HostGame key={creds.room + '/' + creds.password} room={creds.room} password={creds.password}
    onDenied={(why: string) => { store.del(ROOM_KEY); setDenied(why || 'password'); setCreds(null); }}
    onLock={() => { store.del(ROOM_KEY); setDenied(null); setCreds(null); }} />;
}

function HostRoom({ denied, last, onEnter }: { denied: string | null; last: string; onEnter: (c: Creds) => void }) {
  const [name, setName] = useState(last);
  const [pw, setPw] = useState('');
  const code = roomCode(name);
  const ok = code.length >= 2 && pw.length >= 4;
  const msg = denied === 'password' ? 'That password isn’t right for this room. Try again, or pick another room name.'
    : denied === 'short' ? 'The password needs at least 4 characters.'
      : denied ? 'Pick a room name (letters and numbers).'
        : 'Open your room, or type a new name to create one. Players join with the room name; only you need the password.';
  const field: React.CSSProperties = { width: 270, height: 50, borderRadius: 14, border: '1px solid rgba(199,168,255,.3)', background: 'rgba(20,12,34,.7)', color: '#f1e9ff', font: "600 17px 'Manrope', sans-serif", padding: '0 14px', boxSizing: 'border-box' };
  return (
    <PhoneFrame>
      {frameH => (
        <form className="sky pin-screen" style={{ height: frameH }} onSubmit={e => { e.preventDefault(); if (ok) onEnter({ room: code, password: pw }); }}>
          <img src="/moon.svg" alt="" className="pin-moon" />
          <div className="pin-title">Host</div>
          <p className={'pin-sub' + (denied ? ' pin-shake' : '')} style={{ maxWidth: 290, textAlign: 'center', lineHeight: 1.45 }}>{msg}</p>
          <input style={field} value={name} onChange={e => setName(e.target.value)} placeholder="Room name" aria-label="Room name" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={24} />
          <input style={field} value={pw} onChange={e => setPw(e.target.value)} placeholder="Room password" aria-label="Room password" type="password" autoComplete="current-password" maxLength={40} />
          {code && code !== name.trim() ? <p className="pin-sub" style={{ fontSize: 12.5, opacity: .8 }}>Room name: {code}</p> : null}
          <button className="press pin-go" type="submit" disabled={!ok}>Open room</button>
        </form>
      )}
    </PhoneFrame>
  );
}

function HostGame({ room, password, onDenied, onLock }: { room: string; password: string; onDenied: (why: string) => void; onLock: () => void }) {
  const inst = useInstall();
  const socket = useMemo(() => connect('host', room, password), [room, password]);
  const [init, setInit] = useState<Record<string, unknown> | null>(null);
  const [initKey, setInitKey] = useState(0);
  const [net, setNet] = useState<RoomInfo>({ players: [], assign: {}, dealt: false });
  const [info, setInfo] = useState<{ host: string; qr: string } | null>(null);
  const [online, setOnline] = useState(true);
  // sounds: howl / sunrise when the host switches phase, a quiet ambience while it's night in a game
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; } });
  const [stage, setStage] = useState<{ phase?: string; screen?: string }>({});
  const phaseRef = useRef<string | undefined>(undefined);
  const statusRef = useRef<Record<string, unknown>>({});

  useEffect(() => { installAudioUnlock(); }, []);
  useEffect(() => {
    // LOCAL ONLY: night background ambience muted for now (howl / sunrise effects still play)
    if (false && soundOn && stage.screen === 'play' && stage.phase === 'night') startAmbience(); else stopAmbience();
  }, [soundOn, stage.screen, stage.phase]);
  useEffect(() => () => stopAmbience(), []);

  const [theme, setTheme] = useState<string | null>(null);
  // "<name> died" — the same short notice every phone gets
  const [death, setDeath] = useState<{ id: number; names: string[] } | null>(null);
  const deathTimer = useRef<number | undefined>(undefined);
  const onPatch = (patch: Record<string, unknown>) => {
    socket.emit('host:patch', patch);
    if ('theme' in patch) setTheme((patch.theme as string) || null);
    const phase = patch.phase as string | undefined, screen = patch.screen as string | undefined;
    if (patch.status) statusRef.current = patch.status as Record<string, unknown>;
    // the Day button sends phase without screen; deal and end-game also send screen (no sound for those). Nightfall is silent.
    if (phase === 'day' && !screen && phase !== phaseRef.current && soundOn) {
      // morning sound by tonight's deaths (the Day patch carries the resolved status)
      const round = patch.round as number | undefined;
      const deaths = Object.values((patch.status || {}) as Record<string, any>).filter(m => m && m.phase === 'night' && m.round === round && m.how !== 'removed').length;
      playDawn(deaths);
    }
    if (phase) phaseRef.current = phase;
    if (phase || screen) setStage(st => ({ phase: phase || st.phase, screen: screen || st.screen }));
  };
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem(SOUND_KEY, on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });

  useEffect(() => {
    socket.on('host:denied', onDenied);
    // keep a copy of the room on this phone
    socket.on('host:snapshot', (snap: { players?: unknown[]; shared?: Record<string, unknown> }) => {
      if ((snap.players && snap.players.length) || (snap.shared && Object.keys(snap.shared).length)) store.set(SNAP_KEY(room), JSON.stringify(snap));
    });
    socket.on('host:init', ({ shared, room: roomInfo, fresh, restored }) => {
      // the server came back empty (restart): put the last game back instead of starting over
      if (fresh) {
        let snap: { at?: number; players?: unknown[] } | null = null;
        try { snap = JSON.parse(store.get(SNAP_KEY(room)) || 'null'); } catch { snap = null; }
        if (snap && snap.players && snap.players.length && Date.now() - (snap.at || 0) < 24 * 3600 * 1000) { socket.emit('host:restore', snap); return; }
      }
      if (restored) setInitKey(k => k + 1); // rebuild the screen from the restored game
      setInit(shared || {}); setNet(roomInfo); setTheme((shared && shared.theme) || null);
      phaseRef.current = (shared && shared.phase) || 'night';
      statusRef.current = (shared && shared.status) || {};
      setStage({ phase: (shared && shared.phase) || 'night', screen: (shared && shared.screen) || 'players' });
    });
    socket.on('room', setNet);
    socket.on('room:death', (d: { id: number; names: string[] }) => {
      setDeath(d); window.clearTimeout(deathTimer.current); deathTimer.current = window.setTimeout(() => setDeath(null), 4500);
    });
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    fetch('/api/info?room=' + encodeURIComponent(room)).then(r => r.json()).then(setInfo).catch(() => setInfo(null));
    return () => { socket.disconnect(); };
  }, [socket]);

  useWakeLock(stage.screen === 'play'); // keep the host's screen on during a game

  // waiting for the room (a sleeping free server takes up to a minute to wake): say so instead of a blank screen
  if (!init) return (
    <PhoneFrame>
      {frameH => (
        <div className="sky pin-screen" style={{ height: frameH }}>
          <img src="/moon.svg" alt="" className="pin-moon pin-wait" />
          <div className="pin-title">Moonfall</div>
          <p className="pin-sub">Connecting to room {room}…</p>
          <p className="pin-sub" style={{ maxWidth: 280, textAlign: 'center', fontSize: 13, opacity: .75 }}>If the server was asleep, waking it can take up to a minute.</p>
          <button className="press pin-change" onClick={onLock}>Open a different room</button>
        </div>
      )}
    </PhoneFrame>
  );
  return (
    <>
      <PhoneFrame>
        {frameH => (
          <>
          <HostView
            key={initKey}
            roomCode={room}
            frameH={frameH}
            sharedInit={init}
            net={net}
            info={info}
            onPatch={onPatch}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            onKick={(name: string) => socket.emit('host:kick', name)}
            onCouncil={() => socket.emit('host:council')}
            onCouncilUndo={() => socket.emit('host:council:undo')}
            onCouncilReveal={() => socket.emit('host:council:reveal')}
            onDeal={(keys: string[], fixed?: Record<string, string>) => socket.emit('host:deal', keys, fixed)}
            onEnd={() => socket.emit('host:end')}
            onAddFake={(count: number) => socket.emit('host:fake', count)}
            onRemoveFakes={() => socket.emit('host:unfake')}
            onBallot={(nominees: string[] | null) => socket.emit('host:ballot', nominees)}
            installMode={inst.mode}
            onInstall={inst.install}
            onLock={onLock}
          />
          </>
        )}
      </PhoneFrame>
      <HalloweenLayer on={theme === 'halloween'} />
      {death && <DeathNotice fixed id={death.id} kicker="Everyone sees" text={death.names.join(' & ') + ' died'} />}
      {!online && <div className="offline">Reconnecting to the room…</div>}
    </>
  );
}
