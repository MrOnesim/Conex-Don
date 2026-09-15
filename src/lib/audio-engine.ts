/**
 * MOTEUR AUDIO GÉNÉRATIF.
 *
 * Conservé comme moteur de fallback/ambiance (rythmique afrobeat / amapiano
 * générée en direct dans le navigateur). Depuis le passage à l'écoute
 * YouTube, l'interface ouvre désormais le titre officiel ; ce moteur n'est
 * plus appelé par les contrôles visibles.
 */

export type Groove = {
  bpm: number;
  kick: number[];
  hat: number[];
  log: Array<{ step: number; note: number; gain?: number }>;
  keys: Array<{ step: number; notes: number[]; gain?: number }>;
  rim: number[];
};

export type EngineTrack = {
  id: string;
  title: string;
  project: string;
  durationSec: number;
  accent: string;
  youtubeId: string;
  groove: Groove;
};

const A = 110;
const C = 130.81;
const D = 146.83;
const E = 164.81;
const G = 196;
const A3 = 220;
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const G4 = 392;

export const engineTracks: EngineTrack[] = [
  {
    id: "medley",
    title: "MEDLEY — ouverture",
    project: "HÉRITAGE VIVANT LIVE",
    durationSec: 172,
    accent: "#173F32",
    youtubeId: "oGZLv0Vc7aU",
    groove: {
      bpm: 104,
      kick: [0, 7, 10],
      hat: [2, 5, 6, 9, 13, 14],
      log: [
        { step: 0, note: A },
        { step: 6, note: E },
        { step: 10, note: C },
        { step: 14, note: G },
      ],
      keys: [
        { step: 0, notes: [A3, C4], gain: 0.3 },
        { step: 8, notes: [G4, E4], gain: 0.26 },
      ],
      rim: [4, 12],
    },
  },
  {
    id: "djo-agado",
    title: "DJO AGADO — résilience",
    project: "HÉRITAGE VIVANT LIVE",
    durationSec: 158,
    accent: "#6F4A32",
    youtubeId: "oGZLv0Vc7aU",
    groove: {
      bpm: 112,
      kick: [0, 6, 10, 13],
      hat: [1, 3, 5, 7, 9, 11, 13, 15],
      log: [
        { step: 0, note: D },
        { step: 3, note: A },
        { step: 6, note: D },
        { step: 8, note: C },
        { step: 11, note: G },
        { step: 14, note: E },
      ],
      keys: [
        { step: 4, notes: [D4, A3], gain: 0.28 },
        { step: 12, notes: [C4, G4], gain: 0.24 },
      ],
      rim: [2, 10],
    },
  },
  {
    id: "ayato-feel",
    title: "AYATO — écho",
    project: "LA SYMPHONIE BÉNINOISE",
    durationSec: 186,
    accent: "#9E382C",
    youtubeId: "jIKZsZIXhs0",
    groove: {
      bpm: 98,
      kick: [0, 8],
      hat: [3, 7, 11, 15],
      log: [
        { step: 0, note: A },
        { step: 4, note: C },
        { step: 8, note: A },
        { step: 12, note: G },
      ],
      keys: [
        { step: 0, notes: [A3, E4], gain: 0.32 },
        { step: 6, notes: [C4, G4], gain: 0.26 },
        { step: 10, notes: [A3, C4], gain: 0.3 },
      ],
      rim: [4, 12],
    },
  },
  {
    id: "mode-avion",
    title: "MODE AVION — décollage",
    project: "MODE AVION",
    durationSec: 164,
    accent: "#D6A83A",
    youtubeId: "ddy8MadW1XI",
    groove: {
      bpm: 118,
      kick: [0, 3, 6, 10, 12],
      hat: [1, 2, 5, 7, 9, 13, 15],
      log: [
        { step: 0, note: E, gain: 0.6 },
        { step: 3, note: A, gain: 0.56 },
        { step: 6, note: E, gain: 0.6 },
        { step: 10, note: D, gain: 0.54 },
        { step: 12, note: C, gain: 0.56 },
      ],
      keys: [
        { step: 2, notes: [E4, A3], gain: 0.28 },
        { step: 8, notes: [D4, A3], gain: 0.25 },
        { step: 14, notes: [C4, E4], gain: 0.26 },
      ],
      rim: [4, 11],
    },
  },
  {
    id: "dessigui",
    title: "DESSIGUIMANZANBERA — énergie",
    project: "SINGLE 2026",
    durationSec: 189,
    accent: "#9E382C",
    youtubeId: "skYAk6-hxfs",
    groove: {
      bpm: 124,
      kick: [0, 5, 8, 11, 14],
      hat: [1, 3, 4, 7, 9, 12, 15],
      log: [
        { step: 0, note: A },
        { step: 5, note: C },
        { step: 8, note: A },
        { step: 11, note: G },
        { step: 14, note: E },
      ],
      keys: [
        { step: 0, notes: [A3, C4], gain: 0.3 },
        { step: 6, notes: [E4, G4], gain: 0.25 },
        { step: 12, notes: [C4, D4], gain: 0.28 },
      ],
      rim: [3, 9],
    },
  },
];

const STEPS_PER_BAR = 16;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.3;

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextStepTime = 0;
  private groove: Groove = engineTracks[0].groove;
  private startedAt = 0;
  private pausedAt = 0;
  private volume = 0.9;
  playing = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    if (!this.ctx) {
      this.ctx = new Ctor();
      const master = this.ctx.createGain();
      master.gain.value = this.volume;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 3;
      comp.knee.value = 8;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      const analyser = this.ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      master.connect(comp);
      comp.connect(analyser);
      analyser.connect(this.ctx.destination);
      this.master = master;
      this.analyser = analyser;

      const len = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
    return this.ctx;
  }

  private kick(time: number, gain = 1) {
    const ctx = this.ctx!;
    // Corps : descente 152 → 44 Hz.
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(152, time);
    osc.frequency.exponentialRampToValueAtTime(44, time + 0.14);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.45);

    // Clic de définition (mid / haut) pour une attaque audible sur enceintes.
    const click = ctx.createOscillator();
    const cg = ctx.createGain();
    click.type = "sine";
    click.frequency.setValueAtTime(520, time);
    click.frequency.exponentialRampToValueAtTime(180, time + 0.04);
    cg.gain.setValueAtTime(0.0001, time);
    cg.gain.linearRampToValueAtTime(gain * 0.4, time + 0.003);
    cg.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    click.connect(cg);
    cg.connect(this.master!);
    click.start(time);
    click.stop(time + 0.12);
  }

  private logDrum(time: number, freq: number, gain = 0.78) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    sub.type = "sine";
    osc.frequency.setValueAtTime(freq * 2.02, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.05);
    sub.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);
    osc.connect(g);
    sub.connect(g);
    g.connect(this.master!);
    osc.start(time);
    sub.start(time);
    osc.stop(time + 0.52);
    sub.stop(time + 0.52);
  }

  private shaker(time: number, gain = 0.28, tone = 5600) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = tone;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.075);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master!);
    src.start(time);
    src.stop(time + 0.1);
  }

  private rim(time: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1180, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.13, time + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private keys(time: number, notes: number[], gain = 0.24) {
    const ctx = this.ctx!;
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = index === 0 ? "triangle" : "sine";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(gain, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.master!);
      osc.start(time);
      osc.stop(time + 0.95);
    });
  }

  private scheduleStep(step: number, time: number) {
    const groove = this.groove;
    if (groove.kick.includes(step)) this.kick(time);
    if (groove.hat.includes(step)) {
      this.shaker(time, step % 4 === 2 ? 0.34 : 0.22);
    }
    if (groove.rim.includes(step)) this.rim(time);
    const log = groove.log.find((entry) => entry.step === step);
    if (log) this.logDrum(time, log.note, log.gain ?? 0.74);
    const chord = groove.keys.find((entry) => entry.step === step);
    if (chord) this.keys(time, chord.notes, chord.gain ?? 0.14);
  }

  private tick = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    const stepDur = 60 / this.groove.bpm / 4;
    while (this.nextStepTime < ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleStep(this.step % STEPS_PER_BAR, this.nextStepTime);
      this.nextStepTime += stepDur;
      this.step += 1;
    }
  };

  setGroove(groove: Groove) {
    this.groove = groove;
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  async play(): Promise<void> {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") await ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.nextStepTime = ctx.currentTime + 0.06;
    this.startedAt = ctx.currentTime - this.pausedAt;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.12);
    this.timer = window.setInterval(this.tick, LOOKAHEAD_MS);
    this.tick();
  }

  pause(): void {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    this.pausedAt = this.ctx.currentTime - this.startedAt;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.master?.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
  }

  /** Position (secondes) dans le mouvement courant. */
  position(): number {
    if (!this.ctx) return this.pausedAt;
    if (!this.playing) return this.pausedAt;
    return Math.max(0, this.ctx.currentTime - this.startedAt);
  }

  levels(bins = 28): number[] {
    if (!this.analyser) return new Array(bins).fill(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const out: number[] = [];
    const stride = Math.max(1, Math.floor((data.length * 0.7) / bins));
    for (let i = 0; i < bins; i += 1) {
      let sum = 0;
      for (let j = 0; j < stride; j += 1) sum += data[i * stride + j] ?? 0;
      out.push(Math.min(1, sum / stride / 190));
    }
    return out;
  }

  dispose(): void {
    this.pause();
    this.ctx?.close();
    this.ctx = null;
  }
}
