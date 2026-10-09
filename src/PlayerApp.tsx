import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect, playerId } from './net';
import { PhoneFrame } from './PhoneFrame';
import { PlayerView } from './views/PlayerView';
import { installAudioUnlock, playHowl, playSunrise } from './sound';

type View = {
  name: string; dealt: boolean; role: string | null; phase: 'night' | 'day'; fate: 'none' | 'killed' | 'voted' | 'poisoned';
  roomLang: string; showRoles: boolean; deck: [string, number][]; roleDefs: Record<string, unknown>; playerCount: number;
  spectator?: boolean; // joined after the deal: watching (server sends players, roles, status and the host's log instead)
} | null;

export function PlayerApp() {
  const socket = useMemo(() => connect('player'), []);
  const [view, setView] = useState<View>(null);
  const [online, setOnline] = useState(true);

  // the howl / sunrise plays on every phone in the game when the host switches phase
  const lastPhase = useRef<string | null>(null);
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem('moonfall.playerSound') !== 'off'; } catch { return true; } });
  const soundRef = useRef(soundOn); soundRef.current = soundOn;
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem('moonfall.playerSound', on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });
  useEffect(() => { installAudioUnlock(); }, []);
  useEffect(() => {
    const inGame = !!view && (view.dealt || !!view.spectator);
    const phase = inGame ? view!.phase : null;
    if (phase && lastPhase.current && phase !== lastPhase.current && soundRef.current) (phase === 'night' ? playHowl : playSunrise)();
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
          />
        )}
      </PhoneFrame>
    </>
  );
}
