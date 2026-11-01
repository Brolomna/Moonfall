// The picture crop for a role card: a fixed frame with the card's own shape and a dotted guide (card edge, the
// inner frame, and where the name and text sit). Drag to move, pinch / slider / wheel to zoom. Nothing is cut:
// the crop is saved as numbers (see src/images.ts) and every phone draws it the same way.
import React, { useRef } from 'react';
import { CARD_W, CARD_H, clampCrop, cropStyle, type Crop } from '../images';

const BOX_W = 240, BOX_H = Math.round(BOX_W * CARD_H / CARD_W);

export function CropEditor({ src, crop, onChange }: { src: string; crop: Crop; onChange: (c: Crop) => void }) {
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{ crop: Crop; d: number } | null>(null);
  const c = clampCrop(crop);
  const k = CARD_W / BOX_W; // card px per screen px (before the phone frame's own scaling)
  const drawn = () => { const s0 = Math.max(CARD_W / c.w, CARD_H / c.h) * c.z; return { dw: c.w * s0, dh: c.h * s0 }; };
  const dist = () => { const [a, b] = [...pts.current.values()]; return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0; };
  // the phone frame is CSS-scaled: turn screen pixels into the box's own pixels
  const unscale = (el: HTMLElement) => el.getBoundingClientRect().width / BOX_W || 1;

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    start.current = { crop: c, d: dist() };
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pts.current.get(e.pointerId); if (!p || !start.current) return;
    const u = unscale(e.currentTarget);
    if (pts.current.size >= 2) { // pinch
      pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const d = dist(); if (start.current.d > 0) onChange(clampCrop({ ...c, z: start.current.crop.z * d / start.current.d }));
      return;
    }
    const dx = (e.clientX - p.x) / u * k, dy = (e.clientY - p.y) / u * k;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const { dw, dh } = drawn();
    onChange(clampCrop({ ...c, x: c.x - dx / dw, y: c.y - dy / dh }));
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => { pts.current.delete(e.pointerId); start.current = pts.current.size ? { crop: c, d: dist() } : null; };
  const dotted = '1.5px dashed rgba(255,255,255,.75)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: BOX_W + 60 + 'px', height: BOX_H + 30 + 'px', overflow: 'hidden', borderRadius: '16px', background: '#0b0614' }}>
        <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          onWheel={e => onChange(clampCrop({ ...c, z: c.z * (e.deltaY < 0 ? 1.08 : 1 / 1.08) }))}
          style={{ position: 'absolute', left: '30px', top: '15px', width: BOX_W + 'px', height: BOX_H + 'px', touchAction: 'none', cursor: 'grab' }}>
          <img src={src} alt="" draggable={false} style={{ ...cropStyle(c), pointerEvents: 'none', userSelect: 'none' } as React.CSSProperties} />
          {/* outside the card: dimmed, so the frame shows what players get */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: '0', borderRadius: '18px', boxShadow: '0 0 0 400px rgba(5,3,10,.62)', border: dotted, pointerEvents: 'none' }} />
          {/* the card's inner frame, and the lower part where the name and the text go */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: (10 / k) + 'px', borderRadius: '12px', border: '1px dotted rgba(255,255,255,.55)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: (10 / k) + 'px', right: (10 / k) + 'px', top: '52%', bottom: (10 / k) + 'px', borderTop: '1px dotted rgba(255,255,255,.55)', background: 'linear-gradient(180deg, rgba(8,4,16,.0), rgba(8,4,16,.45))', pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <span style={{ marginTop: '6px', fontSize: '10.5px', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>name & text</span>
          </div>
          {/* centre mark */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: '14px', height: '14px', marginLeft: '-7px', marginTop: '-7px', border: dotted, borderRadius: '50%', pointerEvents: 'none' }} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', width: BOX_W + 40 + 'px', fontSize: '12.5px', color: '#c4b8da', fontWeight: 700 }}>
        Zoom
        <input type="range" min="1" max="5" step="0.01" value={c.z} onChange={e => onChange(clampCrop({ ...c, z: +e.target.value }))} style={{ flex: 1 }} aria-label="Zoom" />
      </label>
      <span style={{ fontSize: '12px', color: '#a99bc2', textAlign: 'center', maxWidth: '290px', lineHeight: 1.45 }}>Drag to move, pinch or slide to zoom. The dotted lines are the card’s edge and frame; the lower part holds the name and text. The picture keeps its full quality.</span>
    </div>
  );
}

/** A picture with its crop, filling a box that has the card's shape (position it absolutely over the card). */
export function CroppedImg({ src, crop, alt = '' }: { src: string; crop?: Crop | null; alt?: string }) {
  if (!crop) return <img src={src} alt={alt} draggable={false} style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' }} />;
  return <img src={src} alt={alt} draggable={false} style={cropStyle(crop) as React.CSSProperties} />;
}
