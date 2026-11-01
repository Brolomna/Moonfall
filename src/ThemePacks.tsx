// Theme packs (master host only): a picture for every role, each with its own crop on the card-shaped frame,
// saved as a named pack and applied to the room in one tap — every player's card then shows the pack's picture
// (a host's own picture on a hand-made role still wins). Packs are kept on this phone (the list in localStorage,
// the pictures in IndexedDB at full quality); applying one uploads any picture the room doesn't have yet.
// The server only accepts `themePack` from a host whose plan has the 'themePacks' feature.
import React, { useMemo, useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { ROLE_LIBRARY } from './views/roleLibrary';
import { CropEditor, CroppedImg } from './views/CropEditor';
import { prepareImage, uploadImage, keptImage, imgSrc, fitCrop, type ImgRef, type Crop } from './images';

type Pack = { id: string; name: string; roles: Record<string, ImgRef> };
const KEY = 'moonfall.themePacks';
const load = (): Pack[] => { try { const l = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } };
const save = (l: Pack[]) => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* full / private mode */ } };
/** Packs are keyed like the server looks them up: the built-in role key, else the library name. */
const ROLES = ROLE_LIBRARY.map(e => ({ key: e.builtin || e.name, name: e.name, color: e.color, cat: e.cat }));

const btn = (bg: string, fg: string): React.CSSProperties => ({ height: 40, padding: '0 14px', borderRadius: 12, border: 'none', background: bg, color: fg, fontSize: 14, fontWeight: 700, flex: 'none' });

export function ThemePacks({ room, password, applied, onApply, onClose }: { room: string; password: string; applied: any; onApply: (p: any) => void; onClose: () => void }) {
  const [packs, setPacks] = useState<Pack[]>(load);
  const [editId, setEditId] = useState<string | null>(null);
  const [roleKey, setRoleKey] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const put = (l: Pack[]) => { setPacks(l); save(l); };
  const pack = packs.find(p => p.id === editId) || null;
  const setPack = (p: Pack) => put(packs.map(x => (x.id === p.id ? p : x)));
  const src = (id: string) => imgSrc(room, id);
  const shown = useMemo(() => ROLES.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase())), [q]);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f || !pack) return;
    setBusy(key); setErr('');
    try {
      const p = await prepareImage(f);
      const id = await uploadImage(room, password, p.blob);
      setPack({ ...pack, roles: { ...pack.roles, [key]: { id, crop: fitCrop(p.w, p.h) } } });
      setRoleKey(key);
    } catch { setErr('That picture couldn’t be uploaded. Try again.'); } finally { setBusy(''); }
  };
  // make sure the room has every picture of the pack (it may have been made in another room, or the server restarted)
  const apply = async (p: Pack) => {
    setBusy('apply:' + p.id); setErr('');
    try {
      for (const ref of Object.values(p.roles)) {
        const ok = await fetch(src(ref.id), { method: 'HEAD' }).then(r => r.ok).catch(() => false);
        if (!ok) { const b = await keptImage(ref.id); if (b) await uploadImage(room, password, b); }
      }
      onApply({ id: p.id, name: p.name, roles: p.roles });
    } catch { setErr('Some pictures couldn’t be sent. Try again.'); } finally { setBusy(''); }
  };
  const isOn = (p: Pack) => !!applied && applied.id === p.id;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#0a0612' }}>
      <PhoneFrame>
        {frameH => (
          <div className="sky" style={{ height: frameH, display: 'flex', flexDirection: 'column', color: '#ece6f6', fontFamily: "'Manrope', sans-serif" }}>
            <header style={{ padding: '18px 20px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, flex: 1, fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 22, color: '#f2c38a' }}>🎨 {pack ? 'Edit pack' : 'Theme packs'}</h1>
              <button className="press" onClick={() => (roleKey ? setRoleKey(null) : pack ? setEditId(null) : onClose())} style={btn('rgba(255,255,255,.08)', '#ece6f6')}>{roleKey ? 'Done' : pack ? 'Back' : 'Close'}</button>
            </header>
            {err ? <p style={{ margin: '0 20px 8px', color: '#ffb3bf', fontSize: 13, fontWeight: 700 }}>{err}</p> : null}

            {!pack ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#c4b8da' }}>A pack gives every role its own picture on the players’ cards. Make one, fill in the roles you like, then apply it to this room. Packs are saved on this phone.</p>
                {applied ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, background: 'rgba(98,212,166,.1)', border: '1px solid rgba(98,212,166,.4)' }}>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>In use: {applied.name}</span>
                    <button className="press" onClick={() => onApply(null)} style={btn('rgba(255,255,255,.08)', '#ece6f6')}>Turn off</button>
                  </div>
                ) : null}
                {packs.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 16, background: 'rgba(22,13,38,.8)', border: `1px solid ${isOn(p) ? 'rgba(98,212,166,.5)' : 'rgba(236,230,246,.1)'}` }}>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || 'Untitled pack'}</span>
                      <span style={{ fontSize: 12, color: '#a99bc2' }}>{Object.keys(p.roles).length} / {ROLES.length} roles</span>
                    </span>
                    <button className="press" onClick={() => setEditId(p.id)} style={btn('rgba(255,255,255,.08)', '#ece6f6')}>Edit</button>
                    <button className="press" disabled={!!busy || !Object.keys(p.roles).length} onClick={() => apply(p)} style={{ ...btn(isOn(p) ? '#62d4a6' : '#f2c38a', '#1d1206'), opacity: busy || !Object.keys(p.roles).length ? 0.5 : 1 }}>{busy === 'apply:' + p.id ? '…' : isOn(p) ? 'Update' : 'Apply'}</button>
                  </div>
                ))}
                <button className="press" onClick={() => { const p = { id: 'p' + Date.now().toString(36), name: 'New pack', roles: {} }; put(packs.concat([p])); setEditId(p.id); }} style={{ ...btn('#e9dcff', '#160b28'), height: 48 }}>＋ New pack</button>
              </div>
            ) : roleKey ? (
              // one role's picture: crop it on the card-shaped frame
              (() => {
                const r = ROLES.find(x => x.key === roleKey)!, ref = pack.roles[roleKey];
                return (
                  <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: r.color }}>{r.name}</span>
                    {ref && ref.crop ? <CropEditor src={src(ref.id)} crop={ref.crop} onChange={(c: Crop) => setPack({ ...pack, roles: { ...pack.roles, [roleKey]: { ...ref, crop: c } } })} /> : null}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <label className="press" style={{ ...btn('rgba(167,127,240,.2)', '#e9dcff'), display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        {busy === roleKey ? 'Uploading…' : 'Change picture'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => pick(e, roleKey)} />
                      </label>
                      <button className="press" onClick={() => { const nx = { ...pack.roles }; delete nx[roleKey]; setPack({ ...pack, roles: nx }); setRoleKey(null); }} style={btn('rgba(224,71,95,.14)', '#ffb3bf')}>Remove</button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input aria-label="Pack name" value={pack.name} maxLength={40} onChange={e => setPack({ ...pack, name: e.target.value })} style={{ height: 46, padding: '0 14px', borderRadius: 14, border: '1px solid rgba(242,195,138,.4)', background: 'rgba(20,12,34,.7)', color: '#fff3e2', fontSize: 17, fontWeight: 700 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input aria-label="Find a role" placeholder="Find a role" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, height: 40, padding: '0 12px', borderRadius: 12, border: '1px solid rgba(236,230,246,.16)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: 14 }} />
                  <button className="press" onClick={() => { if (window.confirm('Delete the pack “' + pack.name + '”?')) { put(packs.filter(p => p.id !== pack.id)); setEditId(null); } }} style={btn('rgba(224,71,95,.14)', '#ffb3bf')}>Delete pack</button>
                </div>
                <span style={{ fontSize: 12.5, color: '#a99bc2' }}>{Object.keys(pack.roles).length} / {ROLES.length} roles have a picture. Tap a role to add or crop its picture.</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                  {shown.map(r => {
                    const ref = pack.roles[r.key];
                    return (
                      <label key={r.key} className="press" onClick={ref ? (e) => { e.preventDefault(); setRoleKey(r.key); } : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
                        <span style={{ position: 'relative', width: '100%', aspectRatio: '326 / 520', borderRadius: 10, overflow: 'hidden', border: `1px solid ${ref ? r.color : 'rgba(236,230,246,.14)'}`, background: 'rgba(10,6,18,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.color, fontSize: 20, fontFamily: "'Cinzel', serif" }}>
                          {ref ? <CroppedImg src={src(ref.id)} crop={ref.crop} /> : busy === r.key ? '…' : '＋'}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2, color: ref ? '#ece6f6' : '#a99bc2', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        {!ref ? <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => pick(e, r.key)} /> : null}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}
