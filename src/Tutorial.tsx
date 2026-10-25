import React, { useEffect, useRef, useState } from 'react';

/** The interactive tutorial shown once after the splash (and again from the game guide): one short scene per step,
 *  each with a single tap or hold to try, so players learn the flow and the main roles without reading a manual.
 *  Skip is always visible. Styles (tut-*) live in global.css. */

type SceneProps = { ok: boolean; done: () => void };
type Step = { emoji: string; color: string; kicker: string; title: string; line: string; hint?: string; after?: string; Scene?: (p: SceneProps) => React.ReactElement; night?: boolean };

const FOLK = ['Alex', 'Bea', 'Cal', 'Dee'];
const FACE: Record<string, string> = { Alex: '🧑', Bea: '👩', Cal: '🧔', Dee: '👵', You: '🙂' };

function Folk({ names, pick, marks, faded, onPick }: { names: string[]; pick?: string | null; marks?: Record<string, string>; faded?: Record<string, boolean>; onPick?: (n: string) => void }) {
  return (
    <div className="tut-folk">
      {names.map(n => (
        <button key={n} className={'tut-person press' + (pick === n ? ' on' : '') + (faded && faded[n] ? ' gone' : '')} onClick={onPick ? () => onPick(n) : undefined} disabled={!onPick}>
          <span className="tut-face">{FACE[n] || '🙂'}</span>
          <span className="tut-nm">{n}</span>
          {marks && marks[n] ? <span key={marks[n]} className="tut-mark">{marks[n]}</span> : null}
        </button>
      ))}
    </div>
  );
}

// hold the card to peek — the same gesture as the real role card
function HoldScene({ ok, done }: SceneProps) {
  const [held, setHeld] = useState(false);
  const down = (e: React.PointerEvent) => { try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* old browsers */ } setHeld(true); };
  const up = () => { if (held) done(); setHeld(false); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className={'tut-card holdcard' + (held ? ' up' : '')} onPointerDown={down} onPointerUp={up} onPointerCancel={up} onContextMenu={e => e.preventDefault()}>
        {held ? (
          <>
            <span style={{ fontSize: '46px' }}>👁</span>
            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '22px', color: '#7fb2ff' }}>Seer</span>
            <span style={{ fontSize: '12.5px', color: '#cfc6e0' }}>Team Village</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '40px' }}>🌙</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#c7a8ff', letterSpacing: '.12em', textTransform: 'uppercase' }}>Hold me</span>
          </>
        )}
      </div>
      <span style={{ fontSize: '13px', color: '#a99cc2' }}>{held ? 'Let go and it hides again' : ok ? 'Nice — nobody saw it 🤫' : 'Press and hold the card'}</span>
    </div>
  );
}

function NightScene({ ok, done }: SceneProps) {
  return (
    <button className={'tut-sky press' + (ok ? ' night' : '')} onClick={done} aria-label="Make it night">
      <span className="tut-orb">{ok ? '🌕' : '☀️'}</span>
      <span style={{ fontSize: '13.5px', fontWeight: 700, color: ok ? '#e9dcff' : '#3a2a12' }}>{ok ? 'Eyes closed… 😴😴😴' : 'Tap to bring the night'}</span>
    </button>
  );
}

function WolfScene({ ok, done }: SceneProps) {
  const [pick, setPick] = useState<string | null>(null);
  return <Folk names={FOLK} pick={pick} marks={pick ? { [pick]: '🐾' } : {}} onPick={ok ? undefined : n => { setPick(n); done(); }} />;
}

function CubScene({ ok, done }: SceneProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Folk names={['Cal']} faded={{ Cal: ok }} marks={ok ? { Cal: '🗳' } : {}} onPick={ok ? undefined : done} />
      <span style={{ fontSize: '13px', color: '#a99cc2' }}>{ok ? 'Cal was the Wolf Cub…' : 'Cal is the Wolf Cub. Tap to vote Cal out.'}</span>
      {ok ? <div className="tut-pop" style={{ fontSize: '15px', fontWeight: 800, color: '#ff8f84' }}>Next night: 🐾 🐾 two victims</div> : null}
    </div>
  );
}

function SeerScene({ ok, done }: SceneProps) {
  const [pick, setPick] = useState<string | null>(null);
  const wolf = 'Bea';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Folk names={['Alex', 'Bea', 'Dee']} pick={pick} marks={pick ? { [pick]: pick === wolf ? '👍' : '👎' } : {}} onPick={n => { setPick(n); done(); }} />
      <span style={{ fontSize: '13px', color: '#a99cc2', minHeight: '18px' }}>{pick ? (pick === wolf ? 'Thumbs up: ' + pick + ' IS a werewolf!' : 'Thumbs down: ' + pick + ' is not a werewolf.') : ok ? '' : 'Point at someone'}</span>
    </div>
  );
}

function HealScene({ ok, done }: SceneProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Folk names={['Dee']} marks={{ Dee: ok ? '🛡' : '🐾' }} onPick={ok ? undefined : done} />
      <span style={{ fontSize: '13px', color: ok ? '#62d4a6' : '#a99cc2', fontWeight: ok ? 800 : 500 }}>{ok ? 'Saved! The wolves’ attack fails.' : 'The wolves chose Dee. Tap Dee to protect her.'}</span>
    </div>
  );
}

function WitchScene({ ok, done }: SceneProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const opts = [
    { k: 'save', label: '💚 Save', out: 'Dee wakes up alive. Your save potion is used up.' },
    { k: 'poison', label: '☠️ Poison', out: 'Someone won’t wake up. Your poison is used up.' },
    { k: 'keep', label: '🤫 Keep both', out: 'Saving them for later. Smart.' },
  ];
  const c = opts.find(o => o.k === choice);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {opts.map(o => (
          <button key={o.k} className={'tut-chip press' + (choice === o.k ? ' on' : '')} onClick={() => { setChoice(o.k); done(); }}>{o.label}</button>
        ))}
      </div>
      <span key={choice || ''} className={c ? 'tut-pop' : ''} style={{ fontSize: '13.5px', color: c ? '#e4c9ff' : '#a99cc2', minHeight: '18px', textAlign: 'center' }}>{c ? c.out : ok ? '' : 'The wolves attacked Dee. What will you do?'}</span>
    </div>
  );
}

function DayScene({ ok, done }: SceneProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
      <button className={'tut-sky press' + (ok ? '' : ' night')} onClick={done} aria-label="Wake up">
        <span className="tut-orb">{ok ? '☀️' : '🌕'}</span>
        <span style={{ fontSize: '13.5px', fontWeight: 700, color: ok ? '#3a2a12' : '#e9dcff' }}>{ok ? 'Good morning, village' : 'Tap to wake up'}</span>
      </button>
      {ok ? (
        <div className="death-notice" style={{ position: 'relative', animation: 'none', top: 'auto' }}>
          <span className="dn-candle" aria-hidden="true">🕯</span>
          <span className="dn-name">Alex died</span>
        </div>
      ) : null}
    </div>
  );
}

function VoteScene({ ok, done }: SceneProps) {
  const [votes, setVotes] = useState<Record<string, number>>({ Bea: 1, Cal: 0, Dee: 0 });
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const add = (n: string) => { const nx = { ...votes, [n]: votes[n] + 1 }; setVotes(nx); if (nx.Bea + nx.Cal + nx.Dee >= 3) done(); };
  const top = Object.keys(votes).sort((a, b) => votes[b] - votes[a])[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '300px' }}>
      {Object.keys(votes).map(n => (
        <button key={n} className="tut-vote press" onClick={ok ? undefined : () => add(n)}>
          <span style={{ width: '58px', textAlign: 'left', fontWeight: 800 }}>{FACE[n]} {n}</span>
          <span style={{ flex: 1, height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: (total ? (votes[n] / Math.max(3, total)) * 100 : 0) + '%', background: ok && n === top ? '#e0475f' : '#c7a8ff', transition: 'width .4s ease' }} />
          </span>
          <span style={{ width: '18px', textAlign: 'right', fontWeight: 800 }}>{votes[n]}</span>
        </button>
      ))}
      <span style={{ fontSize: '13px', color: ok ? '#ff9aa9' : '#a99cc2', fontWeight: ok ? 800 : 500, textAlign: 'center' }}>{ok ? top + ' is voted out.' : 'Tap names to vote (only totals are shown)'}</span>
    </div>
  );
}

function HunterScene({ ok, done }: SceneProps) {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <Folk names={['Bea', 'Cal', 'Dee']} pick={pick} faded={pick ? { [pick]: true } : {}} marks={pick ? { [pick]: '🏹' } : {}} onPick={ok ? undefined : n => { setPick(n); done(); }} />
      <span style={{ fontSize: '13px', color: '#a99cc2' }}>{pick ? pick + ' goes down with the Hunter.' : 'You were the Hunter and got voted out. Take your last shot!'}</span>
    </div>
  );
}

function PrinceScene({ ok, done }: SceneProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className={'tut-card' + (ok ? ' up' : '')} style={{ width: '128px', height: '150px', cursor: 'default' }}>
        <span style={{ fontSize: '40px' }}>{ok ? '👑' : '🙂'}</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '18px', color: ok ? '#f2d06b' : '#e9dcff' }}>{ok ? 'Prince' : 'Eli'}</span>
      </div>
      {ok ? <span className="tut-pop" style={{ fontSize: '14px', fontWeight: 800, color: '#f2d06b' }}>Royal card revealed — Eli stays!</span>
        : <button className="tut-chip press" onClick={done}>🗳 Vote Eli out</button>}
    </div>
  );
}

function VillagerScene({ ok, done }: SceneProps) {
  return (
    <button className={'tut-lantern press' + (ok ? ' lit' : '')} onClick={done} aria-label="Speak up">
      <span style={{ fontSize: '52px' }}>🏮</span>
      <span style={{ fontSize: '13.5px', fontWeight: 700, color: ok ? '#f6e7c1' : '#a99cc2' }}>{ok ? '“I think Bea is lying!”' : 'Tap to speak up'}</span>
    </button>
  );
}

const STEPS: Step[] = [
  { emoji: '🌙', color: '#c7a8ff', kicker: 'Welcome', title: 'Moonfall in one minute', line: 'Werewolves are hiding in the village. The village must find them before it’s too late.' },
  { emoji: '🃏', color: '#c7a8ff', kicker: 'Your secret', title: 'Peek at your role', line: 'Your phone holds your secret role. It only shows while you hold it.', Scene: HoldScene },
  { emoji: '🌕', color: '#e9dcff', kicker: 'Night', title: 'Night falls', line: 'Everyone closes their eyes. The host wakes the roles one by one.', Scene: NightScene, night: true },
  { emoji: '🐺', color: '#e0475f', kicker: 'Werewolves', title: 'The pack hunts', line: 'Werewolves wake together and silently pick a victim.', hint: 'Pick a victim', Scene: WolfScene, night: true },
  { emoji: '🐾', color: '#ff6f61', kicker: 'Wolf Cub', title: 'Don’t touch the Cub', line: 'A werewolf. If the Wolf Cub dies, the wolves take two victims the next night.', Scene: CubScene, night: true },
  { emoji: '👁', color: '#7fb2ff', kicker: 'Seer', title: 'See the truth', line: 'Each night, point at one player. The host shows you if they’re a werewolf.', Scene: SeerScene, night: true },
  { emoji: '✚', color: '#62d4a6', kicker: 'Healer', title: 'Protect someone', line: 'Each night, choose one player to protect from the wolves.', Scene: HealScene, night: true },
  { emoji: '⚗️', color: '#c98bf2', kicker: 'Witch', title: 'Two potions', line: 'One potion to save, one poison to kill. Each works only once per game.', Scene: WitchScene, night: true },
  { emoji: '☀️', color: '#f2c38a', kicker: 'Day', title: 'The village wakes', line: 'The host announces who died — but never who did it.', Scene: DayScene },
  { emoji: '🗳', color: '#e9dcff', kicker: 'Vote', title: 'Talk, nominate, vote', line: 'Discuss, nominate suspects, then vote. The most votes is out.', Scene: VoteScene },
  { emoji: '🏹', color: '#f2a65a', kicker: 'Hunter', title: 'One last shot', line: 'When the Hunter is eliminated, they take one player down with them.', Scene: HunterScene },
  { emoji: '👑', color: '#f2d06b', kicker: 'Prince', title: 'Royal immunity', line: 'The Prince can’t be voted out — they reveal their card and survive.', Scene: PrinceScene },
  { emoji: '🏮', color: '#e8d3a0', kicker: 'Villager', title: 'Your voice is power', line: 'No special ability — but your questions and your vote find the wolves.', Scene: VillagerScene },
  { emoji: '🏆', color: '#f2d06b', kicker: 'Winning', title: 'Who wins?', line: 'The village wins when every werewolf is gone. The wolves win when they equal the villagers.' },
];

export function Tutorial({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState<Record<number, boolean>>({});
  const box = useRef<HTMLDivElement>(null);
  const s = STEPS[i];
  const last = i === STEPS.length - 1;
  const can = !s.Scene || ok[i];
  useEffect(() => { box.current?.focus(); }, [i]);
  const next = () => (last ? onDone() : setI(i + 1));
  const Scene = s.Scene;
  return (
    <div className={'tut' + (s.night ? ' is-night' : '')} role="dialog" aria-label="Moonfall tutorial">
      <div className="tut-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
            {STEPS.map((_, k) => <span key={k} style={{ flex: 1, height: '3px', borderRadius: '2px', background: k <= i ? '#e9dcff' : 'rgba(236,230,246,.18)', transition: 'background .3s' }} />)}
          </div>
          <button className="press tut-skip" onClick={onDone}>Skip</button>
        </div>
        <div key={i} ref={box} tabIndex={-1} className="tut-step" style={{ outline: 'none' }}>
          <span className="tut-emoji" style={{ textShadow: `0 0 34px ${s.color}` }}>{s.emoji}</span>
          <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: s.color }}>{s.kicker}</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '25px', lineHeight: 1.2, color: '#f6f1ff' }}>{s.title}</span>
          <span style={{ fontSize: '15.5px', lineHeight: 1.5, color: '#d9d0ea', maxWidth: '320px' }}>{s.line}</span>
          {Scene ? <div className="tut-scene"><Scene ok={!!ok[i]} done={() => setOk(o => ({ ...o, [i]: true }))} /></div> : null}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {i > 0 ? <button className="press" onClick={() => setI(i - 1)} aria-label="Back" style={{ flex: 'none', width: '52px', height: '52px', borderRadius: '16px', border: '1px solid rgba(199,168,255,.4)', background: 'rgba(255,255,255,.05)', color: '#e9dcff', fontSize: '18px' }}>‹</button> : null}
          <button className={'press' + (can ? ' tut-go' : '')} onClick={next} style={{ flex: 1, height: '52px', borderRadius: '16px', border: 'none', background: can ? '#e9dcff' : 'rgba(233,220,255,.18)', color: can ? '#160b28' : '#cfc6e0', fontSize: '16px', fontWeight: 800, fontFamily: 'inherit', transition: 'background .3s' }}>
            {last ? 'Let’s play 🌙' : i === 0 ? 'Show me' : can ? 'Next' : 'Try it, or tap Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
