import { useWakeLock } from './wakeLock';
import { useInstall } from './install';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, playerId } from './net';
import { PhoneFrame } from './PhoneFrame';
import { PlayerView } from './views/PlayerView';
import { installAudioUnlock, playDawn, playHowl } from './sound';

type View = {
  name: string; dealt: boolean; role: string | null; phase: 'night' | 'day'; fate: 'none' | 'killed' | 'voted' | 'poisoned' | 'shot' | 'heartbreak' | 'slain';
  roomLang: string; showRoles: boolean; deck: [string, number][]; roleDefs: Record<string, unknown>; playerCount: number;
  spectator?: boolean;
  winner?: { side: 'village' | 'wolves' | 'solo'; key?: string; lib?: string; names?: string[]; also?: { name: string; key: string }[] } | null; // the end-result card
  woken?: boolean; whisper?: Record<string, unknown> | null; timer?: { running: boolean; leftMs: number; endsAt?: number } | null; now?: number;
  ballot?: { nominee: string; mine: 'kill' | 'spare' | null } | null; ivory?: boolean;
  lover?: string | null; // Cupid's partner, shown as a heart on the card // joined after the deal: watching (server sends players, roles, status and the host's log instead)
} | null;

export function PlayerApp() {
  const socket = useMemo(() => connect('player'), []);
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
  useEffect(() => { const t = window.setTimeout(() => setSplash(false), 4000); return () => clearTimeout(t); }, []);
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem('moonfall.playerSound') !== 'off'; } catch { return true; } });
  const soundRef = useRef(soundOn); soundRef.current = soundOn;
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem('moonfall.playerSound', on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });
  useEffect(() => { installAudioUnlock(); }, []);
  useEffect(() => {
    const inGame = !!view && (view.dealt || !!view.spectator);
    const phase = inGame ? view!.phase : null;
    if (phase && lastPhase.current && phase !== lastPhase.current) {
      if (soundRef.current) { if (phase === 'night') playHowl(); else playDawn((view as any).dawnDeaths || 0); }
    }
    lastPhase.current = phase;
  }, [view]);

  useEffect(() => {
    socket.on('player:view', (v: View) => { setView(v); if (v && (v as { now?: number }).now) skew.current = (v as { now: number }).now - Date.now(); });
    socket.on('player:kicked', () => { playerId.clear(); setView(null); });
    // the server restarted and the host put the game back: reconnect to find this phone's seat again
    socket.on('room:restored', () => { socket.disconnect(); socket.connect(); });
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    return () => { socket.disconnect(); };
  }, [socket]);

  const join = (name: string) => {
    if (!name) return;
    socket.emit('player:join', { name }, (r: { playerId: string }) => playerId.set(r.playerId));
  };

  // silent wake-up: a buzz when this phone's role is called
  const wokeRef = useRef(false);
  useEffect(() => {
    const w = !!view?.woken;
    if (w && !wokeRef.current) { try { navigator.vibrate?.([220, 120, 220]); } catch { /* not supported */ } }
    wokeRef.current = w;
  }, [view?.woken]);
  useWakeLock(!!view && (view.dealt || !!view.spectator)); // keep the screen on during a game
  const inst = useInstall();
  const screen = !view ? 'join' : view.spectator ? 'spectate' : view.dealt ? 'card' : 'waiting';
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
            woken={!!view?.woken}
            whisper={view?.whisper || null}
            timer={view?.timer || null}
            skew={skew.current}
            ballot={view?.ballot || null}
            onVote={(choice: 'kill' | 'spare') => socket.emit('player:vote', choice)}
            ivory={!!view?.ivory}
            installMode={inst.mode}
            onInstall={inst.install}
            language={startLang}
            roleDefs={view?.roleDefs}
            deck={view?.deck}
            showRoles={view?.showRoles}
            playerCount={view?.playerCount}
            onJoin={join}
            offline={!online}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            spectate={view?.spectator ? view : null}
          />
        )}
      </PhoneFrame>
      {splash && (
        <div className="splash" onClick={() => setSplash(false)}>
          <img src="/splash.webp" alt="Moonfall" />
        </div>
      )}
    </>
  );
}
