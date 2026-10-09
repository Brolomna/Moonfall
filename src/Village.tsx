import React, { useEffect, useState } from 'react';
import './village.css';

// The shared village: every player has a house (painted art in /public/houses, repeated), side by side like a
// portrait photo of a village. Shown full-screen for a few seconds when the phase changes.
// Night → the windows glow in the dark. Day → the village in daylight. An eliminated player's house goes dark
// (lights out, colour drained); a house whose owner just went out darkens during the scene.

export type Villager = { name: string; out: boolean; me?: boolean };

type Props = {
  players: Villager[];
  phase: 'night' | 'day';
  justOut?: string[]; // owners who went out since the last scene → their houses go dark on screen
  label: string; // "Night 2" / "Day 2" in the phone's language
  height: number;
  onDone: () => void;
};

const W = 390;
// the four house paintings and their height / width ratio
const HOUSES = [['/houses/house1.webp', 379 / 420], ['/houses/house2.webp', 526 / 420], ['/houses/house3.webp', 283 / 420], ['/houses/house4.webp', 312 / 420]] as const;
const seed = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

export function Village({ players, phase, justOut = [], label, height, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const a = window.setTimeout(() => setLeaving(true), 3700);
    const b = window.setTimeout(onDone, 4300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const H = height, night = phase === 'night', n = players.length;
  // rows of houses, back (top) to front (bottom); odd rows shift a quarter house for a village look
  const cols = n <= 4 ? 2 : n <= 12 ? 3 : 4;
  const rows = Math.max(1, Math.ceil(n / cols));
  const slot = W / cols;
  const hw = slot * 1.32; // neighbours overlap a little, like a crowded village street
  const top = H * 0.24, bottom = H - 22;
  const firstBase = top + hw * 0.8;
  const step = rows > 1 ? (bottom - firstBase) / (rows - 1) : 0;
  const houses = players.map((v, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const inRow = Math.min(cols, n - r * cols);
    const s = rows > 1 ? 0.82 + 0.18 * (r / (rows - 1)) : 1;
    const w = hw * s;
    const cx = (W - inRow * slot) / 2 + slot * (c + 0.5) + (r % 2 ? slot * 0.22 : -slot * 0.06);
    const base = rows > 1 ? firstBase + r * step : (top + bottom) / 2 + hw * 0.4;
    const [src, ratio] = HOUSES[seed(v.name) % HOUSES.length];
    return { v, i, r, w, h: w * ratio, cx, base, src, crumble: justOut.includes(v.name) };
  });

  return (
    <div className={'village ' + (night ? 'v-night' : 'v-day') + (leaving ? ' village-out' : '')} onClick={onDone} style={{ height: H }}>
      {/* the same skies as the game screens: night with the moon, day with the sun */}
      <div className="v-sky v-sky-day" />
      <div className="v-sky v-sky-night" />
      <div className={night ? 'v-orb v-moon' : 'v-orb v-sun'} />
      {night ? <div className="v-stars" /> : null}
      {houses.map(p => (
        <div key={p.v.name} className="v-house" style={{ left: p.cx - p.w / 2, top: p.base - p.h, width: p.w, height: p.h, zIndex: 10 + p.r, animationDelay: `${p.i * 0.05}s` }}>
          <img src={p.src} alt="" draggable={false}
            className={'v-img' + (p.v.out ? (p.crumble ? ' v-dying' : ' v-dead') : '')}
            style={p.crumble ? { animationDelay: `${1.3 + p.i * 0.08}s` } : undefined} />
        </div>
      ))}
      {/* names on top so none hide behind a nearer house */}
      {houses.map(p => (
        <div key={'n' + p.v.name} className={'v-name' + (p.v.out ? ' gone' : '') + (p.v.me ? ' me' : '')}
          style={{ left: p.cx - 60, top: p.base - 4, zIndex: 40 }}>
          {p.v.name}
        </div>
      ))}
      <div className="v-ground" />
      <div className="village-title">{label}</div>
    </div>
  );
}
