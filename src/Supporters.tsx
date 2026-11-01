// The supporters' thank-you banner: a thin strip at the very bottom of every screen (host and players) where the
// names scroll by. It never covers anything — the phone frame is made that much shorter (useBannerHeight) and the
// strip lets taps through. It sits outside the screens, so moving between screens doesn't restart it, and its
// position comes from the clock, so even a reload picks the scroll up where it was. The host edits the names
// (Players screen → Supporters); they are shared as `supporters`.
import React, { useEffect, useMemo, useState } from 'react';

export const BANNER_H = 26;
let height = 0;
const subs = new Set<(h: number) => void>();
const setHeight = (h: number) => { if (h === height) return; height = h; subs.forEach(f => f(h)); };
/** How much room the banner takes at the bottom of the window (0 when there are no names). */
export function useBannerHeight() {
  const [h, setH] = useState(height);
  useEffect(() => { subs.add(setH); setH(height); return () => { subs.delete(setH); }; }, []);
  return h;
}

export function SupporterBanner({ names, label = 'Thank you to our supporters' }: { names: string[]; label?: string }) {
  const list = (names || []).map(n => String(n).trim()).filter(Boolean);
  const on = list.length > 0;
  useEffect(() => { setHeight(on ? BANNER_H : 0); return () => setHeight(0); }, [on]);
  const text = '♥ ' + label + ': ' + list.join('  ·  ') + '  ✦  ';
  const dur = Math.max(40, text.length * 0.88); // seconds for one pass, about the same speed whatever the length
  const delay = useMemo(() => -((Date.now() / 1000) % dur), [dur]); // where the clock says the scroll is (set once per text)
  if (!on) return null;
  return (
    <div className="supporters" aria-label={label + ': ' + list.join(', ')} role="marquee" style={{ height: BANNER_H }}>
      <div className="supporters-track" style={{ animationDuration: dur + 's', animationDelay: delay + 's' }}>
        <span>{text.repeat(4)}</span><span aria-hidden="true">{text.repeat(4)}</span>
      </div>
    </div>
  );
}

/** The host's list: add, edit, remove at any time (every phone updates live). */
export function SupportersEditor({ names, onChange, onClose }: { names: string[]; onChange: (n: string[]) => void; onClose: () => void }) {
  const [add, setAdd] = useState('');
  const list = names || [];
  const field: React.CSSProperties = { flex: 1, minWidth: 0, height: 42, padding: '0 12px', borderRadius: 12, border: '1px solid rgba(236,230,246,.16)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: 14, fontFamily: 'inherit' };
  const btn: React.CSSProperties = { height: 42, padding: '0 14px', flex: 'none', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700 };
  return (
    <>
      <div className="fade" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(5,3,10,.7)', backdropFilter: 'blur(3px)' }} />
      <section className="sheet" aria-label="Supporters" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41, maxHeight: '80%', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #2a1846 0%, #120a20 100%)', borderTop: '1px solid rgba(240,143,184,.45)', display: 'flex', flexDirection: 'column', fontFamily: "'Manrope', sans-serif", color: '#ece6f6' }}>
        <div style={{ padding: '18px 20px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 22, color: '#ffc4dc' }}>♥ Supporters</h2>
          <span style={{ fontSize: 13, color: '#c4b8da', lineHeight: 1.45 }}>Their names scroll along the bottom of every phone in this room. Changes show up right away.</span>
        </div>
        <div style={{ overflowY: 'auto', padding: '6px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input aria-label={'Supporter ' + (i + 1)} value={n} maxLength={40} onChange={e => onChange(list.map((x, j) => (j === i ? e.target.value : x)))} onBlur={() => onChange(list.map(x => x.trim()).filter(Boolean))} style={field} />
              <button className="press" aria-label={'Remove ' + n} onClick={() => onChange(list.filter((_, j) => j !== i))} style={{ ...btn, background: 'rgba(224,71,95,.14)', color: '#ffb3bf' }}>✕</button>
            </div>
          ))}
          {!list.length ? <span style={{ fontSize: 13, color: '#a99bc2' }}>No names yet — the banner is hidden.</span> : null}
          <form onSubmit={e => { e.preventDefault(); const t = add.trim(); if (t) { onChange(list.concat([t]).slice(0, 100)); setAdd(''); } }} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <input aria-label="New supporter" placeholder="Add a name" value={add} maxLength={40} onChange={e => setAdd(e.target.value)} style={field} />
            <button type="submit" className="press" disabled={!add.trim()} style={{ ...btn, background: '#ffc4dc', color: '#2a0d1c', opacity: add.trim() ? 1 : 0.45 }}>Add</button>
          </form>
        </div>
        <div style={{ padding: '12px 20px 28px' }}>
          <button className="press" onClick={onClose} style={{ width: '100%', height: 50, borderRadius: 16, border: 'none', background: '#e9dcff', color: '#160b28', fontSize: 16, fontWeight: 700 }}>Done</button>
        </div>
      </section>
    </>
  );
}
