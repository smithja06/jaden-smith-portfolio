/**
 * Signal Playground: pure, deterministic signal generation and filtering.
 * Noise is a hash of (seed, sample index), so the same settings always
 * produce the same waveform — handy for tests and for scrolling playback.
 */

export interface SignalSettings {
  /** Cycles per window. */
  frequency: number;
  amplitude: number;
  /** Noise standard deviation, in the same units as amplitude. */
  noise: number;
  /** Moving-average window size in samples (1 = no smoothing). */
  window: number;
}

export const SAMPLES = 240;

export const signalDefaults: SignalSettings = {
  frequency: 3,
  amplitude: 0.8,
  noise: 0.25,
  window: 9,
};

export const signalLimits = {
  frequency: { min: 0.5, max: 12, step: 0.5 },
  amplitude: { min: 0, max: 1, step: 0.05 },
  noise: { min: 0, max: 0.6, step: 0.01 },
  window: { min: 1, max: 41, step: 2 },
} as const;

const finite = (v: number, fallback = 0) => (Number.isFinite(v) ? v : fallback);

/** 32-bit integer hash → [0, 1). Deterministic and fast. */
export function hash01(seed: number, n: number): number {
  let h = (Math.imul(seed | 0, 0x9e3779b1) ^ Math.imul(n | 0, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

/** Standard-normal sample for a given index (Box–Muller on two hashes). */
export function gaussianAt(seed: number, n: number): number {
  const u1 = Math.max(hash01(seed, n * 2), 1e-12);
  const u2 = hash01(seed, n * 2 + 1);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export interface GeneratedSignal {
  clean: number[];
  raw: number[];
}

/**
 * Generate SAMPLES points starting at absolute sample `offset`.
 * Advancing `offset` scrolls the waveform while keeping noise consistent.
 */
export function generateSignal(s: SignalSettings, offset = 0, seed = 7, count = SAMPLES): GeneratedSignal {
  const f = finite(s.frequency, 1);
  const a = finite(s.amplitude);
  const sd = Math.max(0, finite(s.noise));
  const clean: number[] = new Array(count);
  const raw: number[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const n = offset + i;
    const c = a * Math.sin((2 * Math.PI * f * n) / count);
    clean[i] = c;
    raw[i] = c + sd * gaussianAt(seed, n);
  }
  return { clean, raw };
}

/** Centered moving average with edge-shrinking window. Output length = input length. */
export function movingAverage(x: number[], window: number): number[] {
  const w = Math.max(1, Math.floor(finite(window, 1)));
  if (w === 1 || x.length === 0) return x.slice();
  const half = Math.floor(w / 2);
  const prefix = new Array(x.length + 1);
  prefix[0] = 0;
  for (let i = 0; i < x.length; i++) prefix[i + 1] = prefix[i] + x[i];
  return x.map((_, i) => {
    const lo = Math.max(0, i - half);
    const hi = Math.min(x.length, i + half + 1);
    return (prefix[hi] - prefix[lo]) / (hi - lo);
  });
}

export function rms(x: number[]): number {
  if (x.length === 0) return 0;
  let s = 0;
  for (const v of x) s += v * v;
  return Math.sqrt(s / x.length);
}

export function peakToPeak(x: number[]): number {
  if (x.length === 0) return 0;
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of x) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return hi - lo;
}

/** RMS of the difference between two equal-length series. */
export function rmsError(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s / n);
}

/** Indices where the signal changes sign (with hysteresis to ignore noise chatter). */
export function zeroCrossings(x: number[], band = 0.05): number[] {
  const idx: number[] = [];
  let state = 0;
  x.forEach((v, i) => {
    const next = v > band ? 1 : v < -band ? -1 : state;
    if (state !== 0 && next !== state) idx.push(i);
    state = next;
  });
  return idx;
}

/** Cycles per window, estimated from the mean spacing between crossings. */
export function estimateCycles(x: number[], band = 0.05): number {
  const idx = zeroCrossings(x, band);
  if (idx.length < 2) return idx.length / 2;
  const span = idx[idx.length - 1] - idx[0];
  if (span <= 0) return 0;
  const halfPeriod = span / (idx.length - 1);
  return x.length / (2 * halfPeriod);
}

export interface SignalStats {
  rawRms: number;
  processedRms: number;
  rawP2p: number;
  processedP2p: number;
  /** RMS deviation from the clean (noise-free) signal. */
  rawError: number;
  processedError: number;
  /** Estimated cycles per window from zero crossings of processed signal. */
  estimatedCycles: number;
}

export function computeStats(sig: GeneratedSignal, processed: number[]): SignalStats {
  const stats: SignalStats = {
    rawRms: rms(sig.raw),
    processedRms: rms(processed),
    rawP2p: peakToPeak(sig.raw),
    processedP2p: peakToPeak(processed),
    rawError: rmsError(sig.raw, sig.clean),
    processedError: rmsError(processed, sig.clean),
    estimatedCycles: estimateCycles(processed),
  };
  for (const k of Object.keys(stats) as (keyof SignalStats)[]) stats[k] = finite(stats[k]);
  return stats;
}
