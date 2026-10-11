import React from 'react';

// Death cards for every killer besides the wolves, the Witch, the Hunter and a broken heart.
// Each card: a palette (background, frame, glow, text colours) and an illustration drawn on the card's
// 326×520 face (the art sits in the top ~60%, the words below). Text comes from the phone's language
// (keys <fate>W / <fate>1 / <fate>2 / <fate>L in PlayerView's ui and i18n/roles.<lang>.ts).
// Animations reuse PlayerView.css: drip, flame (flicker), ember, ring, float, shimmer, slash.

export type FateLook = { bg: string; frame: string; glow: string; kicker: string; title: string; line: string; rule: string };

const look = (c1: string, c2: string, c3: string, rgb: string, kicker: string, title: string, line: string, rule: string): FateLook => ({
  bg: `radial-gradient(circle at 50% 26%, ${c1} 0%, ${c2} 46%, ${c3} 100%)`,
  frame: `rgba(${rgb},.45)`, glow: `0 20px 60px rgba(0,0,0,.6), 0 0 50px rgba(${rgb},.32)`,
  kicker, title, line, rule,
});

export const FATE_LOOK: Record<string, FateLook> = {
  knife: look('#3a3f4a', '#16181e', '#07080b', '216,221,230', '#c9ced8', '#f4f6fa', '#d6dae2', '#a7adb8'),
  burned: look('#7a2e08', '#2e1004', '#0c0402', '255,154,74', '#ffb070', '#fff0e0', '#ffd2a8', '#d9a47a'),
  betrayed: look('#3c4660', '#161a26', '#06070b', '230,238,252', '#cfdcf5', '#ffffff', '#dfe7f7', '#a9b4cc'),
  staked: look('#5a1626', '#22070e', '#0a0205', '208,104,122', '#f08a9c', '#ffe9ee', '#f2c0ca', '#c99aa4'),
  revealed: look('#6a5414', '#261e06', '#0b0902', '242,208,107', '#f2d06b', '#fff7dc', '#f1dfa8', '#cdbb86'),
  misfire: look('#3e2f5c', '#170f26', '#07050c', '185,164,224', '#c7b4ec', '#f3eeff', '#d9cdf2', '#a99bc2'),
  vengeance: look('#14504a', '#06201d', '#020a09', '127,214,200', '#8fe3d4', '#eafffb', '#bfeee6', '#8fbcb5'),
  deathcurse: look('#3a3644', '#141219', '#050407', '179,173,196', '#c6c0d4', '#f4f2f8', '#d7d3e2', '#a29db0'),
  kingshot: look('#5e1220', '#22060c', '#0a0204', '224,71,95', '#f2c86b', '#fff0f2', '#f2c4cb', '#d9b8be'),
  starved: look('#4a4228', '#1c180c', '#080703', '232,211,160', '#e8d3a0', '#fbf4e2', '#e3d6b4', '#bdb08c'),
  ghost: look('#22365c', '#0c1424', '#03060c', '169,203,255', '#a9cbff', '#f0f6ff', '#cddfff', '#9fb2cf'),
  sacrifice: look('#1c4a5a', '#0a1c24', '#03090c', '143,211,232', '#8fd3e8', '#effbff', '#c3e8f3', '#93b8c4'),
};

/** The illustration for a death card (an SVG group on the 326×520 card). */
export function FateArt({ fate }: { fate: string }) {
  const halo = (rgb: string) => (
    <>
      <circle cx="163" cy="130" r="118" fill={`rgba(${rgb},.05)`} />
      <circle cx="163" cy="130" r="86" fill={`rgba(${rgb},.08)`} />
    </>
  );
  switch (fate) {
    case 'knife': // the Serial Killer's dagger, point down, still dripping
      return (
        <g>
          {halo('216,221,230')}
          <circle cx="163" cy="34" r="10" fill="#6d5c48" />
          <rect x="155" y="40" width="16" height="44" rx="6" fill="#3b2a1e" />
          <path d="M159 46h8 M159 56h8 M159 66h8 M159 76h8" stroke="rgba(0,0,0,.35)" strokeWidth="2" />
          <rect x="119" y="84" width="88" height="13" rx="6.5" fill="#7a6650" />
          <path d="M149 97h28l-4 112-10 26-10-26z" fill="#cfd5de" />
          <path d="M163 100v124" stroke="rgba(70,80,96,.55)" strokeWidth="2" />
          <path d="M149 97h28l-4 112-10 26-10-26z" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
          <path d="M156 190l7 45 7-45" fill="#8e1626" opacity=".85" />
          <ellipse className="drip" cx="163" cy="244" rx="4" ry="6" fill="#b3243a" />
          <ellipse className="drip" cx="163" cy="244" rx="3" ry="5" fill="#b3243a" style={{ animationDelay: '1.4s' }} />
        </g>
      );
    case 'burned': // the Arsonist's fire
      return (
        <g>
          {halo('255,154,74')}
          <path d="M70 250h186" stroke="rgba(30,10,2,.9)" strokeWidth="18" strokeLinecap="round" />
          <g className="flame" style={{ transformOrigin: '163px 240px', transformBox: 'view-box' } as React.CSSProperties}>
            <path d="M163 40c30 52 58 74 48 128-6 38-28 66-48 68-20-2-42-30-48-68-10-54 18-76 48-128z" fill="#ff6a12" />
            <path d="M163 104c18 30 30 44 25 74-4 26-14 40-25 41-11-1-21-15-25-41-5-30 7-44 25-74z" fill="#ffc24a" />
            <path d="M163 160c8 14 13 22 10 36-2 12-6 18-10 18s-8-6-10-18c-3-14 2-22 10-36z" fill="#fff1c2" />
          </g>
          <g className="flame" style={{ transformOrigin: '104px 244px', transformBox: 'view-box', animationDelay: '.4s' } as React.CSSProperties}>
            <path d="M104 150c16 28 30 40 26 66-3 20-14 30-26 31-12-1-23-11-26-31-4-26 10-38 26-66z" fill="#ff8a24" opacity=".9" />
          </g>
          <g className="flame" style={{ transformOrigin: '222px 244px', transformBox: 'view-box', animationDelay: '.8s' } as React.CSSProperties}>
            <path d="M222 156c15 26 28 38 24 62-3 19-13 28-24 29-11-1-21-10-24-29-4-24 9-36 24-62z" fill="#ff8a24" opacity=".9" />
          </g>
          {[[120, 210, 0], [190, 200, 1.2], [150, 230, 2.1], [210, 226, .6], [96, 228, 1.7]].map(([x, y, d], i) => (
            <circle key={i} className="ember" cx={x} cy={y} r="2.4" fill="#ffd27a" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
      );
    case 'betrayed': // the White Werewolf's claws
      return (
        <g>
          {halo('230,238,252')}
          <circle cx="163" cy="130" r="64" fill="rgba(230,238,252,.08)" stroke="rgba(230,238,252,.25)" />
          {[-34, 0, 34].map((dx, i) => (
            <path key={i} className="slashline" d={`M${120 + dx} ${52 + Math.abs(dx) * .3}C${150 + dx} 110 ${170 + dx} 160 ${200 + dx} ${214 - Math.abs(dx) * .3}`}
              fill="none" stroke="#f4f8ff" strokeWidth="9" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(230,238,252,.7))', animationDelay: `${.2 + i * .15}s` }} />
          ))}
          {[-34, 0, 34].map((dx, i) => (
            <path key={'r' + i} d={`M${126 + dx} ${66 + Math.abs(dx) * .3}C${152 + dx} 116 ${170 + dx} 160 ${196 + dx} ${206 - Math.abs(dx) * .3}`} fill="none" stroke="#a3172c" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
          ))}
        </g>
      );
    case 'staked': // the Vampire Hunter's stake above the bite it ended
      return (
        <g>
          {halo('208,104,122')}
          <g transform="translate(0 -34) rotate(38 163 130)">
            <path d="M154 22h18v150l-9 30-9-30z" fill="#8a5a32" />
            <path d="M158 30v136 M166 34v128" stroke="rgba(40,20,8,.45)" strokeWidth="1.6" />
            <rect x="150" y="18" width="26" height="10" rx="3" fill="#6a4224" />
          </g>
          <path d="M104 196c18 16 37 22 59 22s41-6 59-22" fill="none" stroke="rgba(240,138,156,.7)" strokeWidth="3" strokeLinecap="round" />
          <path d="M136 206l6 26 6-23z M178 209l6 23 6-26z" fill="#f6f1ee" />
          <ellipse className="drip" cx="142" cy="236" rx="3" ry="5" fill="#b3243a" />
          <ellipse className="drip" cx="184" cy="236" rx="3" ry="5" fill="#b3243a" style={{ animationDelay: '1.1s' }} />
        </g>
      );
    case 'revealed': // the Revealer's eye — it saw the truth
      return (
        <g>
          {halo('242,208,107')}
          <g className="shimmer">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <path key={i} d={`M${163 + Math.cos(a) * 74} ${130 + Math.sin(a) * 74}L${163 + Math.cos(a) * 104} ${130 + Math.sin(a) * 104}`} stroke="rgba(242,208,107,.7)" strokeWidth="3" strokeLinecap="round" />;
            })}
          </g>
          <path d="M93 130c22-36 46-52 70-52s48 16 70 52c-22 36-46 52-70 52s-48-16-70-52z" fill="#fff4cf" stroke="#f2d06b" strokeWidth="3" />
          <circle cx="163" cy="130" r="30" fill="#c79a26" />
          <circle cx="163" cy="130" r="15" fill="#2a1e05" />
          <circle cx="155" cy="122" r="5" fill="#fff" />
        </g>
      );
    case 'misfire': // the Revealer pointed at an innocent: the eye cracks
      return (
        <g>
          {halo('185,164,224')}
          <path d="M93 130c22-36 46-52 70-52s48 16 70 52c-22 36-46 52-70 52s-48-16-70-52z" fill="#2a2140" stroke="#b9a4e0" strokeWidth="3" />
          <circle cx="163" cy="130" r="28" fill="#4a3a6e" />
          <circle cx="163" cy="130" r="13" fill="#0e0918" />
          <path d="M150 58l20 34-14 14 22 30-12 16 18 42" fill="none" stroke="#f3eeff" strokeWidth="4" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(185,164,224,.8))' }} />
          <path d="M132 236l10-8 M186 240l-8-10 M160 250l3-12" stroke="#b9a4e0" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'vengeance': // the Vengeful Spirit, back from the dead and reaching for you
      return (
        <g>
          {halo('127,214,200')}
          <g className="float">
            <path d="M111 232c-2-70 16-142 52-142s54 72 52 142l-12-14-10 18-11-16-10 20-9-20-11 16-10-18z" fill="rgba(160,240,226,.88)" />
            <path d="M136 132l24 10-4 10-22-8z M190 132l-24 10 4 10 22-8z" fill="#06201d" />
            <path d="M144 176l8-8 6 7 5-8 5 8 6-7 8 8-7 10h-24z" fill="#06201d" />
            <path d="M212 168c18-8 32-22 40-40" stroke="rgba(160,240,226,.88)" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M252 128l-6-18 M252 128l4-19 M252 128l12-12 M252 128l14-2" stroke="rgba(160,240,226,.88)" strokeWidth="4" strokeLinecap="round" />
            <path d="M114 168c-16-6-28-18-34-34 M80 134l-8-12 M80 134l-12-6 M80 134l-2-15" stroke="rgba(160,240,226,.75)" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          {[[98, 200, 0], [230, 220, 1.3], [140, 240, 2.2]].map(([x, y, d], i) => (
            <circle key={i} className="ember" cx={x} cy={y} r="3" fill="rgba(160,240,226,.8)" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
      );
    case 'deathcurse': // Death's hourglass, run out
      return (
        <g>
          {halo('179,173,196')}
          <rect x="112" y="40" width="102" height="12" rx="5" fill="#8a8398" />
          <rect x="112" y="210" width="102" height="12" rx="5" fill="#8a8398" />
          <path d="M124 52h78c0 44-30 58-30 79s30 35 30 79h-78c0-44 30-58 30-79s-30-35-30-79z" fill="rgba(220,215,235,.12)" stroke="#d7d3e2" strokeWidth="3" />
          <path d="M136 206c4-22 20-30 27-46 7 16 23 24 27 46z" fill="#b3adc4" />
          <path d="M163 131v40" stroke="#b3adc4" strokeWidth="2" strokeDasharray="3 5" className="shimmer" />
          <path d="M226 70c40 10 58 44 54 82" fill="none" stroke="#c6c0d4" strokeWidth="5" strokeLinecap="round" />
          <path d="M226 70c-14 22-36 30-58 28 20-12 40-24 58-28z" fill="#e8e5f0" />
        </g>
      );
    case 'kingshot': // the Wolf King's fallen crown and his last strike
      return (
        <g>
          {halo('224,71,95')}
          <g transform="rotate(-14 163 120)">
            <path d="M106 150l-8-70 36 30 29-46 29 46 36-30-8 70z" fill="#e3b54a" stroke="#fff0b8" strokeWidth="2" />
            <rect x="106" y="150" width="114" height="16" rx="4" fill="#c99630" />
            <circle cx="134" cy="158" r="5" fill="#e0475f" /><circle cx="163" cy="158" r="5" fill="#7ad0ff" /><circle cx="192" cy="158" r="5" fill="#e0475f" />
          </g>
          {[-26, 0, 26].map((dx, i) => (
            <path key={i} className="slashline" d={`M${140 + dx} ${176}C${150 + dx} 200 ${160 + dx} 222 ${176 + dx} 246`} fill="none" stroke="#e0475f" strokeWidth="7" strokeLinecap="round" style={{ animationDelay: `${.3 + i * .15}s` }} />
          ))}
        </g>
      );
    case 'starved': // no bread without the Baker: an empty bowl, a dry spoon and the last crust
      return (
        <g>
          {halo('232,211,160')}
          <g transform="rotate(-28 200 120)">
            <rect x="196" y="40" width="10" height="110" rx="5" fill="#9a7444" />
            <ellipse cx="201" cy="160" rx="18" ry="24" fill="#b88a50" />
            <ellipse cx="201" cy="160" rx="11" ry="16" fill="#7a5a30" />
          </g>
          <path d="M92 150h142c0 48-32 78-71 78s-71-30-71-78z" fill="#5a4828" stroke="#e8d3a0" strokeWidth="3" />
          <path d="M96 150h134" stroke="#e8d3a0" strokeWidth="6" strokeLinecap="round" />
          <path d="M110 156h106" stroke="rgba(20,16,8,.6)" strokeWidth="5" strokeLinecap="round" />
          <path d="M70 232c4-14 18-22 32-20 10 2 14 8 12 16-14 6-30 8-44 4z" fill="#c99a5a" stroke="#8a6434" strokeWidth="2" />
          <path d="M80 222l6 4 M92 218l4 6" stroke="#8a6434" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="136" cy="244" rx="4" ry="2.5" fill="#c9a86a" /><ellipse cx="204" cy="240" rx="3.5" ry="2.2" fill="#c9a86a" /><ellipse cx="174" cy="252" rx="3" ry="2" fill="#c9a86a" /><ellipse cx="226" cy="252" rx="2.5" ry="1.8" fill="#c9a86a" />
        </g>
      );
    case 'ghost': // the Ghost was always meant to fade on the first night
      return (
        <g>
          {halo('169,203,255')}
          <g className="float">
            <path d="M118 226c0-74 18-136 45-136s45 62 45 136c-9-9-15-9-22 0-8-11-15-11-23 0-8-11-15-11-23 0-7-9-13-9-22 0z" fill="rgba(214,230,255,.88)" />
            <ellipse cx="150" cy="140" rx="7" ry="11" fill="#0c1424" />
            <ellipse cx="176" cy="140" rx="7" ry="11" fill="#0c1424" />
            <ellipse cx="163" cy="172" rx="7" ry="9" fill="#0c1424" />
          </g>
          <rect x="226" y="196" width="14" height="40" rx="3" fill="#e8e2d0" />
          <path className="flame" d="M233 170c7 10 10 16 8 22-1 4-4 6-8 6s-7-2-8-6c-2-6 1-12 8-22z" fill="#ffd27a" style={{ transformOrigin: '233px 198px', transformBox: 'view-box' } as React.CSSProperties} />
        </g>
      );
    case 'sacrifice': // the Bodyguard's shield, broken in someone else's place
      return (
        <g>
          {halo('143,211,232')}
          <path d="M163 46l70 24v62c0 52-30 84-70 102-40-18-70-50-70-102V70z" fill="#2f5f70" stroke="#c3e8f3" strokeWidth="3" />
          <path d="M163 66l52 18v46c0 40-22 64-52 78-30-14-52-38-52-78V84z" fill="#1c4a5a" />
          <path d="M150 50l14 40-12 22 18 36-10 22 12 30" fill="none" stroke="#effbff" strokeWidth="4" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(143,211,232,.8))' }} />
          {[-22, 0, 22].map((dx, i) => (
            <path key={i} className="slashline" d={`M${120 + dx} 120L${150 + dx} 196`} stroke="#e0475f" strokeWidth="6" strokeLinecap="round" style={{ animationDelay: `${.3 + i * .15}s` }} />
          ))}
        </g>
      );
    default:
      return null;
  }
}
