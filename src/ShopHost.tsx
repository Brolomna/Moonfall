// The host's shop (🛍 in the header, on every screen): make and edit items, open the shop to players, see everyone's
// points and bag, give or buy items for them, and see who used what. Kept on this phone (src/shop.ts).
import React, { useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { type ShopData, type Item, type ItemKind, PTS_PER_WIN, earned, points, buy, remove, newId } from './shop';

const C = { ink: '#ece6f6', dim: '#a99bc2', soft: '#c4b8da', line: 'rgba(236,230,246,.1)', panel: 'rgba(22,13,38,.8)', mint: '#8fe0b8', gold: '#f2d06b' };
const btn = (bg: string, fg: string, extra?: React.CSSProperties): React.CSSProperties => ({ height: 40, padding: '0 14px', borderRadius: 12, border: 'none', background: bg, color: fg, fontSize: 14, fontWeight: 700, flex: 'none', ...extra });
const field: React.CSSProperties = { height: 44, padding: '0 12px', borderRadius: 12, border: '1px solid rgba(236,230,246,.16)', background: 'rgba(10,6,18,.6)', color: C.ink, fontSize: 15, boxSizing: 'border-box', minWidth: 0 };
const KIND: Record<ItemKind, [string, string]> = { artifact: ['Artifact', 'kept for good · once per game'], powerup: ['Power-up', 'used up when used'] };

type Props = { shop: ShopData; setShop: (d: ShopData) => void; players: string[]; inGame: boolean; onClose: () => void };

export function ShopHost({ shop, setShop, players, inGame, onClose }: Props) {
  const [tab, setTab] = useState<'players' | 'items' | 'uses'>('players');
  const [edit, setEdit] = useState<Item | null>(null);
  const [row, setRow] = useState<string | null>(null);
  const [give, setGive] = useState('');
  const [msg, setMsg] = useState('');
  const say = (t: string) => { setMsg(t); window.setTimeout(() => setMsg(''), 2600); };
  const isOpen = (nm: string) => shop.all || shop.open.includes(nm);
  const toggleOpen = (nm: string) => setShop({ ...shop, open: shop.open.includes(nm) ? shop.open.filter(x => x !== nm) : shop.open.concat([nm]) });
  const saveItem = (it: Item) => {
    const clean = { ...it, name: it.name.trim() || 'New item', icon: (it.icon || '🎁').trim().slice(0, 4), price: Math.max(0, Math.min(9999, Math.round(Number(it.price) || 0))), desc: it.desc.trim() };
    setShop({ ...shop, items: shop.items.some(x => x.id === it.id) ? shop.items.map(x => (x.id === it.id ? clean : x)) : shop.items.concat([clean]) });
    setEdit(null); say('Saved “' + clean.name + '”');
  };
  const delItem = (id: string) => { setShop({ ...shop, items: shop.items.filter(x => x.id !== id) }); setEdit(null); };
  const giveTo = (nm: string, gift: boolean) => {
    if (!give) return;
    const n = buy(shop, nm, give, gift);
    if (!n) { say(nm + ' doesn’t have enough points'); return; }
    setShop(n); say((gift ? 'Gave ' : 'Bought ') + (shop.items.find(x => x.id === give) || { name: '' }).name + (gift ? ' to ' : ' for ') + nm);
  };
  const tabs: [typeof tab, string][] = [['players', 'Players'], ['items', 'Items'], ['uses', 'Used' + (shop.uses.length ? ' (' + shop.uses.length + ')' : '')]];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#0a0612' }}>
      <PhoneFrame>
        {frameH => (
          <div className="sky" style={{ position: 'relative', height: frameH, display: 'flex', flexDirection: 'column', color: C.ink, fontFamily: "'Manrope', sans-serif", background: 'radial-gradient(120% 70% at 80% 6%, #1f3b33 0%, #13101f 45%, #0a0612 80%)' }}>
            <div style={{ padding: '54px 20px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 24, flex: 1 }}>🛍 Shop</span>
                <button className="press" onClick={onClose} style={btn('rgba(255,255,255,.08)', C.ink)}>Done</button>
              </div>
              <span style={{ fontSize: 12.5, lineHeight: 1.45, color: C.soft }}>
                Players earn {PTS_PER_WIN} points for every win in the Hall of Fame and spend them on items. Only you see the shop until you open it to a player.
                Items are used from the player’s phone during a game; you get a notice and apply the effect.
              </span>
              <div role="tablist" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(10,6,18,.6)' }}>
                {tabs.map(([k, l]) => (
                  <button key={k} role="tab" aria-selected={tab === k} className="press" onClick={() => setTab(k)} style={{ height: 38, borderRadius: 10, border: 'none', background: tab === k ? '#e9dcff' : 'transparent', color: tab === k ? '#160b28' : C.soft, fontSize: 14, fontWeight: 700 }}>{l}</button>
                ))}
              </div>
            </div>

            <div className="scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tab === 'players' ? (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 16, background: C.panel, border: '1px solid ' + C.line }}>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontWeight: 700 }}>Open the shop to everyone</span>
                      <span style={{ fontSize: 12.5, color: C.dim }}>Or open it to single players below.</span>
                    </span>
                    <input type="checkbox" checked={shop.all} onChange={() => setShop({ ...shop, all: !shop.all })} style={{ width: 22, height: 22 }} />
                  </label>
                  {!players.length ? <span style={{ color: C.dim, fontSize: 14, padding: '10px 0' }}>No players in the room yet.</span> : null}
                  {players.map(nm => {
                    const inv = shop.inv[nm] || [], open = row === nm;
                    return (
                      <div key={nm} style={{ borderRadius: 16, background: C.panel, border: '1px solid ' + (isOpen(nm) ? 'rgba(143,224,184,.4)' : C.line) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
                          <button className="press" onClick={() => setRow(open ? null : nm)} aria-expanded={open} style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', color: C.ink, textAlign: 'left', padding: 0 }}>
                            <span style={{ display: 'block', fontWeight: 700, fontSize: 15.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nm}</span>
                            <span style={{ fontSize: 12.5, color: C.dim }}>{points(shop, nm)} pts · {inv.length} item{inv.length === 1 ? '' : 's'} {open ? '▲' : '▼'}</span>
                          </button>
                          <button className="press" disabled={shop.all} onClick={() => toggleOpen(nm)} aria-pressed={isOpen(nm)} style={btn(isOpen(nm) ? 'rgba(143,224,184,.22)' : 'rgba(255,255,255,.06)', isOpen(nm) ? C.mint : C.soft, { height: 34, fontSize: 12.5, opacity: shop.all ? .6 : 1 })}>
                            {isOpen(nm) ? '🛍 Shop open' : 'Open shop'}
                          </button>
                        </div>
                        {open ? (
                          <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontSize: 12.5, color: C.dim }}>Earned {earned(nm)} · spent {shop.spent[nm] || 0}</span>
                            {inv.length ? inv.map(o => (
                              <div key={o.uid} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                                <span style={{ fontSize: 18 }}>{o.icon}</span>
                                <span style={{ flex: 1, minWidth: 0 }}>{o.name}<span style={{ color: C.dim, fontSize: 12 }}> · {o.kind === 'artifact' ? 'artifact' : o.used ? 'used' : 'power-up'}{o.gift ? ' · gift' : ''}</span></span>
                                <button className="press" onClick={() => setShop(remove(shop, nm, o.uid))} aria-label={'Take ' + o.name + ' back'} style={btn('rgba(255,255,255,.06)', C.soft, { height: 30, padding: '0 10px', fontSize: 12 })}>Remove</button>
                              </div>
                            )) : <span style={{ fontSize: 13, color: C.dim }}>Nothing in their bag yet.</span>}
                            <div style={{ display: 'flex', gap: 6 }}>
                              <select value={give} onChange={e => setGive(e.target.value)} aria-label="Item" style={{ ...field, flex: 1, height: 40 }}>
                                <option value="">Choose an item…</option>
                                {shop.items.map(it => <option key={it.id} value={it.id}>{it.icon} {it.name} · {it.price} pts</option>)}
                              </select>
                              <button className="press" disabled={!give} onClick={() => giveTo(nm, false)} style={btn('rgba(143,224,184,.2)', C.mint, { opacity: give ? 1 : .5 })}>Buy</button>
                              <button className="press" disabled={!give} onClick={() => giveTo(nm, true)} style={btn('rgba(242,208,107,.18)', C.gold, { opacity: give ? 1 : .5 })}>Gift</button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </>
              ) : null}

              {tab === 'items' ? (
                <>
                  {edit ? <ItemForm item={edit} onSave={saveItem} onCancel={() => setEdit(null)} onDelete={shop.items.some(x => x.id === edit.id) ? () => delItem(edit.id) : undefined} /> : (
                    <button className="press" onClick={() => setEdit({ id: newId(), name: '', kind: 'powerup', icon: '🎁', price: 10, desc: '' })} style={{ height: 52, borderRadius: 16, border: '1px dashed rgba(143,224,184,.5)', background: 'rgba(143,224,184,.07)', color: C.mint, fontSize: 15, fontWeight: 700 }}>+ Create an item</button>
                  )}
                  {shop.items.map(it => (
                    <button key={it.id} className="press" onClick={() => setEdit(it)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: C.panel, border: '1px solid ' + (edit && edit.id === it.id ? C.mint : C.line), color: C.ink, textAlign: 'left' }}>
                      <span style={{ fontSize: 26, width: 34, textAlign: 'center' }}>{it.icon}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 700 }}>{it.name} <span style={{ fontSize: 11.5, fontWeight: 800, color: it.kind === 'artifact' ? C.gold : C.mint }}>{KIND[it.kind][0].toUpperCase()}</span></span>
                        <span style={{ display: 'block', fontSize: 12.5, color: C.soft, lineHeight: 1.4 }}>{it.desc}</span>
                      </span>
                      <span style={{ fontWeight: 800, color: C.gold }}>{it.price}</span>
                    </button>
                  ))}
                </>
              ) : null}

              {tab === 'uses' ? (
                shop.uses.length ? shop.uses.slice().reverse().map((u, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 16, background: C.panel, border: '1px solid ' + C.line, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontWeight: 700 }}>{u.icon} {u.name} used {u.item}</span>
                    <span style={{ fontSize: 12.5, color: C.soft }}>{u.desc}</span>
                    <span style={{ fontSize: 11.5, color: C.dim }}>{new Date(u.at).toLocaleString()}</span>
                  </div>
                )) : <span style={{ color: C.dim, fontSize: 14, padding: '10px 0' }}>Nobody has used an item yet.{inGame ? '' : ' Items can be used during a game.'}</span>
              ) : null}
            </div>
            {msg ? <div className="fade" role="status" style={{ position: 'absolute', left: 20, right: 20, bottom: 24, padding: '12px 14px', borderRadius: 14, background: '#e9dcff', color: '#160b28', fontWeight: 700, textAlign: 'center' }}>{msg}</div> : null}
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}

function ItemForm({ item, onSave, onCancel, onDelete }: { item: Item; onSave: (it: Item) => void; onCancel: () => void; onDelete?: () => void }) {
  const [d, setD] = useState<Item>(item);
  const [sure, setSure] = useState(false);
  const set = (p: Partial<Item>) => setD({ ...d, ...p });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(d); }} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 18, background: 'rgba(143,224,184,.07)', border: '1px solid rgba(143,224,184,.4)' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={d.icon} onChange={e => set({ icon: e.target.value })} aria-label="Icon (emoji)" maxLength={4} style={{ ...field, width: 56, textAlign: 'center', fontSize: 22 }} />
        <input value={d.name} onChange={e => set({ name: e.target.value })} placeholder="Item name" aria-label="Item name" maxLength={40} style={{ ...field, flex: 1 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {(['artifact', 'powerup'] as ItemKind[]).map(k => (
          <button key={k} type="button" className="press" onClick={() => set({ kind: k })} aria-pressed={d.kind === k} style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid ' + (d.kind === k ? '#e9dcff' : 'rgba(236,230,246,.14)'), background: d.kind === k ? 'rgba(233,220,255,.14)' : 'transparent', color: C.ink, textAlign: 'left' }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>{KIND[k][0]}</span>
            <span style={{ fontSize: 11.5, color: C.dim }}>{KIND[k][1]}</span>
          </button>
        ))}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.soft }}>
        Price
        <input type="number" inputMode="numeric" min={0} max={9999} value={d.price} onChange={e => set({ price: Number(e.target.value) })} aria-label="Price in points" style={{ ...field, width: 100 }} />
        points
      </label>
      <textarea value={d.desc} onChange={e => set({ desc: e.target.value })} placeholder="What it does (you apply it when it’s used)" aria-label="What it does" maxLength={200} rows={3} style={{ ...field, height: 'auto', padding: '10px 12px', resize: 'none', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" className="press" style={btn('#e9dcff', '#160b28', { flex: 1 })}>Save</button>
        <button type="button" className="press" onClick={onCancel} style={btn('rgba(255,255,255,.06)', C.ink)}>Cancel</button>
        {onDelete ? <button type="button" className="press" onClick={() => (sure ? onDelete() : setSure(true))} style={btn(sure ? 'rgba(255,111,97,.35)' : 'rgba(255,255,255,.06)', '#ffb3a8')}>{sure ? 'Tap to delete' : 'Delete'}</button> : null}
      </div>
    </form>
  );
}

/** The notice the host gets when a player uses an item (stays until the host taps OK). */
export function UseNotice({ use, onOk }: { use: { name: string; item: string; icon: string; desc: string }; onOk: () => void }) {
  return (
    <div className="fade" role="alertdialog" aria-label="Item used" style={{ position: 'absolute', inset: 0, zIndex: 400, background: 'rgba(5,3,10,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Manrope', sans-serif" }}>
      <section style={{ width: '100%', padding: '24px 20px', borderRadius: 24, background: 'linear-gradient(180deg, #1f3b33, #13101f)', border: '1px solid rgba(143,224,184,.5)', color: C.ink, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
        <span style={{ fontSize: 44 }}>{use.icon}</span>
        <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.18em', color: C.mint }}>ITEM USED · ONLY YOU SEE THIS</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 22 }}>{use.name} used {use.item}</span>
        <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.soft }}>{use.desc}</span>
        <button className="press" onClick={onOk} style={btn('#e9dcff', '#160b28', { height: 50, marginTop: 6 })}>OK</button>
      </section>
    </div>
  );
}
