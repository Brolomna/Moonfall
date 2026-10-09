import React, { useEffect, useState } from 'react';
import './village.css';

// The shared village: every player has a house. Shown full-screen for a few seconds when the phase changes.
// Night → the moon rises and the windows go dark one by one. Day → the sun comes up, chimneys smoke, birds fly.
// Eliminated players' houses stand abandoned (boarded windows, broken roof); a house whose owner just died
// falls into ruin during the transition.

export type Villager = { name: string; out: boolean; me?: boolean };

type Props = {
  players: Villager[];
  phase: 'night' | 'day';
  justOut?: string[]; // owners who died since the last scene → their houses crumble on screen
  label: string; // "Night 2" / "Day 2" in the phone's language
  height: number;
  onDone: () => void;
};

const W = 390;
// a stable little personality for each house from its owner's name
const seed = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const WALLS = ['#b98a5e', '#a77d58', '#c49a6c', '#9c7a5c', '#b3896a', '#a98663'];
const ROOFS = ['#7a3b2e', '#5b3a4e', '#4f4a6b', '#6b4430', '#3f4d5c', '#704c3a'];

function House({ v, x, y, s, phase, i, crumble }: { v: Villager; x: number; y: number; s: number; phase: 'night' | 'day'; i: number; crumble: boolean }) {
  const h = seed(v.name), w = 46 + (h % 3) * 6, bh = 34 + ((h >> 3) % 3) * 5, roofH = 22 + ((h >> 5) % 3) * 4;
  const wall = WALLS[h % WALLS.length], roof = ROOFS[(h >> 2) % ROOFS.length];
  const night = phase === 'night';
  const dead = v.out && !crumble;
  const winDelay = `${0.6 + i * 0.12}s`;
  const windows = (
    <>
      <rect x={-w / 2 + 7} y={-bh + 9} width="10" height="11" rx="1.5" className={night ? 'win win-off' : 'win win-on'} style={{ animationDelay: winDelay }} />
      <rect x={w / 2 - 17} y={-bh + 9} width="10" height="11" rx="1.5" className={night ? 'win win-off' : 'win win-on'} style={{ animationDelay: winDelay }} />
    </>
  );
  const ruin = (
    <g className={crumble ? 'ruin-in' : ''} style={crumble ? { animationDelay: `${1.4 + i * 0.1}s` } : undefined}>
      <rect x={-w / 2} y={-bh} width={w} height={bh} fill="#4a4651" />
      <polygon points={`${-w / 2 - 5},${-bh} 0,${-bh - roofH} ${w / 2 + 5},${-bh}`} fill="#2e2b33" />
      <polygon points={`${-4},${-bh - roofH + 6} ${8},${-bh - roofH + 12} ${3},${-bh - 4} ${-8},${-bh - 8}`} fill="#0d0a14" />
      {[-w / 2 + 7, w / 2 - 17].map((wx, k) => (
        <g key={k}>
          <rect x={wx} y={-bh + 9} width="10" height="11" fill="#141019" />
          <path d={`M${wx - 1} ${-bh + 8}L${wx + 11} ${-bh + 21} M${wx + 11} ${-bh + 8}L${wx - 1} ${-bh + 21}`} stroke="#6b5640" strokeWidth="2" />
        </g>
      ))}
      <rect x={-5} y={-15} width="10" height="15" fill="#1a1520" transform="rotate(8 0 0)" />
      <polygon points={`${-w / 2 - 5},0 ${-w / 2 - 5},${-bh} 0,${-bh - roofH} ${w / 2 + 5},${-bh} ${w / 2 + 5},0`} fill="#0b0618" className={night ? 'veil-in' : 'veil-out'} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="house" style={{ animationDelay: `${i * 0.05}s` }}>
      {!dead ? (
        <g>
          {/* chimney + smoke */}
          <rect x={w / 2 - 14} y={-bh - roofH + 2} width="7" height={roofH - 4} fill={roof} />
          {!night && !v.out ? (
            <g className="smoke-col">
              <circle cx={w / 2 - 10.5} cy={-bh - roofH - 4} r="3.5" className="puff" />
              <circle cx={w / 2 - 10.5} cy={-bh - roofH - 4} r="3" className="puff" style={{ animationDelay: '1s' }} />
              <circle cx={w / 2 - 10.5} cy={-bh - roofH - 4} r="2.6" className="puff" style={{ animationDelay: '2s' }} />
            </g>
          ) : null}
          <rect x={-w / 2} y={-bh} width={w} height={bh} fill={wall} />
          <polygon points={`${-w / 2 - 5},${-bh} 0,${-bh - roofH} ${w / 2 + 5},${-bh}`} fill={roof} />
          <rect x={-5} y={-15} width="10" height="15" rx="1" fill="#3a2618" />
          {/* dusk/dawn: a dark veil over the house fades in at night, out at day */}
          <polygon points={`${-w / 2 - 5},0 ${-w / 2 - 5},${-bh} 0,${-bh - roofH} ${w / 2 + 5},${-bh} ${w / 2 + 5},0`} fill="#0b0618" className={night ? 'veil-in' : 'veil-out'} />
          {windows}
        </g>
      ) : null}
      {v.out ? ruin : null}
      <text y="13" textAnchor="middle" className={'house-name' + (v.out ? ' gone' : '') + (v.me ? ' me' : '')}>
        {v.name.length > 9 ? v.name.slice(0, 8) + '…' : v.name}
      </text>
    </g>
  );
}

export function Village({ players, phase, justOut = [], label, height, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const a = window.setTimeout(() => setLeaving(true), 3700);
    const b = window.setTimeout(onDone, 4300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const H = height;
  const night = phase === 'night';
  // rows from back to front; the front row is largest
  const n = players.length;
  const rows = n <= 6 ? 1 : n <= 13 ? 2 : 3;
  const per = Math.ceil(n / rows);
  const ground = H * 0.55;
  const rowGap = 100;
  const frontY = Math.min(H - 70, ground + 80 + (rows - 1) * rowGap);
  const placed = players.map((v, idx) => {
    const r = rows - 1 - Math.floor(idx / per); // first players in front
    const inRow = players.slice(Math.floor(idx / per) * per, Math.floor(idx / per) * per + per).length;
    const k = idx % per;
    const gap = (W - 24) / inRow;
    // big houses, but never wider than their slot; rows further back are a little smaller
    const s = Math.min([1.45, 1.25, 1.08][r], (gap - 8) / 62);
    return { v, x: 12 + gap * (k + 0.5), y: frontY - r * rowGap, s, r, idx };
  }).sort((a, b) => b.r - a.r); // draw back rows first

  return (
    <div className={'village' + (leaving ? ' village-out' : '')} onClick={onDone} style={{ height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="vNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07040f" /><stop offset=".6" stopColor="#1c1038" /><stop offset="1" stopColor="#2c1a4f" /></linearGradient>
          <linearGradient id="vDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb2ff" /><stop offset=".55" stopColor="#f7c59f" /><stop offset="1" stopColor="#ffd8a8" /></linearGradient>
          <radialGradient id="vMoon" cx=".4" cy=".4" r=".7"><stop offset="0" stopColor="#fffaf0" /><stop offset=".6" stopColor="#ece2c6" /><stop offset="1" stopColor="#c9bc9c" /></radialGradient>
          <radialGradient id="vSun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6d8" /><stop offset=".55" stopColor="#ffd27a" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
        </defs>
        {/* sky: the old phase fades into the new */}
        <rect width={W} height={H} fill="url(#vDay)" className={night ? 'sky-fade-out' : 'sky-fade-in'} />
        <rect width={W} height={H} fill="url(#vNight)" className={night ? 'sky-fade-in' : 'sky-fade-out'} />
        {night ? (
          <g className="stars">
            {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={(i * 97) % W} cy={(i * 53) % (H * 0.45)} r={i % 4 ? 0.9 : 1.5} fill="#fff" className="twink" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />)}
          </g>
        ) : null}
        {/* moon rises at night, sun at day */}
        {night
          ? <circle cx="300" cy={H * 0.16} r="30" fill="url(#vMoon)" className="moon-rise" />
          : <circle cx="80" cy={H * 0.18} r="60" fill="url(#vSun)" className="sun-rise" />}
        {!night ? (
          <g className="birds" stroke="#3a2a40" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M0 0q5-5 10 0q5-5 10 0" className="bird" />
            <path d="M0 0q4-4 8 0q4-4 8 0" className="bird" style={{ animationDelay: '.7s' }} transform="translate(0 18)" />
            <path d="M0 0q4-4 8 0q4-4 8 0" className="bird" style={{ animationDelay: '1.3s' }} transform="translate(0 -12)" />
          </g>
        ) : null}
        {/* hills and ground */}
        <path d={`M0 ${ground - 40} Q90 ${ground - 90} 190 ${ground - 50} T390 ${ground - 70} V${H} H0Z`} className={night ? 'hill hill-night' : 'hill hill-day'} />
        <rect y={ground - 10} width={W} height={H - ground + 10} className={night ? 'grass grass-night' : 'grass grass-day'} />
        <path d={`M170 ${H} C185 ${H * 0.8} 230 ${H * 0.66} 205 ${ground}`} fill="none" strokeWidth="26" strokeLinecap="round" className={night ? 'path path-night' : 'path path-day'} />
        {[18, 44, 352, 376, 300].map((x, i) => (
          <polygon key={i} points={`${x},${ground - 70 - (i % 2) * 14} ${x - 13},${ground - 18} ${x + 13},${ground - 18}`} className={night ? 'pine pine-night' : 'pine pine-day'} />
        ))}
        {placed.map(p => (
          <House key={p.v.name} v={p.v} x={p.x} y={p.y} s={p.s} phase={phase} i={p.idx} crumble={justOut.includes(p.v.name)} />
        ))}
        {night ? <rect y={ground - 30} width={W} height="120" className="fog-band" /> : null}
      </svg>
      <div className="village-title">{label}</div>
    </div>
  );
}
