// The shop: players earn points from their wins in the Hall of Fame and spend them on items the host makes —
// artifacts (kept for good, usable once per game) and power-ups (used up). Everything is kept on the host's phone
// (localStorage `moonfall.shop`, next to the Hall of Fame `moonfall.fame`), keyed by player name like the rest of the game.
// The host shares only what each phone needs (`shop` in the room's shared state → the server's `shopView()`).
// Quests are not here yet: they would be one more source in `earned()` (and their own list in ShopData).

export type ItemKind = 'artifact' | 'powerup';
export type Item = { id: string; name: string; kind: ItemKind; icon: string; price: number; desc: string };
/** An item someone owns. A copy of the item as it was bought, so editing or deleting the shop item never changes it. */
export type Owned = { uid: string; id: string; name: string; kind: ItemKind; icon: string; desc: string; at: number; gift?: boolean; usedIn?: string; used?: number };
export type Use = { at: number; name: string; item: string; icon: string; desc: string; game: string; seen?: boolean };
export type ShopData = {
  items: Item[];
  spent: Record<string, number>; // points spent per player
  inv: Record<string, Owned[]>;
  uses: Use[]; // the last item uses (the host applies the effect in person)
  open: string[]; // players the host opened the shop to (the host always sees it)
  all: boolean; // …or everyone
};

/** Points for one win in the Hall of Fame. */
export const PTS_PER_WIN = 10;
const KEY = 'moonfall.shop';

export const STARTER_ITEMS: Item[] = [
  { id: 'amulet', name: 'Silver Amulet', kind: 'artifact', icon: '🧿', price: 40, desc: 'Once per game, at night: if the werewolves attack you tonight, you survive.' },
  { id: 'lantern', name: 'Lantern of Truth', kind: 'artifact', icon: '🏮', price: 50, desc: 'Once per game: the host secretly tells you whether one player you name is on the wolf side.' },
  { id: 'double', name: 'Double Vote', kind: 'powerup', icon: '🗳', price: 15, desc: 'Your vote counts twice in one day’s vote.' },
  { id: 'shield', name: 'Vote Shield', kind: 'powerup', icon: '🛡', price: 25, desc: 'The first time you would be voted out, the vote fails instead.' },
  { id: 'lastword', name: 'Last Word', kind: 'powerup', icon: '🗣', price: 10, desc: 'When you are out, you may speak for 30 more seconds.' },
];

export function loadShop(): ShopData {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && Array.isArray(d.items)) return { items: d.items, spent: d.spent || {}, inv: d.inv || {}, uses: Array.isArray(d.uses) ? d.uses : [], open: Array.isArray(d.open) ? d.open : [], all: !!d.all };
  } catch { /* fresh */ }
  return { items: STARTER_ITEMS.slice(), spent: {}, inv: {}, uses: [], open: [], all: false };
}
export function saveShop(d: ShopData) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* full / private mode */ } }

const fame = (): Record<string, { wins?: number }> => { try { return JSON.parse(localStorage.getItem('moonfall.fame') || '{}') || {}; } catch { return {}; } };
/** Points a player has earned so far: their wins in the Hall of Fame (quests would add here later). */
export function earned(name: string): number { const f = fame()[name]; return ((f && f.wins) || 0) * PTS_PER_WIN; }
export const points = (d: ShopData, name: string) => Math.max(0, earned(name) - (d.spent[name] || 0));

/** Can this owned item be used now? Power-ups once, artifacts once per game. Only during a game (`game` = its id). */
export const usable = (o: Owned, game: string | null) => !!game && (o.kind === 'powerup' ? !o.used : o.usedIn !== game);

export const newId = () => Math.random().toString(36).slice(2, 10);

export function buy(d: ShopData, name: string, itemId: string, gift = false): ShopData | null {
  const it = d.items.find(x => x.id === itemId); if (!it) return null;
  if (!gift && points(d, name) < it.price) return null;
  const own: Owned = { uid: newId(), id: it.id, name: it.name, kind: it.kind, icon: it.icon, desc: it.desc, at: Date.now(), ...(gift ? { gift: true } : {}) };
  return { ...d, spent: gift ? d.spent : { ...d.spent, [name]: (d.spent[name] || 0) + it.price }, inv: { ...d.inv, [name]: (d.inv[name] || []).concat([own]) } };
}

export function use(d: ShopData, name: string, uid: string, game: string | null): ShopData | null {
  const list = d.inv[name] || []; const o = list.find(x => x.uid === uid);
  if (!o || !usable(o, game)) return null;
  const next = o.kind === 'powerup' ? { ...o, used: Date.now() } : { ...o, usedIn: game! };
  const u: Use = { at: Date.now(), name, item: o.name, icon: o.icon, desc: o.desc, game: game! };
  return { ...d, inv: { ...d.inv, [name]: list.map(x => (x.uid === uid ? next : x)) }, uses: d.uses.concat([u]).slice(-100) };
}

/** Take an item back (refunds the points if it was bought and never used). */
export function remove(d: ShopData, name: string, uid: string): ShopData {
  const list = d.inv[name] || []; const o = list.find(x => x.uid === uid); if (!o) return d;
  const it = d.items.find(x => x.id === o.id);
  const refund = !o.gift && !o.used && !o.usedIn && it ? it.price : 0;
  return { ...d, spent: refund ? { ...d.spent, [name]: Math.max(0, (d.spent[name] || 0) - refund) } : d.spent, inv: { ...d.inv, [name]: list.filter(x => x.uid !== uid) } };
}

/** What the room's phones get (the server picks out each player's own part): the items only for players the shop
 *  is open to, and each player's points and bag. `game` = the running game's id (items can only be used during one). */
export function shopShared(d: ShopData, names: string[], game: string | null) {
  const wallets: Record<string, { pts: number; inv: (Owned & { usable: boolean })[] }> = {};
  names.forEach(nm => { wallets[nm] = { pts: points(d, nm), inv: (d.inv[nm] || []).map(o => ({ ...o, usable: usable(o, game) })) }; });
  return { items: d.items, open: d.all ? names : d.open.filter(nm => names.includes(nm)), wallets, game };
}
