import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from './net';
import { PhoneFrame } from './PhoneFrame';
import { HostView } from './views/HostView';
import { installAudioUnlock, playDawn, playHowl, startAmbience, stopAmbience } from './sound';
import { Village, preloadVillage } from './Village';
import { useWakeLock } from './wakeLock';

const SOUND_KEY = 'moonfall.hostSound';

type RoomInfo = { spectators?: number; players: { name: string; color: string; connected: boolean; fake?: boolean }[]; assign: Record<string, string>; dealt: boolean };

const PIN_KEY = 'moonfall.hostPin';
const SNAP_KEY = 'moonfall.room'; // last copy of the whole room, to put the game back after a server restart
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode / full */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

/** The host screen is behind a PIN (checked by the server). It's asked once per phone and remembered. */
export function HostApp() {
  const [pin, setPin] = useState(() => store.get(PIN_KEY));
  const [wrong, setWrong] = useState(false);
  if (!pin) return <HostPin wrong={wrong} onEnter={p => { setWrong(false); store.set(PIN_KEY, p); setPin(p); }} />;
  return <HostGame key={pin} pin={pin} onDenied={() => { store.del(PIN_KEY); setWrong(true); setPin(null); }} />;
}

function HostPin({ wrong, onEnter }: { wrong: boolean; onEnter: (pin: string) => void }) {
  const [digits, setDigits] = useState('');
  const press = (d: string) => setDigits(x => (x.length < 8 ? x + d : x));
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <PhoneFrame>
      {frameH => (
        <div className="sky pin-screen" style={{ height: frameH }}>
          <img src="/moon.svg" alt="" className="pin-moon" />
          <div className="pin-title">Host</div>
          <p className="pin-sub">{wrong ? 'That PIN isn’t right. Try again.' : 'Enter the host PIN to run the game.'}</p>
          <div className={'pin-dots' + (wrong ? ' pin-shake' : '')} aria-label={`${digits.length} digits entered`}>
            {Array.from({ length: Math.max(4, digits.length) }, (_, i) => <span key={i} className={i < digits.length ? 'on' : ''} />)}
          </div>
          <div className="pin-pad">
            {keys.map((k, i) => k === '' ? <span key={i} /> : (
              <button key={i} className="press" aria-label={k === '⌫' ? 'Delete' : k}
                onClick={() => (k === '⌫' ? setDigits(x => x.slice(0, -1)) : press(k))}>{k}</button>
            ))}
          </div>
          <button className="press pin-go" disabled={digits.length < 4} onClick={() => onEnter(digits)}>Enter</button>
        </div>
      )}
    </PhoneFrame>
  );
}

function HostGame({ pin, onDenied }: { pin: string; onDenied: () => void }) {
  const socket = useMemo(() => connect('host', pin), [pin]);
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
  const sceneOut = useRef<Set<string>>(new Set());
  const [scene, setScene] = useState<{ phase: 'night' | 'day'; round: number; players: { name: string; out: boolean }[]; justOut: string[] } | null>(null);

  useEffect(() => { installAudioUnlock(); preloadVillage(); }, []);
  useEffect(() => {
    if (soundOn && stage.screen === 'play' && stage.phase === 'night') startAmbience(); else stopAmbience();
  }, [soundOn, stage.screen, stage.phase]);
  useEffect(() => () => stopAmbience(), []);

  const onPatch = (patch: Record<string, unknown>) => {
    socket.emit('host:patch', patch);
    const phase = patch.phase as string | undefined, screen = patch.screen as string | undefined;
    if (patch.status) statusRef.current = patch.status as Record<string, unknown>;
    // Day: show the village scene at sunrise (houses of everyone; the dead ones abandoned). Nightfall has no scene,
    // but still marks who was already out, so the dawn scene only dims the houses of the night's deaths.
    if (phase && !screen && phase !== phaseRef.current) {
      const now = statusRef.current;
      if (phase === 'day') setScene({
        phase: phase as 'night' | 'day', round: (patch.round as number) || 1,
        players: net.players.map(p => ({ name: p.name, out: !!now[p.name] })),
        // houses whose owner went out since the last scene crumble on screen
        justOut: net.players.filter(p => now[p.name] && !sceneOut.current.has(p.name)).map(p => p.name),
      });
      sceneOut.current = new Set(net.players.filter(p => now[p.name]).map(p => p.name));
    }
    // Night / Day buttons send phase without screen; deal and end-game also send screen (no sound for those)
    if (phase && !screen && phase !== phaseRef.current && soundOn) {
      if (phase === 'night') playHowl();
      else {
        // morning sound by tonight's deaths (the Day patch carries the resolved status)
        const round = patch.round as number | undefined;
        const deaths = Object.values((patch.status || {}) as Record<string, any>).filter(m => m && m.phase === 'night' && m.round === round && m.how !== 'removed').length;
        playDawn(deaths);
      }
    }
    if (phase) phaseRef.current = phase;
    if (phase || screen) setStage(st => ({ phase: phase || st.phase, screen: screen || st.screen }));
  };
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem(SOUND_KEY, on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });

  useEffect(() => {
    socket.on('host:denied', onDenied);
    // keep a copy of the room on this phone
    socket.on('host:snapshot', (snap: { players?: unknown[]; shared?: Record<string, unknown> }) => {
      if ((snap.players && snap.players.length) || (snap.shared && Object.keys(snap.shared).length)) store.set(SNAP_KEY, JSON.stringify(snap));
    });
    socket.on('host:init', ({ shared, room, fresh, restored }) => {
      // the server came back empty (restart): put the last game back instead of starting over
      if (fresh) {
        let snap: { at?: number; players?: unknown[] } | null = null;
        try { snap = JSON.parse(store.get(SNAP_KEY) || 'null'); } catch { snap = null; }
        if (snap && snap.players && snap.players.length && Date.now() - (snap.at || 0) < 24 * 3600 * 1000) { socket.emit('host:restore', snap); return; }
      }
      if (restored) setInitKey(k => k + 1); // rebuild the screen from the restored game
      setInit(shared || {}); setNet(room);
      phaseRef.current = (shared && shared.phase) || 'night';
      statusRef.current = (shared && shared.status) || {};
      sceneOut.current = new Set(Object.keys(statusRef.current));
      setStage({ phase: (shared && shared.phase) || 'night', screen: (shared && shared.screen) || 'players' });
    });
    socket.on('room', setNet);
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    fetch('/api/info').then(r => r.json()).then(setInfo).catch(() => setInfo(null));
    return () => { socket.disconnect(); };
  }, [socket]);

  useWakeLock(stage.screen === 'play'); // keep the host's screen on during a game

  if (!init) return null;
  return (
    <>
      <PhoneFrame>
        {frameH => (
          <>
          <HostView
            key={initKey}
            frameH={frameH}
            sharedInit={init}
            net={net}
            info={info}
            onPatch={onPatch}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            onKick={(name: string) => socket.emit('host:kick', name)}
            onDeal={(keys: string[], fixed?: Record<string, string>) => socket.emit('host:deal', keys, fixed)}
            onEnd={() => socket.emit('host:end')}
            onAddFake={(count: number) => socket.emit('host:fake', count)}
            onRemoveFakes={() => socket.emit('host:unfake')}
          />
          {scene && <Village key={scene.phase + scene.round} players={scene.players} phase={scene.phase} justOut={scene.justOut} label={(scene.phase === 'night' ? 'Night ' : 'Day ') + scene.round} height={frameH} onDone={() => setScene(null)} />}
          </>
        )}
      </PhoneFrame>
      {!online && <div className="offline">Reconnecting to the room…</div>}
    </>
  );
}
