// Moonfall sounds — synthesized with the Web Audio API (no audio files, works offline).
// Phones only allow sound after the page has been tapped once, so call installAudioUnlock() at start.

let ctx: AudioContext | null = null;
let verb: ConvolverNode | null = null;

function audio(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Resume audio on the first taps (browsers keep it suspended until a user gesture). */
export function installAudioUnlock() {
  const unlock = () => {
    const c = audio();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (c.state === 'running') {
      // a silent blip finishes the unlock on iOS
      const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
      ['pointerdown', 'touchend', 'keydown'].forEach(e => window.removeEventListener(e, unlock));
    }
  };
  ['pointerdown', 'touchend', 'keydown'].forEach(e => window.addEventListener(e, unlock, { passive: true }));
}

/** A long, dark reverb tail shared by all sounds. */
function reverb(c: AudioContext): ConvolverNode {
  if (verb) return verb;
  const len = Math.floor(c.sampleRate * 3.2), buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  verb = c.createConvolver();
  verb.buffer = buf;
  verb.connect(c.destination);
  return verb;
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** Output bus: dry + reverb send. */
function bus(c: AudioContext, level: number, wet: number, pan = 0) {
  const g = c.createGain(); g.gain.value = level;
  const p = c.createStereoPanner ? c.createStereoPanner() : null;
  if (p) { p.pan.value = pan; g.connect(p); p.connect(c.destination); } else g.connect(c.destination);
  const send = c.createGain(); send.gain.value = wet; g.connect(send); send.connect(reverb(c));
  return g;
}

/** A gentler outdoor reverb for the howl (a big cathedral tail makes it sound like a ghost). */
let forest: ConvolverNode | null = null;
function forestVerb(c: AudioContext): ConvolverNode {
  if (forest) return forest;
  const len = Math.floor(c.sampleRate * 1.8), buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4) * (i < c.sampleRate * 0.02 ? 0.3 : 1);
  }
  forest = c.createConvolver(); forest.buffer = buf;
  const dark = c.createBiquadFilter(); dark.type = 'lowpass'; dark.frequency.value = 2200;
  forest.connect(dark); dark.connect(c.destination);
  return forest;
}

/**
 * One wolf. A real howl is a fairly low, breathy, throaty voice: it scoops up quickly, holds with small
 * irregular wobbles (not a smooth vibrato), the mouth opens and closes ("aoo-oo" — the formants move),
 * and it ends with a downward break. A buzzy source through moving vocal formants gives that animal timbre.
 */
function wolf(c: AudioContext, t0: number, f: number, level: number, pan: number, dur: number) {
  const out = c.createGain(); out.gain.value = level;
  const p = c.createStereoPanner ? c.createStereoPanner() : null;
  if (p) { p.pan.value = pan; out.connect(p); p.connect(c.destination); } else out.connect(c.destination);
  const wet = c.createGain(); wet.gain.value = 0.32; out.connect(wet); wet.connect(forestVerb(c));

  // voice: sawtooth + softer square an octave down for body
  const v1 = c.createOscillator(); v1.type = 'sawtooth';
  const v2 = c.createOscillator(); v2.type = 'triangle';
  const sub = c.createGain(); sub.gain.value = 0.35; v2.connect(sub);
  const voice = c.createGain(); voice.gain.value = 0; v1.connect(voice); sub.connect(voice);
  const end = t0 + dur;
  for (const o of [v1, v2]) {
    const m = o === v2 ? 0.5 : 1;
    o.frequency.setValueAtTime(f * 0.55 * m, t0);                         // throaty start
    o.frequency.exponentialRampToValueAtTime(f * 0.96 * m, t0 + 0.32);   // the scoop up
    o.frequency.linearRampToValueAtTime(f * 1.04 * m, t0 + dur * 0.55);  // slow lift while holding
    o.frequency.linearRampToValueAtTime(f * 0.98 * m, t0 + dur * 0.78);
    o.frequency.exponentialRampToValueAtTime(f * 0.62 * m, end);          // the break down at the end
  }
  // small irregular pitch wobble (jitter), not a singer's vibrato
  const jit = c.createBufferSource(); jit.buffer = noiseBuffer(c, dur + 0.2);
  const jf = c.createBiquadFilter(); jf.type = 'lowpass'; jf.frequency.value = 9;
  const jd = c.createGain(); jd.gain.value = f * 0.06;
  jit.connect(jf); jf.connect(jd); jd.connect(v1.frequency);

  // vocal tract: three formants that open ("aa") and close ("oo") during the howl
  const formants: [number, number, number, number][] = [[480, 820, 8, 1], [1050, 1350, 10, 0.55], [2600, 2800, 12, 0.18]];
  const mix = c.createGain(); mix.gain.value = 1;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; mix.connect(lp); lp.connect(out);
  for (const [lo, hi, q, g] of formants) {
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(lo, t0);
    bp.frequency.linearRampToValueAtTime(hi, t0 + 0.45);                  // mouth opens
    bp.frequency.setValueAtTime(hi, t0 + dur * 0.5);
    bp.frequency.linearRampToValueAtTime(lo * 0.9, end);                  // closes to "oo"
    const gg = c.createGain(); gg.gain.value = g * 3; voice.connect(bp); bp.connect(gg); gg.connect(mix);
  }
  // breath through the nose and mouth
  const br = c.createBufferSource(); br.buffer = noiseBuffer(c, dur + 0.2);
  const bf = c.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 1100; bf.Q.value = 0.7;
  const bg = c.createGain(); bg.gain.value = 0;
  bg.gain.setValueAtTime(0, t0); bg.gain.linearRampToValueAtTime(0.06, t0 + 0.2); bg.gain.linearRampToValueAtTime(0.025, end);
  br.connect(bf); bf.connect(bg); bg.connect(mix);

  // loudness: quick swell, hold, fade with the break
  voice.gain.setValueAtTime(0, t0);
  voice.gain.linearRampToValueAtTime(0.5, t0 + 0.18);
  voice.gain.linearRampToValueAtTime(0.62, t0 + dur * 0.5);
  voice.gain.linearRampToValueAtTime(0.45, t0 + dur * 0.8);
  voice.gain.exponentialRampToValueAtTime(0.001, end);
  [v1, v2, jit, br].forEach(s => { s.start(t0); s.stop(end + 0.1); });
}

/** Night falls: a wolf howls, a second one answers from further off (wolves harmonize rather than match). */
export function playHowl() {
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.05;
  wolf(c, t, 440, 0.5, -0.15, 3.4);
  wolf(c, t + 1.5, 523, 0.2, 0.5, 2.8);
}

/** Day breaks: a warm swell, bell tones climbing, and birds. */
export function playSunrise() {
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.05;
  // warm pad (Cmaj9)
  const pad = bus(c, 0.16, 0.6);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(2600, t + 2.4); lp.connect(pad);
  const penv = c.createGain(); penv.gain.setValueAtTime(0, t); penv.gain.linearRampToValueAtTime(1, t + 1.6); penv.gain.setValueAtTime(1, t + 3); penv.gain.exponentialRampToValueAtTime(0.001, t + 5.2); penv.connect(lp);
  [261.6, 329.6, 392, 493.9, 587.3].forEach((f, i) => {
    const o = c.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (i - 2) * 4;
    const g = c.createGain(); g.gain.value = 0.22; o.connect(g); g.connect(penv); o.start(t); o.stop(t + 5.4);
  });
  // bell tones rising like the sun
  const bells = bus(c, 0.13, 0.7);
  [783.99, 880, 1046.5, 1318.5, 1568].forEach((f, i) => {
    const s = t + 0.5 + i * 0.32;
    [1, 2.76].forEach((m, j) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m;
      const g = c.createGain(); g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(j ? 0.12 : 0.5, s + 0.01); g.gain.exponentialRampToValueAtTime(0.0008, s + 1.8);
      o.connect(g); g.connect(bells); o.start(s); o.stop(s + 1.9);
    });
  });
  // birds
  const birds = bus(c, 0.08, 0.35, 0.3);
  [2.1, 2.35, 2.5, 3.3, 3.5, 4.2].forEach((d, i) => {
    const s = t + d, o = c.createOscillator(); o.type = 'sine';
    const f0 = 3200 + (i % 3) * 600;
    o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(f0 * 1.35, s + 0.06); o.frequency.exponentialRampToValueAtTime(f0 * 0.9, s + 0.12);
    const g = c.createGain(); g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.6, s + 0.015); g.gain.exponentialRampToValueAtTime(0.001, s + 0.14);
    o.connect(g); g.connect(birds); o.start(s); o.stop(s + 0.16);
  });
}

/** A low funeral bell. */
function bell(c: AudioContext, t: number, f: number, level: number, out: AudioNode, decay = 6) {
  [[1, 1], [2.0, 0.5], [2.4, 0.35], [3.9, 0.18], [5.4, 0.08]].forEach(([m, a]) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m;
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level * a, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0004, t + decay / m ** 0.3);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + decay + 0.2);
  });
}

/** A soft, bowed, cello-like note (for mournful lines). */
function bowed(c: AudioContext, t: number, f: number, dur: number, level: number, out: AudioNode) {
  const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
  const vib = c.createOscillator(); vib.frequency.value = 4.6; const vd = c.createGain(); vd.gain.value = f * 0.006; vib.connect(vd); vd.connect(o.frequency);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = f * 3.2; lp.Q.value = 0.6;
  const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.35); g.gain.setValueAtTime(level, t + dur - 0.3); g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
  o.connect(lp); lp.connect(g); g.connect(out);
  [o, vib].forEach(x => { x.start(t); x.stop(t + dur + 0.5); });
}

/** Day breaks after a death: a grey morning — a low minor swell, a mournful falling line, one funeral bell. */
export function playMourning() {
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.05;
  const out = bus(c, 0.22, 0.75);
  // A-minor pad
  const pad = c.createGain(); pad.gain.setValueAtTime(0, t); pad.gain.linearRampToValueAtTime(0.55, t + 2); pad.gain.setValueAtTime(0.55, t + 4.5); pad.gain.linearRampToValueAtTime(0, t + 7.5);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; pad.connect(lp); lp.connect(out);
  [110, 130.8, 164.8, 220].forEach((f, i) => {
    const o = c.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 5;
    const g = c.createGain(); g.gain.value = 0.25; o.connect(g); g.connect(pad); o.start(t); o.stop(t + 7.6);
  });
  // the mourning line: E D C B … A
  [[329.6, 0.9], [293.7, 0.9], [261.6, 0.9], [246.9, 1.0], [220, 2.4]].reduce((at, [f, d]) => { bowed(c, at, f, d, 0.16, out); return at + d; }, t + 0.8);
  bell(c, t + 0.4, 98, 0.22, out, 7);
}

/** Day breaks after several deaths: a deep impact, a dissonant swell, shrill strings, a heartbeat and heavy bells. */
export function playMassacre() {
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.05;
  const out = bus(c, 0.26, 0.8);
  // impact: a falling sub boom + a dark noise burst
  const boom = c.createOscillator(); boom.type = 'sine'; boom.frequency.setValueAtTime(70, t); boom.frequency.exponentialRampToValueAtTime(28, t + 1.6);
  const bg = c.createGain(); bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(1.1, t + 0.02); bg.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
  boom.connect(bg); bg.connect(out); boom.start(t); boom.stop(t + 2.3);
  const nz = c.createBufferSource(); nz.buffer = noiseBuffer(c, 1.5);
  const nf = c.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.setValueAtTime(1200, t); nf.frequency.exponentialRampToValueAtTime(120, t + 1.2);
  const ng = c.createGain(); ng.gain.setValueAtTime(0.5, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
  nz.connect(nf); nf.connect(ng); ng.connect(out); nz.start(t); nz.stop(t + 1.5);
  // dissonant cluster swelling up from the dark
  const cl = c.createGain(); cl.gain.setValueAtTime(0, t + 0.3); cl.gain.linearRampToValueAtTime(0.5, t + 3.2); cl.gain.linearRampToValueAtTime(0, t + 7);
  const clf = c.createBiquadFilter(); clf.type = 'lowpass'; clf.frequency.setValueAtTime(200, t + 0.3); clf.frequency.exponentialRampToValueAtTime(1600, t + 3.2); clf.frequency.exponentialRampToValueAtTime(300, t + 7);
  cl.connect(clf); clf.connect(out);
  [65.4, 69.3, 92.5, 98, 138.6].forEach((f, i) => {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = (i - 2) * 9;
    const g = c.createGain(); g.gain.value = 0.18; o.connect(g); g.connect(cl); o.start(t + 0.3); o.stop(t + 7.1);
  });
  // shrill, trembling high strings a semitone apart
  [1760, 1864.7].forEach((f, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const trem = c.createOscillator(); trem.frequency.value = 9 + i * 2; const td = c.createGain(); td.gain.value = 0.03;
    const g = c.createGain(); g.gain.setValueAtTime(0, t + 1); g.gain.linearRampToValueAtTime(0.035, t + 3.5); g.gain.linearRampToValueAtTime(0, t + 6.5);
    trem.connect(td); td.connect(g.gain); o.connect(g); g.connect(out);
    [o, trem].forEach(x => { x.start(t + 1); x.stop(t + 6.6); });
  });
  // heartbeat
  [1.4, 1.65, 2.6, 2.85, 3.8, 4.05].forEach((d, i) => {
    const s0 = t + d, o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(58, s0); o.frequency.exponentialRampToValueAtTime(40, s0 + 0.18);
    const g = c.createGain(); g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(i % 2 ? 0.45 : 0.7, s0 + 0.01); g.gain.exponentialRampToValueAtTime(0.001, s0 + 0.25);
    o.connect(g); g.connect(out); o.start(s0); o.stop(s0 + 0.3);
  });
  // two heavy bell tolls
  bell(c, t + 0.1, 73.4, 0.3, out, 8);
  bell(c, t + 3.4, 69.3, 0.26, out, 8);
}

/** The morning sound for how many players died tonight. */
export function playDawn(deaths: number) {
  if (deaths >= 2) playMassacre(); else if (deaths === 1) playMourning(); else playSunrise();
}

// ---------- host-only night ambience (very quiet loop) ----------
let amb: { stop: () => void } | null = null;
let wantAmb = false;

export function startAmbience() {
  wantAmb = true;
  const c = audio(); if (!c || amb) return;
  // still locked (no tap yet): start as soon as audio is allowed
  if (c.state !== 'running') { c.resume().then(() => { if (wantAmb) startAmbience(); }).catch(() => {}); return; }
  const master = c.createGain(); master.gain.setValueAtTime(0, c.currentTime); master.gain.linearRampToValueAtTime(0.16, c.currentTime + 4);
  master.connect(c.destination);
  const send = c.createGain(); send.gain.value = 0.7; master.connect(send); send.connect(reverb(c));
  const nodes: AudioScheduledSourceNode[] = [];
  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

  // a faint eerie hum: two low tones a tritone apart, slowly swelling
  [[65.4, 0.32], [92.5, 0.14], [130.8, 0.06]].forEach(([f, g], i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = i * 6;
    const gg = c.createGain(); gg.gain.value = g;
    const l = c.createOscillator(); l.frequency.value = 0.04 + i * 0.025;
    const ld = c.createGain(); ld.gain.value = g * 0.6; l.connect(ld); ld.connect(gg.gain);
    o.connect(gg); gg.connect(master); o.start(); l.start(); nodes.push(o, l);
  });

  // metal wind chimes: inharmonic partials, a few strikes at a time like a breeze moving them
  const CHIMES = [1318.5, 1480, 1568, 1760, 1975.5, 2093, 2349.3, 2637]; // E6 F#6 G6 A6 B6 C7 D7 E7 — minor, a little cold
  const strike = (when: number, f: number, vel: number, pan: number) => {
    const out = c.createGain(); out.gain.value = vel;
    const pn = c.createStereoPanner ? c.createStereoPanner() : null;
    if (pn) { pn.pan.value = pan; out.connect(pn); pn.connect(master); } else out.connect(master);
    [[1, 1, 4.2], [2.76, 0.42, 2.2], [5.4, 0.18, 1.1], [8.93, 0.07, 0.6]].forEach(([m, a, d]) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m * (1 + (Math.random() - 0.5) * 0.004);
      const g = c.createGain(); g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(a, when + 0.003); g.gain.exponentialRampToValueAtTime(0.0003, when + d);
      o.connect(g); g.connect(out); o.start(when); o.stop(when + d + 0.05);
    });
  };
  const gust = () => {
    const n = 2 + Math.floor(Math.random() * 5);
    let t = c.currentTime + 0.05;
    for (let i = 0; i < n; i++) {
      strike(t, CHIMES[Math.floor(Math.random() * CHIMES.length)], 0.05 + Math.random() * 0.07, Math.random() * 1.2 - 0.6);
      t += 0.08 + Math.random() * 0.32;
    }
    later(gust, 2500 + Math.random() * 6500);
  };
  later(gust, 1500);

  // a broken music box: a few slow notes of a minor lullaby, slightly out of tune
  const BOX = [[880, 783.99, 698.46, 659.25], [659.25, 698.46, 587.33], [523.25, 622.25, 587.33, 523.25]];
  const musicBox = () => {
    const phrase = BOX[Math.floor(Math.random() * BOX.length)];
    let t = c.currentTime + 0.05;
    phrase.forEach(f => {
      [[1, 0.09], [3.02, 0.03]].forEach(([m, a]) => {
        const o = c.createOscillator(); o.type = m === 1 ? 'triangle' : 'sine'; o.frequency.value = f * m; o.detune.value = -18 + Math.random() * 10;
        const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0003, t + 2.4);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.5);
      });
      t += 0.55 + Math.random() * 0.25;
    });
    later(musicBox, 22000 + Math.random() * 20000);
  };
  later(musicBox, 9000);

  // a far-off bell now and then
  const toll = () => {
    const s0 = c.currentTime + 0.05;
    [[146.8, 0.2], [146.8 * 2.4, 0.06], [146.8 * 3.9, 0.03]].forEach(([f, a]) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = c.createGain(); g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(a, s0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0004, s0 + 5);
      o.connect(g); g.connect(master); o.start(s0); o.stop(s0 + 5.2);
    });
    later(toll, 25000 + Math.random() * 20000);
  };
  later(toll, 16000);

  amb = {
    stop: () => {
      timers.forEach(clearTimeout);
      const t = c.currentTime;
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0, t + 1.5);
      window.setTimeout(() => { nodes.forEach(x => { try { x.stop(); } catch { /* already stopped */ } }); master.disconnect(); }, 1700);
    },
  };
}

export function stopAmbience() {
  wantAmb = false;
  if (amb) { amb.stop(); amb = null; }
}
