const fs = require("fs");
const path = require("path");

const SR = 44100;
const DUR = 8.0;
const N = Math.floor(SR * DUR);

// Warm A-minor-ish ambient pad, all frequencies are multiples of 0.125Hz
// so every tone completes an integer number of cycles over the 8s loop -> seamless.
const voices = [
  { f: 55.0, amp: 0.42, lfo: 0.25, lfoPhase: 0.0 },
  { f: 82.5, amp: 0.30, lfo: 0.25, lfoPhase: 0.5 },
  { f: 110.0, amp: 0.50, lfo: 0.125, lfoPhase: 0.25 },
  { f: 137.5, amp: 0.22, lfo: 0.125, lfoPhase: 0.75 },
  { f: 165.0, amp: 0.18, lfo: 0.25, lfoPhase: 0.35 },
  { f: 206.25, amp: 0.10, lfo: 0.125, lfoPhase: 0.6 },
];

const samples = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;
  for (const v of voices) {
    const shim = 1 - 0.28 * (0.5 + 0.5 * Math.sin(2 * Math.PI * v.lfo * t + v.lfoPhase * 2 * Math.PI));
    s += v.amp * shim * Math.sin(2 * Math.PI * v.f * t);
  }
  s = Math.tanh(s * 1.4); // soft saturation for warmth
  samples[i] = s;
}

// normalize to 0.55 peak
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(samples[i]));
const gain = peak > 0 ? 0.55 / peak : 1;

const pcm = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, samples[i] * gain));
  pcm.writeInt16LE(Math.round(v * 32767), i * 2);
}

const outDir = path.join(process.cwd(), "public", "sounds");
fs.mkdirSync(outDir, { recursive: true });
const buf = Buffer.alloc(44);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + pcm.length, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(pcm.length, 40);
const file = Buffer.concat([buf, pcm]);
const outPath = path.join(outDir, "ambient-loop.wav");
fs.writeFileSync(outPath, file);
console.log(`wrote ${outPath} (${(file.length / 1024).toFixed(0)} KB, ${DUR}s, ${SR}Hz, mono)`);