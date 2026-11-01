// Role pictures at full quality. The host's phone uploads the file exactly as picked (no re-encoding unless it is
// too big or a format phones can't show), the server keeps it by content hash (`POST /api/img`), and the crop is
// stored next to it as numbers — phones draw the crop, so the picture itself is never cut or squeezed.
// The host's phone also keeps every picture it uploaded (IndexedDB), so after a server restart it can send them back.

/** The role card's shape (RoleCardFace is drawn 326 × 520). Every crop is made for this ratio. */
export const CARD_W = 326, CARD_H = 520;

/** A crop: (x, y) = the picture point at the card's centre (0–1), z = zoom over "just covers the card" (≥ 1), w × h = the picture's size. */
export type Crop = { x: number; y: number; z: number; w: number; h: number };
/** A picture on a role: the server's id, and how it sits on the card. */
export type ImgRef = { id: string; crop?: Crop };

const MAX_KEEP = 8 * 1024 * 1024; // files up to this size go up untouched
const MAX_SIDE = 4096; // bigger ones (or odd formats) are redrawn at this size, at high quality

/** Where a picture is served from for this room. */
export const imgSrc = (room: string, id: string) => '/api/img?room=' + encodeURIComponent(room) + '&id=' + id;

/** Read a picked file: its size, and the bytes to upload (the original when possible). */
export async function prepareImage(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = url; });
    const w = img.naturalWidth, h = img.naturalHeight;
    const keep = /^image\/(png|jpeg|webp|gif|avif)$/.test(file.type) && file.size <= MAX_KEEP && Math.max(w, h) <= MAX_SIDE * 2;
    if (keep) return { blob: file, w, h };
    // too big, or HEIC & co.: redraw once, as large as allowed, at high quality (never squeezed — same proportions)
    const k = Math.min(1, MAX_SIDE / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
    const g = c.getContext('2d')!; g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>(ok => c.toBlob(ok, 'image/jpeg', 0.95));
    if (!blob) throw new Error('encode');
    return { blob, w: c.width, h: c.height };
  } finally { URL.revokeObjectURL(url); }
}

// ---------- the host phone's own copy (IndexedDB) ----------
const DB = 'moonfall-images', STORE = 'img';
function db(): Promise<IDBDatabase> {
  return new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error);
  });
}
export async function keepImage(id: string, blob: Blob) {
  try { const d = await db(); await new Promise<void>((ok, bad) => { const t = d.transaction(STORE, 'readwrite'); t.objectStore(STORE).put(blob, id); t.oncomplete = () => ok(); t.onerror = () => bad(t.error); }); } catch { /* private mode: the server copy is all we have */ }
}
export async function keptImage(id: string): Promise<Blob | null> {
  try { const d = await db(); return await new Promise((ok) => { const r = d.transaction(STORE).objectStore(STORE).get(id); r.onsuccess = () => ok((r.result as Blob) || null); r.onerror = () => ok(null); }); } catch { return null; }
}

/** Upload to a room (host password); returns the picture's id. Keeps a copy on this phone. */
export async function uploadImage(room: string, password: string, blob: Blob): Promise<string> {
  const r = await fetch('/api/img?room=' + encodeURIComponent(room), { method: 'POST', headers: { 'content-type': blob.type || 'image/jpeg', 'x-moonfall-password': password }, body: blob });
  if (!r.ok) throw new Error(r.status === 413 ? 'full' : 'upload');
  const { id } = await r.json();
  keepImage(id, blob);
  return id;
}

/** Send back the pictures the server doesn't have (it restarted): from this phone's copies. */
export async function resendImages(room: string, password: string, need: string[], have: string[]) {
  for (const id of need.filter(x => have.indexOf(x) < 0)) {
    const b = await keptImage(id);
    if (b) await uploadImage(room, password, b).catch(() => { /* try again on the next connect */ });
  }
}

/** A crop that just covers the card, centred. */
export const fitCrop = (w: number, h: number): Crop => ({ x: 0.5, y: 0.5, z: 1, w, h });

/** Keep the card covered: the centre can only move as far as the picture reaches. */
export function clampCrop(c: Crop): Crop {
  const z = Math.min(8, Math.max(1, c.z));
  const s0 = Math.max(CARD_W / c.w, CARD_H / c.h) * z; // card px per picture px
  const hx = CARD_W / 2 / (c.w * s0), hy = CARD_H / 2 / (c.h * s0); // half the card, in picture units (0–1)
  return { ...c, z, x: Math.min(1 - hx, Math.max(hx, c.x)), y: Math.min(1 - hy, Math.max(hy, c.y)) };
}

/** Style for an <img> inside a box with the card's ratio (position: relative; overflow: hidden) — no stretching, ever. */
export function cropStyle(c: Crop): Record<string, string> {
  const k = clampCrop(c);
  const s0 = Math.max(CARD_W / k.w, CARD_H / k.h) * k.z;
  const dw = k.w * s0, dh = k.h * s0; // drawn size in card px
  const left = CARD_W / 2 - k.x * dw, top = CARD_H / 2 - k.y * dh;
  const pc = (v: number, of: number) => (v / of * 100).toFixed(4) + '%';
  return { position: 'absolute', left: pc(left, CARD_W), top: pc(top, CARD_H), width: pc(dw, CARD_W), height: pc(dh, CARD_H), maxWidth: 'none', objectFit: 'fill' };
}
