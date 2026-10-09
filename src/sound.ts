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

/** One wolf: a rising, wavering, falling howl. */
function wolf(c: AudioContext, t0: number, base: number, level: number, pan: number) {
  const out = bus(c, level, 0.9, pan);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1900; lp.Q.value = 0.7; lp.connect(out);
  const formant = c.createBiquadFilter(); formant.type = 'bandpass'; formant.frequency.value = 950; formant.Q.value = 1.4;
  const fg = c.createGain(); fg.gain.value = 0.6; formant.connect(fg); fg.connect(lp);
  const env = c.createGain(); env.gain.value = 0; env.connect(lp); env.connect(formant);
  const dur = 3.4;
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(0.9, t0 + 0.45);
  env.gain.setValueAtTime(0.9, t0 + 2.2);
  env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  const f = (o: OscillatorNode) => {
    o.frequency.setValueAtTime(base * 0.62, t0);
    o.frequency.exponentialRampToValueAtTime(base, t0 + 0.55);
    o.frequency.setValueAtTime(base, t0 + 1.9);
    o.frequency.exponentialRampToValueAtTime(base * 0.7, t0 + dur);
  };
  const o1 = c.createOscillator(); o1.type = 'sine'; f(o1);
  const o2 = c.createOscillator(); o2.type = 'triangle'; f(o2); o2.detune.value = 1200;
  const g2 = c.createGain(); g2.gain.value = 0.18; o2.connect(g2); g2.connect(env);
  o1.connect(env);
  // the waver in a wolf's voice
  const lfo = c.createOscillator(); lfo.frequency.value = 5.2;
  const depth = c.createGain(); depth.gain.value = base * 0.018;
  lfo.connect(depth); depth.connect(o1.frequency); depth.connect(o2.frequency);
  // breath
  const n = c.createBufferSource(); n.buffer = noiseBuffer(c, dur);
  const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1400; nf.Q.value = 0.8;
  const ng = c.createGain(); ng.gain.value = 0.05; n.connect(nf); nf.connect(ng); ng.connect(env);
  [o1, o2, lfo, n].forEach(s => { s.start(t0); s.stop(t0 + dur + 0.1); });
}

/** Night falls: a wolf howls, a second answers from far away. */
export function playHowl() {
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.05;
  wolf(c, t, 640, 0.32, -0.2);
  wolf(c, t + 1.1, 540, 0.14, 0.45);
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

// ---------- host-only night ambience (very quiet loop) ----------
let amb: { stop: () => void } | null = null;
let wantAmb = false;

export function startAmbience() {
  wantAmb = true;
  const c = audio(); if (!c || amb) return;
  // still locked (no tap yet): start as soon as audio is allowed
  if (c.state !== 'running') { c.resume().then(() => { if (wantAmb) startAmbience(); }).catch(() => {}); return; }
  const master = c.createGain(); master.gain.setValueAtTime(0, c.currentTime); master.gain.linearRampToValueAtTime(0.11, c.currentTime + 4);
  master.connect(c.destination);
  const send = c.createGain(); send.gain.value = 0.5; master.connect(send); send.connect(reverb(c));
  const nodes: AudioScheduledSourceNode[] = [];
  // low drone, slowly breathing
  [55, 82.4, 110.3].forEach((f, i) => {
    const o = c.createOscillator(); o.type = i === 1 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = i * 7;
    const g = c.createGain(); g.gain.value = i === 0 ? 0.5 : 0.18;
    const l = c.createOscillator(); l.frequency.value = 0.05 + i * 0.03;
    const ld = c.createGain(); ld.gain.value = 0.12; l.connect(ld); ld.connect(g.gain);
    o.connect(g); g.connect(master); o.start(); l.start(); nodes.push(o, l);
  });
  // wind
  const n = c.createBufferSource(); n.buffer = noiseBuffer(c, 6); n.loop = true;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.9;
  const sweep = c.createOscillator(); sweep.frequency.value = 0.07;
  const sd = c.createGain(); sd.gain.value = 260; sweep.connect(sd); sd.connect(bp.frequency);
  const wg = c.createGain(); wg.gain.value = 0.22;
  n.connect(bp); bp.connect(wg); wg.connect(master); n.start(); sweep.start(); nodes.push(n, sweep);
  // a far-off bell now and then
  let timer = 0;
  const toll = () => {
    const s = c.currentTime + 0.05, o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 196;
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 196 * 2.4;
    const g = c.createGain(); g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.25, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0005, s + 4);
    o.connect(g); o2.connect(g); g.connect(master); o.start(s); o2.start(s); o.stop(s + 4.2); o2.stop(s + 4.2);
    timer = window.setTimeout(toll, 12000 + Math.random() * 14000);
  };
  timer = window.setTimeout(toll, 7000);
  amb = {
    stop: () => {
      clearTimeout(timer);
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
