import React, { useEffect, useRef, useState } from 'react';
import type { Recap } from '../recap';

/** The post-game recap, shown on every phone and the host's: one animated card at a time (tap to go on), ending
 *  with the Moonfall Moment of the Match. Moves on by itself every few seconds; × closes it. */
export function RecapView({ recap, onClose, title }: { recap: Recap; onClose: () => void; title?: string }) {
  const all = recap.cards.concat(recap.moment ? [recap.moment] : []);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const last = i >= all.length - 1;
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!paused && !last) timer.current = window.setTimeout(() => setI(x => Math.min(all.length - 1, x + 1)), 6500);
    return () => window.clearTimeout(timer.current);
  }, [i, paused, last, all.length]);
  if (!all.length) return null;
  const c = all[i];
  const isMoment = c.kind === 'moment';
  const go = (d: number) => setI(x => Math.max(0, Math.min(all.length - 1, x + d)));
  return (
    <div className="recap fade" role="dialog" aria-label={title || 'Match recap'} style={{ position: 'absolute', inset: 0, zIndex: 96, display: 'flex', flexDirection: 'column', padding: '22px 20px 26px', boxSizing: 'border-box', fontFamily: "'Manrope', sans-serif", color: '#f6f1ff', background: 'radial-gradient(120% 80% at 50% 10%, rgba(59,33,99,.97), rgba(10,6,18,.98) 70%)' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {all.map((_, k) => (
          <span key={k} style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'rgba(236,230,246,.18)', overflow: 'hidden' }}>
            <span className={k === i && !paused && !last ? 'recap-fill' : ''} style={{ display: 'block', height: '100%', width: k < i || (k === i && (paused || last)) ? '100%' : k === i ? undefined : '0%', background: '#e9dcff' }} />
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#c7a8ff' }}>✨ {title || 'Match recap'} · {i + 1}/{all.length}</span>
        <button className="press" onClick={onClose} aria-label="Close" style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.08)', color: '#e9dcff', fontSize: '20px' }}>×</button>
      </div>
      {/* tap the left third to go back, anywhere else to go on; hold to pause */}
      <div
        style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        onClick={e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); go(e.clientX - r.left < r.width / 3 ? -1 : 1); }}
        onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onPointerLeave={() => setPaused(false)} onPointerCancel={() => setPaused(false)}
      >
        {isMoment ? <div className="recap-rays" aria-hidden="true" /> : null}
        <section key={i} className={isMoment ? 'recap-card recap-moment' : 'recap-card'} style={{ position: 'relative', width: '100%', maxWidth: '330px', padding: '30px 22px 26px', boxSizing: 'border-box', borderRadius: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: `linear-gradient(165deg, ${c.color}33, rgba(18,10,31,.94) 62%)`, border: `1px solid ${c.color}99`, boxShadow: `0 0 70px ${c.color}40, 0 30px 80px rgba(0,0,0,.55)` }}>
          <span className="recap-emoji" style={{ fontSize: isMoment ? '64px' : '54px', lineHeight: 1 }}>{c.emoji}</span>
          {isMoment ? <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase', color: c.color }}>The most surprising moment</span> : null}
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: isMoment ? '25px' : '24px', lineHeight: 1.2, color: isMoment ? '#fff4d6' : '#f6f1ff', textShadow: `0 0 24px ${c.color}88` }}>{c.title}</span>
          {c.names.length ? (
            <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
              {c.names.map(nm => <span key={nm} className="recap-name" style={{ padding: '5px 12px', borderRadius: '999px', fontSize: '14.5px', fontWeight: 800, color: '#14091f', background: c.color }}>{nm}</span>)}
            </span>
          ) : null}
          <span style={{ fontSize: '15.5px', lineHeight: 1.5, color: '#ece4f8' }}>{c.line}</span>
          {c.punch ? <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '20px', color: c.color }}>“{c.punch}”</span> : null}
        </section>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {last ? (
          <>
            <button className="press" onClick={() => setI(0)} style={{ flex: 'none', height: '52px', padding: '0 18px', borderRadius: '16px', border: '1px solid rgba(199,168,255,.4)', background: 'rgba(255,255,255,.05)', color: '#e9dcff', fontSize: '15px', fontWeight: 700 }}>↺ Replay</button>
            <button className="press" onClick={onClose} style={{ flex: 1, height: '52px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '16px', fontWeight: 800 }}>Done</button>
          </>
        ) : (
          <button className="press" onClick={() => go(1)} style={{ flex: 1, height: '52px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '16px', fontWeight: 800 }}>{i === all.length - 2 && recap.moment ? '🌕 The Moment of the Match' : 'Next'}</button>
        )}
      </div>
    </div>
  );
}
