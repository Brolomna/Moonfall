// Player phone extras, drawn over PlayerView:
//  • the werewolves' bluff pick — while the pack is awake on the first night a sheet opens with the host's bluff roles;
//    each wolf picks one and sees their teammates' picks. Afterwards a small "🎭" button shows them again.
//    Only wolves ever get this (server `bluffView`), so nothing tells anyone else which roles are bluffs.
//  • the items bag 🎒 (and the shop, if the host opened it to this player): points, owned items, "Use item" during a game.
import React, { useEffect, useRef, useState } from 'react';
import { shopText } from './i18n/shop';

type Owned = { uid: string; name: string; kind: 'artifact' | 'powerup'; icon: string; desc: string; usable?: boolean; used?: number; usedIn?: string };
type Item = { id: string; name: string; kind: 'artifact' | 'powerup'; icon: string; price: number; desc: string };
type Props = {
  lang: string; font: string; fontD: string;
  role: (k: string) => { name: string; color: string; icon: string; rgb?: string };
  bluff: null | { open: boolean; roles: string[]; mine: string | null; pack: { name: string; key: string | null }[] };
  shop: null | { open: boolean; pts: number; inv: Owned[]; items: Item[]; inGame: boolean };
  onBluff: (key: string | null) => void;
  onBuy: (id: string) => Promise<{ ok?: boolean; error?: string }>;
  onUse: (uid: string) => Promise<{ ok?: boolean; error?: string }>;
};

const ink = '#ece6f6', dim = '#a99bc2', soft = '#c4b8da';
const pill: React.CSSProperties = { height: 34, padding: '0 12px', borderRadius: 999, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(6px)' };

export function PlayerExtras({ lang, font, fontD, role, bluff, shop, onBluff, onBuy, onUse }: Props) {
  const T = shopText(lang);
  const [bluffSheet, setBluffSheet] = useState(false);
  const [bagSheet, setBagSheet] = useState<null | 'bag' | 'shop'>(null);
  const [ask, setAsk] = useState<Owned | null>(null);
  const [toast, setToast] = useState('');
  const toastT = useRef<number | undefined>(undefined);
  const say = (t: string) => { setToast(t); window.clearTimeout(toastT.current); toastT.current = window.setTimeout(() => setToast(''), 2800); };
  // the pick opens by itself when the host calls the werewolves on the first night
  const wasOpen = useRef(false);
  useEffect(() => { const o = !!(bluff && bluff.open); if (o && !wasOpen.current) setBluffSheet(true); wasOpen.current = o; }, [bluff && bluff.open]);
  const ack = (r: { ok?: boolean; error?: string }, ok: string) => say(r.ok ? ok : r.error === 'host' ? T.hostAway : T.notEnough);

  const showBluff = !!bluff && bluff.roles.length > 0;
  const showBag = !!shop;
  if (!showBluff && !showBag) return null;
  const mine = bluff && bluff.mine ? role(bluff.mine) : null;

  return (
    <>
      <div style={{ position: 'absolute', right: 16, top: 104, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, fontFamily: font }}>
        {showBluff ? (
          <button className="press" onClick={() => setBluffSheet(true)} aria-label={T.bluffTitle} style={{ ...pill, border: '1px solid rgba(255,138,155,.5)', background: bluff!.open ? 'rgba(224,71,95,.45)' : 'rgba(20,12,34,.7)', color: '#ffd0d6' }}>
            🎭 {mine ? mine.name : T.bluffBtn}
          </button>
        ) : null}
        {showBag ? (
          <button className="press" onClick={() => setBagSheet('bag')} aria-label={T.bagTitle} style={{ ...pill, border: '1px solid rgba(143,224,184,.45)', background: 'rgba(20,12,34,.7)', color: '#c8f5df' }}>
            🎒 {T.bag}{shop!.inv.filter(o => o.usable).length ? ' ' + shop!.inv.filter(o => o.usable).length : ''}{shop!.open ? ' · 🛍' : ''}
          </button>
        ) : null}
      </div>

      {bluffSheet && showBluff ? (
        <Sheet onClose={() => setBluffSheet(false)} font={font} label={T.bluffTitle} tint="rgba(224,71,95,.45)">
          <span style={{ fontFamily: fontD, fontWeight: 700, fontSize: 22, color: '#ffd0d6' }}>🎭 {bluff!.open ? T.bluffTitle : T.bluffMine}</span>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: soft }}>{bluff!.open ? T.bluffSub : T.bluffClosed}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bluff!.roles.map(k => {
              const r = role(k), on = bluff!.mine === k, taken = bluff!.pack.filter(p => p.key === k).map(p => p.name);
              return (
                <button key={k} className="press" disabled={!bluff!.open} onClick={() => onBluff(on ? null : k)} aria-pressed={on}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, textAlign: 'left', color: ink, border: '1px solid ' + (on ? r.color : 'rgba(236,230,246,.12)'), background: on ? 'rgba(' + (r.rgb || '199,168,255') + ',.2)' : 'rgba(10,6,18,.55)', opacity: bluff!.open || on ? 1 : .55 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.icon} /></svg>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 800, fontSize: 16 }}>{r.name}</span>
                    {taken.length ? <span style={{ fontSize: 12.5, color: '#ffb3bf' }}>🐺 {taken.join(', ')}</span> : null}
                  </span>
                  {on ? <span style={{ fontWeight: 800, color: r.color }}>✓</span> : null}
                </button>
              );
            })}
          </div>
          {bluff!.pack.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', borderRadius: 14, background: 'rgba(224,71,95,.1)', border: '1px solid rgba(255,138,155,.25)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#ff8a9b' }}>{T.bluffPack}</span>
              {bluff!.pack.map(p => (
                <span key={p.name} style={{ display: 'flex', fontSize: 14.5 }}>
                  <span style={{ flex: 1, fontWeight: 700 }}>{p.name}</span>
                  <span style={{ color: p.key ? role(p.key).color : dim, fontWeight: 700 }}>{p.key ? role(p.key).name : T.bluffNone}</span>
                </span>
              ))}
            </div>
          ) : null}
        </Sheet>
      ) : null}

      {bagSheet && showBag ? (
        <Sheet onClose={() => { setBagSheet(null); setAsk(null); }} font={font} label={T.bagTitle} tint="rgba(143,224,184,.45)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, fontFamily: fontD, fontWeight: 700, fontSize: 22, color: '#c8f5df' }}>{bagSheet === 'shop' ? '🛍 ' + T.shop : '🎒 ' + T.bagTitle}</span>
            <span style={{ marginRight: 44, padding: '4px 10px', borderRadius: 999, background: 'rgba(242,208,107,.16)', color: '#f2d06b', fontWeight: 800, fontSize: 14 }}>{T.pts.replace('{n}', String(shop!.pts))}</span>
          </div>
          {shop!.open ? (
            <div role="tablist" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(10,6,18,.6)' }}>
              {(['bag', 'shop'] as const).map(k => (
                <button key={k} role="tab" aria-selected={bagSheet === k} className="press" onClick={() => setBagSheet(k)} style={{ height: 38, borderRadius: 10, border: 'none', background: bagSheet === k ? '#e9dcff' : 'transparent', color: bagSheet === k ? '#160b28' : soft, fontSize: 14, fontWeight: 700 }}>{k === 'bag' ? T.bag : T.shop}</button>
              ))}
            </div>
          ) : null}
          {bagSheet === 'bag' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!shop!.inv.length ? <span style={{ color: dim, fontSize: 14 }}>{T.empty}</span> : null}
              {shop!.inv.slice().reverse().map(o => (
                <div key={o.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: 'rgba(10,6,18,.55)', border: '1px solid rgba(236,230,246,.1)', opacity: o.usable || !shop!.inGame ? 1 : .6 }}>
                  <span style={{ fontSize: 28, width: 36, textAlign: 'center' }}>{o.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 800 }}>{o.name}</span>
                    <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: o.kind === 'artifact' ? '#f2d06b' : '#8fe0b8' }}>{o.kind === 'artifact' ? T.artifact : T.powerup}</span>
                    <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.4, color: soft }}>{o.desc}</span>
                  </span>
                  {shop!.inGame ? (
                    o.usable
                      ? <button className="press" onClick={() => setAsk(o)} style={{ flex: 'none', height: 38, padding: '0 12px', borderRadius: 12, border: 'none', background: '#8fe0b8', color: '#0d2a20', fontSize: 13, fontWeight: 800 }}>{T.use}</button>
                      : <span style={{ flex: 'none', fontSize: 12, color: dim }}>{o.kind === 'artifact' ? T.usedGame : T.used}</span>
                  ) : null}
                </div>
              ))}
              {shop!.inv.length && !shop!.inGame ? <span style={{ fontSize: 12.5, color: dim }}>{T.onlyInGame}</span> : null}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {shop!.items.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: 'rgba(10,6,18,.55)', border: '1px solid rgba(236,230,246,.1)' }}>
                  <span style={{ fontSize: 28, width: 36, textAlign: 'center' }}>{it.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 800 }}>{it.name}</span>
                    <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: it.kind === 'artifact' ? '#f2d06b' : '#8fe0b8' }}>{it.kind === 'artifact' ? T.artifact : T.powerup}</span>
                    <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.4, color: soft }}>{it.desc}</span>
                  </span>
                  <button className="press" disabled={shop!.pts < it.price} onClick={() => onBuy(it.id).then(r => ack(r, T.bought))}
                    style={{ flex: 'none', height: 38, padding: '0 10px', borderRadius: 12, border: 'none', background: shop!.pts >= it.price ? '#f2d06b' : 'rgba(255,255,255,.08)', color: shop!.pts >= it.price ? '#241a05' : dim, fontSize: 12.5, fontWeight: 800 }}>
                    {T.buy.replace('{n}', String(it.price))}
                  </button>
                </div>
              ))}
            </div>
          )}
          {ask ? (
            <div className="fade" style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(5,3,10,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <div style={{ width: '100%', padding: '22px 18px', borderRadius: 22, background: '#1b1230', border: '1px solid rgba(143,224,184,.45)', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
                <span style={{ fontSize: 42 }}>{ask.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45 }}>{T.confirmUse.replace('{item}', ask.name)}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="press" onClick={() => setAsk(null)} style={{ flex: 1, height: 48, borderRadius: 14, border: '1px solid rgba(236,230,246,.2)', background: 'none', color: ink, fontSize: 15, fontWeight: 700 }}>{T.cancel}</button>
                  <button className="press" onClick={() => { const o = ask; setAsk(null); onUse(o.uid).then(r => ack(r, T.sent)); }} style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', background: '#8fe0b8', color: '#0d2a20', fontSize: 15, fontWeight: 800 }}>{T.yes}</button>
                </div>
              </div>
            </div>
          ) : null}
        </Sheet>
      ) : null}

      {toast ? <div className="fade" role="status" style={{ position: 'absolute', left: 20, right: 20, bottom: 30, zIndex: 120, padding: '12px 14px', borderRadius: 14, background: '#e9dcff', color: '#160b28', fontWeight: 700, textAlign: 'center', fontFamily: font }}>{toast}</div> : null}
    </>
  );
}

function Sheet({ children, onClose, font, label, tint }: { children: React.ReactNode; onClose: () => void; font: string; label: string; tint: string }) {
  const T = { close: '×' };
  return (
    <div className="fade" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 110, background: 'rgba(5,3,10,.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end', fontFamily: font }}>
      <section className="sheet" role="dialog" aria-label={label} onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxHeight: '86%', overflowY: 'auto', padding: '18px 20px 28px', boxSizing: 'border-box', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #23143a 0%, #120a20 80%)', borderTop: '1px solid ' + tint, display: 'flex', flexDirection: 'column', gap: 12, color: ink }}>
        <button className="press" onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 14, top: 12, width: 38, height: 38, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,.08)', color: ink, fontSize: 20 }}>{T.close}</button>
        {children}
      </section>
    </div>
  );
}
