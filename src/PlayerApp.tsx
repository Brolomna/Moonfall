import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, playerId } from './net';
import { PhoneFrame } from './PhoneFrame';
import { PlayerView } from './views/PlayerView';
import { installAudioUnlock, playDawn, playHowl } from './sound';

type View = {
  name: string; dealt: boolean; role: string | null; phase: 'night' | 'day'; fate: 'none' | 'killed' | 'voted' | 'poisoned' | 'shot' | 'heartbreak';
  roomLang: string; showRoles: boolean; deck: [string, number][]; roleDefs: Record<string, unknown>; playerCount: number;
  spectator?: boolean;
  lover?: string | null; // Cupid's partner, shown as a heart on the card // joined after the deal: watching (server sends players, roles, status and the host's log instead)
} | null;

export function PlayerApp() {
  const socket = useMemo(() => connect('player'), []);
  const [view, setView] = useState<View>(null);
  const [online, setOnline] = useState(true);

  // the howl / sunrise plays on every phone in the game when the host switches phase
  const lastPhase = useRef<string | null>(null);
  const lastVillage = useRef<{ name: string; out: boolean }[]>([]);
  // the village scene shown for a few seconds when the phase changes
  const [scene, setScene] = useState<{ phase: string; round: number; players: { name: string; out: boolean; me?: boolean }[]; justOut: string[] } | null>(null);
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
    const village = ((view as any)?.village || []) as { name: string; out: boolean }[];
    if (phase && lastPhase.current && phase !== lastPhase.current) {
      if (soundRef.current) { if (phase === 'night') playHowl(); else playDawn((view as any).dawnDeaths || 0); }
      // houses whose owner went out since the last scene crumble on screen
      const before = new Set(lastVillage.current.filter(v => v.out).map(v => v.name));
      setScene({ phase, round: (view as any).round || 1, players: village.map(v => ({ ...v, me: v.name === view!.name })), justOut: village.filter(v => v.out && !before.has(v.name)).map(v => v.name) });
      lastVillage.current = village;
    }
    if (!lastPhase.current) lastVillage.current = village;
    lastPhase.current = phase;
  }, [view]);

  useEffect(() => {
    socket.on('player:view', setView);
    socket.on('player:kicked', () => { playerId.clear(); setView(null); });
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    return () => { socket.disconnect(); };
  }, [socket]);

  const join = (name: string) => {
    if (!name) return;
    socket.emit('player:join', { name }, (r: { playerId: string }) => playerId.set(r.playerId));
  };

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
            language={view?.roomLang || 'en'}
            roleDefs={view?.roleDefs}
            deck={view?.deck}
            showRoles={view?.showRoles}
            playerCount={view?.playerCount}
            onJoin={join}
            offline={!online}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            spectate={view?.spectator ? view : null}
            scene={scene}
            onSceneDone={() => setScene(null)}
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
