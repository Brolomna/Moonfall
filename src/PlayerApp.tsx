import { useWakeLock } from './wakeLock';
import { useInstall } from './install';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, playerId, roomCode } from './net';
import { PhoneFrame } from './PhoneFrame';
import { brandText, type Sponsor } from './brand';
import { HalloweenLayer } from './halloween';
import { PlayerView } from './views/PlayerView';
import { installAudioUnlock, playDawn, playHowl } from './sound';

type View = {
  name: string; dealt: boolean; role: string | null; phase: 'night' | 'day'; fate: 'none' | 'killed' | 'voted' | 'poisoned' | 'shot' | 'heartbreak' | 'slain';
  roomLang: string; showRoles: boolean; deck: [string, number][]; roleDefs: Record<string, unknown>; playerCount: number;
  spectator?: boolean;
  winner?: { side: 'village' | 'wolves' | 'solo'; key?: string; lib?: string; names?: string[]; also?: { name: string; key: string }[] } | null; // the end-result card
  whisper?: Record<string, unknown> | null; timer?: { running: boolean; leftMs: number; endsAt?: number } | null; now?: number;
  ballot?: { nominee: string; mine: 'kill' | 'spare' | null; accused?: boolean } | null; ivory?: boolean; sponsor?: Sponsor;
  spirit?: { chat: { from: string; text: string; at: number }[]; council: any; need: number; dead: number } | null; spiritWhispers?: { id: string; text: string }[]; note?: { id: string; text: string } | null;
  lover?: string | null; // Cupid's partner, shown as a heart on the card // joined after the deal: watching (server sends players, roles, status and the host's log instead)
} | null;

const LAST_ROOM = 'moonfall.lastRoom';
const urlRoom = () => roomCode(new URLSearchParams(window.location.search).get('room') || '');
const lastRoom = () => { try { return localStorage.getItem(LAST_ROOM) || ''; } catch { return ''; } };

/** A phone plays in one room at a time: the room in the link (the host's QR code), else the last one, else it asks. */
export function PlayerApp() {
  const [room, setRoom] = useState(() => urlRoom() || lastRoom());
  const [pickError, setPickError] = useState<string | null>(null);
  const choose = (code: string) => {
    try { localStorage.setItem(LAST_ROOM, code); } catch { /* private mode */ }
    const u = new URL(window.location.href); u.searchParams.set('room', code); window.history.replaceState(null, '', u.toString());
    setPickError(null); setRoom(code);
  };
  const leave = (why?: string) => {
    try { localStorage.removeItem(LAST_ROOM); } catch { /* ignore */ }
    const u = new URL(window.location.href); u.searchParams.delete('room'); window.history.replaceState(null, '', u.toString());
    setPickError(why || null); setRoom('');
  };
  if (!room) return <RoomPick error={pickError} onPick={choose} />;
  return <PlayerGame key={room} room={room} onLeave={leave} />;
}

function RoomPick({ error, onPick }: { error: string | null; onPick: (code: string) => void }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [miss, setMiss] = useState<string | null>(error);
  const code = roomCode(name);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); if (code.length < 2) return;
    setBusy(true);
    try {
      const r = await fetch('/api/room?room=' + encodeURIComponent(code)).then(x => x.json());
      if (r.exists) onPick(code); else setMiss(code);
    } catch { onPick(code); } finally { setBusy(false); }
  };
  const field: React.CSSProperties = { width: 270, height: 52, borderRadius: 14, border: '1px solid rgba(199,168,255,.3)', background: 'rgba(20,12,34,.7)', color: '#f1e9ff', font: "600 18px 'Manrope', sans-serif", padding: '0 14px', boxSizing: 'border-box', textAlign: 'center' };
  return (
    <PhoneFrame>
      {frameH => (
        <form className="sky pin-screen" style={{ height: frameH }} onSubmit={go}>
          <img src="/moon.svg" alt="" className="pin-moon" />
          <div className="pin-title">Moonfall</div>
          <p className="pin-sub" style={{ maxWidth: 290, textAlign: 'center', lineHeight: 1.45 }}>
            {miss ? `There's no room called “${miss}” right now. Check the name with your host.` : 'Scan the host’s QR code, or type the room name your host gives you.'}
          </p>
          <input style={field} value={name} onChange={e => { setName(e.target.value); setMiss(null); }} placeholder="Room name" aria-label="Room name" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={24} />
          <button className="press pin-go" type="submit" disabled={code.length < 2 || busy}>Join room</button>
        </form>
      )}
    </PhoneFrame>
  );
}

function PlayerGame({ room, onLeave }: { room: string; onLeave: (why?: string) => void }) {
  const socket = useMemo(() => connect('player', room), [room]);
  // the room isn't on the server: a wrong name, or the server restarted and the host hasn't reopened it yet
  const [noRoom, setNoRoom] = useState(false);
  const [view, setView] = useState<View>(null);
  const [online, setOnline] = useState(true);
  const skew = useRef(0); // server clock − phone clock, for the timer
  // the phone's language: the player's last choice, else the phone's own language when Moonfall has it, else English
  const startLang = useMemo(() => {
    try { const saved = localStorage.getItem('moonfall.lang'); if (saved) return saved; } catch { /* private mode */ }
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return ['en', 'zh', 'ko', 'ja', 'fr', 'th', 'es'].includes(nav) ? nav : 'en';
  }, []);

  // the howl / sunrise plays on every phone in the game when the host switches phase
  const lastPhase = useRef<string | null>(null);
  // splash art first, then the name page
  const [splash, setSplash] = useState(true);
  // the host's sponsor, shown on the splash and the join screen before this phone has joined
  const [preSponsor, setPreSponsor] = useState<Sponsor>(null);
  // the host's theme (Halloween…): fetched on load, then pushed live by the server
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => { fetch('/api/theme?room=' + encodeURIComponent(room)).then(r => r.json()).then(t => setTheme(t.theme || null)).catch(() => { /* default look */ }); }, []);
  useEffect(() => { fetch('/api/sponsor?room=' + encodeURIComponent(room)).then(r => r.json()).then(setPreSponsor).catch(() => { /* none */ }); }, []);
  useEffect(() => { const t = window.setTimeout(() => setSplash(false), 4000); return () => clearTimeout(t); }, []);
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem('moonfall.playerSound') !== 'off'; } catch { return true; } });
  const soundRef = useRef(soundOn); soundRef.current = soundOn;
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem('moonfall.playerSound', on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });
  useEffect(() => { installAudioUnlock(); }, []);
  useEffect(() => {
    const inGame = !!view && (view.dealt || !!view.spectator);
    const phase = inGame ? view!.phase : null;
    if (phase && lastPhase.current && phase !== lastPhase.current) {
      // spirits (dead players) are out of the village's day and night: no howl / sunrise for them
      if (soundRef.current && (view!.fate || 'none') === 'none') { if (phase === 'night') playHowl(); else playDawn((view as any).dawnDeaths || 0); }
    }
    lastPhase.current = phase;
  }, [view]);

  useEffect(() => {
    socket.on('player:view', (v: View) => { setView(v); if (v && (v as { now?: number }).now) skew.current = (v as { now: number }).now - Date.now(); });
    socket.on('room:theme', (t: string | null) => setTheme(t || null));
    socket.on('player:kicked', () => { playerId.clear(room); setView(null); });
    socket.on('room:none', () => setNoRoom(true));
    socket.on('player:view', () => setNoRoom(false));
    // the server restarted and the host put the game back: reconnect to find this phone's seat again
    socket.on('room:restored', () => { socket.disconnect(); socket.connect(); });
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    return () => { socket.disconnect(); };
  }, [socket]);

  const join = (name: string) => {
    if (!name) return;
    socket.emit('player:join', { name }, (r: { playerId?: string; error?: string }) => { if (r.playerId) playerId.set(room, r.playerId); else if (r.error === 'no-room') onLeave(room); });
  };

  useWakeLock(!!view && (view.dealt || !!view.spectator)); // keep the screen on during a game
  const inst = useInstall();
  const screen = !view ? 'join' : view.spectator ? 'spectate' : view.dealt ? 'card' : 'waiting';
  // a room that isn't there: a new phone goes back to the room name; a phone with a seat waits for the host to reopen it
  const seated = !!playerId.get(room);
  useEffect(() => { if (noRoom && !seated) onLeave(room); }, [noRoom, seated]);
  if (noRoom && seated) return (
    <PhoneFrame>
      {frameH => (
        <div className="sky pin-screen" style={{ height: frameH }}>
          <img src="/moon.svg" alt="" className="pin-moon pin-wait" />
          <div className="pin-title">Moonfall</div>
          <p className="pin-sub" style={{ maxWidth: 290, textAlign: 'center', lineHeight: 1.45 }}>Waiting for the host to reopen room “{room}”…</p>
          <button className="press pin-change" onClick={() => { playerId.clear(room); onLeave(); }}>Join a different room</button>
        </div>
      )}
    </PhoneFrame>
  );
  return (
    <>
      <PhoneFrame>
        {frameH => (
          <PlayerView
            frameH={frameH}
            screen={screen}
            name={view?.name}
            role={view?.role || 'villager'}
            phase={view?.phase || 'night'}
            fate={view?.fate || 'none'}
            lover={view?.lover || null}
            winner={view?.winner || null}
            whisper={view?.whisper || null}
            timer={view?.timer || null}
            skew={skew.current}
            ballot={view?.ballot || null}
            onVote={(choice: 'kill' | 'spare') => socket.emit('player:vote', choice)}
            ivory={!!view?.ivory}
            note={view?.note || null}
            spirit={view?.spirit || null}
            spiritWhispers={view?.spiritWhispers || []}
            onSpiritSay={(text: string) => socket.emit('spirit:say', text)}
            onSpiritWhisper={(to: string) => socket.emit('spirit:whisper', { to })}
            sponsor={view ? view.sponsor || null : preSponsor}
            installMode={inst.mode}
            onInstall={inst.install}
            language={startLang}
            roleDefs={view?.roleDefs}
            deck={view?.deck}
            showRoles={view?.showRoles}
            playerCount={view?.playerCount}
            onJoin={join}
            room={room}
            onChangeRoom={() => onLeave()}
            offline={!online}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            spectate={view?.spectator ? view : null}
          />
        )}
      </PhoneFrame>
      <HalloweenLayer on={theme === 'halloween'} />
      {splash && (
        <div className="splash" onClick={() => setSplash(false)}>
          <img src="/splash.webp" alt="Moonfall" />
          {preSponsor && (
            <div className={'splash-sponsor' + (preSponsor.banner ? ' has-banner' : '')}>
              {preSponsor.banner ? <img className="banner" src={preSponsor.banner} alt={preSponsor.name || ''} /> : preSponsor.logo && <img src={preSponsor.logo} alt="" />}
              {preSponsor.name && <span>{brandText(startLang).by.replace('{name}', preSponsor.name)}</span>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
