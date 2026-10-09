import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from './net';
import { PhoneFrame } from './PhoneFrame';
import { HostView } from './views/HostView';
import { installAudioUnlock, playHowl, playSunrise, startAmbience, stopAmbience } from './sound';

const SOUND_KEY = 'moonfall.hostSound';

type RoomInfo = { spectators?: number; players: { name: string; color: string; connected: boolean; fake?: boolean }[]; assign: Record<string, string>; dealt: boolean };

export function HostApp() {
  const socket = useMemo(() => connect('host'), []);
  const [init, setInit] = useState<Record<string, unknown> | null>(null);
  const [net, setNet] = useState<RoomInfo>({ players: [], assign: {}, dealt: false });
  const [info, setInfo] = useState<{ host: string; qr: string } | null>(null);
  const [online, setOnline] = useState(true);
  // sounds: howl / sunrise when the host switches phase, a quiet ambience while it's night in a game
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; } });
  const [stage, setStage] = useState<{ phase?: string; screen?: string }>({});
  const phaseRef = useRef<string | undefined>(undefined);

  useEffect(() => { installAudioUnlock(); }, []);
  useEffect(() => {
    if (soundOn && stage.screen === 'play' && stage.phase === 'night') startAmbience(); else stopAmbience();
  }, [soundOn, stage.screen, stage.phase]);
  useEffect(() => () => stopAmbience(), []);

  const onPatch = (patch: Record<string, unknown>) => {
    socket.emit('host:patch', patch);
    const phase = patch.phase as string | undefined, screen = patch.screen as string | undefined;
    // Night / Day buttons send phase without screen; deal and end-game also send screen (no sound for those)
    if (phase && !screen && phase !== phaseRef.current && soundOn) (phase === 'night' ? playHowl : playSunrise)();
    if (phase) phaseRef.current = phase;
    if (phase || screen) setStage(st => ({ phase: phase || st.phase, screen: screen || st.screen }));
  };
  const toggleSound = () => setSoundOn(on => { try { localStorage.setItem(SOUND_KEY, on ? 'off' : 'on'); } catch { /* private mode */ } return !on; });

  useEffect(() => {
    socket.on('host:init', ({ shared, room }) => {
      setInit(shared || {}); setNet(room);
      phaseRef.current = (shared && shared.phase) || 'night';
      setStage({ phase: (shared && shared.phase) || 'night', screen: (shared && shared.screen) || 'players' });
    });
    socket.on('room', setNet);
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    fetch('/api/info').then(r => r.json()).then(setInfo).catch(() => setInfo(null));
    return () => { socket.disconnect(); };
  }, [socket]);

  if (!init) return null;
  return (
    <>
      <PhoneFrame>
        {frameH => (
          <HostView
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
        )}
      </PhoneFrame>
      {!online && <div className="offline">Reconnecting to the room…</div>}
    </>
  );
}
