import React, { useEffect, useMemo, useState } from 'react';
import { connect, playerId } from './net';
import { PhoneFrame } from './PhoneFrame';
import { PlayerView } from './views/PlayerView';

type View = {
  name: string; dealt: boolean; role: string | null; phase: 'night' | 'day'; fate: 'none' | 'killed' | 'voted';
  roomLang: string; showRoles: boolean; deck: [string, number][]; roleDefs: Record<string, unknown>; playerCount: number;
} | null;

export function PlayerApp() {
  const socket = useMemo(() => connect('player'), []);
  const [view, setView] = useState<View>(null);
  const [online, setOnline] = useState(true);

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

  const screen = !view ? 'join' : view.dealt ? 'card' : 'waiting';
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
          />
        )}
      </PhoneFrame>
    </>
  );
}
