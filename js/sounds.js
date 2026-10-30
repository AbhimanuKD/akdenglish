// sounds.js — "Focus sounds": calm ambient soundscapes generated with the
// Web Audio API (no audio files, so no copyright concerns). Playback only
// starts after the learner presses Play. Nothing auto-plays.

let ctx = null;
let master = null;
let current = null; // { out, stop }
let state = { scape: null, playing: false, volume: 0.5, muted: false };

const noiseCache = {};

export function isSupported() {
  return typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = state.muted ? 0 : state.volume;
    master.connect(ctx.destination);
  }
  return ctx;
}

function noiseBuffer(c, type) {
  if (noiseCache[type]) return noiseCache[type];
  const len = Math.floor(c.sampleRate * 2);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  if (type === "brown") {
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  } else if (type === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else { // white
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  noiseCache[type] = buf;
  return buf;
}

function filter(c, type, freq) {
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  return f;
}

function buildRain(c) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, "white");
  src.loop = true;
  const hp = filter(c, "highpass", 180);
  const lp = filter(c, "lowpass", 1500);
  const out = c.createGain(); out.gain.value = 0.55;
  src.connect(hp); hp.connect(lp); lp.connect(out);
  const lfo = c.createOscillator(); lfo.frequency.value = 0.12;
  const lfoAmt = c.createGain(); lfoAmt.gain.value = 600;
  lfo.connect(lfoAmt); lfoAmt.connect(lp.frequency);
  src.start(); lfo.start();
  return { out, stop() { try { src.stop(); lfo.stop(); } catch {} } };
}

function buildOcean(c) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, "brown");
  src.loop = true;
  const lp = filter(c, "lowpass", 420);
  const out = c.createGain(); out.gain.value = 0.5;
  src.connect(lp); lp.connect(out);
  const lfo = c.createOscillator(); lfo.frequency.value = 0.07;
  const lfoAmt = c.createGain(); lfoAmt.gain.value = 0.22;
  lfo.connect(lfoAmt); lfoAmt.connect(out.gain);
  src.start(); lfo.start();
  return { out, stop() { try { src.stop(); lfo.stop(); } catch {} } };
}

function buildForest(c) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, "pink");
  src.loop = true;
  const lp = filter(c, "lowpass", 950);
  const out = c.createGain(); out.gain.value = 0.32;
  src.connect(lp); lp.connect(out);
  src.start();
  const timers = [];
  function chirp() {
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    const base = 1800 + Math.random() * 1200;
    o.frequency.setValueAtTime(base, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.3, t + 0.08);
    o.frequency.exponentialRampToValueAtTime(base, t + 0.16);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.055, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.28);
  }
  function schedule() {
    const delay = 2500 + Math.random() * 5000;
    timers.push(setTimeout(() => { if (ctx) chirp(); schedule(); }, delay));
  }
  schedule();
  return { out, stop() { try { src.stop(); } catch {} timers.forEach(clearTimeout); } };
}

function buildBrown(c) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, "brown");
  src.loop = true;
  const lp = filter(c, "lowpass", 280);
  const out = c.createGain(); out.gain.value = 0.5;
  src.connect(lp); lp.connect(out);
  src.start();
  return { out, stop() { try { src.stop(); } catch {} } };
}

const SCAPES = {
  rain: { label: "Rain", icon: "🌧️", build: buildRain },
  ocean: { label: "Ocean", icon: "🌊", build: buildOcean },
  forest: { label: "Forest", icon: "🌲", build: buildForest },
  brown: { label: "Soft noise", icon: "🌫️", build: buildBrown },
};
export function getScapes() { return SCAPES; }

export function getState() { return { ...state }; }
export function setVolume(v) {
  state.volume = clamp(Number(v) || 0, 0, 1);
  if (master && !state.muted) master.gain.value = state.volume;
}
export function setMuted(m) {
  state.muted = !!m;
  if (master) master.gain.value = m ? 0 : state.volume;
}
export function setScape(id) { state.scape = id; }

export function play(scape) {
  if (!isSupported()) return { ok: false, error: "Audio is not supported in this browser." };
  const c = ensureCtx();
  if (c.state === "suspended") c.resume();
  stopAll();
  const def = SCAPES[scape];
  if (!def) return { ok: false, error: "Unknown sound." };
  const built = def.build(c);
  built.out.connect(master);
  current = built;
  state.scape = scape;
  state.playing = true;
  return { ok: true };
}

export function pause() {
  if (ctx && ctx.state === "running") ctx.suspend();
  state.playing = false;
}
export function resume() {
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  state.playing = true;
}
export function togglePlay() {
  if (state.playing) pause(); else resume();
  return state.playing;
}
export function stopAll() {
  if (current) {
    try { current.out.disconnect(); } catch {}
    try { current.stop(); } catch {}
    current = null;
  }
  state.playing = false;
}
