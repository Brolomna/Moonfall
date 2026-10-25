// The post-game recap: a few highlight cards and one "Moonfall Moment of the Match", built by rules from what the
// game actually recorded (the host's log, mirrored on the server): votes and who nominated whom, deaths and who caused
// them, night actions, saves, the Spirit Council. Nothing is guessed — a card only appears when its facts were recorded,
// so a short or quiet game gets fewer cards (or none). Built on the host's phone once the game is over and shared then.

export type RecapPlayer = {
  name: string;
  role: string; // the card they ended with
  team: 'Village' | 'Werewolves' | 'Loner' | string;
  out: null | { how: string; round: number; phase: string; cause?: string };
};
export type RecapCard = { kind: string; emoji: string; title: string; names: string[]; line: string; punch: string; color: string };
export type Recap = { id: string; cards: RecapCard[]; moment: RecapCard | null };

type Input = {
  players: RecapPlayer[];
  log: any[];
  winners: string[];
  winner: { side: string; lib?: string; names?: string[] } | null;
  spirits?: Record<string, { faction?: string; to?: string; won?: boolean | null }> | null;
};

const HOST = '__host__';
const when = (round: number, phase: string) => (phase === 'day' ? 'Day ' : 'Night ') + round;
const list = (a: string[]) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const times = (k: number) => (k === 1 ? 'once' : k === 2 ? 'twice' : k + ' times');
const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

const PUNCH: Record<string, string[]> = {
  betrayal: ['Cold. Ice cold.', 'The pack will remember this one.', 'Family dinners just got awkward.'],
  friendly: ['Right energy, wrong target.', 'Aim is a skill. It can be practised.', 'Oops.'],
  detective: ['Somebody get this villager a badge.', 'Nothing gets past them.', 'Sherlock would be proud.'],
  actor: ['And the award goes to…', 'Hollywood is calling.', 'Give them an award. Maybe two.'],
  death: ['Unfinished business: finished.', 'Gone, but very much not forgotten.', 'Haunting level: expert.'],
  untouchable: ['Teflon-coated.', 'Not today, village.', 'Nine lives, at least.'],
  guardian: ['Not on their watch.', 'Wings optional.', 'Somebody owes them a drink.'],
  oracle: ['The spirits know things.', 'Called it from the other side.'],
  royal: ['Long live the Prince.', 'Royal blood has its perks.'],
  twist: ['Didn’t see that coming.', 'Character development!'],
  moment: ['Tell this one at the next game night.', 'They’ll be talking about this for weeks.', 'Pure Moonfall.'],
};

export function buildRecap({ players, log, winners, winner, spirits }: Input): Recap | null {
  if (!players.length || !winner) return null;
  const P: Record<string, RecapPlayer> = {}; players.forEach(p => { P[p.name] = p; });
  const has = (nm: string) => !!nm && !!P[nm];
  const evil = (nm: string) => has(nm) && P[nm].team === 'Werewolves';
  const village = (nm: string) => has(nm) && P[nm].team === 'Village';
  const alive = (nm: string) => has(nm) && !P[nm].out;
  const won = (nm: string) => winners.indexOf(nm) >= 0;
  const id = players.map(p => p.name).join(',') + '|' + log.length + '|' + winner.side + '|' + (winner.lib || '');
  const seed = hash(id);
  const punch = (k: string, i = 0) => { const a = PUNCH[k]; return a[(seed + i) % a.length]; };

  type Cand = RecapCard & { score: number; ev?: string };
  const cards: Cand[] = [], moments: (Cand & { ev: string })[] = [];
  const card = (kind: string, emoji: string, title: string, color: string, names: string[], line: string, score: number, ev?: string) =>
    cards.push({ kind, emoji, title, color, names, line, punch: punch(kind, cards.length), score, ev });
  const moment = (ev: string, names: string[], line: string, score: number) =>
    moments.push({ kind: 'moment', emoji: '🌕', title: 'Moonfall Moment of the Match', color: '#f2d06b', names, line, punch: '', score, ev });

  const votes = log.filter(e => e && e.t === 'vote');
  const outs = log.filter(e => e && e.t === 'out' && e.how !== 'removed' && has(e.name));
  const nomsOf = (e: any) => (Array.isArray(e.noms) ? e.noms : []).filter((n: any) => n && n.name);

  // ---- The Biggest Betrayal: someone nominated their own teammate on the wolf side ----
  votes.forEach((e, i) => nomsOf(e).forEach((n: any) => {
    if (!n.by || n.by === n.name || !evil(n.by) || !evil(n.name)) return;
    const out = e.out === n.name;
    const line = n.by + ' (' + P[n.by].role + ') nominated their own teammate ' + n.name + ' (' + P[n.name].role + ') on ' + when(e.round, 'day') + (out ? ' — and the village voted them out.' : '.');
    card('betrayal', '🗡', 'The Biggest Betrayal', '#ff8a9b', [n.by, n.name], line, out ? 92 : 72, 'vote' + i + n.name);
    if (out) moment('vote' + i + n.name, [n.by, n.name], n.by + ' nominated their own teammate ' + n.name + ' — and the village voted ' + n.name + ' out.', 88);
  }));
  // ---- Friendly Fire: the Witch's poison or the Hunter's arrow hit someone on the village side ----
  outs.forEach((e, i) => {
    const by = (Array.isArray(e.byWho) ? e.byWho : []).filter(has);
    if (!by.length || !village(e.name) || by.indexOf(e.name) >= 0) return;
    if (e.cause === 'poison' && by.every(village)) card('friendly', '🎯', 'Friendly Fire', '#f2a65a', [by[0], e.name], 'The Witch (' + list(by) + ') poisoned ' + e.name + ', who was on the village side too.', 50, 'out' + i);
    if (e.cause === 'hunter' && by.every(village)) card('friendly', '🎯', 'Friendly Fire', '#f2a65a', [by[0], e.name], 'The Hunter (' + list(by) + ') took ' + e.name + ' down with them — a fellow villager.', 50, 'out' + i);
  });

  // ---- Detective of the Year: checks that found a werewolf, or nominations that voted one out ----
  const found: Record<string, { role: string; hits: string[] }> = {};
  log.forEach(e => {
    if (!e || e.t !== 'act' || e.kind !== 'check' || !e.found || !Array.isArray(e.who) || !e.who.length) return;
    const t = (e.targets || [])[0]; if (!t) return;
    e.who.filter(has).forEach((nm: string) => { const f = found[nm] = found[nm] || { role: e.by || 'Seer', hits: [] }; if (f.hits.indexOf(t) < 0) f.hits.push(t); });
  });
  Object.keys(found).forEach(nm => {
    const f = found[nm], k = f.hits.length;
    card('detective', '🔍', 'Detective of the Year', '#7fb2ff', [nm], nm + ' (' + f.role + ') checked ' + list(f.hits) + ' and found ' + (k === 1 ? 'a werewolf' : k + ' werewolves') + '.', 60 + 12 * k);
  });
  const caught: Record<string, string[]> = {};
  votes.forEach(e => nomsOf(e).forEach((n: any) => {
    if (e.out === n.name && n.by && has(n.by) && !evil(n.by) && evil(n.name)) (caught[n.by] = caught[n.by] || []).push(n.name);
  }));
  Object.keys(caught).forEach(nm => {
    const c = caught[nm];
    card('detective', '🔍', 'Detective of the Year', '#7fb2ff', [nm], nm + ' nominated ' + list(c.map(x => x + ' (' + P[x].role + ')')) + ' — and the village voted ' + (c.length === 1 ? 'them' : 'every one of them') + ' out.', 55 + 12 * c.length);
  });

  // ---- Best Actor: on the wolf side (or alone), never voted out ----
  const nominated: Record<string, number> = {};
  votes.forEach(e => nomsOf(e).forEach((n: any) => { if (has(n.name)) nominated[n.name] = (nominated[n.name] || 0) + 1; }));
  players.filter(p => p.team !== 'Village' && !(p.out && p.out.how === 'voted') && (alive(p.name) || won(p.name))).forEach(p => {
    const k = nominated[p.name] || 0;
    const line = p.name + ' was the ' + p.role + ' all along' + (k ? ' — nominated ' + times(k) + ' and never voted out.' : votes.length ? ' — and was never nominated once.' : ' — and never voted out.');
    card('actor', '🎭', 'Best Actor', '#c98bf2', [p.name], line, 50 + 10 * k + (won(p.name) ? 10 : 0) + (alive(p.name) ? 5 : 0));
  });

  // ---- Even Death Couldn't Stop Them ----
  const sp = spirits || {};
  Object.keys(sp).forEach(nm => {
    const x = sp[nm];
    if (!has(nm) || !P[nm].out || x.won !== true || (x.faction !== 'good' && x.faction !== 'evil')) return;
    const line = nm + ' fell on ' + when(P[nm].out!.round, P[nm].out!.phase) + ', but their spirit joined the ' + (x.faction === 'good' ? 'village' : 'werewolves') + ' — and won.';
    card('death', '👻', 'Even Death Couldn’t Stop Them', '#b8d4ff', [nm], line, 78, 'spirit' + nm);
    moment('spirit' + nm, [nm], line, 70);
  });
  outs.forEach((e, i) => {
    const by = (Array.isArray(e.byWho) ? e.byWho : []).filter(has);
    if (e.cause !== 'hunter' || !by.length || !evil(e.name)) return;
    const line = by[0] + ' (Hunter) went down on ' + when(e.round, e.phase) + ' — and took ' + e.name + ' (' + P[e.name].role + ') with them.';
    card('death', '👻', 'Even Death Couldn’t Stop Them', '#b8d4ff', [by[0], e.name], line, 74, 'out' + i);
    moment('out' + i, [by[0], e.name], line, 86);
  });
  players.filter(p => p.out && p.out.how !== 'removed' && won(p.name)).sort((a, b) => (a.out!.round * 2 + (a.out!.phase === 'day' ? 1 : 0)) - (b.out!.round * 2 + (b.out!.phase === 'day' ? 1 : 0))).slice(0, 1).forEach(p => {
    card('death', '👻', 'Even Death Couldn’t Stop Them', '#b8d4ff', [p.name], p.name + ' was out on ' + when(p.out!.round, p.out!.phase) + ' — and still ended up on the winning side.', 35);
  });

  // ---- The Untouchable: nominated again and again, never voted out ----
  Object.keys(nominated).forEach(nm => {
    const k = nominated[nm];
    if (k < 2 || !alive(nm) || P[nm].team !== 'Village') return; // wolves who dodged votes are already the Best Actor candidates
    card('untouchable', '🛡', 'The Untouchable', '#8fe0b8', [nm], nm + ' was nominated ' + times(k) + ' and survived every vote.', 45 + 10 * k);
  });

  // ---- Guardian Angel: saves recorded at dawn, with who made them ----
  const saved: Record<string, { role: string; names: string[] }> = {};
  log.forEach((e, i) => {
    if (!e || e.t !== 'saved' || !Array.isArray(e.who) || !e.who.length || !has(e.name)) return;
    e.who.filter(has).forEach((nm: string) => { const g = saved[nm] = saved[nm] || { role: String(e.by || '').replace(/^the /, ''), names: [] }; if (g.names.indexOf(e.name) < 0) g.names.push(e.name); });
    moment('saved' + i, [e.name], 'The wolves came for ' + e.name + ' on ' + when(e.round, 'night') + ' — the ' + String(e.by || '').replace(/^the /, '') + ' got there first.', 62);
  });
  Object.keys(saved).forEach(nm => {
    const g = saved[nm], others = g.names.filter(x => x !== nm);
    const line = nm + ' (' + g.role + ') saved ' + (others.length ? list(others) : 'themselves') + (g.names.length > others.length && others.length ? ' (and themselves)' : '') + ' from the wolves.';
    card('guardian', '😇', 'Guardian Angel', '#62d4a6', [nm], line, 58 + 10 * g.names.length);
  });

  // ---- Spirit Oracle: a spirit chose a living player at the Council, and that player made it to the end ----
  Object.keys(sp).forEach(nm => {
    const x = sp[nm];
    if (!has(nm) || !x.to || !alive(x.to)) return;
    card('oracle', '🔮', 'The Spirit Oracle', '#c7a8ff', [nm, x.to], 'From beyond, ' + nm + ' chose ' + x.to + ' at the Spirit Council — and ' + x.to + ' made it to the end.', 48);
  });

  // ---- Royal Escape / Plot Twist / back from the dead ----
  log.forEach((e, i) => {
    if (!e || !has(e.name)) return;
    if (e.t === 'prince') {
      const line = e.name + ' was voted out on ' + when(e.round, 'day') + ' — then revealed the Prince and walked away.';
      card('royal', '👑', 'Royal Escape', '#f2d06b', [e.name], line, 66, 'prince' + i); moment('prince' + i, [e.name], line, 82);
    }
    if ((e.t === 'turned' && ['Cursed', 'Alpha Werewolf', 'Vampire'].indexOf(e.by) >= 0) || e.t === 'cursed') {
      const line = e.name + ' started on the village side and became ' + (e.t === 'cursed' ? 'a Werewolf' : 'the ' + e.role) + ' on ' + when(e.round, e.phase || 'night') + '.';
      card('twist', '🌀', 'Plot Twist', '#c2a8f0', [e.name], line, 52, 'turn' + i); moment('turn' + i, [e.name], line, 76);
    }
    if (e.t === 'revived') moment('rev' + i, [e.name], e.name + ' was dead — until the Witch’s healing potion brought them back on ' + when(e.round, 'night') + '.', 90);
  });

  // ---- moments from the votes and the ending ----
  votes.forEach((e, i) => {
    const t = (Array.isArray(e.tally) ? e.tally : []).slice().sort((a: any, b: any) => b[1] - a[1]);
    if (e.out === 'the host') moment('vote' + i, [], 'On ' + when(e.round, 'day') + ' the village voted out the host.', 95);
    else if (e.out && has(e.out) && t.length >= 2 && t[0][1] - t[1][1] === 1) moment('vote' + i, [e.out], e.out + ' was voted out on ' + when(e.round, 'day') + ' by a single vote (' + t[0][1] + '–' + t[1][1] + ').', 72);
    if (e.why === 'tie' && t.length >= 2) moment('tie' + i, t.filter((x: any) => x[1] === t[0][1]).map((x: any) => x[0]).filter((x: string) => x !== HOST), when(e.round, 'day') + ' ended in a dead heat — ' + list(t.filter((x: any) => x[1] === t[0][1]).map((x: any) => x[0] === HOST ? 'the host' : x[0])) + ' tied and nobody went out.', 64);
  });
  const lastVote = votes[votes.length - 1];
  if (lastVote && evil(lastVote.out) && winner.side === 'village' && !players.some(p => p.team === 'Werewolves' && !p.out))
    moment('vote' + (votes.length - 1), [lastVote.out], 'The final vote caught ' + lastVote.out + ', the last of the ' + P[lastVote.out].role + ' side.', 70);
  const wn = (winner.names || []).filter(has);
  if (winner.side === 'solo' && wn.length) {
    if (winner.lib === 'Tanner') moment('end', wn, wn[0] + ' got voted out — exactly what the Tanner needed to win it all.', 100);
    else if (winner.lib === 'Lovers') moment('end', wn, list(wn) + ' were the last two standing — lovers to the very end.', 96);
    else moment('end', wn, list(wn) + ' outlasted the whole village as the ' + (winner.lib || P[wn[0]].role) + '.', 94);
  }
  const first = outs[0];
  if (first) moment('first', [first.name], first.name + ' was the first to fall, on ' + when(first.round, first.phase) + '.', 20);

  // ---- choose: the strongest card of each kind, featuring different players where possible, at most four ----
  const picked: Cand[] = [], seen = new Set<string>();
  cards.sort((a, b) => b.score - a.score);
  for (const pass of [0, 1]) for (const c of cards) {
    if (picked.length >= 4) break;
    if (picked.some(x => x.kind === c.kind)) continue;
    if (pass === 0 && seen.has(c.names[0])) continue;
    picked.push(c); c.names.forEach(nm => seen.add(nm));
  }
  const used = new Set(picked.map(c => c.ev).filter(Boolean));
  moments.sort((a, b) => b.score - a.score);
  const m = moments.find(x => !used.has(x.ev) && x.score >= 40) || moments[0] || null;
  const clean = ({ score, ev, ...c }: Cand) => c;
  if (!picked.length && !m) return null;
  return { id, cards: picked.map(clean), moment: m ? { ...clean(m), punch: punch('moment') } : null };
}
