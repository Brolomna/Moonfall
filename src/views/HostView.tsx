// @ts-nocheck
// Generated from design/Host.dc.html by tools/dc2tsx.py, then hand-wired to the room server (see NET: comments).
import React from 'react';
import './HostView.css';

export class HostView extends React.Component<any, any> {
  // NET: fields the host owns that are mirrored to the server (so players see them and a refresh keeps the game)
  static SHARED = ['screen', 'counts', 'picked', 'custom', 'edits', 'rules', 'roomLang', 'phase', 'round', 'status', 'override', 'dismissed', 'checks', 'tough', 'dgDone', 'log', 'hidden'];

  constructor(props) {
    super(props);
    this.state = { ...(props.sharedInit || {}) };
  }

  setState(patch, cb) {
    if (patch && typeof patch === 'object') {
      const shared = {};
      for (const k of HostView.SHARED) if (k in patch) shared[k] = patch[k] === undefined ? null : patch[k];
      if (Object.keys(shared).length && this.props.onPatch) this.props.onPatch(shared);
    }
    return super.setState(patch, cb);
  }

  catalog() {
    const V = 'Village', W = 'Werewolves', L = 'Loner';
    const I = {
      wolf: 'M4 3l3.5 5.5L12 7l4.5 1.5L20 3l-.5 9-3.5 5-4 4-4-4-3.5-5z M9 12.5l1.5 1 M15 12.5l-1.5 1 M10.5 17.5h3L12 19z',
      lantern: 'M9 4h6 M12 2v2 M7.5 7h9l-.8 11.5H8.3z M6.5 20.5h11 M12 10.5c1.3 1.3 1.3 3 0 4.5-1.3-1.5-1.3-3.2 0-4.5z',
      brick: 'M3 20h18 M4 20V8h16v12 M4 12h16 M4 16h16 M9 8v4 M15 8v4 M12 12v4 M8 16v4 M16 16v4',
      eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
      shieldCross: 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z M12 8.5v7 M8.5 12h7',
      flask: 'M9 3h6 M10 3v5.5L5 18.2A1.9 1.9 0 0 0 6.7 21h10.6a1.9 1.9 0 0 0 1.7-2.8L14 8.5V3 M7.5 15h9',
      bow: 'M6 3c7 2.5 7 15.5 0 18 M6 3v18 M3 12h17 M17 9l3 3-3 3',
      shieldStar: 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z M12 8l1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 14.2l-2.5 1.4.6-2.8L8 10.9l2.8-.3z',
      heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z M3 21L21 3 M16 3h5v5',
      crown: 'M3 18h18 M4 18L3 7l5 4 4-7 4 7 5-4-1 11',
      sash: 'M6 3h12v18l-6-3-6 3z M9 8h6 M9 11.5h6',
      dumbbell: 'M6 7v10 M18 7v10 M3 9.5v5 M21 9.5v5 M6 12h12',
      eyeSmall: 'M3 13s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5z M12 11a2 2 0 1 0 0 4a2 2 0 1 0 0-4z M12 2v3 M6.5 4l1.2 2 M17.5 4l-1.2 2',
      moonClaw: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z M8 9.5l2 4.5 M11.5 8.5l2 4.5',
      mask: 'M3 6c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0v5c0 5-4 9-9 9s-9-4-9-9z M7.5 11h2.5 M14 11h2.5 M9 16c2 1 4 1 6 0',
      jester: 'M4 19l3-13 5 6 5-6 3 13z M4 19h16 M7 6a1 1 0 1 0 0-.01 M17 6a1 1 0 1 0 0-.01',
      door: 'M6 21V4.5L16 3v18 M3 21h18 M13 12.5h.01 M16 5h3v16',
      paw: 'M5.5 8a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M9.5 4a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M14.5 4a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M18.5 8a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M12 12c-3 0-5.5 3-5.5 5.5 0 1.8 1.5 2.5 3 2.5 1 0 1.6-.5 2.5-.5s1.5.5 2.5.5c1.5 0 3-.7 3-2.5C17.5 15 15 12 12 12z',
      dagger: 'M12 2l2 4v9h-4V6z M7 15h10 M12 15v7',
      orb: 'M12 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M6 21h12 M8.5 17l-1 4 M15.5 17l1 4 M9 9a3 3 0 0 1 3-3',
      skull: 'M12 3a7 7 0 0 0-7 7c0 2.6 1.3 4.3 3 5.3V19h8v-3.7c1.7-1 3-2.7 3-5.3a7 7 0 0 0-7-7z M8.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z M13.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z',
      twin: 'M8 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M16 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M2 20c0-3.3 2.7-6 6-6 1.6 0 3 .6 4 1.6 1-1 2.4-1.6 4-1.6 3.3 0 6 2.7 6 6'
    };
    const r = (key, name, team, kind, strength, color, rgb, icon, blurb, extra) => ({ key, name, team, kind, strength, color, rgb, icon: I[icon], blurb, ...(extra || {}) });
    return [
      r('werewolf', 'Werewolf', W, 'count', -6, '#e0475f', '224,71,95', 'wolf', 'Wakes with the pack each night to eliminate a player.', { plural: 'Werewolves', countHint: 'Usually 1 for every 4–5 players' }),
      r('villager', 'Villager', V, 'count', 1, '#e8d3a0', '232,211,160', 'lantern', 'No power. Talks, suspects and votes.', { plural: 'Villagers', countHint: 'Fills the rest of the table' }),
      r('mason', 'Mason', V, 'pair', 2, '#d9b48a', '217,180,138', 'brick', 'Masons know each other.', { plural: 'Masons', countHint: 'Pairs only — 0, 2, 3 or 4' }),
      r('seer', 'Seer', V, 'unique', 7, '#7fb2ff', '127,178,255', 'eye', 'Each night, learns if one player is a werewolf.'),
      r('healer', 'Healer', V, 'unique', 5, '#62d4a6', '98,212,166', 'shieldCross', 'Each night, protects one player from the wolves.'),
      r('witch', 'Witch', V, 'unique', 4, '#c98bf2', '201,139,242', 'flask', 'One potion to save, one poison. Each used once.'),
      r('hunter', 'Hunter', V, 'unique', 3, '#f2a65a', '242,166,90', 'bow', 'When eliminated, takes one player down too.'),
      r('bodyguard', 'Bodyguard', V, 'unique', 3, '#8fd3e8', '143,211,232', 'shieldStar', 'Guards one player a night, never twice in a row.'),
      r('apprentice', 'Apprentice Seer', V, 'unique', 4, '#a6c8ff', '166,200,255', 'eyeSmall', 'Becomes the Seer if the Seer dies.'),
      r('prince', 'Prince', V, 'unique', 3, '#f2d06b', '242,208,107', 'crown', 'Can’t be voted out — reveals the card instead.'),
      r('toughguy', 'Tough Guy', V, 'unique', 3, '#f29a7a', '242,154,122', 'dumbbell', 'Survives a wolf attack until the next day ends.'),
      r('mayor', 'Mayor', V, 'unique', 2, '#b8c4ff', '184,196,255', 'sash', 'Once revealed, their vote counts twice.'),
      r('idiot', 'Village Idiot', V, 'unique', 2, '#d8e08a', '216,224,138', 'jester', 'Must always vote to eliminate someone.'),
      r('oldhag', 'Old Hag', V, 'unique', 1, '#9fd6b8', '159,214,184', 'door', 'Banishes one player from the next day.'),
      r('lycan', 'Lycan', V, 'unique', -1, '#c48aa0', '196,138,160', 'moonClaw', 'A villager who looks like a wolf to the Seer.'),
      r('cursed', 'Cursed', V, 'unique', -3, '#a58ad6', '165,138,214', 'mask', 'Turns into a werewolf if the wolves attack.'),
      r('cupid', 'Cupid', V, 'unique', -3, '#f08fb8', '240,143,184', 'heart', 'Links two lovers who die together.'),
      r('wolfcub', 'Wolf Cub', W, 'unique', -8, '#ff6f61', '255,111,97', 'paw', 'If killed, the wolves take two victims next night.'),
      r('minion', 'Minion', W, 'unique', -6, '#d14a7a', '209,74,122', 'dagger', 'Knows the wolves; the wolves don’t know them.'),
      r('sorceress', 'Sorceress', W, 'unique', -3, '#b45cc7', '180,92,199', 'orb', 'Each night, searches for the Seer.'),
      r('tanner', 'Tanner', L, 'unique', -2, '#c9a27a', '201,162,122', 'skull', 'Wins only if the village votes them out.'),
      r('doppelganger', 'Doppelgänger', L, 'unique', -2, '#9aa7b8', '154,167,184', 'twin', 'Copies a player on night one and takes their role if they die.')
    ];
  }
  icons() {
    return [
      { key: 'star', label: 'Star', d: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z' },
      { key: 'heart', label: 'Heart and arrow', d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z M3 21L21 3 M16 3h5v5' },
      { key: 'crown', label: 'Crown', d: 'M3 18h18 M4 18L3 7l5 4 4-7 4 7 5-4-1 11' },
      { key: 'key', label: 'Key', d: 'M7.5 11a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M10.4 12.6L20 3 M16 7l3 3 M13.5 9.5l2 2' },
      { key: 'dagger', label: 'Dagger', d: 'M12 2l2 4v9h-4V6z M7 15h10 M12 15v7' },
      { key: 'skull', label: 'Skull', d: 'M12 3a7 7 0 0 0-7 7c0 2.6 1.3 4.3 3 5.3V19h8v-3.7c1.7-1 3-2.7 3-5.3a7 7 0 0 0-7-7z M8.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z M13.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z' },
      { key: 'orb', label: 'Crystal ball', d: 'M12 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M6 21h12 M8.5 17l-1 4 M15.5 17l1 4 M9 9a3 3 0 0 1 3-3' },
      { key: 'feather', label: 'Feather', d: 'M20 4C11 4 6 10 6 18v2 M6 18L16 8 M9 15h6 M8 10c2.5-4 6.5-6 12-6' },
      { key: 'wolf', label: 'Wolf', d: 'M4 3l3.5 5.5L12 7l4.5 1.5L20 3l-.5 9-3.5 5-4 4-4-4-3.5-5z M9 12.5l1.5 1 M15 12.5l-1.5 1 M10.5 17.5h3L12 19z' },
      { key: 'eye', label: 'Eye', d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z' },
      { key: 'shield', label: 'Shield', d: 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z' },
      { key: 'cross', label: 'Holy cross', d: 'M12 3v18 M6.5 8.5h11' },
      { key: 'flask', label: 'Potion', d: 'M9 3h6 M10 3v5.5L5 18.2A1.9 1.9 0 0 0 6.7 21h10.6a1.9 1.9 0 0 0 1.7-2.8L14 8.5V3 M7.5 15h9' },
      { key: 'bow', label: 'Bow', d: 'M6 3c7 2.5 7 15.5 0 18 M6 3v18 M3 12h17 M17 9l3 3-3 3' },
      { key: 'moon', label: 'Moon', d: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z' },
      { key: 'mask', label: 'Mask', d: 'M3 6c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0v5c0 5-4 9-9 9s-9-4-9-9z M7.5 11h2.5 M14 11h2.5 M9 16c2 1 4 1 6 0' },
      { key: 'flame', label: 'Flame', d: 'M12 3c3 4 6 6.5 6 11a6 6 0 0 1-12 0c0-3 1.5-5 3-7 .8 2 1.8 3 3 3 0-2.5-1-4.5 0-7z' }
    ];
  }
  kb() {
    // Mock of the online lookup: in the real app this is a web / wiki search on the server.
    return [
      { name: 'Little Girl', aliases: ['girl'], source: 'Werewolves of Millers Hollow', team: 'Village', strength: 4, icon: 'eye', color: '#f08fb8', rgb: '240,143,184', desc: 'When the werewolves wake, you may secretly peek through your fingers. If they catch you looking, they can choose you as their victim instead.' },
      { name: 'Fortune Teller', aliases: ['fortune'], source: 'Werewolf fan wiki', team: 'Village', strength: 3, icon: 'orb', color: '#8fd3e8', rgb: '143,211,232', desc: 'Once per game, when the host wakes you at night, point at a player. The host shows you their exact role.' },
      { name: 'Aura Seer', aliases: ['aura'], source: 'Ultimate Werewolf', team: 'Village', strength: 3, icon: 'star', color: '#a6c8ff', rgb: '127,178,255', desc: 'Each night, point at one player. The host nods if they have a special power, and shakes if they are a plain Villager or Werewolf.' },
      { name: 'Priest', aliases: ['cleric'], source: 'Ultimate Werewolf', team: 'Village', strength: 3, icon: 'cross', color: '#e8d3a0', rgb: '232,211,160', desc: 'Once per game, at night, bless one player. The first time they would be eliminated, they survive instead.' },
      { name: 'Pacifist', aliases: [], source: 'Ultimate Werewolf', team: 'Village', strength: -1, icon: 'feather', color: '#62d4a6', rgb: '98,212,166', desc: 'You must always vote to keep players alive — you can never vote to eliminate anyone.' },
      { name: 'Troublemaker', aliases: ['trouble maker'], source: 'Ultimate Werewolf', team: 'Village', strength: -3, icon: 'mask', color: '#f2a65a', rgb: '242,166,90', desc: 'Once per game, at night, tell the host to stir up trouble. The next day the village must hold two votes and eliminate two players.' },
      { name: 'Drunk', aliases: ['the drunk'], source: 'Ultimate Werewolf', team: 'Village', strength: 3, icon: 'flask', color: '#e8d3a0', rgb: '232,211,160', desc: 'You play as a plain Villager until the third night, when the host secretly hands you your real role.' },
      { name: 'Ghost', aliases: [], source: 'Ultimate Werewolf', team: 'Village', strength: 2, icon: 'skull', color: '#8fd3e8', rgb: '143,211,232', desc: 'You are eliminated on the first night. Each day after, you may give the village one letter as a clue — never a whole name.' },
      { name: 'Diseased', aliases: ['disease', 'sick'], source: 'Ultimate Werewolf', team: 'Village', strength: 3, icon: 'flask', color: '#d8e08a', rgb: '216,224,138', desc: 'If the werewolves eliminate you, they catch your sickness and cannot attack anyone the following night.' },
      { name: 'Spellcaster', aliases: ['spell caster'], source: 'Ultimate Werewolf', team: 'Village', strength: 1, icon: 'star', color: '#c98bf2', rgb: '201,139,242', desc: 'Each night, point at one player. They are silenced and may not speak at all during the next day.' },
      { name: 'Alpha Wolf', aliases: ['alpha'], source: 'Ultimate Werewolf', team: 'Werewolves', strength: -9, icon: 'wolf', color: '#e0475f', rgb: '224,71,95', desc: 'You wake with the werewolves. Once per game, instead of eliminating the victim, you can turn them into a werewolf.' },
      { name: 'Big Bad Wolf', aliases: ['big bad'], source: 'Ultimate Werewolf', team: 'Werewolves', strength: -9, icon: 'wolf', color: '#ff6f61', rgb: '255,111,97', desc: 'You wake with the werewolves. While no werewolf has been eliminated, you also eliminate a player sitting next to the victim.' },
      { name: 'Vampire', aliases: ['vampires'], source: 'Ultimate Werewolf', team: 'Loner', strength: -7, icon: 'dagger', color: '#b45cc7', rgb: '180,92,199', desc: 'Each night the vampires choose a victim, who is eliminated the next time anyone votes for them. Vampires win when they outnumber everyone else.' },
      { name: 'Fool', aliases: ['the fool'], source: 'Werewolf fan wiki', team: 'Village', strength: 1, icon: 'eye', color: '#d8e08a', rgb: '216,224,138', desc: 'You think you are the Seer and wake like one — but the host’s answers to you are random. You don’t know you’re the Fool.' },
      { name: 'Arsonist', aliases: [], source: 'Werewolf fan wiki', team: 'Loner', strength: -4, icon: 'flame', color: '#f2a65a', rgb: '242,166,90', desc: 'Each night, douse one player in oil, or set every doused player on fire at once. You win if you are the last one standing.' }
    ];
  }
  lookup(text, all, self, hidden) {
    const n = text.toLowerCase().trim().replace(/^the\s+/, '');
    if (n.length < 3) return null;
    const have = all.find(r => r.key !== self && (r.name.toLowerCase() === n || (r.plural && r.plural.toLowerCase() === n)));
    if (have) return { existing: true, key: have.key, name: have.name };
    const kb = this.kb();
    const hit = kb.find(k => k.name.toLowerCase() === n) || kb.find(k => k.aliases.indexOf(n) >= 0) || (n.length >= 4 ? kb.find(k => k.name.toLowerCase().indexOf(n) === 0) : null);
    if (hit) return hit;
    // a built-in role the host deleted (or the original of one being edited) → fill from the built-in card
    const orig = this.catalog().find(r => (hidden.indexOf(r.key) >= 0 || r.key === self) && (r.name.toLowerCase() === n || (r.plural && r.plural.toLowerCase() === n)));
    return orig ? { name: orig.name, source: 'Moonfall’s built-in roles', team: orig.team, strength: orig.strength, desc: orig.blurb, iconPath: orig.icon, color: orig.color, rgb: orig.rgb } : null;
  }
  colors() {
    return [
      { hex: '#8fd3e8', rgb: '143,211,232', label: 'Frost' }, { hex: '#f08fb8', rgb: '240,143,184', label: 'Rose' },
      { hex: '#e0475f', rgb: '224,71,95', label: 'Blood' }, { hex: '#f2a65a', rgb: '242,166,90', label: 'Ember' },
      { hex: '#e8d3a0', rgb: '232,211,160', label: 'Gold' }, { hex: '#62d4a6', rgb: '98,212,166', label: 'Sage' },
      { hex: '#7fb2ff', rgb: '127,178,255', label: 'Moon' }, { hex: '#c98bf2', rgb: '201,139,242', label: 'Violet' }
    ];
  }
  scenario() {
    const k = this.props.scenario || 'night1';
    const n = (round, phase) => ({ how: 'night', round, phase });
    if (k === 'mark') return { phase: 'day', round: 2, status: { Felix: n(2, 'night') }, markOpen: true };
    if (k === 'cub') return { phase: 'day', round: 2, status: { Felix: n(2, 'night'), Noa: { how: 'voted', round: 2, phase: 'day' } } };
    if (k === 'doppel') return { phase: 'day', round: 2, status: { Ivy: n(2, 'night') }, dg: { dead: 'Ivy', choice: 'seer' } };
    if (k === 'end') return { phase: 'day', round: 4, status: { Ivy: n(2, 'night'), Noa: { how: 'voted', round: 2, phase: 'day' }, Theo: n(3, 'night'), Ezra: n(3, 'night'), Ren: { how: 'voted', round: 3, phase: 'day' }, Hana: n(4, 'night') }, dismissAll: true };
    if (k === 'rules') return { phase: 'night', round: 1, status: {}, rulesOpen: true };
    return { phase: 'night', round: 1, status: {} };
  }
  str(v) { return (v > 0 ? '+' : (v < 0 ? '−' : '')) + Math.abs(v); }
  strStyle(v) {
    return {
      strFg: v > 0 ? '#8fe0b8' : (v < 0 ? '#ff8a9b' : '#c4b8da'),
      strBg: v > 0 ? 'rgba(98,212,166,.14)' : (v < 0 ? 'rgba(224,71,95,.16)' : 'rgba(255,255,255,.08)')
    };
  }
  renderVals() {
    const s = this.state || {};
    const init = this.scenario();
    const st = (k, def) => (s[k] !== undefined ? s[k] : (init[k] !== undefined ? init[k] : def));

    // ---------- house rules ----------
    const ruleDefaults = { peaceful: false, wolfPick: 'majority', seerSees: 'wolf', selfHeal: true, skipVote: true, tie: 'none', reveal: true, silentDead: true, showRoles: true };
    const rules = { ...ruleDefaults, ...(s.rules || {}) };
    const setRule = (k, v) => this.setState({ rules: { ...rules, [k]: v } });
    const tgl = (k, label, desc) => ({ isToggle: true, isChoice: false, label, desc, on: rules[k], track: rules[k] ? '#e8d3a0' : 'rgba(255,255,255,.16)', knob: rules[k] ? '23px' : '3px', border: rules[k] !== ruleDefaults[k] ? 'rgba(232,211,160,.45)' : 'rgba(236,230,246,.08)', flip: () => setRule(k, !rules[k]) });
    const chc = (k, label, desc, opts) => ({ isToggle: false, isChoice: true, label, desc, border: rules[k] !== ruleDefaults[k] ? 'rgba(232,211,160,.45)' : 'rgba(236,230,246,.08)', opts: opts.map(([v, l]) => ({ label: l, on: rules[k] === v, bg: rules[k] === v ? '#e8d3a0' : 'transparent', fg: rules[k] === v ? '#1c140a' : '#c4b8da', pick: () => setRule(k, v) })) });
    const ruleGroups = [
      { label: 'At night', color: '#c7a8ff', icon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z', items: [
        tgl('peaceful', 'Peaceful first night', 'On night 1 the werewolves only meet each other — nobody is eliminated.'),
        chc('wolfPick', 'How the werewolves choose', 'What happens when the pack points at different players.', [['majority', 'Most points wins'], ['unanimous', 'Must all agree']]),
        chc('seerSees', 'What the Seer learns', 'How much the host reveals when the Seer checks a player.', [['wolf', 'Werewolf or not'], ['role', 'Exact role']]),
        tgl('selfHeal', 'Healer can protect themselves', 'Turn off for a harder game: the Healer must always save someone else.')
      ] },
      { label: 'Day & voting', color: '#ffc98a', icon: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M2 12h2 M20 12h2', items: [
        tgl('skipVote', 'Village may skip the vote', 'If most players agree, nobody is voted out that day.'),
        chc('tie', 'If the vote is tied', 'What to do when two players get the same number of votes.', [['none', 'No one is out'], ['revote', 'Vote again'], ['host', 'Host decides']])
      ] },
      { label: 'When someone is out', color: '#ff8a9b', icon: 'M12 3a7 7 0 0 0-7 7c0 2.6 1.3 4.3 3 5.3V19h8v-3.7c1.7-1 3-2.7 3-5.3a7 7 0 0 0-7-7z', items: [
        tgl('reveal', 'Reveal their card', 'Everyone learns the role of a player who is killed or voted out.'),
        tgl('silentDead', 'The dead stay silent', 'Players who are out may not talk, hint or react until the game ends.')
      ] },
      { label: 'Players’ phones', color: '#a6eedd', icon: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M11 18h2', items: [
        tgl('showRoles', 'Show this round’s roles in the game guide', 'Players can read which roles are in the deck. Turn off for a mystery game.')
      ] }
    ];
    const ruleShort = { peaceful: 'Peaceful first night', wolfPick: 'Wolves must all agree', seerSees: 'Seer sees exact role', selfHeal: 'No self-heal', skipVote: 'No skipping votes', tie: rules.tie === 'revote' ? 'Ties: vote again' : 'Ties: host decides', reveal: 'Cards stay hidden', silentDead: 'The dead may talk', showRoles: 'Mystery role list' };
    const changed = Object.keys(ruleDefaults).filter(k => rules[k] !== ruleDefaults[k]).map(k => ruleShort[k]);
    const rulesSummary = changed.length ? changed.slice(0, 2).join(' · ') + (changed.length > 2 ? ' · +' + (changed.length - 2) + ' more' : '') : 'Classic rules · tap to customize';
    const screen = s.screen || this.props.screen || 'players';
    const sheetOpen = s.sheet !== undefined ? s.sheet : (!!this.props.sheet && screen === 'roles');
    const phase = st('phase', this.props.phase || 'night');
    const night = phase === 'night';
    const round = st('round', 1);

    // ---------- players ----------
    // NET: players come from the room server
    const netPlayers = (this.props.net && this.props.net.players) || [];
    const palette = {}; netPlayers.forEach(p => { palette[p.name] = p.color; });
    const names = netPlayers.map(p => p.name);
    const n = names.length;
    const players = netPlayers.map(p => ({ name: p.name, initial: (p.name[0] || '?').toUpperCase(), color: p.color, connected: p.connected, kick: () => this.props.onKick && this.props.onKick(p.name) }));

    // ---------- deck ----------
    const custom = s.custom || [];
    const edits = s.edits || {};
    const applyEdit = r => (edits[r.key] ? { ...r, ...edits[r.key] } : r);
    const all = this.catalog().map(applyEdit).concat(custom.map(applyEdit));
    const byKey = {}; all.forEach(r => { byKey[r.key] = r; });
    const hidden = s.hidden || [];
    const visible = all.filter(r => hidden.indexOf(r.key) < 0);
    const KEEP = ['werewolf', 'villager']; // every deck needs these, so they can't be deleted
    const openEdit = (r) => this.setState({ sheet: true, editing: r.key, draft: { name: r.name, team: r.team, strength: r.strength, desc: r.blurb, iconD: r.icon, color: r.color, rgb: r.rgb, auto: {}, search: 'idle' } });
    const counts = s.counts || { werewolf: 2, villager: 2, mason: 0 };
    const picked = s.picked || ['seer', 'healer', 'hunter', 'apprentice', 'wolfcub', 'doppelganger'];
    const setCount = (k, v) => this.setState({ counts: { ...counts, [k]: v } });
    const counted = visible.filter(r => r.kind !== 'unique').map(r => {
      const c = counts[r.key] || 0;
      const pair = r.kind === 'pair';
      return {
        ...r, count: c, strText: this.str(r.strength), ...this.strStyle(r.strength),
        soft: 'rgba(' + r.rgb + ',.16)', edge: 'rgba(' + r.rgb + ',.45)',
        border: c > 0 ? 'rgba(' + r.rgb + ',.4)' : 'rgba(236,230,246,.07)',
        bg: c > 0 ? 'rgba(' + r.rgb + ',.08)' : 'rgba(20,12,34,.66)',
        countFg: c > 0 ? '#f6f1ff' : '#7f7397',
        edit: () => openEdit(r),
        inc: () => setCount(r.key, pair ? (c === 0 ? 2 : Math.min(4, c + 1)) : Math.min(16, c + 1)),
        dec: () => setCount(r.key, pair ? (c <= 2 ? 0 : c - 1) : Math.max(r.key === 'werewolf' ? 1 : 0, c - 1))
      };
    });
    const uniques = visible.filter(r => r.kind === 'unique').map(r => {
      const on = picked.indexOf(r.key) >= 0;
      return {
        ...r, on, off: !on, strText: this.str(r.strength), ...this.strStyle(r.strength),
        soft: 'rgba(' + r.rgb + ',.16)', edge: 'rgba(' + r.rgb + ',.4)',
        border: on ? r.color : 'rgba(236,230,246,.08)',
        bg: on ? 'rgba(' + r.rgb + ',.14)' : 'rgba(20,12,34,.66)',
        glow: on ? '0 0 22px rgba(' + r.rgb + ',.22)' : 'none',
        edit: () => openEdit(r),
        toggle: () => this.setState({ picked: on ? picked.filter(k => k !== r.key) : picked.concat([r.key]) })
      };
    });
    const mkGroup = (label, dot, fg, items) => ({ label, dot, fg, items, picked: items.filter(i => i.on).length + ' added' });
    const groups = [
      mkGroup('Village side', '#8fe0b8', '#a6eedd', uniques.filter(r => r.team === 'Village' && !r.custom)),
      mkGroup('Wolf side', '#e0475f', '#ff8a9b', uniques.filter(r => r.team === 'Werewolves' && !r.custom)),
      mkGroup('On their own', '#c9a27a', '#e3c7a5', uniques.filter(r => r.team === 'Loner' && !r.custom))
    ];
    const customItems = uniques.filter(r => r.custom);
    if (customItems.length) groups.push(mkGroup('Your roles', '#c7a8ff', '#d9c6ff', customItems));
    const total = counted.reduce((a, r) => a + r.count, 0) + uniques.filter(r => r.on).length;
    const score = counted.reduce((a, r) => a + r.count * r.strength, 0) + uniques.filter(r => r.on).reduce((a, r) => a + r.strength, 0);
    const wolfCards = counts.werewolf || 0;
    const clamp = Math.max(-15, Math.min(15, score));
    let balLabel = 'Fair game', balColor = '#e9dcff';
    if (score > 3) { balLabel = 'Village favored'; balColor = '#8fe0b8'; }
    if (score < -3) { balLabel = 'Wolves favored'; balColor = '#ff8a9b'; }
    const diff = n - total;
    let deckHint = 'Ready — ' + total + ' cards for ' + n + ' players', deckColor = '#8fe0b8';
    if (wolfCards === 0) { deckHint = 'Add at least one Werewolf'; deckColor = '#f2a65a'; }
    else if (diff > 0) { deckHint = 'Add ' + diff + ' more card' + (diff > 1 ? 's' : '') + ' — one for each player'; deckColor = '#f2a65a'; }
    else if (diff < 0) { deckHint = 'Remove ' + (-diff) + ' card' + (diff < -1 ? 's' : '') + ' — more cards than players'; deckColor = '#f2a65a'; }
    const ready = diff === 0 && wolfCards > 0;

    // ---------- draft ----------
    const icons = this.icons(), colors = this.colors();
    const iconD = (k) => (icons.find(i => i.key === k) || icons[0]).d;
    const editScenario = this.props.scenario === 'edit';
    const editing = s.editing !== undefined ? s.editing : (editScenario ? 'seer' : null);
    const editingRole = editing ? byKey[editing] : null;
    const demoDraft = editingRole
      ? { name: editingRole.name, team: editingRole.team, strength: editingRole.strength, desc: editingRole.blurb, iconD: editingRole.icon, color: editingRole.color, rgb: editingRole.rgb, auto: {}, search: 'idle' }
      : { name: 'Little Girl', team: 'Village', strength: 4, desc: this.kb()[0].desc, iconD: iconD('eye'), color: '#f08fb8', rgb: '240,143,184', auto: { team: true, strength: true, desc: true, icon: true }, search: 'found', found: { name: 'Little Girl', source: 'Werewolves of Millers Hollow' } };
    const d = s.draft || demoDraft;
    const auto = d.auto || {};
    const setDraft = (patch, clear) => this.setState(prev => {
      const cur = prev.draft || d;
      const a = { ...(cur.auto || {}) }; if (clear) a[clear] = false;
      return { draft: { ...cur, ...patch, auto: a } };
    });
    const dr = {
      ...d, icon: d.iconD, displayName: d.name || 'New role', strText: this.str(d.strength),
      strColor: this.strStyle(d.strength).strFg,
      soft: 'rgba(' + d.rgb + ',.18)', edge: 'rgba(' + d.rgb + ',.5)', tint: 'rgba(' + d.rgb + ',.16)'
    };
    const teamOpts = ['Village', 'Werewolves', 'Loner'].map(t => ({
      label: t, on: d.team === t, bg: d.team === t ? '#e9dcff' : 'transparent', fg: d.team === t ? '#160b28' : '#c4b8da',
      pick: () => setDraft({ team: t }, 'team')
    }));
    const iconList = icons.some(i => i.d === d.iconD) ? icons : [{ key: 'current', label: 'Current symbol', d: d.iconD }].concat(icons.slice(0, 17));
    const iconOpts = iconList.map(i => {
      const on = i.d === d.iconD;
      return {
        ...i, on,
        border: on ? d.color : 'rgba(236,230,246,.1)',
        bg: on ? 'rgba(' + d.rgb + ',.16)' : 'rgba(10,6,18,.5)',
        fg: on ? d.color : '#c4b8da',
        pick: () => setDraft({ iconD: i.d }, 'icon')
      };
    });
    const colorList = colors.some(c => c.hex === d.color) ? colors : [{ hex: d.color, rgb: d.rgb, label: 'Current color' }].concat(colors);
    const colorOpts = colorList.map(c => ({ ...c, on: c.hex === d.color, ring: c.hex === d.color ? '#f6f1ff' : 'transparent', pick: () => setDraft({ color: c.hex, rgb: c.rgb }) }));

    // online lookup (mocked)
    const setName = (e) => {
      const v = e.target.value;
      const go = v.trim().length >= 3 && !(editingRole && v.trim().toLowerCase() === editingRole.name.toLowerCase());
      setDraft({ name: v, search: go ? 'searching' : 'idle' });
      clearTimeout(this._lk);
      if (!go) return;
      this._lk = setTimeout(() => {
        const hit = this.lookup(v, visible, editing, hidden);
        this.setState(prev => {
          const cur = prev.draft || d;
          if (cur.name !== v) return null;
          if (!hit) return { draft: { ...cur, search: 'none', auto: {} } };
          if (hit.existing) return { draft: { ...cur, search: 'exists', existingKey: hit.key, found: { name: hit.name } } };
          return { draft: { ...cur, search: 'found', found: { name: hit.name, source: hit.source }, team: hit.team, strength: hit.strength, desc: hit.desc, iconD: hit.iconPath || iconD(hit.icon), color: hit.color, rgb: hit.rgb, auto: { team: true, strength: true, desc: true, icon: true } } };
        });
      }, 900);
    };
    const S = { search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M20 20l-4-4', globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z', check: 'M5 12.5l4.5 4.5L19 7.5', warn: 'M12 4l9 16H3z M12 10v4 M12 17h.01' };
    const q = '“' + (d.name || '').trim() + '”';
    let lk = { show: false };
    {
      if (d.search === 'searching') lk = { show: true, title: 'Searching online…', text: 'Looking up ' + q + ' in Werewolf rulebooks and fan wikis.', color: '#c7a8ff', icon: S.globe, bg: 'rgba(167,127,240,.1)', border: 'rgba(199,168,255,.25)' };
      else if (d.search === 'found') lk = { show: true, title: 'Found “' + d.found.name + '” · ' + d.found.source, text: 'Side, strength, card text and symbol were filled in for you. Change anything you like.', color: '#8fe0b8', icon: S.check, bg: 'rgba(98,212,166,.1)', border: 'rgba(98,212,166,.3)' };
      else if (d.search === 'none') lk = { show: true, title: 'No match found online', text: 'We couldn’t find ' + q + '. Fill in the details below — you know your table best.', color: '#f2a65a', icon: S.warn, bg: 'rgba(242,166,90,.1)', border: 'rgba(242,166,90,.3)' };
      else if (d.search === 'exists') lk = { show: true, title: '“' + d.found.name + '” is already in your deck', text: 'Edit the existing role instead of making a copy.', color: '#e9dcff', icon: S.check, bg: 'rgba(167,127,240,.12)', border: 'rgba(199,168,255,.3)', canEditExisting: true, editExisting: () => openEdit(byKey[d.existingKey]) };
      else if (editing) lk = { show: true, title: 'Rename to auto-fill', text: 'Type another role’s name and its side, strength, card text and symbol are filled in for you.', color: '#c4b8da', icon: S.search, bg: 'rgba(255,255,255,.04)', border: 'rgba(236,230,246,.1)' };
      else lk = { show: true, title: 'Type a name to auto-fill', text: 'We’ll look the role up online and fill in the rest for you.', color: '#c4b8da', icon: S.search, bg: 'rgba(255,255,255,.04)', border: 'rgba(236,230,246,.1)' };
    }
    lk.searching = d.search === 'searching'; lk.notSearching = !lk.searching;
    if (!lk.canEditExisting) { lk.canEditExisting = false; }

    // ---------- the game ----------
    const deck = [];
    counted.forEach(r => { for (let i = 0; i < r.count; i++) deck.push(r); });
    uniques.filter(r => r.on).forEach(r => deck.push(r));
    const order = [3, 0, 7, 1, 5, 9, 2, 8, 4, 6, 10, 11, 12, 13, 14, 15];
    const shuffled = order.filter(i => i < deck.length).map(i => deck[i]).concat(deck.slice(order.length));
    const status = st('status', {});
    const override = st('override', {});
    const dismissed = st('dismissed', []);
    const checks = st('checks', []);
    const tough = st('tough', null);
    const dgDone = st('dgDone', null);
    const dismissAll = !!init.dismissAll && s.dismissed === undefined;
    const hide = !!s.hide;

    const baseRole = {}; names.forEach((nm, i) => { baseRole[nm] = byKey[((this.props.net && this.props.net.assign) || {})[nm]] || shuffled[i] || byKey.villager; /* NET: server deals the cards */ });
    const roleOf = (nm) => (override[nm] && byKey[override[nm]]) || baseRole[nm];
    const isOut = (nm) => !!status[nm];
    const alive = names.filter(nm => !isOut(nm));
    const aliveWith = (key) => alive.filter(nm => roleOf(nm).key === key);
    const inGame = (key) => names.some(nm => roleOf(nm).key === key);
    const isWolf = (r) => r.team === 'Werewolves' && r.key !== 'minion' && r.key !== 'sorceress';
    const wolvesAlive = alive.filter(nm => isWolf(roleOf(nm))).length;
    const othersAlive = alive.length - wolvesAlive;
    const dgName = names.find(nm => baseRole[nm].key === 'doppelganger' && !override[nm] && !isOut(nm));

    // ---------- history (storyteller timeline) ----------
    const log = st('log', []);
    const ev = (t, extra) => ({ t, round, phase, ...(extra || {}) });
    // Re-marking someone in the same phase is a correction: replace their entry instead of stacking another
    const unlog = (lg, nm) => lg.filter(e => !(e.name === nm && e.round === round && e.phase === phase && ['out', 'back', 'tough', 'cursed', 'prince'].indexOf(e.t) >= 0));
    const markPatch = (nm, how) => {
      const next = { ...status };
      if (how === 'alive') delete next[nm]; else next[nm] = { how, round, phase };
      const lg = unlog(log, nm);
      const fixedHere = lg.length !== log.length;
      const patch = { status: next, log: how !== 'alive' ? lg.concat([ev('out', { how, name: nm, role: roleOf(nm).name })]) : fixedHere ? lg : lg.concat([ev('back', { name: nm })]) };
      if (how !== 'alive' && how !== 'removed' && dgName && nm !== dgName) {
        patch.dg = { dead: nm, choice: roleOf(nm).key };
        patch.markOpen = false;
      }
      return patch;
    };
    const mark = (nm, how) => this.setState(markPatch(nm, how));
    const statusOpts = [['alive', 'Alive', '#62d4a6', '#0d2a20'], ['night', 'Killed', '#ff8a9b', '#2b0b14'], ['voted', 'Voted', '#f2a65a', '#2a1606'], ['removed', 'Left', '#b9acd2', '#1a1424']];
    const dealt = names.map(nm => {
      const r = roleOf(nm);
      const cur = status[nm] ? status[nm].how : 'alive';
      const out = cur !== 'alive';
      return {
        name: nm, initial: nm[0], color: palette[nm], out,
        opacity: out ? 0.55 : 1, strike: out ? 'line-through' : 'none',
        rowBg: out ? 'rgba(10,6,18,.5)' : 'rgba(20,12,34,.75)',
        rowBorder: out ? 'rgba(236,230,246,.05)' : 'rgba(236,230,246,.09)',
        roleName: hide ? 'Hidden' : r.name, roleColor: hide ? '#a99bc2' : r.color,
        roleSoft: hide ? 'rgba(255,255,255,.06)' : 'rgba(' + r.rgb + ',.14)',
        roleIcon: hide ? 'M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7' : r.icon,
        opts: statusOpts.map(([k, label, col, ink]) => ({ label, on: cur === k, bg: cur === k ? col : 'transparent', fg: cur === k ? ink : '#a99bc2', pick: () => mark(nm, k) }))
      };
    });

    // ---------- alerts ----------
    const alerts = [];
    const tone = (rgb, color) => ({ color, soft: 'rgba(' + rgb + ',.18)', border: 'rgba(' + rgb + ',.45)', bg: 'linear-gradient(160deg, rgba(' + rgb + ',.16), rgba(18,10,31,.88))', glow: 'rgba(' + rgb + ',.16)' });
    const push = (id, kicker, title, text, rgb, color, icon, action) => {
      if (dismissAll || dismissed.indexOf(id) >= 0) return;
      alerts.push({
        id, kicker, title, text, icon, ...tone(rgb, color),
        hasAction: !!action, actLabel: action ? action.label : '', act: action ? action.fn : null,
        dismiss: () => this.setState({ dismissed: dismissed.concat([id]) })
      });
    };
    const cupidIn = inGame('cupid');
    names.filter(isOut).forEach(nm => {
      const r = roleOf(nm); const how = status[nm].how; const k = r.key;
      if (how === 'removed') return;
      if (k === 'wolfcub') push('cub-' + nm, 'Wolf Cub · ' + nm, 'Next night, the wolves take TWO victims', nm + ' was the Wolf Cub. When the werewolves wake next night, tell them to choose two players instead of one.', '255,111,97', '#ff8f84', r.icon);
      if (k === 'hunter') push('hunter-' + nm, 'Hunter · ' + nm, 'The Hunter takes a last shot — now', 'Before anything else, ask ' + nm + ' to point at one player. That player is eliminated too. Mark them in the list.', '242,166,90', '#f2a65a', r.icon, { label: 'Mark their target', fn: () => this.setState({ markOpen: true }) });
      if (k === 'seer') {
        const app = aliveWith('apprentice')[0];
        if (app) push('app-' + nm, 'Seer · ' + nm, 'The Apprentice Seer takes over', 'From tonight, wake ' + app + ' (Apprentice Seer) in the Seer’s place. They now check one player each night.', '166,200,255', '#a6c8ff', byKey.apprentice.icon);
      }
      if (k === 'prince' && how === 'voted') push('prince-' + nm, 'Prince · ' + nm, 'The Prince can’t be voted out', nm + ' shows their card and survives. No one else is eliminated by this vote.', '242,208,107', '#f2d06b', r.icon, { label: 'Undo — keep ' + nm + ' alive', fn: () => { const pt = markPatch(nm, 'alive'); this.setState({ ...pt, log: pt.log.concat([ev('prince', { name: nm })]) }); } });
      if (k === 'toughguy' && how === 'night') push('tough-' + nm, 'Tough Guy · ' + nm, 'Don’t announce this death yet', 'The Tough Guy survives until the end of the next day. Keep ' + nm + ' in the game and mark them out at sunset.', '242,154,122', '#f29a7a', r.icon, { label: 'Keep alive until sunset', fn: () => { const nx = { ...status }; delete nx[nm]; this.setState({ status: nx, tough: nm, log: unlog(log, nm).concat([ev('tough', { name: nm })]) }); } });
      if (k === 'cursed' && how === 'night') push('cursed-' + nm, 'Cursed · ' + nm, 'The Cursed turns instead of dying', nm + ' survives the attack. Tap their shoulder and secretly show a thumbs-up: they are now a Werewolf and wake with the pack.', '165,138,214', '#c2a8f0', r.icon, { label: 'Turn ' + nm + ' into a Werewolf', fn: () => { const nx = { ...status }; delete nx[nm]; this.setState({ status: nx, override: { ...override, [nm]: 'werewolf' }, log: unlog(log, nm).concat([ev('cursed', { name: nm })]) }); } });
      if (k === 'tanner' && how === 'voted') push('tanner-' + nm, 'Tanner · ' + nm, 'The Tanner wins!', nm + ' wanted to be voted out — and got their wish. The Tanner wins alone. You can keep playing for everyone else.', '201,162,122', '#d9b48a', r.icon);
      if (cupidIn) push('love-' + nm, 'Cupid’s lovers', 'Was ' + nm + ' one of the lovers?', 'If so, the other lover dies of heartbreak right away. Mark them out too.', '240,143,184', '#f08fb8', byKey.cupid.icon, { label: 'Mark the other lover', fn: () => this.setState({ markOpen: true }) });
    });
    if (dgDone) {
      const nr = byKey[dgDone.role] || byKey.villager;
      push('dg-' + dgDone.name, 'Doppelgänger · ' + dgDone.name, dgDone.name + ' is now the ' + nr.name, 'Their phone card has changed. From now on, wake ' + dgDone.name + ' as the ' + nr.name + ' when that role is called.', '154,167,184', '#c6d0dc', nr.icon);
    }

    // ---------- night guide ----------
    const first = round === 1;
    const list = (key) => aliveWith(key);
    const cubDeath = names.find(nm => roleOf(nm).key === 'wolfcub' && status[nm] && status[nm].how !== 'removed');
    const rage = night && cubDeath && round === status[cubDeath].round + 1;
    const wolves = alive.filter(nm => isWolf(roleOf(nm)));
    const defs = [];
    const renamed = (key) => { const o = this.catalog().find(r => r.key === key); return o && edits[key] && edits[key].name && edits[key].name !== o.name; };
    const add = (key, title, who, say, opts) => defs.push({ key, title: renamed(key) ? byKey[key].name : title, who, say: renamed(key) ? byKey[key].blurb : say, ...(opts || {}) });
    if (first && list('doppelganger').length) add('doppelganger', 'Doppelgänger', list('doppelganger'), 'Wake the Doppelgänger. They silently point at one player to copy. Remember who — you’ll need it if that player dies.', { firstOnly: true });
    if (first && list('cupid').length) add('cupid', 'Cupid', list('cupid'), 'Cupid points at two players. Tap both on the shoulder — they open their eyes and see each other. They are now lovers.', { firstOnly: true });
    const agree = rules.wolfPick === 'unanimous' ? ' They must all point at the same player.' : ' If they disagree, the most-pointed player is chosen.';
    const wolfSay = rage ? 'The Wolf Cub was killed — tonight the wolves choose TWO players to eliminate.' + agree
      : (first && rules.peaceful ? 'Peaceful first night: the werewolves open their eyes only to see each other. No one is eliminated tonight.' : 'Werewolves open their eyes, find each other and silently choose one player to eliminate.' + agree);
    if (wolves.length) add('werewolf', 'Werewolves', wolves, wolfSay, { rage, peaceful: first && rules.peaceful });
    if (first && list('minion').length) add('minion', 'Minion', list('minion'), 'Werewolves raise a thumb with eyes closed. The Minion opens their eyes to see who they are.', { firstOnly: true });
    if (first && list('mason').length) add('mason', 'Masons', list('mason'), 'Masons open their eyes and look at each other, then close them.', { firstOnly: true });
    const seerSay = rules.seerSees === 'role' ? 'The Seer points at one player. Quietly show them that player’s exact role on your phone.' : 'The Seer points at one player. Nod for werewolf, shake for not.' + (inGame('lycan') ? ' The Lycan counts as a werewolf here.' : '');
    if (list('seer').length) add('seer', 'Seer', list('seer'), seerSay);
    if (!list('seer').length && list('apprentice').length && names.some(nm => roleOf(nm).key === 'seer')) add('apprentice', 'Apprentice Seer', list('apprentice'), 'The Seer is gone, so the Apprentice now points at one player. Nod for werewolf, shake for not.');
    if (list('sorceress').length) add('sorceress', 'Sorceress', list('sorceress'), 'The Sorceress points at one player. Nod if that player is the Seer.');
    if (list('bodyguard').length) add('bodyguard', 'Bodyguard', list('bodyguard'), 'The Bodyguard points at one player to guard — not the same player as last night.');
    if (list('healer').length) add('healer', 'Healer', list('healer'), 'The Healer points at one player to protect tonight.' + (rules.selfHeal ? ' They may choose themselves.' : ' They may not choose themselves.'));
    if (list('witch').length) add('witch', 'Witch', list('witch'), 'Point at tonight’s victim. The Witch may save them, poison someone else, or do nothing.');
    if (list('oldhag').length) add('oldhag', 'Old Hag', list('oldhag'), 'The Old Hag points at one player. That player must sit out all of tomorrow.');
    custom.forEach(c => { if (list(c.key).length) add(c.key, c.name, list(c.key), c.blurb); });
    const ck = (key) => round + '-' + key;
    const nightSteps = defs.map((x, i) => {
      const r = byKey[x.key] || byKey.werewolf;
      const done = checks.indexOf(ck(x.key)) >= 0;
      const tag = x.rage ? 'Two victims!' : (x.peaceful ? 'Peaceful night' : (x.firstOnly ? 'First night only' : ''));
      return {
        num: done ? '✓' : String(i + 1), title: x.title, who: x.who.join(', '), say: x.say, icon: r.icon, color: r.color, done,
        hasTag: !!tag, tag, tagFg: x.rage ? '#ffd0cb' : '#e9dcff', tagBg: x.rage ? 'rgba(255,111,97,.3)' : 'rgba(167,127,240,.25)',
        numBg: done ? '#62d4a6' : 'rgba(' + r.rgb + ',.2)', numFg: done ? '#0d2a20' : r.color,
        border: x.rage ? 'rgba(255,111,97,.6)' : (done ? 'rgba(98,212,166,.3)' : 'rgba(236,230,246,.08)'),
        bg: x.rage ? 'rgba(255,111,97,.1)' : 'rgba(10,6,18,.45)', opacity: done ? 0.6 : 1, strike: done ? 'line-through' : 'none',
        tick: () => this.setState({ checks: done ? checks.filter(c => c !== ck(x.key)) : checks.concat([ck(x.key)]) })
      };
    });
    const doneCount = nightSteps.filter(x => x.done).length;

    // ---------- day guide ----------
    const nightDeaths = names.filter(nm => status[nm] && status[nm].phase === 'night' && status[nm].round === round && status[nm].how !== 'removed');
    const daySteps = [
      { num: '1', title: 'Announce the night', text: nightDeaths.length ? 'Say who was eliminated: ' + nightDeaths.join(', ') + '.' + (rules.reveal ? ' Reveal their card to everyone.' : ' Keep their card secret.') + (rules.silentDead ? ' Ask them to stay silent from now on.' : ' They may still listen and react, but not vote.') : 'If no one was marked, say: “Everyone survived the night.”' },
      { num: '2', title: 'Let the village talk', text: 'Give everyone 2–5 minutes to share suspicions and accuse.' },
      { num: '3', title: 'Hold the vote', text: 'Count hands for the most-accused player.' + (rules.skipVote ? ' The village may also vote to skip — then no one is out.' : ' Someone must be voted out.') + ({ none: ' On a tie, no one is out today.', revote: ' On a tie, vote again between the tied players.', host: ' On a tie, you decide.' })[rules.tie] + ' Then tap Mark players → Voted.' }
    ];
    if (tough && !isOut(tough)) daySteps.push({ num: '4', title: 'At sunset', text: 'Mark ' + tough + ' as Killed — the Tough Guy’s extra day is over.' });
    const dr2 = (key, text) => { const r = byKey[key]; return aliveWith(key).length ? [{ name: r.name + ' (' + aliveWith(key).join(', ') + ')', text, color: r.color, icon: r.icon }] : []; };
    const dayRules = [].concat(
      dr2('prince', 'if voted out, they reveal and survive.'),
      dr2('mayor', 'once revealed, their vote counts twice.'),
      dr2('idiot', 'must always vote to eliminate someone.'),
      dr2('hunter', 'if voted out, they shoot one player right away.'),
      dr2('tanner', 'wins if voted out — watch for suspicious acting.'),
      dr2('oldhag', 'the player they banished last night can’t talk or vote.')
    );

    // ---------- game end ----------
    const anyOut = names.some(isOut);
    const villageWins = anyOut && wolvesAlive === 0;
    const wolvesWin = anyOut && wolvesAlive > 0 && wolvesAlive >= othersAlive;
    const gameOver = villageWins || wolvesWin;
    const endTips = [];
    if (inGame('hunter') && aliveWith('hunter').length === 0 && names.some(nm => roleOf(nm).key === 'hunter' && status[nm] && status[nm].round === round)) endTips.push('The Hunter just fell — let them take their shot first. It can change the result.');
    if (wolvesWin && (inGame('minion') || inGame('sorceress'))) endTips.push('The Minion and Sorceress win with the werewolves.');
    if (villageWins && (inGame('minion') || inGame('sorceress'))) endTips.push('The Minion and Sorceress lose with the werewolves.');
    if (inGame('tanner')) endTips.push('A Tanner who was voted out has already won on their own.');
    if (cupidIn) endTips.push('If the two lovers are the last ones standing, they win together.');
    if (inGame('doppelganger')) endTips.push('The Doppelgänger wins with the team of the role they copied.');
    endTips.push('Ask everyone to show their cards and enjoy the reveal!');
    const wolfNames = alive.filter(nm => isWolf(roleOf(nm)));

    // ---------- history view ----------
    const who = (e) => e.name + (hide || !e.role ? '' : ' (' + e.role + ')');
    const evLine = (e) => ({
      out: { night: who(e) + ' was killed', voted: who(e) + ' was voted out by the village', removed: e.name + ' left the game' }[e.how],
      back: e.name + ' is back in the game',
      tough: e.name + ' was attacked but, as the Tough Guy, lives until sunset',
      cursed: e.name + ' was attacked and, being Cursed, turned into a Werewolf',
      prince: e.name + ' revealed the Prince and survived the vote',
      dg: e.name + ' (Doppelgänger) became the ' + e.role,
      note: e.text,
    }[e.t]);
    const evColor = (e) => (e.t === 'out' ? { night: '#ff8a9b', voted: '#f2a65a', removed: '#b9acd2' }[e.how] : { back: '#62d4a6', tough: '#f29a7a', cursed: '#c2a8f0', prince: '#f2d06b', dg: '#c6d0dc', note: '#e8d3a0' }[e.t]) || '#c7a8ff';
    const chapters = [];
    log.forEach((e, i) => {
      if (e.t === 'start' || e.t === 'phase') {
        chapters.push({ title: (e.phase === 'night' ? 'Night ' : 'Day ') + e.round, night: e.phase === 'night', sub: e.t === 'start' ? e.players + ' players · ' + (hide ? 'cards dealt' : e.text) : '', items: [] });
        return;
      }
      if (!chapters.length) chapters.push({ title: 'Night 1', night: true, sub: '', items: [] });
      chapters[chapters.length - 1].items.push({ text: evLine(e), color: evColor(e), note: e.t === 'note', del: e.t === 'note' ? () => this.setState({ log: log.filter((_, j) => j !== i) }) : null });
    });
    chapters.forEach((c, i) => {
      c.empty = !c.items.length;
      c.emptyText = i === chapters.length - 1 ? 'Nothing yet.' : c.night ? 'A quiet night — no one died.' : 'No one was voted out.';
      c.icon = c.night ? 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z' : 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4';
      c.tint = c.night ? '#c7a8ff' : '#f2c58a';
    });
    const outcome = gameOver ? (villageWins ? 'The village wins! Every werewolf has been found.' : 'The werewolves win! ' + wolfNames.join(' and ') + ' now rule the village.') : '';
    const storyText = ['Moonfall — the story so far', '']
      .concat(...chapters.map(c => [c.title + (c.sub ? ' — ' + c.sub : '')].concat(c.empty ? ['  ' + c.emptyText] : c.items.map(it => '  • ' + it.text), [''])))
      .concat(outcome ? ['The end: ' + outcome] : []).join('\n').trim();
    const copyStory = () => {
      const done = () => { this.setState({ copied: true }); clearTimeout(this.copiedTimer); this.copiedTimer = setTimeout(() => this.setState({ copied: false }), 1800); };
      // navigator.clipboard needs https; on the local Wi-Fi (http) fall back to a hidden textarea
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(storyText).then(done, () => {}); return; }
      const ta = document.createElement('textarea'); ta.value = storyText; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } ta.remove();
    };

    const stepKeys = ['players', 'roles', 'play'];
    const idx = stepKeys.indexOf(screen);
    const steps = [['players', '1 · Players'], ['roles', '2 · Roles'], ['play', '3 · Play']].map(([k, label], i) => ({
      label, current: i === idx, locked: k === 'play' && screen !== 'play',
      bar: i < idx ? '#a77ff0' : (i === idx ? '#e9dcff' : 'rgba(236,230,246,.14)'),
      fg: i === idx ? '#f6f1ff' : (i < idx ? '#c7a8ff' : '#8f82a8'),
      go: () => this.setState({ screen: k, sheet: false })
    }));

    // doppelgänger sheet
    const dgState = st('dg', null);
    const dgOpen = screen === 'play' && !!dgState && !!names.find(nm => baseRole[nm].key === 'doppelganger');
    const dgWho = names.find(nm => baseRole[nm].key === 'doppelganger') || '';
    const dgRole = dgState ? (byKey[dgState.choice] || byKey.villager) : byKey.villager;
    const inPlayKeys = [];
    names.forEach(nm => { const k = baseRole[nm].key; if (k !== 'doppelganger' && inPlayKeys.indexOf(k) < 0) inPlayKeys.push(k); });
    const dgChoices = inPlayKeys.map(k => {
      const r = byKey[k]; const on = dgState && dgState.choice === k;
      return { name: r.name, icon: r.icon, on, border: on ? r.color : 'rgba(236,230,246,.14)', bg: on ? 'rgba(' + r.rgb + ',.2)' : 'rgba(255,255,255,.04)', fg: on ? r.color : '#c4b8da', pick: () => this.setState({ dg: { ...dgState, choice: k } }) };
    });

    const inPlayDay = screen === 'play' && !night;
    return {
      steps,
      ruleGroups, rulesSummary,
      rulesOpen: screen === 'players' && !!st('rulesOpen', false),
      openRules: () => this.setState({ rulesOpen: true }),
      closeRules: () => this.setState({ rulesOpen: false }),
      resetRules: () => this.setState({ rules: {} }),
      isPlayers: screen === 'players', isRoles: screen === 'roles', isPlay: screen === 'play', sheetOpen,
      go: { players: () => this.setState({ screen: 'players' }), roles: () => this.setState({ screen: 'roles' }) },
      skyBg: inPlayDay
        ? 'radial-gradient(130% 70% at 75% 4%, #b0607a 0%, #6a3462 34%, #2a1238 70%, #120a1c 100%)'
        : 'radial-gradient(120% 70% at 80% 6%, #3b2163 0%, #1a0f2e 42%, #0a0612 78%)',
      orbBg: inPlayDay ? 'radial-gradient(circle, #ffe9c4, #f2a65a 70%)' : 'radial-gradient(circle at 38% 36%, #fffaf0, #ece2c6 45%, #c9bc9c)',
      orbGlow: inPlayDay ? '0 0 90px 40px rgba(242,166,90,.4)' : '0 0 60px 20px rgba(241,233,210,.18)',
      orbTop: inPlayDay ? '120px' : '50px',
      starOpacity: inPlayDay ? 0 : 1,

      qrSrc: (this.props.info && this.props.info.qr) || '', joinHost: (this.props.info && this.props.info.host) || '…', // NET
      roomLangs: [['en', 'English'], ['zh', '中文'], ['ko', '한국어'], ['ja', '日本語'], ['fr', 'Français'], ['th', 'ไทย'], ['es', 'Español']].map(([code, native]) => {
        const on = (s.roomLang || 'en') === code;
        return { code, native, on, border: on ? 'rgba(233,220,255,.85)' : 'rgba(236,230,246,.14)', bg: on ? '#e9dcff' : 'rgba(255,255,255,.04)', fg: on ? '#160b28' : '#d8cfe8', pick: () => this.setState({ roomLang: code }) };
      }),
      players, playerCount: n, tooFew: n < 5,
      // Test players (added by the server, no phone) — handy for trying the game alone
      fakeInput: this.state.fakeN || '', fakeValid: +this.state.fakeN >= 1 && +this.state.fakeN <= 20,
      fakeHave: netPlayers.filter(p => p.fake).length,
      setFake: e => this.setState({ fakeN: e.target.value.replace(/\D/g, '').slice(0, 2) }),
      addFake: e => { e.preventDefault(); const k = +this.state.fakeN; if (k >= 1 && k <= 20 && this.props.onAddFake) { this.props.onAddFake(k); this.setState({ fakeN: '' }); } },
      removeFakes: () => this.props.onRemoveFakes && this.props.onRemoveFakes(),
      playersCtaOpacity: n < 5 ? 0.45 : 1,
      playersHint: n < 5 ? 'You need at least 5 players to start' : n + ' players are in. Late arrivals can still join.',

      counted, groups, totalCards: total, scoreText: this.str(score),
      balLabel, balColor, balPos: Math.round((clamp + 15) / 30 * 100) + '%',
      deckHint, deckColor, cantDeal: !ready, dealOpacity: ready ? 1 : 0.45,
      beginnerSet: () => {
        const w = Math.max(1, Math.round(n / 4));
        this.setState({ counts: { werewolf: w, villager: Math.max(0, n - w - 2), mason: 0 }, picked: ['seer', 'healer'] });
      },
      deal: () => {
        const tally = []; deck.forEach(r => { const t = tally.find(x => x.name === r.name); if (t) t.n++; else tally.push({ name: r.name, n: 1 }); });
        const start = { t: 'start', round: 1, phase: 'night', players: n, text: tally.map(x => (x.n > 1 ? x.n + '× ' : '') + x.name).join(', ') };
        this.props.onDeal && this.props.onDeal(deck.map(r => r.key));
        this.setState({ /* NET */ screen: 'play', phase: 'night', round: 1, status: {}, override: {}, dismissed: [], checks: [], tough: null, dg: null, dgDone: null, markOpen: false, log: [start] });
      },
      openSheet: () => this.setState({ sheet: true, editing: null, draft: { name: '', team: 'Village', strength: 1, desc: '', iconD: iconD('star'), color: '#8fd3e8', rgb: '143,211,232', auto: {}, search: 'idle' } }),
      closeSheet: () => { clearTimeout(this._lk); this.setState({ sheet: false }); },

      dr, teamOpts, iconOpts, colorOpts, lk, auto,
      sheetTitle: editingRole ? 'Edit ' + editingRole.name : 'Create a role',
      sheetKicker: editingRole ? (editingRole.custom ? 'Your role' : 'Role details') : 'New role',
      saveLabel: editingRole ? 'Save changes' : 'Add to the deck',
      strBorder: auto.strength ? 'rgba(199,168,255,.45)' : 'rgba(236,230,246,.1)',
      descBorder: auto.desc ? 'rgba(199,168,255,.55)' : 'rgba(236,230,246,.16)',
      setName,
      setDesc: (e) => setDraft({ desc: e.target.value }, 'desc'),
      strUp: () => setDraft({ strength: Math.min(9, d.strength + 1) }, 'strength'),
      strDown: () => setDraft({ strength: Math.max(-9, d.strength - 1) }, 'strength'),
      draftEmpty: !d.name, addOpacity: d.name ? 1 : 0.45,
      canReset: !!editingRole && !editingRole.custom && !!edits[editing],
      resetLabel: 'Reset to the original',
      resetRole: () => { const nx = { ...edits }; delete nx[editing]; this.setState({ edits: nx, sheet: false }); },
      canDelete: !!editingRole && KEEP.indexOf(editing) < 0,
      deleteLabel: 'Delete ' + (editingRole ? editingRole.name : 'this role'),
      deleteRole: () => {
        clearTimeout(this._lk);
        if (editingRole.custom) this.setState({ custom: custom.filter(c => c.key !== editing), picked: picked.filter(k => k !== editing), sheet: false });
        else this.setState({ hidden: hidden.concat([editing]), picked: picked.filter(k => k !== editing), counts: { ...counts, [editing]: 0 }, sheet: false });
      },
      hasHidden: hidden.length > 0,
      restoreLabel: 'Restore deleted: ' + hidden.map(k => byKey[k] ? byKey[k].name : k).join(', '),
      restoreRoles: () => this.setState({ hidden: [] }),
      saveRole: () => {
        if (editingRole) {
          const patch = { name: d.name, team: d.team, strength: d.strength, blurb: d.desc, icon: d.iconD, color: d.color, rgb: d.rgb };
          if (editingRole.kind !== 'unique' && d.name !== editingRole.name) patch.plural = d.name + 's';
          this.setState({ edits: { ...edits, [editing]: { ...(edits[editing] || {}), ...patch } }, sheet: false });
          return;
        }
        const key = 'c' + Date.now();
        const role = { key, name: d.name, team: d.team, kind: 'unique', strength: d.strength, color: d.color, rgb: d.rgb, blurb: d.desc || 'Custom role.', icon: d.iconD, custom: true };
        this.setState({ custom: custom.concat([role]), picked: picked.concat([key]), sheet: false });
      },

      // play
      dealt, hideRoles: hide,
      hideLabel: hide ? 'Show' : 'Hide', hideIcon: hide ? 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z' : 'M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4 M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6',
      toggleHide: () => this.setState({ hide: !hide }),
      aliveCount: alive.length, outCount: n - alive.length, wolvesAlive, othersAlive,
      markOpen: screen === 'play' && !!st('markOpen', false) && !dgOpen,
      openMark: () => this.setState({ markOpen: true }),
      closeMark: () => this.setState({ markOpen: false }),
      alerts,
      showNightGuide: night && !gameOver, showDayGuide: !night && !gameOver,
      nightIntro: first
        ? 'First night. Say “Everyone, close your eyes.” Then call each role below in order and give each about 10 seconds. Tap a step when it’s done.'
        : 'Say “Night falls — everyone, close your eyes.” Call each role in order. Players who are out are skipped for you.',
      nightSteps, stepsDone: doneCount + ' / ' + nightSteps.length + ' done',
      daySteps, dayRules, hasDayRules: dayRules.length > 0,
      gameOver,
      histOpen: screen === 'play' && !!s.histOpen, openHist: () => this.setState({ histOpen: true }), closeHist: () => this.setState({ histOpen: false }),
      chapters, outcome, hasOutcome: !!outcome, copyStory, copyLabel: s.copied ? 'Copied!' : 'Copy as text',
      noteInput: s.noteDraft || '', setNote: e => this.setState({ noteDraft: e.target.value }),
      addNote: e => { e.preventDefault(); const t = (s.noteDraft || '').trim(); if (t) this.setState({ log: log.concat([ev('note', { text: t })]), noteDraft: '' }); },
      endTitle: villageWins ? 'The village wins!' : 'The werewolves win!',
      endText: villageWins ? 'Every werewolf has been found and eliminated.' : (wolfNames.join(' and ') + ' now equal the rest of the village. Nobody can outvote them.'),
      endTips,
      endColor: villageWins ? '#8fe0b8' : '#ff8a9b',
      endBorder: villageWins ? 'rgba(98,212,166,.5)' : 'rgba(224,71,95,.55)',
      endGlow: villageWins ? 'rgba(98,212,166,.22)' : 'rgba(224,71,95,.25)',
      endBg: villageWins ? 'linear-gradient(170deg, rgba(20,80,60,.6), rgba(18,10,31,.92))' : 'linear-gradient(170deg, rgba(110,20,38,.65), rgba(18,10,31,.92))',
      endIcon: villageWins ? byKey.villager.icon : byKey.werewolf.icon,

      dgOpen, dgChoices,
      dg: {
        dgName: dgWho, dead: dgState ? dgState.dead : '', dgIcon: byKey.doppelganger.icon,
        roleName: dgRole.name, icon: dgRole.icon, color: dgRole.color,
        soft: 'rgba(' + dgRole.rgb + ',.2)', edge: 'rgba(' + dgRole.rgb + ',.55)'
      },
      dgConfirm: () => this.setState({ override: { ...override, [dgWho]: dgState.choice }, dg: null, dgDone: { name: dgWho, role: dgState.choice }, log: log.concat([ev('dg', { name: dgWho, role: dgRole.name })]) }),
      dgSkip: () => this.setState({ dg: null }),

      isNightPhase: night, isDayPhase: !night,
      phaseTitle: (night ? 'Night ' : 'Day ') + round,
      phaseLine: night ? 'Everyone’s eyes are closed.' : 'Everyone wakes. Talk, then vote.',
      heroBg: night ? 'linear-gradient(170deg, rgba(60,34,104,.85), rgba(20,12,36,.85))' : 'linear-gradient(170deg, rgba(160,84,96,.7), rgba(60,26,60,.85))',
      heroBorder: night ? 'rgba(199,168,255,.3)' : 'rgba(255,211,168,.35)',
      heroOrb: night ? 'rgba(241,233,210,.14)' : 'rgba(242,166,90,.22)',
      heroIcon: night ? 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z' : 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
      heroIconColor: night ? '#f1e9d2' : '#ffd3a8',
      nightBtnBg: night ? '#e9dcff' : 'transparent', nightBtnFg: night ? '#160b28' : '#c4b8da',
      dayBtnBg: night ? 'transparent' : '#f2a65a', dayBtnFg: night ? '#c4b8da' : '#1c0e06',
      setNight: () => { if (!night) this.setState({ phase: 'night', round: round + 1, log: log.concat([{ t: 'phase', round: round + 1, phase: 'night' }]) }); },
      setDay: () => { if (night) this.setState({ phase: 'day', round, log: log.concat([{ t: 'phase', round, phase: 'day' }]) }); },
      endGame: () => (this.props.onEnd && this.props.onEnd(), this.setState({ /* NET */ screen: 'players', phase: 'night', round: 1, status: {}, override: {}, dismissed: [], checks: [], tough: null, dg: null, dgDone: null, markOpen: false }))
    };
  }

  render() {
    const v: any = this.renderVals();
    return (
      <div className="sky" style={{ position: 'relative', width: '390px', overflow: 'clip', height: (this.props.frameH ? this.props.frameH + 'px' : '844px') /* NET: fills the phone screen */, fontFamily: "'Manrope', sans-serif", color: '#ece6f6', background: v.skyBg }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: v.orbTop, right: '30px', width: '54px', height: '54px', borderRadius: '50%', background: v.orbBg, boxShadow: v.orbGlow, transition: 'all 1.2s ease' }} />
          <span className="twinkle" style={{ position: 'absolute', top: '74px', left: '40px', width: '2px', height: '2px', borderRadius: '50%', background: '#fff', opacity: v.starOpacity }} />
          <span className="twinkle" style={{ position: 'absolute', top: '130px', left: '170px', width: '3px', height: '3px', borderRadius: '50%', background: '#e6dcff', animationDelay: '1.1s', opacity: v.starOpacity }} />
          <span className="twinkle" style={{ position: 'absolute', top: '40px', left: '250px', width: '2px', height: '2px', borderRadius: '50%', background: '#fff', animationDelay: '2.2s', opacity: v.starOpacity }} />
          <img src="/forest-phone.svg" alt="" style={{ position: 'absolute', left: '0', bottom: '0', width: '390px', height: '280px', objectFit: 'cover', objectPosition: 'bottom', opacity: '.9' }} />
          <div className="fog" style={{ position: 'absolute', left: '0', bottom: '20px', width: '780px', height: '180px', background: 'radial-gradient(40% 50% at 20% 60%, rgba(190,165,240,.11), transparent 70%), radial-gradient(40% 50% at 70% 60%, rgba(190,165,240,.09), transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(10,6,18,0) 40%, rgba(10,6,18,.7) 100%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '54px 20px 14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1e9d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
              </svg>
              <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '16px', letterSpacing: '.22em' }}>
                MOONFALL
              </span>
            </div>
            <nav aria-label="Setup steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' }}>
              {((v.steps) || []).map((st: any, $index: number) => (
                <React.Fragment key={$index}>
                  <button className="press" onClick={st.go} disabled={st.locked} aria-current={st.current} style={{ padding: '0', border: 'none', background: 'transparent', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '7px', textAlign: 'left' }}>
                    <span style={{ height: '4px', borderRadius: '999px', background: st.bar }} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: st.fg }}>
                      {st.label}
                    </span>
                  </button>
                </React.Fragment>
              ))}
            </nav>
          </div>
          {(v.isPlayers) ? (
            <>
              <div className="scroll rise" style={{ flex: '1', minHeight: '0', padding: '6px 20px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h1 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '28px', letterSpacing: '.02em' }}>
                    Invite players
                  </h1>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: '#c4b8da' }}>
                    Everyone scans the code with their phone camera and types their name. That’s it.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', borderRadius: '22px', background: 'rgba(22,13,38,.78)', border: '1px solid rgba(190,165,235,.18)', backdropFilter: 'blur(12px)' }}>
                  <div style={{ padding: '8px', borderRadius: '14px', background: '#ede6f7', flex: 'none' }}>
                    <img src={v.qrSrc} alt="QR code to join" style={{ display: 'block', width: '112px', height: '112px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                      Room code
                    </span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '34px', letterSpacing: '.2em' }}>
                      HOWL
                    </span>
                    <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#a99bc2' }}>
                      No camera? Open{' '}
                      <span style={{ color: '#ece6f6', fontWeight: '600' }}>
                        {v.joinHost}
                      </span>
                    </span>
                  </div>
                </div>
                <section aria-label="Players' language" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px 16px', borderRadius: '20px', background: 'rgba(22,13,38,.72)', border: '1px solid rgba(190,165,235,.16)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c7a8ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                      <path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
                    </svg>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>
                        Language on players’ phones
                      </span>
                      <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#a99bc2' }}>
                        Everyone starts in this language. Each player can still switch on their own phone.
                      </span>
                    </span>
                  </span>
                  <div role="radiogroup" aria-label="Players' language" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {((v.roomLangs) || []).map((l: any, $index: number) => (
                      <React.Fragment key={$index}>
                        <button className="press" role="radio" aria-checked={l.on} onClick={l.pick} lang={l.code} style={{ height: '38px', padding: '0 12px', borderRadius: '999px', border: `1px solid ${l.border}`, background: l.bg, color: l.fg, fontSize: '13.5px', fontWeight: '700' }}>
                          {l.native}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </section>
                <section aria-label="Test players" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px 16px', borderRadius: '20px', background: 'rgba(22,13,38,.72)', border: '1px solid rgba(190,165,235,.16)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c7a8ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                      <path d="M9 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5 M18 8v6 M15 11h6" />
                    </svg>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>
                        Test players
                      </span>
                      <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#a99bc2' }}>
                        Pretend players with no phone, for trying the game alone. Remove them before a real game.
                      </span>
                    </span>
                  </span>
                  <form onSubmit={v.addFake} style={{ display: 'flex', gap: '8px', margin: '0' }}>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label="How many test players" placeholder="How many? (1–20)" value={v.fakeInput} onChange={v.setFake} style={{ flex: '1', minWidth: '0', height: '42px', padding: '0 14px', borderRadius: '14px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit', outline: 'none' }} />
                    <button type="submit" className="press" disabled={!v.fakeValid} style={{ height: '42px', padding: '0 18px', borderRadius: '14px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '14px', fontWeight: '800', letterSpacing: '.06em', opacity: v.fakeValid ? 1 : 0.45 }}>
                      ADD
                    </button>
                  </form>
                  {v.fakeHave > 0 && (
                    <button className="press" onClick={v.removeFakes} style={{ alignSelf: 'flex-start', padding: '0', border: 'none', background: 'none', color: '#ff9fb0', fontSize: '13px', fontWeight: '700' }}>
                      Remove all {v.fakeHave} test player{v.fakeHave > 1 ? 's' : ''}
                    </button>
                  )}
                </section>
                <button className="press" onClick={v.openRules} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '20px', border: '1px solid rgba(232,211,160,.28)', background: 'linear-gradient(150deg, rgba(232,211,160,.1), rgba(22,13,38,.85))', color: '#ece6f6', textAlign: 'left' }}>
                  <span style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(232,211,160,.14)', border: '1px solid rgba(232,211,160,.35)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0dfb4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2 M9 8h6 M9 12h6 M9 16h3" />
                    </svg>
                  </span>
                  <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>
                      House rules
                    </span>
                    <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#cbbfa0' }}>
                      {v.rulesSummary}
                    </span>
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbbfa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                      Joined{' '}
                      <span style={{ color: '#c7a8ff' }}>
                        {v.playerCount}
                      </span>
                    </h2>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8fe0b8' }}>
                      <span className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#62d4a6' }} />
                      Waiting for more
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {((v.players) || []).map((p: any, $index: number) => (
                      <React.Fragment key={$index}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '52px', padding: '0 6px 0 10px', borderRadius: '14px', background: 'rgba(20,12,34,.66)', border: '1px solid rgba(236,230,246,.07)' }}>
                          <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '14px', color: '#12091c', background: p.color }}>
                            {p.initial}
                          </span>
                          <span style={{ flex: '1', fontWeight: '600', fontSize: '15px' }}>
                            {p.name}
                          </span>
                          <button className="press" onClick={p.kick} aria-label={`Remove ${p.name}`} style={{ width: '44px', height: '44px', border: 'none', borderRadius: '12px', background: 'transparent', color: '#8f82a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </button>
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ padding: '14px 20px 30px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'linear-gradient(180deg, rgba(10,6,18,0), rgba(10,6,18,.85) 40%)' }}>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#a99bc2' }}>
                  {v.playersHint}
                </span>
                <button className="press" onClick={v.go.roles} disabled={v.tooFew} style={{ height: '58px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '17px', fontWeight: '700', opacity: v.playersCtaOpacity, boxShadow: '0 0 36px rgba(199,168,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  Next: choose roles{' '}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14 M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </>
          ) : null}
          {(v.isRoles) ? (
            <>
              <div className="scroll rise" style={{ flex: '1', minHeight: '0', padding: '6px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h1 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '28px', letterSpacing: '.02em' }}>
                    Pick the roles
                  </h1>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: '#c4b8da' }}>
                    One card per player. Cards are shuffled and dealt at random.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 12px 12px 16px', borderRadius: '18px', background: 'rgba(232,211,160,.08)', border: '1px solid rgba(232,211,160,.25)' }}>
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#f6e7c1' }}>
                      New to Werewolf?
                    </span>
                    <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#cbbfa0' }}>
                      Werewolves, Villagers, a Seer and a Healer.
                    </span>
                  </span>
                  <button className="press" onClick={v.beginnerSet} style={{ height: '44px', padding: '0 14px', flex: 'none', borderRadius: '12px', border: 'none', background: '#e8d3a0', color: '#1c140a', fontSize: '14px', fontWeight: '700' }}>
                    Use simple set
                  </button>
                </div>
                <section aria-label="Game balance" style={{ padding: '14px 16px', borderRadius: '20px', background: 'rgba(22,13,38,.8)', border: '1px solid rgba(190,165,235,.18)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                        Balance
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '18px', color: v.balColor }}>
                        {v.balLabel}
                      </span>
                    </span>
                    <span style={{ minWidth: '48px', height: '34px', padding: '0 10px', boxSizing: 'border-box', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '18px', background: 'rgba(255,255,255,.06)', color: v.balColor }}>
                      {v.scoreText}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: '10px', borderRadius: '999px', background: 'linear-gradient(90deg, #e0475f 0%, #8a4f9e 38%, #6b5f80 50%, #4f7fb8 62%, #62d4a6 100%)' }}>
                    <span style={{ position: 'absolute', top: '-5px', left: '40%', width: '20%', height: '20px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,.35)', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', top: '-6px', left: v.balPos, width: '22px', height: '22px', marginLeft: '-11px', borderRadius: '50%', background: '#f6f1ff', border: '3px solid #0a0612', boxShadow: '0 0 14px rgba(255,255,255,.5)', transition: 'left .4s cubic-bezier(.2,.8,.2,1)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                    <span style={{ color: '#ff8a9b' }}>
                      Wolves favored
                    </span>
                    <span style={{ color: '#a99bc2' }}>
                      Fair
                    </span>
                    <span style={{ color: '#8fe0b8' }}>
                      Village favored
                    </span>
                  </div>
                  <p style={{ margin: '0', fontSize: '12.5px', lineHeight: '1.45', color: '#a99bc2' }}>
                    Each role has a strength:{' '}
                    <span style={{ color: '#8fe0b8', fontWeight: '700' }}>
                      +
                    </span>
                    {' '}helps the village,{' '}
                    <span style={{ color: '#ff8a9b', fontWeight: '700' }}>
                      −
                    </span>
                    {' '}helps the wolves. Aim for the middle.
                  </p>
                </section>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                      How many of each
                    </h2>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: v.deckColor }}>
                      {v.totalCards} / {v.playerCount} cards
                    </span>
                  </div>
                  {((v.counted) || []).map((r: any, $index: number) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 10px 10px 12px', borderRadius: '18px', border: `1px solid ${r.border}`, background: r.bg, transition: 'border-color .3s ease, background-color .3s ease' }}>
                        <button className="press" onClick={r.edit} aria-label={`Edit ${r.plural}`} style={{ position: 'relative', width: '44px', height: '44px', flex: 'none', padding: '0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.soft, border: `1px solid ${r.edge}` }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d={r.icon} />
                          </svg>
                          <span style={{ position: 'absolute', right: '-4px', bottom: '-4px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9dcff', border: '2px solid #150c24' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#160b28" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 20h4L19 9l-4-4L4 16z" />
                            </svg>
                          </span>
                        </button>
                        <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: '700', fontSize: '15.5px' }}>
                              {r.plural}
                            </span>
                            <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11.5px', fontWeight: '800', color: r.strFg, background: r.strBg }}>
                              {r.strText} each
                            </span>
                          </span>
                          <span style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#a99bc2' }}>
                            {r.countHint}
                          </span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 'none' }}>
                          <button className="press" onClick={r.dec} aria-label={`Fewer ${r.plural}`} style={{ width: '38px', height: '44px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '20px' }}>
                            −
                          </button>
                          <span style={{ width: '28px', textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '19px', color: r.countFg }}>
                            {r.count}
                          </span>
                          <button className="press" onClick={r.inc} aria-label={`More ${r.plural}`} style={{ width: '38px', height: '44px', borderRadius: '12px', border: 'none', background: r.soft, color: '#ece6f6', fontSize: '20px' }}>
                            +
                          </button>
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                    Special roles
                  </h2>
                  <span style={{ fontSize: '13px', color: '#a99bc2' }}>
                    Tap to add. Each one is a single card. Tap the pencil to edit any role.
                  </span>
                </div>
                {((v.groups) || []).map((g: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.dot }} />
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: g.fg }}>
                          {g.label}
                        </span>
                        <span style={{ flex: '1', height: '1px', background: 'rgba(236,230,246,.1)' }} />
                        <span style={{ fontSize: '12px', color: '#a99bc2' }}>
                          {g.picked}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                        {((g.items) || []).map((r: any, $index: number) => (
                          <React.Fragment key={$index}>
                            <div style={{ position: 'relative', display: 'flex' }}>
                              <button className="press" onClick={r.toggle} aria-pressed={r.on} style={{ flex: '1', minHeight: '128px', padding: '12px 12px 14px', borderRadius: '18px', border: `1px solid ${r.border}`, background: r.bg, color: '#ece6f6', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: r.glow }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <span style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.soft, border: `1px solid ${r.edge}` }}>
                                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d={r.icon} />
                                    </svg>
                                  </span>
                                  {(r.on) ? (
                                    <>
                                      <span className="pop" style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.color }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#12091c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                                        </svg>
                                      </span>
                                    </>
                                  ) : null}
                                  {(r.off) ? (
                                    <>
                                      <span style={{ width: '26px', height: '26px', boxSizing: 'border-box', borderRadius: '50%', border: '1.5px solid rgba(236,230,246,.25)' }} />
                                    </>
                                  ) : null}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: '700', fontSize: '14.5px' }}>
                                    {r.name}
                                  </span>
                                  <span style={{ height: '18px', padding: '0 6px', borderRadius: '5px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: r.strFg, background: r.strBg }}>
                                    {r.strText}
                                  </span>
                                </span>
                                <span style={{ fontSize: '12px', lineHeight: '1.35', color: '#b3a6c9', paddingRight: '26px' }}>
                                  {r.blurb}
                                </span>
                              </button>
                              <button className="press" onClick={r.edit} aria-label={`Edit ${r.name}`} style={{ position: 'absolute', right: '4px', bottom: '4px', width: '36px', height: '36px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.07)', color: '#c4b8da', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 20h4L19 9l-4-4L4 16z M14 6l4 4" />
                                </svg>
                              </button>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                <button className="press" onClick={v.openSheet} style={{ height: '56px', flex: 'none', borderRadius: '18px', border: '1px dashed rgba(199,168,255,.45)', background: 'rgba(167,127,240,.08)', color: '#e9dcff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14 M5 12h14" />
                  </svg>
                  {' '}Create your own role
                </button>
                {(v.hasHidden) ? (
                  <button className="press" onClick={v.restoreRoles} style={{ padding: '4px 0', border: 'none', background: 'none', color: '#c7a8ff', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                    {v.restoreLabel}
                  </button>
                ) : null}
              </div>
              <div style={{ padding: '12px 20px 30px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'linear-gradient(180deg, rgba(10,6,18,0), rgba(10,6,18,.9) 40%)' }}>
                <span style={{ textAlign: 'center', fontSize: '13px', fontWeight: '600', color: v.deckColor }}>
                  {v.deckHint}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="press" onClick={v.go.players} aria-label="Back to players" style={{ width: '58px', height: '58px', flex: 'none', borderRadius: '16px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5 M11 6l-6 6 6 6" />
                    </svg>
                  </button>
                  <button className="press" onClick={v.deal} disabled={v.cantDeal} style={{ flex: '1', height: '58px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '17px', fontWeight: '700', opacity: v.dealOpacity, boxShadow: '0 0 36px rgba(199,168,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7h4l10 10h4 M3 17h4l3-3 M14 10l3-3h4 M18 4l3 3-3 3 M18 14l3 3-3 3" />
                    </svg>
                    {' '}Shuffle & deal cards
                  </button>
                </div>
              </div>
            </>
          ) : null}
          {(v.isPlay) ? (
            <>
              <div className="scroll rise" style={{ flex: '1', minHeight: '0', padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <section aria-label="Phase" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '22px', background: v.heroBg, border: `1px solid ${v.heroBorder}`, transition: 'background 1s ease, border-color 1s ease' }}>
                  <span style={{ width: '52px', height: '52px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.heroOrb }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={v.heroIconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.heroIcon} />
                    </svg>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '26px', letterSpacing: '.05em' }}>
                      {v.phaseTitle}
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '17px', color: '#e4d9f0' }}>
                      {v.phaseLine}
                    </span>
                  </span>
                </section>
                <div role="group" aria-label="Switch phase" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', padding: '6px', borderRadius: '20px', background: 'rgba(10,6,18,.6)', border: '1px solid rgba(236,230,246,.1)' }}>
                  <button className="press" onClick={v.setNight} aria-pressed={v.isNightPhase} style={{ height: '56px', borderRadius: '15px', border: 'none', background: v.nightBtnBg, color: v.nightBtnFg, fontSize: '17px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                    </svg>
                    {' '}Night
                  </button>
                  <button className="press" onClick={v.setDay} aria-pressed={v.isDayPhase} style={{ height: '56px', borderRadius: '15px', border: 'none', background: v.dayBtnBg, color: v.dayBtnFg, fontSize: '17px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4" />
                    </svg>
                    {' '}Day
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 10px 10px 14px', borderRadius: '18px', background: 'rgba(20,12,34,.75)', border: '1px solid rgba(236,230,246,.1)' }}>
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>
                      {v.aliveCount} alive{' '}
                      <span style={{ color: '#a99bc2', fontWeight: '600' }}>
                        · {v.outCount} out
                      </span>
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>
                      Wolves left{' '}
                      <span style={{ color: '#ff8a9b', fontWeight: '700' }}>
                        {v.wolvesAlive}
                      </span>
                      {' '}· Others left{' '}
                      <span style={{ color: '#8fe0b8', fontWeight: '700' }}>
                        {v.othersAlive}
                      </span>
                    </span>
                  </span>
                  <button className="press" onClick={v.openMark} style={{ height: '48px', padding: '0 16px', flex: 'none', borderRadius: '14px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5 M16 11l2 2 4-4" />
                    </svg>
                    {' '}Mark players
                  </button>
                </div>
                {(v.gameOver) ? (
                  <>
                    <section className="rise" aria-label="Game over" style={{ padding: '22px 20px', borderRadius: '24px', background: v.endBg, border: `1px solid ${v.endBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center', boxShadow: `0 0 60px ${v.endGlow}` }}>
                      <span style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.25)', border: `1px solid ${v.endBorder}` }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={v.endColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d={v.endIcon} />
                        </svg>
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.18em', textTransform: 'uppercase', color: v.endColor }}>
                        Game over
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '26px' }}>
                        {v.endTitle}
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#e4d9f0' }}>
                        {v.endText}
                      </span>
                      <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: '12px 14px', borderRadius: '14px', background: 'rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                        {((v.endTips) || []).map((t: any, $index: number) => (
                          <React.Fragment key={$index}>
                            <li style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: '1.45', color: '#d8cfe8' }}>
                              <span style={{ width: '6px', height: '6px', marginTop: '7px', flex: 'none', borderRadius: '50%', background: v.endColor }} />
                              {t}
                            </li>
                          </React.Fragment>
                        ))}
                      </ul>
                      <button className="press" onClick={v.openHist} style={{ marginTop: '6px', width: '100%', height: '48px', borderRadius: '14px', border: `1px solid ${v.endColor}`, background: 'rgba(0,0,0,.2)', color: v.endColor, fontSize: '15px', fontWeight: '700' }}>
                        Read the story of this game
                      </button>
                      <button className="press" onClick={v.endGame} style={{ width: '100%', height: '52px', borderRadius: '14px', border: 'none', background: v.endColor, color: '#12091c', fontSize: '16px', fontWeight: '700' }}>
                        Start a new game
                      </button>
                    </section>
                  </>
                ) : null}
                {((v.alerts) || []).map((a: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <section className="rise" aria-label={a.title} style={{ padding: '14px', borderRadius: '20px', background: a.bg, border: `1px solid ${a.border}`, display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: `0 0 30px ${a.glow}` }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ width: '42px', height: '42px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: a.soft, border: `1px solid ${a.border}` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d={a.icon} />
                          </svg>
                        </span>
                        <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: a.color }}>
                            {a.kicker}
                          </span>
                          <span style={{ fontSize: '16px', fontWeight: '700', lineHeight: '1.3' }}>
                            {a.title}
                          </span>
                          <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#d8cfe8' }}>
                            {a.text}
                          </span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(a.hasAction) ? (
                          <>
                            <button className="press" onClick={a.act} style={{ flex: '1', height: '44px', borderRadius: '12px', border: 'none', background: a.color, color: '#12091c', fontSize: '14px', fontWeight: '700' }}>
                              {a.actLabel}
                            </button>
                          </>
                        ) : null}
                        <button className="press" onClick={a.dismiss} style={{ flex: '1', height: '44px', borderRadius: '12px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '14px', fontWeight: '700' }}>
                          Got it
                        </button>
                      </div>
                    </section>
                  </React.Fragment>
                ))}
                {(v.showNightGuide) ? (
                  <>
                    <section aria-label="Wake-up order" style={{ padding: '16px', borderRadius: '22px', background: 'rgba(22,13,38,.82)', border: '1px solid rgba(199,168,255,.2)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c7a8ff' }}>
                            Host guide
                          </span>
                          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '19px' }}>
                            Wake-up order
                          </span>
                        </span>
                        <span style={{ height: '28px', padding: '0 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: '700', color: '#e9dcff', background: 'rgba(167,127,240,.18)' }}>
                          {v.stepsDone}
                        </span>
                      </div>
                      <p style={{ margin: '0', padding: '10px 12px', borderRadius: '12px', background: 'rgba(167,127,240,.1)', fontSize: '13px', lineHeight: '1.5', color: '#e4d9f0' }}>
                        {v.nightIntro}
                      </p>
                      <ol style={{ listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {((v.nightSteps) || []).map((st: any, $index: number) => (
                          <React.Fragment key={$index}>
                            <li>
                              <button className="press" onClick={st.tick} aria-pressed={st.done} style={{ width: '100%', padding: '12px', borderRadius: '16px', border: `1px solid ${st.border}`, background: st.bg, color: '#ece6f6', textAlign: 'left', display: 'flex', gap: '12px', opacity: st.opacity }}>
                                <span style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', background: st.numBg, color: st.numFg }}>
                                  {st.num}
                                </span>
                                <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={st.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <path d={st.icon} />
                                    </svg>
                                    <span style={{ fontWeight: '700', fontSize: '15px', textDecoration: st.strike }}>
                                      {st.title}
                                    </span>
                                    {(st.hasTag) ? (
                                      <>
                                        <span style={{ height: '20px', padding: '0 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: st.tagFg, background: st.tagBg }}>
                                          {st.tag}
                                        </span>
                                      </>
                                    ) : null}
                                  </span>
                                  <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>
                                    {st.who}
                                  </span>
                                  <span style={{ fontSize: '13.5px', lineHeight: '1.45', color: '#d8cfe8' }}>
                                    {st.say}
                                  </span>
                                </span>
                              </button>
                            </li>
                          </React.Fragment>
                        ))}
                      </ol>
                      <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.5', color: '#c4b8da' }}>
                        Last, say{' '}
                        <span style={{ color: '#f1e9d2', fontStyle: 'italic' }}>
                          “Everyone, wake up.”
                        </span>
                        {' '}and tap{' '}
                        <span style={{ fontWeight: '700', color: '#ffd3a8' }}>
                          Day
                        </span>
                        .
                      </p>
                    </section>
                  </>
                ) : null}
                {(v.showDayGuide) ? (
                  <>
                    <section aria-label="Day script" style={{ padding: '16px', borderRadius: '22px', background: 'rgba(40,18,40,.8)', border: '1px solid rgba(255,211,168,.25)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#ffd3a8' }}>
                          Host guide
                        </span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '19px' }}>
                          Run the day
                        </span>
                      </span>
                      <ol style={{ listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {((v.daySteps) || []).map((d: any, $index: number) => (
                          <React.Fragment key={$index}>
                            <li style={{ display: 'flex', gap: '12px' }}>
                              <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', background: 'rgba(242,166,90,.2)', color: '#ffd3a8' }}>
                                {d.num}
                              </span>
                              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontWeight: '700', fontSize: '14.5px' }}>
                                  {d.title}
                                </span>
                                <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#d8c8d4' }}>
                                  {d.text}
                                </span>
                              </span>
                            </li>
                          </React.Fragment>
                        ))}
                      </ol>
                      {(v.hasDayRules) ? (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(236,230,246,.1)' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.12em', textTransform: 'uppercase', color: '#a99bc2' }}>
                              Remember during the vote
                            </span>
                            {((v.dayRules) || []).map((r: any, $index: number) => (
                              <React.Fragment key={$index}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
                                    <path d={r.icon} />
                                  </svg>
                                  <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#e4d9f0' }}>
                                    <span style={{ fontWeight: '700', color: r.color }}>
                                      {r.name}
                                    </span>
                                    {' '}· {r.text}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </section>
                  </>
                ) : null}
              </div>
              <div style={{ padding: '12px 20px 30px', background: 'linear-gradient(180deg, rgba(10,6,18,0), rgba(10,6,18,.88) 40%)', display: 'flex', gap: '8px' }}>
                <button className="press" onClick={v.openHist} style={{ height: '48px', padding: '0 16px', flex: 'none', borderRadius: '14px', border: '1px solid rgba(199,168,255,.35)', background: 'rgba(199,168,255,.1)', color: '#e9dcff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7 M3 4v4h4 M12 7v5l3 2" />
                  </svg>
                  {' '}History
                </button>
                <button className="press" onClick={v.endGame} style={{ flex: '1', minWidth: '0', height: '48px', borderRadius: '14px', border: '1px solid rgba(224,71,95,.35)', background: 'rgba(224,71,95,.08)', color: '#ffb3bf', fontSize: '15px', fontWeight: '700' }}>
                  End game & start over
                </button>
              </div>
            </>
          ) : null}
        </div>
        {(v.sheetOpen) ? (
          <>
            <div className="fade" onClick={v.closeSheet} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.66)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label={v.sheetTitle} style={{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '792px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #1d1131 0%, #120a20 100%)', borderTop: '1px solid rgba(199,168,255,.3)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c7a8ff' }}>
                      {v.sheetKicker}
                    </span>
                    <h2 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '22px' }}>
                      {v.sheetTitle}
                    </h2>
                  </span>
                  <button className="press" onClick={v.closeSheet} aria-label="Close" style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.06)', color: '#ece6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="scroll" style={{ flex: '1', minHeight: '0', padding: '6px 20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                    Role name{' '}
                    <span style={{ position: 'relative', display: 'flex' }}>
                      <input type="text" value={v.dr.name} onChange={v.setName} placeholder="Type any role, e.g. Little Girl" autoComplete="off" style={{ flex: '1', height: '54px', padding: '0 48px 0 14px', borderRadius: '14px', border: '1px solid rgba(236,230,246,.16)', background: 'rgba(10,6,18,.6)', color: '#ece6f6', fontSize: '17px', fontWeight: '600' }} />
                      <span style={{ position: 'absolute', right: '14px', top: '17px', width: '20px', height: '20px', color: '#c7a8ff' }}>
                        {(v.lk.searching) ? (
                          <>
                            <span className="spin" style={{ display: 'block', width: '18px', height: '18px', boxSizing: 'border-box', borderRadius: '50%', border: '2px solid rgba(199,168,255,.25)', borderTopColor: '#c7a8ff' }} />
                          </>
                        ) : null}
                        {(v.lk.notSearching) ? (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <path d="M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M20 20l-4-4" />
                            </svg>
                          </>
                        ) : null}
                      </span>
                    </span>
                  </label>
                  {(v.lk.show) ? (
                    <>
                      <div className="fade" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', borderRadius: '12px', background: v.lk.bg, border: `1px solid ${v.lk.border}` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={v.lk.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
                          <path d={v.lk.icon} />
                        </svg>
                        <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '700', color: v.lk.color }}>
                            {v.lk.title}
                          </span>
                          <span style={{ fontSize: '12.5px', lineHeight: '1.45', color: '#c4b8da' }}>
                            {v.lk.text}
                          </span>
                        </span>
                        {(v.lk.canEditExisting) ? (
                          <>
                            <button className="press" onClick={v.lk.editExisting} style={{ height: '34px', padding: '0 10px', flex: 'none', borderRadius: '10px', border: 'none', background: v.lk.color, color: '#12091c', fontSize: '12.5px', fontWeight: '700' }}>
                              Edit it
                            </button>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '18px', background: `linear-gradient(150deg, ${v.dr.tint}, rgba(14,8,24,.9))`, border: `1px solid ${v.dr.edge}`, transition: 'all .3s ease' }}>
                  <span style={{ width: '54px', height: '54px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.dr.soft, border: `1px solid ${v.dr.edge}`, boxShadow: `0 0 26px ${v.dr.soft}` }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={v.dr.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.dr.icon} />
                    </svg>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '20px' }}>
                      {v.dr.displayName}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: v.dr.color }}>
                      {v.dr.team} · strength {v.dr.strText}
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                    Which side are they on?{' '}
                    {(v.auto.team) ? (
                      <>
                        <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: '#c7a8ff', background: 'rgba(167,127,240,.18)' }}>
                          AUTO
                        </span>
                      </>
                    ) : null}
                  </span>
                  <div role="group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4px', padding: '4px', borderRadius: '14px', background: 'rgba(10,6,18,.6)', border: '1px solid rgba(236,230,246,.1)' }}>
                    {((v.teamOpts) || []).map((t: any, $index: number) => (
                      <React.Fragment key={$index}>
                        <button className="press" onClick={t.pick} aria-pressed={t.on} style={{ height: '44px', borderRadius: '10px', border: 'none', background: t.bg, color: t.fg, fontSize: '14px', fontWeight: '700' }}>
                          {t.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', borderRadius: '18px', background: 'rgba(10,6,18,.5)', border: `1px solid ${v.strBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                        Strength{' '}
                        {(v.auto.strength) ? (
                          <>
                            <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: '#c7a8ff', background: 'rgba(167,127,240,.18)' }}>
                              AUTO
                            </span>
                          </>
                        ) : null}
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>
                        How much this role helps its side
                      </span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button className="press" onClick={v.strDown} aria-label="Lower strength" style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.06)', color: '#ece6f6', fontSize: '22px' }}>
                        −
                      </button>
                      <span style={{ width: '54px', textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '26px', color: v.dr.strColor }}>
                        {v.dr.strText}
                      </span>
                      <button className="press" onClick={v.strUp} aria-label="Raise strength" style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.06)', color: '#ece6f6', fontSize: '22px' }}>
                        +
                      </button>
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', fontSize: '11.5px', lineHeight: '1.35', color: '#a99bc2', textAlign: 'center' }}>
                    <span style={{ padding: '6px 4px', borderRadius: '8px', background: 'rgba(224,71,95,.1)' }}>
                      <span style={{ color: '#ff8a9b', fontWeight: '800' }}>
                        −6
                      </span>
                      <br />
                      Werewolf
                    </span>
                    <span style={{ padding: '6px 4px', borderRadius: '8px', background: 'rgba(232,211,160,.08)' }}>
                      <span style={{ color: '#f0dfb4', fontWeight: '800' }}>
                        +1
                      </span>
                      <br />
                      Villager
                    </span>
                    <span style={{ padding: '6px 4px', borderRadius: '8px', background: 'rgba(127,178,255,.1)' }}>
                      <span style={{ color: '#a9cbff', fontWeight: '800' }}>
                        +7
                      </span>
                      <br />
                      Seer
                    </span>
                  </div>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    What does this role do?{' '}
                    {(v.auto.desc) ? (
                      <>
                        <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: '#c7a8ff', background: 'rgba(167,127,240,.18)' }}>
                          AUTO
                        </span>
                      </>
                    ) : null}
                  </span>
                  <textarea rows="4" onChange={v.setDesc} value={v.dr.desc} placeholder="Explain it the way you’d say it out loud at the table." style={{ padding: '12px 14px', borderRadius: '14px', border: `1px solid ${v.descBorder}`, background: 'rgba(10,6,18,.6)', color: '#ece6f6', fontSize: '15px', lineHeight: '1.45', resize: 'none' }} />
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#a99bc2' }}>
                    This text appears on the player’s card.
                  </span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                    Symbol{' '}
                    {(v.auto.icon) ? (
                      <>
                        <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: '#c7a8ff', background: 'rgba(167,127,240,.18)' }}>
                          AUTO
                        </span>
                      </>
                    ) : null}
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '6px' }}>
                    {((v.iconOpts) || []).map((ic: any, $index: number) => (
                      <React.Fragment key={$index}>
                        <button className="press" onClick={ic.pick} aria-label={ic.label} aria-pressed={ic.on} style={{ height: '48px', borderRadius: '12px', border: `1px solid ${ic.border}`, background: ic.bg, color: ic.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d={ic.d} />
                          </svg>
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>
                    Card color
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {((v.colorOpts) || []).map((c: any, $index: number) => (
                      <React.Fragment key={$index}>
                        <button className="press" onClick={c.pick} aria-label={c.label} aria-pressed={c.on} style={{ width: '34px', height: '34px', padding: '0', borderRadius: '50%', border: `2px solid ${c.ring}`, background: c.hex, boxShadow: '0 0 0 3px #150c24' }} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {(v.canReset) ? (
                  <>
                    <button className="press" onClick={v.resetRole} style={{ height: '46px', borderRadius: '14px', border: '1px solid rgba(236,230,246,.16)', background: 'transparent', color: '#c4b8da', fontSize: '14px', fontWeight: '700' }}>
                      {v.resetLabel}
                    </button>
                  </>
                ) : null}
                {(v.canDelete) ? (
                  <button className="press" onClick={v.deleteRole} style={{ height: '46px', borderRadius: '14px', border: '1px solid rgba(224,71,95,.35)', background: 'rgba(224,71,95,.08)', color: '#ffb3bf', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3" />
                    </svg>
                    {' '}{v.deleteLabel}
                  </button>
                ) : null}
              </div>
              <div style={{ padding: '12px 20px 30px', borderTop: '1px solid rgba(236,230,246,.08)' }}>
                <button className="press" onClick={v.saveRole} disabled={v.draftEmpty} style={{ width: '100%', height: '58px', borderRadius: '16px', border: 'none', background: v.dr.color, color: '#12091c', fontSize: '17px', fontWeight: '700', opacity: v.addOpacity }}>
                  {v.saveLabel}
                </button>
              </div>
            </section>
          </>
        ) : null}
        {(v.rulesOpen) ? (
          <>
            <div className="fade" onClick={v.closeRules} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.66)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label="House rules" style={{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '792px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #221632 0%, #120a20 100%)', borderTop: '1px solid rgba(232,211,160,.35)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#e8d3a0' }}>
                      Your table, your rules
                    </span>
                    <h2 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '22px' }}>
                      House rules
                    </h2>
                  </span>
                  <button className="press" onClick={v.closeRules} aria-label="Close" style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.06)', color: '#ece6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
                <span style={{ width: '100%', fontSize: '13px', lineHeight: '1.45', color: '#a99bc2' }}>
                  These change the host guide and reminders. Not sure? The defaults are a classic game.
                </span>
              </div>
              <div className="scroll" style={{ flex: '1', minHeight: '0', padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {((v.ruleGroups) || []).map((grp: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={grp.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={grp.icon} />
                        </svg>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: grp.color }}>
                          {grp.label}
                        </span>
                      </span>
                      {((grp.items) || []).map((r: any, $index: number) => (
                        <React.Fragment key={$index}>
                          <div style={{ padding: '12px 14px', borderRadius: '16px', background: 'rgba(10,6,18,.5)', border: `1px solid ${r.border}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(r.isToggle) ? (
                              <>
                                <button className="press" onClick={r.flip} role="switch" aria-checked={r.on} style={{ width: '100%', padding: '0', border: 'none', background: 'transparent', color: '#ece6f6', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <span style={{ fontSize: '15px', fontWeight: '700' }}>
                                      {r.label}
                                    </span>
                                    <span style={{ fontSize: '12.5px', lineHeight: '1.45', color: '#a99bc2' }}>
                                      {r.desc}
                                    </span>
                                  </span>
                                  <span style={{ position: 'relative', width: '48px', height: '28px', flex: 'none', borderRadius: '999px', background: r.track, transition: 'background-color .25s ease' }}>
                                    <span style={{ position: 'absolute', top: '3px', left: r.knob, width: '22px', height: '22px', borderRadius: '50%', background: '#f6f1ff', boxShadow: '0 2px 6px rgba(0,0,0,.35)', transition: 'left .25s ease' }} />
                                  </span>
                                </button>
                              </>
                            ) : null}
                            {(r.isChoice) ? (
                              <>
                                <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  <span style={{ fontSize: '15px', fontWeight: '700' }}>
                                    {r.label}
                                  </span>
                                  <span style={{ fontSize: '12.5px', lineHeight: '1.45', color: '#a99bc2' }}>
                                    {r.desc}
                                  </span>
                                </span>
                                <div role="radiogroup" aria-label={r.label} style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '12px', background: 'rgba(0,0,0,.3)' }}>
                                  {((r.opts) || []).map((o: any, $index: number) => (
                                    <React.Fragment key={$index}>
                                      <button className="press" role="radio" aria-checked={o.on} onClick={o.pick} style={{ flex: '1', minHeight: '38px', padding: '4px 6px', borderRadius: '9px', border: 'none', background: o.bg, color: o.fg, fontSize: '12.5px', fontWeight: '700', lineHeight: '1.2' }}>
                                        {o.label}
                                      </button>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ padding: '12px 20px 30px', borderTop: '1px solid rgba(236,230,246,.08)', display: 'flex', gap: '10px' }}>
                <button className="press" onClick={v.resetRules} style={{ height: '56px', padding: '0 16px', flex: 'none', borderRadius: '16px', border: '1px solid rgba(236,230,246,.18)', background: 'transparent', color: '#c4b8da', fontSize: '14px', fontWeight: '700' }}>
                  Classic rules
                </button>
                <button className="press" onClick={v.closeRules} style={{ flex: '1', height: '56px', borderRadius: '16px', border: 'none', background: '#e8d3a0', color: '#1c140a', fontSize: '16px', fontWeight: '700' }}>
                  Save rules
                </button>
              </div>
            </section>
          </>
        ) : null}
        {(v.histOpen) ? (
          <>
            <div className="fade" onClick={v.closeHist} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.66)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label="Game history" style={{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '780px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #1d1131 0%, #120a20 100%)', borderTop: '1px solid rgba(199,168,255,.3)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h2 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '22px' }}>
                      The story so far
                    </h2>
                    <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>
                      Only you can see this. Read it out at the end.
                    </span>
                  </span>
                  <button className="press" onClick={v.copyStory} style={{ height: '40px', padding: '0 12px', flex: 'none', borderRadius: '12px', border: '1px solid rgba(236,230,246,.16)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '13px', fontWeight: '700' }}>
                    {v.copyLabel}
                  </button>
                </div>
              </div>
              <ol className="scroll" style={{ flex: '1', minHeight: '0', listStyle: 'none', margin: '0', padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {((v.chapters) || []).map((c: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <li style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                        <span style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: `1px solid ${c.tint}` }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.tint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d={c.icon} />
                          </svg>
                        </span>
                        <span style={{ flex: '1', width: '2px', minHeight: '14px', background: 'rgba(236,230,246,.1)' }} />
                      </span>
                      <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '14px' }}>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minHeight: '32px', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '17px', color: c.tint }}>
                            {c.title}
                          </span>
                          {(c.sub) ? (
                            <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#a99bc2' }}>
                              {c.sub}
                            </span>
                          ) : null}
                        </span>
                        {(c.empty) ? (
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: '#a99bc2' }}>
                            {c.emptyText}
                          </span>
                        ) : null}
                        {((c.items) || []).map((it: any, $i: number) => (
                          <React.Fragment key={$i}>
                            <span style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 10px', borderRadius: '12px', background: 'rgba(20,12,34,.75)', border: '1px solid rgba(236,230,246,.07)' }}>
                              <span style={{ width: '8px', height: '8px', marginTop: '6px', flex: 'none', borderRadius: '50%', background: it.color }} />
                              <span style={{ flex: '1', minWidth: '0', fontSize: '14px', lineHeight: '1.45', color: '#ece6f6', fontStyle: it.note ? 'italic' : 'normal' }}>
                                {it.text}
                              </span>
                              {(it.del) ? (
                                <button className="press" onClick={it.del} aria-label="Delete note" style={{ width: '28px', height: '28px', margin: '-4px -4px -4px 0', flex: 'none', border: 'none', borderRadius: '8px', background: 'transparent', color: '#8f82a8', fontSize: '18px', lineHeight: '1' }}>
                                  ×
                                </button>
                              ) : null}
                            </span>
                          </React.Fragment>
                        ))}
                      </span>
                    </li>
                  </React.Fragment>
                ))}
                {(v.hasOutcome) ? (
                  <li style={{ padding: '14px 16px', borderRadius: '16px', background: `linear-gradient(160deg, rgba(232,211,160,.16), rgba(18,10,31,.9))`, border: '1px solid rgba(232,211,160,.4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.18em', textTransform: 'uppercase', color: '#e8d3a0' }}>
                      The end
                    </span>
                    <span style={{ fontSize: '15px', lineHeight: '1.45', color: '#f6f1ff', fontWeight: '600' }}>
                      {v.outcome}
                    </span>
                  </li>
                ) : null}
              </ol>
              <div style={{ padding: '12px 20px 30px', borderTop: '1px solid rgba(236,230,246,.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <form onSubmit={v.addNote} style={{ display: 'flex', gap: '8px', margin: '0' }}>
                  <input type="text" aria-label="Add a note to this phase" placeholder="Add a note, e.g. Healer saved Theo" value={v.noteInput} onChange={v.setNote} maxLength={140} style={{ flex: '1', minWidth: '0', height: '46px', padding: '0 14px', borderRadius: '14px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '14.5px', fontFamily: 'inherit', outline: 'none' }} />
                  <button type="submit" className="press" disabled={!v.noteInput.trim()} style={{ height: '46px', padding: '0 16px', flex: 'none', borderRadius: '14px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.08)', color: '#ece6f6', fontSize: '14px', fontWeight: '700', opacity: v.noteInput.trim() ? 1 : 0.45 }}>
                    Add
                  </button>
                </form>
                <button className="press" onClick={v.closeHist} style={{ width: '100%', height: '52px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '17px', fontWeight: '700' }}>
                  Done
                </button>
              </div>
            </section>
          </>
        ) : null}
        {(v.markOpen) ? (
          <>
            <div className="fade" onClick={v.closeMark} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.66)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label="Mark players" style={{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '780px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #1d1131 0%, #120a20 100%)', borderTop: '1px solid rgba(199,168,255,.3)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h2 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '22px' }}>
                      Mark players
                    </h2>
                    <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>
                      Only you can see roles here.
                    </span>
                  </span>
                  <button className="press" onClick={v.toggleHide} aria-pressed={v.hideRoles} style={{ height: '40px', padding: '0 12px', flex: 'none', borderRadius: '12px', border: '1px solid rgba(236,230,246,.16)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.hideIcon} />
                    </svg>
                    {' '}{v.hideLabel}
                  </button>
                </div>
              </div>
              <ul className="scroll" style={{ flex: '1', minHeight: '0', listStyle: 'none', margin: '0', padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {((v.dealt) || []).map((d: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <li style={{ padding: '12px', borderRadius: '18px', background: d.rowBg, border: `1px solid ${d.rowBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: d.opacity }}>
                        <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '14px', color: '#12091c', background: d.color }}>
                          {d.initial}
                        </span>
                        <span style={{ flex: '1', fontWeight: '700', fontSize: '15.5px', textDecoration: d.strike }}>
                          {d.name}
                        </span>
                        <span style={{ height: '28px', padding: '0 10px 0 6px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '700', color: d.roleColor, background: d.roleSoft }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d={d.roleIcon} />
                          </svg>
                          {' '}{d.roleName}
                        </span>
                      </div>
                      <div role="group" aria-label={`Status of ${d.name}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '4px', padding: '3px', borderRadius: '12px', background: 'rgba(0,0,0,.28)' }}>
                        {((d.opts) || []).map((o: any, $index: number) => (
                          <React.Fragment key={$index}>
                            <button className="press" onClick={o.pick} aria-pressed={o.on} style={{ height: '40px', padding: '0 2px', borderRadius: '9px', border: 'none', background: o.bg, color: o.fg, fontSize: '12.5px', fontWeight: '700' }}>
                              {o.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
              <div style={{ padding: '12px 20px 30px', borderTop: '1px solid rgba(236,230,246,.08)' }}>
                <button className="press" onClick={v.closeMark} style={{ width: '100%', height: '56px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '17px', fontWeight: '700' }}>
                  Done
                </button>
              </div>
            </section>
          </>
        ) : null}
        {(v.dgOpen) ? (
          <>
            <div className="fade" style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.7)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label="Update the Doppelgänger" style={{ position: 'absolute', left: '0', right: '0', bottom: '0', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #23192f 0%, #120a20 100%)', borderTop: '1px solid rgba(154,167,184,.5)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', padding: '10px 20px 30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ alignSelf: 'center', width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c6d0dc' }}>
                  Doppelgänger check
                </span>
                <h2 style={{ margin: '0', fontFamily: "'Cinzel', serif", fontWeight: '600', fontSize: '22px', lineHeight: '1.25' }}>
                  Did {v.dg.dgName} copy {v.dg.dead}?
                </h2>
                <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#c4b8da' }}>
                  On the first night, the Doppelgänger chose someone to copy. If it was {v.dg.dead}, {v.dg.dgName} now takes over their role.
                </span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '14px', borderRadius: '18px', background: 'rgba(0,0,0,.25)' }}>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(154,167,184,.18)', border: '1px solid rgba(154,167,184,.55)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c6d0dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.dg.dgIcon} />
                    </svg>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>
                    {v.dg.dgName}
                  </span>
                </span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a99bc2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14 M13 6l6 6-6 6" />
                </svg>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.dg.soft, border: `1px solid ${v.dg.edge}`, boxShadow: `0 0 24px ${v.dg.soft}` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={v.dg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.dg.icon} />
                    </svg>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: v.dg.color }}>
                    {v.dg.roleName}
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  New role for {v.dg.dgName}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {((v.dgChoices) || []).map((c: any, $index: number) => (
                    <React.Fragment key={$index}>
                      <button className="press" onClick={c.pick} aria-pressed={c.on} style={{ height: '38px', padding: '0 12px 0 8px', borderRadius: '999px', border: `1px solid ${c.border}`, background: c.bg, color: c.fg, fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d={c.icon} />
                        </svg>
                        {' '}{c.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <span style={{ display: 'flex', gap: '8px', fontSize: '12.5px', lineHeight: '1.45', color: '#a99bc2' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
                  <path d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M11 18h2" />
                </svg>
                {' '}{v.dg.dgName}’s phone card changes to the new role right away. No one else is told.
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="press" onClick={v.dgConfirm} style={{ height: '56px', borderRadius: '16px', border: 'none', background: v.dg.color, color: '#12091c', fontSize: '16px', fontWeight: '700' }}>
                  Yes — {v.dg.dgName} becomes the {v.dg.roleName}
                </button>
                <button className="press" onClick={v.dgSkip} style={{ height: '48px', borderRadius: '14px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(255,255,255,.05)', color: '#ece6f6', fontSize: '14px', fontWeight: '700' }}>
                  No, they copied someone else
                </button>
              </div>
            </section>
          </>
        ) : null}
      </div>
    );
  }
}
