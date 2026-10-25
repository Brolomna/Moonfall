// A short theme for each night role, played on the host's phone when a step in the wake-up order is tapped.
// Everything is synthesized here with the Web Audio API (like ./sound.ts): no audio files, no licences to track.
// Hand-made themes for the main roles; every other role gets its own motif generated from its name, so no two
// roles share a tune and the same role always sounds the same.
import { audio, bell, noiseBuffer, reverb, wolf } from './sound';

type X = { c: AudioContext; out: GainNode; t: number };
type Theme = (x: X) => void;

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** One oscillator note with an attack / release envelope. */
function tone(x: X, at: number, midi: number, dur: number, o: { type?: OscillatorType; level?: number; attack?: number; vib?: number; detune?: number; lp?: number; pan?: number; glide?: number } = {}) {
  const { c } = x, t = x.t + at, f = hz(midi), level = o.level ?? 0.2, a = o.attack ?? 0.01;
  const osc = c.createOscillator(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t); osc.detune.value = o.detune || 0;
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(hz(midi + o.glide), t + dur);
  const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + a); g.gain.setValueAtTime(level, t + Math.max(a, dur * 0.6)); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  let node: AudioNode = osc;
  if (o.lp) { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp; node.connect(lp); node = lp; }
  node.connect(g);
  let end: AudioNode = g;
  if (o.pan && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = o.pan; g.connect(p); end = p; }
  end.connect(x.out);
  const srcs: AudioScheduledSourceNode[] = [osc];
  if (o.vib) { const l = c.createOscillator(); l.frequency.value = 5.5; const d = c.createGain(); d.gain.value = f * o.vib; l.connect(d); d.connect(osc.frequency); srcs.push(l); }
  srcs.forEach(s => { s.start(t); s.stop(t + dur + 0.05); });
}

/** A plucked string (harp / pizzicato): bright attack, quick decay. */
const pluck = (x: X, at: number, midi: number, level = 0.22, decay = 1.4, pan = 0) => {
  tone(x, at, midi, decay, { type: 'triangle', level, attack: 0.004, lp: 3200, pan });
  tone(x, at, midi + 12, decay * 0.4, { type: 'sine', level: level * 0.3, attack: 0.004, pan });
};
/** A glassy celesta / music-box bell. */
const chime = (x: X, at: number, midi: number, level = 0.16, pan = 0) => {
  tone(x, at, midi, 2.2, { level, attack: 0.003, pan });
  tone(x, at, midi + 19.02, 0.7, { level: level * 0.25, attack: 0.003, pan }); // the bright partial
};
/** A held chord, soft-edged. */
function pad(x: X, at: number, notes: number[], dur: number, o: { type?: OscillatorType; level?: number; lp?: number; attack?: number } = {}) {
  notes.forEach((n, i) => tone(x, at, n, dur, { type: o.type || 'sawtooth', level: (o.level ?? 0.05), attack: o.attack ?? 0.8, lp: o.lp ?? 900, detune: (i - notes.length / 2) * 6 }));
}
/** A low drum hit (a pitch-dropping sine). */
function drum(x: X, at: number, f0 = 110, level = 0.6, decay = 0.35) {
  const { c } = x, t = x.t + at;
  const o = c.createOscillator(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.42, t + decay);
  const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + decay);
  o.connect(g); g.connect(x.out); o.start(t); o.stop(t + decay + 0.05);
}
/** Filtered noise: wind, swishes, snare, fire. */
function hiss(x: X, at: number, dur: number, o: { type?: BiquadFilterType; f?: number; f2?: number; q?: number; level?: number; attack?: number } = {}) {
  const { c } = x, t = x.t + at;
  const n = c.createBufferSource(); n.buffer = noiseBuffer(c, dur + 0.1);
  const bf = c.createBiquadFilter(); bf.type = o.type || 'bandpass'; bf.Q.value = o.q ?? 1; bf.frequency.setValueAtTime(o.f || 1000, t);
  if (o.f2) bf.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
  const g = c.createGain(), a = o.attack ?? 0.005; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(o.level ?? 0.2, t + a); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  n.connect(bf); bf.connect(g); g.connect(x.out); n.start(t); n.stop(t + dur + 0.1);
}
/** A note sequence: [beat, midi, length in beats]. */
const seq = (x: X, bpm: number, notes: [number, number, number?][], play: (at: number, midi: number, dur: number) => void, start = 0) =>
  notes.forEach(([b, m, l]) => play(start + b * 60 / bpm, m, (l || 1) * 60 / bpm));

// ---------- the hand-made themes ----------
const THEMES: Record<string, Theme> = {
  // a pack hunting: war drums, a dark D-minor drone and a howl over it
  Werewolf: x => {
    pad(x, 0, [38, 41, 45, 50], 5.5, { level: 0.06, lp: 500, attack: 1.2 });
    [0, 0.42, 1.2, 1.62, 2.4, 2.82, 3.6, 4.02].forEach((d, i) => drum(x, d, i % 2 ? 72 : 96, i % 2 ? 0.45 : 0.7, 0.4));
    wolf(x.c, x.t + 1.0, 600, 0.16, 0, x.out);
  },
  // second sight: a rising crystal arpeggio (F Lydian) over a shimmering high pad
  Seer: x => {
    pad(x, 0, [77, 81, 84, 88], 5, { type: 'sine', level: 0.03, lp: 6000, attack: 1.5 });
    [65, 69, 72, 76, 71, 79, 83, 84, 88].forEach((m, i) => chime(x, 0.1 + i * 0.32, m, 0.15, (i % 3 - 1) * 0.4));
    chime(x, 3.3, 89, 0.12);
  },
  // gentle care: a warm harp arpeggio in C major, rising and settling
  Healer: x => {
    pad(x, 0, [48, 55, 64], 5, { type: 'triangle', level: 0.06, lp: 1400, attack: 1 });
    [60, 64, 67, 72, 76, 79, 84, 79, 76, 72].forEach((m, i) => pluck(x, i * 0.26, m, 0.2, 1.8, (i % 2 ? 0.3 : -0.3)));
    pluck(x, 2.9, 72, 0.18, 2.4); pluck(x, 2.9, 76, 0.14, 2.4);
  },
  // standing guard: a brass fanfare in fifths with a snare roll
  Bodyguard: x => {
    const brass = (at: number, m: number, d: number) => { tone(x, at, m, d, { type: 'sawtooth', level: 0.09, attack: 0.04, lp: 1500 }); tone(x, at, m - 12, d, { type: 'sawtooth', level: 0.05, attack: 0.04, lp: 900 }); };
    seq(x, 132, [[0, 55, 0.5], [0.5, 55, 0.5], [1, 60, 1.5], [2.5, 62, 0.5], [3, 64, 1], [4, 67, 3]], brass);
    for (let i = 0; i < 14; i++) hiss(x, 1.6 + i * 0.07, 0.08, { type: 'highpass', f: 1800, level: 0.06 + i * 0.006 });
    drum(x, 1.82, 130, 0.5); drum(x, 2.7, 90, 0.6, 0.6);
  },
  // the cauldron: bubbles, a low drone and a whole-tone line falling through the steam
  Witch: x => {
    pad(x, 0, [40, 46], 5, { level: 0.06, lp: 450 });
    for (let i = 0; i < 18; i++) { const at = 0.1 + i * 0.22 + (i % 3) * 0.05; tone(x, at, 55 + ((i * 7) % 13), 0.12, { level: 0.08, attack: 0.005, glide: 7 }); }
    [84, 82, 80, 78, 76, 74, 72].forEach((m, i) => chime(x, 0.6 + i * 0.42, m, 0.11, i % 2 ? 0.4 : -0.4));
  },
  // love's arrow: a harp glissando up, a heartbeat, a sparkle
  Cupid: x => {
    [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84].forEach((m, i) => pluck(x, i * 0.08, m, 0.15, 1.2));
    [1.4, 1.62, 2.4, 2.62].forEach((d, i) => drum(x, d, 62, i % 2 ? 0.3 : 0.45, 0.25));
    chime(x, 3, 88, 0.12); chime(x, 3.2, 91, 0.1); pad(x, 1, [64, 68, 71], 3.5, { type: 'triangle', level: 0.04, lp: 2000 });
  },
  // the copy: a phrase, then its mirror image on the other side
  'Doppelgänger': x => {
    const a: [number, number, number?][] = [[0, 64], [1, 67], [2, 71], [3, 70, 2]];
    seq(x, 110, a, (at, m, d) => tone(x, at, m, d, { type: 'triangle', level: 0.13, pan: -0.6, lp: 2400 }));
    seq(x, 110, a.map(([b, m, l]) => [b, 128 - m, l] as [number, number, number?]), (at, m, d) => tone(x, at, m, d, { type: 'triangle', level: 0.13, pan: 0.6, lp: 2400, detune: 18 }), 2.7);
  },
  // a cathedral organ in D minor with a tremolo, and a slow descending line
  Vampire: x => {
    const organ = (at: number, m: number, d: number) => { tone(x, at, m, d, { type: 'square', level: 0.04, attack: 0.05, lp: 1800 }); tone(x, at, m + 12, d, { level: 0.05, attack: 0.05, vib: 0.004 }); };
    [50, 53, 57, 62].forEach(m => organ(0, m, 2.2));
    seq(x, 90, [[3, 69], [4, 67], [5, 65], [6, 64], [7, 62, 2]], organ);
    [49, 52, 55, 58].forEach(m => organ(3.4, m, 1.6));
  },
  // stabbing, dissonant strings
  'Serial Killer': x => {
    [0, 0.3, 0.6, 0.9, 1.5, 1.8, 2.1].forEach((d, i) => [88, 89].forEach(m => tone(x, d, m - (i > 3 ? 1 : 0), 0.22, { type: 'sawtooth', level: 0.05, attack: 0.005, lp: 5000 })));
    pad(x, 0, [36, 37, 43], 4, { level: 0.05, lp: 400 });
    drum(x, 2.8, 60, 0.7, 0.9);
  },
  // fire: crackling embers and a rising, roaring swell
  Arsonist: x => {
    for (let i = 0; i < 40; i++) hiss(x, (i * 0.113) % 4.3 + (i % 5) * 0.01, 0.03, { type: 'highpass', f: 2000 + (i * 397) % 3000, level: 0.12 });
    hiss(x, 0, 4.5, { type: 'lowpass', f: 300, f2: 2500, level: 0.18, attack: 2.5 });
    [45, 52, 57].forEach(m => tone(x, 0.5, m, 4, { type: 'sawtooth', level: 0.05, attack: 2.5, lp: 1200, glide: 5 }));
  },
  // a lone white wolf: a high, icy howl and frost bells
  'White Werewolf': x => {
    wolf(x.c, x.t + 0.2, 900, 0.12, 0, x.out);
    [96, 93, 91, 88, 84].forEach((m, i) => chime(x, 0.6 + i * 0.5, m, 0.08, i % 2 ? 0.5 : -0.5));
    pad(x, 0, [69, 76, 81], 4.5, { type: 'sine', level: 0.03, lp: 4000 });
  },
  // a bad dream: a low, wobbling drone and a swell that sucks the air out
  'Nightmare Wolf': x => {
    [33, 33.3, 40].forEach(m => tone(x, 0, m, 5, { type: 'sawtooth', level: 0.06, attack: 1.5, lp: 380, vib: 0.03 }));
    hiss(x, 0, 3, { type: 'bandpass', f: 400, f2: 3000, q: 4, level: 0.15, attack: 2.9 });
    chime(x, 3.1, 70, 0.1); chime(x, 3.1, 71, 0.08);
  },
  // the wolves' servant: a blade swish and a dark minor stab
  Minion: x => {
    hiss(x, 0, 0.35, { type: 'bandpass', f: 1200, f2: 7000, q: 2, level: 0.25 });
    [43, 46, 50].forEach(m => tone(x, 0.3, m, 1.6, { type: 'sawtooth', level: 0.07, attack: 0.01, lp: 900 }));
    seq(x, 100, [[2, 62], [2.5, 61], [3, 58, 2]], (at, m, d) => pluck(x, at, m, 0.18, d + 0.6));
  },
  // the masons' lodge: hammer on anvil, in rhythm
  Mason: x => {
    [0, 0.5, 1, 1.75, 2, 2.5, 3].forEach((d, i) => { bell(x.c, x.t + d, i % 3 === 2 ? 523 : 440, 0.07, x.out, 1.4); drum(x, d, 180, 0.25, 0.1); });
    pad(x, 0.2, [45, 52, 57], 3.8, { type: 'triangle', level: 0.05, lp: 900 });
  },
  // the Seer's dark twin: the crystal arpeggio, in a minor key and falling
  Sorcerer: x => {
    pad(x, 0, [45, 48, 52], 5, { level: 0.05, lp: 600 });
    [81, 77, 76, 72, 69, 68, 64, 57].forEach((m, i) => chime(x, 0.1 + i * 0.36, m, 0.14, (i % 3 - 1) * 0.4));
  },
  // a voice from beyond: a wavering theremin
  Medium: x => {
    seq(x, 70, [[0, 69, 1.5], [1.5, 72, 1], [2.5, 76, 1.5], [4, 74, 2]], (at, m, d) => tone(x, at, m, d, { level: 0.12, attack: 0.25, vib: 0.012, glide: -1 }));
    pad(x, 0, [45, 52], 5.5, { type: 'sine', level: 0.06, lp: 800 });
  },
  // raising the dead: a grave bell, a low choir and a rising groan
  Necromancer: x => {
    bell(x.c, x.t, 82, 0.25, x.out, 5);
    pad(x, 0.3, [40, 43, 47, 52], 4.5, { level: 0.06, lp: 700, attack: 1.5 });
    tone(x, 1, 52, 3.5, { type: 'sawtooth', level: 0.05, attack: 1, lp: 800, glide: 12 });
  },
  // a blessing: a bright choir chord and a church bell
  Priest: x => {
    pad(x, 0, [60, 64, 67, 72, 76], 4.5, { level: 0.05, lp: 1800, attack: 1 });
    bell(x.c, x.t + 0.2, 392, 0.12, x.out, 4); bell(x.c, x.t + 1.8, 523, 0.1, x.out, 4);
  },
  // creeping footsteps: a sneaky pizzicato line
  Spy: x => seq(x, 150, [[0, 45], [1, 48], [2, 50], [3, 51], [4, 50], [5, 48], [6, 45], [8, 57], [9, 56], [10, 45, 2]], (at, m, d) => pluck(x, at, m, 0.24, d * 1.5)),
  Tracker: x => { seq(x, 128, [[0, 50], [1.5, 50], [2, 53], [3.5, 55], [4, 57], [5.5, 55], [6, 53, 2]], (at, m, d) => pluck(x, at, m, 0.22, d * 1.4)); [0, 1.5, 3, 4.5].forEach(b => hiss(x, b * 60 / 128, 0.06, { f: 600, level: 0.08 })); },
  Watcher: x => { pad(x, 0, [57, 64], 4.5, { type: 'sine', level: 0.06, lp: 2000 }); seq(x, 96, [[0, 76], [2, 74], [4, 76], [6, 79, 2]], (at, m, d) => chime(x, at, m, 0.12)); },
};
// the built-in roles share their library's theme
const ALIAS: Record<string, string> = { Werewolves: 'Werewolf', Sorceress: 'Sorcerer', 'Apprentice Seer': 'Seer' };

// ---------- every other role: a motif generated from its name ----------
function seeded(name: string) {
  let h = 2166136261; for (let i = 0; i < name.length; i++) { h ^= name.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}
const SCALES = [[0, 2, 3, 5, 7, 8, 10], [0, 2, 3, 5, 7, 9, 10], [0, 1, 3, 5, 7, 8, 10], [0, 2, 3, 5, 7, 8, 11], [0, 3, 5, 7, 10], [0, 2, 4, 7, 9], [0, 2, 4, 6, 7, 9, 11]];
function generated(name: string): Theme {
  return x => {
    const r = seeded(name), pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
    const scale = pick(SCALES), root = 55 + Math.floor(r() * 10), bpm = 84 + Math.floor(r() * 60);
    const voice = Math.floor(r() * 4);
    const play = (at: number, m: number, d: number) => voice === 0 ? pluck(x, at, m, 0.2, d * 1.6) : voice === 1 ? chime(x, at, m + 12, 0.13)
      : voice === 2 ? tone(x, at, m, d, { type: 'triangle', level: 0.14, attack: 0.03, lp: 2200 }) : tone(x, at, m, d, { type: 'square', level: 0.05, attack: 0.02, lp: 1600 });
    let beat = 0, step = Math.floor(r() * scale.length);
    const notes: [number, number, number][] = [];
    for (let i = 0; i < 7; i++) {
      step = Math.max(0, Math.min(scale.length * 2 - 1, step + pick([-2, -1, 1, 1, 2, 3])));
      const m = root + scale[step % scale.length] + 12 * Math.floor(step / scale.length), len = i === 6 ? 2 : pick([0.5, 1, 1, 1.5]);
      notes.push([beat, m, len]); beat += len;
    }
    pad(x, 0, [root - 24, root - 24 + scale[pick([2, 4])]], beat * 60 / bpm + 1.5, { level: 0.05, lp: 600 });
    seq(x, bpm, notes, play);
    if (r() < 0.5) [0, 2, 4].forEach(b => drum(x, b * 60 / bpm, 70 + r() * 40, 0.35, 0.3));
  };
}

let current: GainNode | null = null;
/** Play a night role's theme (by its library name, e.g. 'Seer', 'Werewolf'); a new one fades the last one out. */
export function playRoleTheme(name: string) {
  const c = audio(); if (!c || c.state !== 'running' || !name) return;
  if (current) { const old = current; old.gain.setTargetAtTime(0, c.currentTime, 0.12); setTimeout(() => old.disconnect(), 800); }
  const out = c.createGain(); out.gain.value = 0.9;
  out.connect(c.destination);
  const wet = c.createGain(); wet.gain.value = 0.45; out.connect(wet); wet.connect(reverb(c));
  current = out;
  const key = ALIAS[name] || name;
  (THEMES[key] || generated(key))({ c, out, t: c.currentTime + 0.05 });
}
