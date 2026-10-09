import React, { useEffect, useState } from 'react';
import './village.css';
import { HOUSES, PAINTING_RATIO, House } from './villageMap';

// The shared village, shown full-screen for a few seconds when the phase changes. It is one painting
// (public/village): every player owns a house in it and their name hangs on it.
// Night → the village is dark, then each living player's windows light up one by one.
// Day → the sun comes up and the lights go out as the village wakes.
// An eliminated player's house stays dark and drained of colour; a house whose owner just went out
// keeps its light for a moment, flickers and dies during the scene.
//   night.webp — the painting with every house's lights off   lit.webp — the original, lights on
//   day.webp   — lights off and no moon (the sun is drawn on top)

export type Villager = { name: string; out: boolean; me?: boolean };

type Props = {
  players: Villager[];
  phase: 'night' | 'day';
  justOut?: string[]; // owners who went out since the last scene → their lights die on screen
  label: string; // "Night 2" / "Day 2" in the phone's language
  height: number;
  onDone: () => void;
};

const W = 390;
const IMG = { night: '/village/night.webp', day: '/village/day.webp', lit: '/village/lit.webp' };

/** Fetch the paintings early so the first scene doesn't flash in half-loaded. */
export function preloadVillage() {
  Object.values(IMG).forEach(src => { const i = new Image(); i.src = src; });
}

export function Village({ players, phase, justOut = [], label, height, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);
  // start the story once the paintings are decoded (at most 1.5 s later), so it never plays half-loaded
  useEffect(() => {
    let live = true;
    const go = () => { if (live) setReady(true); };
    const wait = window.setTimeout(go, 1500);
    Promise.all([phase === 'night' ? IMG.night : IMG.day, IMG.lit].map(src => { const i = new Image(); i.src = src; return i.decode().catch(() => undefined); })).then(go);
    return () => { live = false; clearTimeout(wait); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!ready) return;
    const a = window.setTimeout(() => setLeaving(true), 4600);
    const b = window.setTimeout(onDone, 5200);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const night = phase === 'night';
  // the painting fills the height and keeps its proportions; the sides are cropped evenly
  const pw = Math.max(W, height * PAINTING_RATIO), ph = pw / PAINTING_RATIO;
  const box = { width: pw, height: ph, left: (W - pw) / 2, top: height - ph };

  // players take the houses in order — only houses whose name plate is on screen (the sides are cropped on
  // narrow phones); with more players than houses, neighbours share
  const onScreen = HOUSES.filter(h => { const x = box.left + (h.x / 100) * pw; return x > 12 && x < W - 12; });
  // name plates stay fully on screen (in px inside the painting)
  const plateX = (h: House) => Math.min(W - 44, Math.max(44, box.left + (h.x / 100) * pw)) - box.left;
  const homes = HOUSES.map((h, i) => { const k = onScreen.indexOf(h); return { h, i, people: k < 0 ? [] : players.filter((_, j) => j % onScreen.length === k) }; });
  const lightState = (people: Villager[]) => {
    if (!people.length) return 'empty';
    if (people.some(p => !p.out)) return 'alive';
    return people.some(p => justOut.includes(p.name)) ? 'dying' : 'dead';
  };
  // an abandoned house: a soft cold shadow over it (no hard edges — only its lights are gone)
  const ruinAt = (h: House) => ({ left: `${h.cx}%`, top: `${h.cy}%`, width: `${h.w * 1.25}%`, height: `${h.h * 1.2}%` });
  let order = 0; // lights come on (or go out) one house after another

  return (
    <div className={'village ' + (night ? 'v-night' : 'v-day') + (leaving ? ' village-out' : '') + (ready ? '' : ' v-wait')} onClick={onDone} style={{ height }}>
      <div className="v-pan" style={box}>
        <div className="v-paint">
        <img className="v-base" src={night ? IMG.night : IMG.day} alt="" draggable={false} />
        {homes.map(({ h, i, people }) => {
          const st = lightState(people);
          if (st === 'dead') return <div key={h.id} className="v-ruin" style={ruinAt(h)} />;
          const delay = (night ? 0.7 : 0.9) + (st === 'empty' ? 0.3 : 0) + (order++) * 0.11;
          return (
            <React.Fragment key={h.id}>
              <img className={'v-lit v-lit-' + st} src={IMG.lit} alt="" draggable={false}
                style={{ clipPath: h.clip, WebkitClipPath: h.clip, animationDelay: `${delay}s, ${delay + 1.2 + (i % 3) * 0.4}s` }} />
              {st === 'dying' && <div className="v-ruin v-ruin-late" style={ruinAt(h)} />}
            </React.Fragment>
          );
        })}
        </div>
        <div className="v-fire" />
        {!night && <div className="v-dawn" />}
        {!night && <div className="v-orb v-sun" />}
        {homes.map(({ h, people }) => people.map((p, k) => (
          <div key={p.name} className={'v-name' + (p.out ? ' gone' : '') + (p.me ? ' me' : '') + (justOut.includes(p.name) ? ' going' : '')}
            style={{ left: plateX(h), top: `calc(${h.y}% + ${k * 17}px)` }}>
            {p.name}
          </div>
        )))}
      </div>
      <div className="v-shade" />
      <div className="village-title">{label}</div>
    </div>
  );
}
