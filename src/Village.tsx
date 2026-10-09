import React, { useEffect, useState } from 'react';
import './village.css';

// The shared village: every player has a tall medieval house lining a cobbled street that runs up to a castle.
// Shown full-screen for a few seconds when the phase changes.
// Night → the moon rises, lit windows go dark one by one, torches flicker. Day → dawn, chimneys smoke, birds fly.
// Eliminated players' houses stand abandoned (broken roof, sagging beams, boarded windows); a house whose owner
// just went out falls into ruin during the scene.

export type Villager = { name: string; out: boolean; me?: boolean };

type Props = {
  players: Villager[];
  phase: 'night' | 'day';
  justOut?: string[]; // owners who went out since the last scene → their houses crumble on screen
  label: string; // "Night 2" / "Day 2" in the phone's language
  height: number;
  onDone: () => void;
};

const W = 390;
// a stable little personality for each house from its owner's name
const seed = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const PLASTER = ['#e6d6b8', '#d9c7a4', '#e8dcc6', '#cdb894', '#dccfb5', '#d2c0a0'];
const ROOF = ['#3b3150', '#2f2b44', '#45324a', '#33384d', '#3d2e3e', '#2b3040'];
const BEAM = '#3a2618';

/** One house, drawn upward from (0,0) = middle of its front wall at street level. */
function House({ v, phase, i, crumble }: { v: Villager; phase: 'night' | 'day'; i: number; crumble: boolean }) {
  const h = seed(v.name);
  const w = 44 + (h % 4) * 4;              // wall width
  const g = 30;                             // ground floor
  const floors = 1 + ((h >> 3) % 2);        // upper floors (1–2)
  const u = 26;                             // upper floor height
  const over = 4;                           // jettied upper floors overhang the street
  const roofH = 38 + ((h >> 5) % 3) * 8;    // steep roof
  const plaster = PLASTER[h % PLASTER.length], roof = ROOF[(h >> 2) % ROOF.length];
  const turret = (h >> 7) % 5 === 0, dormer = (h >> 9) % 2 === 0, chimney = (h >> 11) % 3 !== 0;
  const night = phase === 'night';
  const dead = v.out && !crumble;
  const topY = -g - floors * u;             // eaves line
  const uw = w + over * 2;                  // upper-floor width
  const winCls = night ? 'win win-off' : 'win win-on';
  const winDelay = (k: number) => ({ animationDelay: `${0.6 + i * 0.1 + k * 0.08}s` });
  const roofPts = `${-uw / 2 - 4},${topY} 0,${topY - roofH} ${uw / 2 + 4},${topY}`;

  const intact = (
    <g>
      {chimney ? <rect x={uw / 4} y={topY - roofH * 0.7} width="7" height={roofH * 0.55} fill="#4a3a3a" /> : null}
      {chimney && !night ? (
        <g>
          {[0, 1, 2].map(k => <circle key={k} cx={uw / 4 + 3.5} cy={topY - roofH * 0.7 - 3} r={3 - k * 0.3} className="puff" style={{ animationDelay: `${k}s` }} />)}
        </g>
      ) : null}
      {/* ground floor: stone base, arched door, a window */}
      <rect x={-w / 2} y={-g} width={w} height={g} fill="#8d8597" />
      <path d={`M-6 0V-14a6 6 0 0 1 12 0V0z`} fill="#2a1a12" />
      <rect x={w / 2 - 15} y={-g + 9} width="9" height="11" rx="1" className={winCls} style={winDelay(0)} />
      {/* upper floors: plaster with timber framing, jettied */}
      {Array.from({ length: floors }, (_, f) => {
        const y = -g - (f + 1) * u;
        return (
          <g key={f}>
            <rect x={-uw / 2} y={y} width={uw} height={u} fill={plaster} />
            <g stroke={BEAM} strokeWidth="2.2">
              <line x1={-uw / 2} y1={y + u} x2={uw / 2} y2={y + u} />
              <line x1={-uw / 2 + 1} y1={y} x2={-uw / 2 + 1} y2={y + u} />
              <line x1={uw / 2 - 1} y1={y} x2={uw / 2 - 1} y2={y + u} />
              <line x1="0" y1={y} x2="0" y2={y + u} />
              <line x1={-uw / 2 + 1} y1={y + u} x2={-uw / 4} y2={y} />
              <line x1={uw / 2 - 1} y1={y + u} x2={uw / 4} y2={y} />
            </g>
            {[-uw / 4 - 4, uw / 4 - 4].map((wx, k) => (
              <g key={k}>
                <rect x={wx} y={y + 7} width="8" height="12" rx="3.5" className={winCls} style={winDelay(f * 2 + k + 1)} />
                <line x1={wx + 4} y1={y + 7} x2={wx + 4} y2={y + 19} stroke={BEAM} strokeWidth="1" />
              </g>
            ))}
          </g>
        );
      })}
      {/* steep slate roof with a dormer, sometimes a little turret */}
      <polygon points={roofPts} fill={roof} />
      <g stroke="rgba(0,0,0,.25)" strokeWidth="1">
        {[0.3, 0.55, 0.78].map((t, k) => <line key={k} x1={-uw / 2 * (1 - t)} y1={topY - roofH * t} x2={uw / 2 * (1 - t)} y2={topY - roofH * t} />)}
      </g>
      {dormer ? (
        <g>
          <polygon points={`-7,${topY - roofH * 0.28} 0,${topY - roofH * 0.48} 7,${topY - roofH * 0.28}`} fill={roof} stroke="rgba(0,0,0,.3)" />
          <rect x="-3.5" y={topY - roofH * 0.38} width="7" height="8" rx="3" className={winCls} style={winDelay(9)} />
        </g>
      ) : null}
      {turret ? (
        <g>
          <rect x={-uw / 2 - 6} y={topY - 34} width="12" height="34" fill={plaster} stroke={BEAM} strokeWidth="1.5" />
          <polygon points={`${-uw / 2 - 9},${topY - 34} ${-uw / 2},${topY - 58} ${-uw / 2 + 9},${topY - 34}`} fill={roof} />
          <rect x={-uw / 2 - 2.5} y={topY - 26} width="5" height="8" rx="2.5" className={winCls} style={winDelay(10)} />
          <polygon points={`${-uw / 2 - 9},${topY} ${-uw / 2 - 9},${topY - 34} ${-uw / 2},${topY - 58} ${-uw / 2 + 9},${topY - 34} ${-uw / 2 + 9},${topY}`} fill="#0b0618" className={night ? 'veil-in' : 'veil-out'} />
        </g>
      ) : null}
      {/* dusk/dawn: a dark veil over the house fades in at night, out at day */}
      <polygon points={`${-uw / 2 - 10},0 ${-uw / 2 - 10},${topY} 0,${topY - roofH} ${uw / 2 + 4},${topY} ${uw / 2 + 4},0`} fill="#0b0618" className={night ? 'veil-in' : 'veil-out'} />
    </g>
  );

  const ruin = (
    <g className={crumble ? 'ruin-in' : ''} style={crumble ? { animationDelay: `${1.4 + i * 0.1}s` } : undefined}>
      <rect x={-w / 2} y={-g} width={w} height={g} fill="#5a5560" />
      <path d={`M-6 0V-14a6 6 0 0 1 12 0V0z`} fill="#141019" transform="rotate(6 0 0)" />
      {Array.from({ length: floors }, (_, f) => {
        const y = -g - (f + 1) * u;
        return (
          <g key={f}>
            <rect x={-uw / 2} y={y} width={uw} height={u} fill="#7a7480" />
            <g stroke="#2a2420" strokeWidth="2.2">
              <line x1={-uw / 2} y1={y + u} x2={uw / 2} y2={y + u - 3} />
              <line x1={-uw / 2 + 1} y1={y} x2={-uw / 2 + 3} y2={y + u} />
              <line x1={uw / 2 - 1} y1={y + 3} x2={uw / 2 - 1} y2={y + u} />
              <line x1={-uw / 2 + 1} y1={y + u} x2={-uw / 4} y2={y + 4} />
            </g>
            {[-uw / 4 - 4, uw / 4 - 4].map((wx, k) => (
              <g key={k}>
                <rect x={wx} y={y + 7} width="8" height="12" fill="#141019" />
                <path d={`M${wx - 1} ${y + 8}L${wx + 9} ${y + 18} M${wx + 9} ${y + 8}L${wx - 1} ${y + 18}`} stroke="#6b5640" strokeWidth="1.8" />
              </g>
            ))}
          </g>
        );
      })}
      {/* broken roof: half caved in */}
      <polygon points={`${-uw / 2 - 4},${topY} ${-uw / 8},${topY - roofH * 0.82} ${uw / 10},${topY - roofH * 0.5} ${uw / 4},${topY - roofH * 0.6} ${uw / 2 + 4},${topY}`} fill="#2e2b33" />
      <polygon points={`${uw / 10},${topY - roofH * 0.5} ${uw / 4},${topY - roofH * 0.6} ${uw / 5},${topY - roofH * 0.2} ${0},${topY - roofH * 0.25}`} fill="#0d0a14" />
      <polygon points={`${-uw / 2 - 4},0 ${-uw / 2 - 4},${topY} ${-uw / 8},${topY - roofH} ${uw / 2 + 4},${topY} ${uw / 2 + 4},0`} fill="#0b0618" className={night ? 'veil-in' : 'veil-out'} />
    </g>
  );

  return (
    <g className="house" style={{ animationDelay: `${i * 0.04}s` }}>
      {!dead ? intact : null}
      {v.out ? ruin : null}
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
  // A street runs from the bottom of the screen up to the castle on the horizon; houses line both sides.
  const horizon = H * 0.5;
  const streetBottom = H - 34;
  const edgeL = (t: number) => 132 + (186 - 132) * t, edgeR = (t: number) => 258 + (204 - 258) * t;
  const yAt = (t: number) => streetBottom + (horizon + 10 - streetBottom) * t;
  const perSide = Math.max(1, Math.ceil(players.length / 2));
  const placed = players.map((v, idx) => {
    const left = idx % 2 === 0, k = Math.floor(idx / 2);
    const t = perSide > 1 ? (k / (perSide - 1)) * 0.78 : 0;
    const s = 1.65 - t * 1.25;
    // the house's street-side corner sits on the street edge
    const x = left ? edgeL(t) - (30 * s) : edgeR(t) + (30 * s);
    return { v, idx, t, s, x, y: yAt(t), left };
  });
  const drawOrder = placed.slice().sort((a, b) => b.t - a.t); // far houses first

  return (
    <div className={'village' + (leaving ? ' village-out' : '')} onClick={onDone} style={{ height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="vNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b061a" /><stop offset=".5" stopColor="#24143f" /><stop offset="1" stopColor="#3b2263" /></linearGradient>
          <linearGradient id="vDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d5aa8" /><stop offset=".45" stopColor="#c99bc0" /><stop offset=".8" stopColor="#f6c8a2" /><stop offset="1" stopColor="#ffd9ad" /></linearGradient>
          <radialGradient id="vMoon" cx=".4" cy=".4" r=".7"><stop offset="0" stopColor="#fffaf0" /><stop offset=".6" stopColor="#ece2c6" /><stop offset="1" stopColor="#c9bc9c" /></radialGradient>
          <radialGradient id="vSun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff6d8" /><stop offset=".5" stopColor="#ffd27a" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
          <radialGradient id="vGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ffcf7a" stopOpacity=".85" /><stop offset="1" stopColor="#ff9b3d" stopOpacity="0" /></radialGradient>
        </defs>
        {/* sky: the old phase fades into the new */}
        <rect width={W} height={H} fill="url(#vDay)" className={night ? 'sky-fade-out' : 'sky-fade-in'} />
        <rect width={W} height={H} fill="url(#vNight)" className={night ? 'sky-fade-in' : 'sky-fade-out'} />
        {night ? (
          <g>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 97) % W} cy={(i * 53) % (H * 0.42)} r={i % 4 ? 0.9 : 1.5} fill="#fff" className="twink" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />)}</g>
        ) : null}
        {night
          ? <circle cx="300" cy={H * 0.13} r="34" fill="url(#vMoon)" className="moon-rise" />
          : <circle cx="300" cy={H * 0.2} r="64" fill="url(#vSun)" className="sun-rise" />}
        {/* drifting clouds */}
        {[[40, H * 0.2, 1], [230, H * 0.3, 0.8], [120, H * 0.36, 1.2]].map(([x, y, s], k) => (
          <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
            <g className={'cloud ' + (night ? 'cloud-night' : 'cloud-day')} style={{ animationDelay: `${k * -6}s` }}>
              <ellipse cx="0" cy="0" rx="46" ry="11" /><ellipse cx="-20" cy="-7" rx="22" ry="10" /><ellipse cx="16" cy="-9" rx="26" ry="12" />
            </g>
          </g>
        ))}
        {/* castle on the hill at the end of the street, distant rooftops on both sides */}
        <g className={night ? 'far far-night' : 'far far-day'}>
          <path d={`M110 ${horizon + 6} Q195 ${horizon - 46} 280 ${horizon + 6} Z`} />
          <rect x="168" y={horizon - 70} width="16" height="52" /><polygon points={`165,${horizon - 70} 176,${horizon - 92} 187,${horizon - 70}`} />
          <rect x="206" y={horizon - 62} width="14" height="44" /><polygon points={`203,${horizon - 62} 213,${horizon - 82} 223,${horizon - 62}`} />
          <rect x="182" y={horizon - 50} width="26" height="34" />
          <rect x="190" y={horizon - 104} width="6" height="56" /><polygon points={`187,${horizon - 104} 193,${horizon - 128} 199,${horizon - 104}`} />
          <path d={`M0 ${horizon + 8} L0 ${horizon - 22} L18 ${horizon - 36} L36 ${horizon - 22} L50 ${horizon - 30} L64 ${horizon - 14} L84 ${horizon - 26} L104 ${horizon - 6} L110 ${horizon + 8} Z`} />
          <path d={`M390 ${horizon + 8} L390 ${horizon - 24} L372 ${horizon - 38} L354 ${horizon - 24} L340 ${horizon - 32} L326 ${horizon - 16} L306 ${horizon - 28} L286 ${horizon - 6} L280 ${horizon + 8} Z`} />
        </g>
        {night ? (
          <g className="castle-lights">
            <rect x="174" y={horizon - 58} width="3" height="5" fill="#ffcf7a" /><rect x="212" y={horizon - 50} width="3" height="5" fill="#ffcf7a" /><rect x="193" y={horizon - 40} width="3" height="5" fill="#ffcf7a" />
          </g>
        ) : null}
        {/* ground and the cobbled street */}
        <rect y={horizon + 6} width={W} height={H - horizon} className={night ? 'grass grass-night' : 'grass grass-day'} />
        <polygon points={`${edgeL(0) - 30},${H} ${edgeL(1)},${horizon + 10} ${edgeR(1)},${horizon + 10} ${edgeR(0) + 30},${H}`} className={night ? 'street street-night' : 'street street-day'} />
        <g stroke={night ? 'rgba(160,140,200,.14)' : 'rgba(90,60,40,.22)'} strokeWidth="1">
          {Array.from({ length: 12 }, (_, k) => { const t = Math.pow(k / 12, 1.6); const y = yAt(t) + 20 * (1 - t); return <line key={k} x1={edgeL(t) - 30 * (1 - t)} y1={y} x2={edgeR(t) + 30 * (1 - t)} y2={y} />; })}
          {[-0.5, -0.17, 0.17, 0.5].map((f, k) => <line key={'v' + k} x1={195 + f * 180} y1={H} x2={195 + f * 20} y2={horizon + 10} />)}
        </g>
        {/* torches along the street */}
        {[0.12, 0.45].flatMap((t, k) => [edgeL(t) + 4, edgeR(t) - 4].map((x, j) => {
          const y = yAt(t) + 4, s = 1.2 - t;
          return (
            <g key={k + '-' + j} transform={`translate(${x} ${y}) scale(${s})`}>
              <line x1="0" y1="0" x2="0" y2="-34" stroke="#2a1c14" strokeWidth="3" />
              {night ? <circle cx="0" cy="-40" r="16" fill="url(#vGlow)" className="torch-glow" /> : null}
              <path d="M0 -36 q-4 -6 0 -12 q4 6 0 12" fill={night ? '#ffcf7a' : '#7a6a5a'} className={night ? 'flame-flick' : ''} />
            </g>
          );
        }))}
        {/* houses, far to near */}
        {drawOrder.map(p => (
          <g key={p.v.name} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
            <House v={p.v} phase={phase} i={p.idx} crumble={justOut.includes(p.v.name)} />
          </g>
        ))}
        {night ? <rect y={horizon - 10} width={W} height="140" className="fog-band" /> : null}
        {!night ? (
          <g stroke="#3a2a40" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M0 0q5-5 10 0q5-5 10 0" className="bird" />
            <path d="M0 18q4-4 8 0q4-4 8 0" className="bird" style={{ animationDelay: '.7s' }} />
          </g>
        ) : null}
        {/* names on top so none hide behind a nearer house */}
        {placed.map(p => (
          <text key={'n' + p.v.name} x={p.x} y={p.y + 12 * p.s} textAnchor="middle" style={{ fontSize: Math.max(8, 11 * p.s) }}
            className={'house-name' + (p.v.out ? ' gone' : '') + (p.v.me ? ' me' : '')}>
            {p.v.name.length > 9 ? p.v.name.slice(0, 8) + '…' : p.v.name}
          </text>
        ))}
      </svg>
      <div className="village-title">{label}</div>
    </div>
  );
}
