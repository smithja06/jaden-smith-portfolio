import { describe, expect, it } from 'vitest';
import {
  SAMPLES, computeStats, generateSignal, hash01, movingAverage, signalDefaults, signalLimits,
} from './signal';

describe('signal model', () => {
  it('is deterministic for a given seed and offset', () => {
    expect(generateSignal(signalDefaults, 10, 3)).toEqual(generateSignal(signalDefaults, 10, 3));
    expect(generateSignal(signalDefaults, 10, 3).raw).not.toEqual(generateSignal(signalDefaults, 10, 4).raw);
  });

  it('hash01 stays in [0,1)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = hash01(1, i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('zero noise gives raw === clean', () => {
    const s = generateSignal({ ...signalDefaults, noise: 0 });
    expect(s.raw).toEqual(s.clean);
  });

  it('moving average keeps length and window 1 is identity', () => {
    const x = [1, 2, 3, 4, 5];
    expect(movingAverage(x, 1)).toEqual(x);
    expect(movingAverage(x, 3)).toEqual([1.5, 2, 3, 4, 4.5]);
  });

  it('smoothing reduces error against the clean signal for noisy input', () => {
    const sig = generateSignal({ ...signalDefaults, noise: 0.4, frequency: 2 });
    const stats = computeStats(sig, movingAverage(sig.raw, 11));
    expect(stats.processedError).toBeLessThan(stats.rawError);
  });

  it('estimates frequency from a clean signal', () => {
    const sig = generateSignal({ ...signalDefaults, noise: 0, frequency: 4 });
    expect(computeStats(sig, sig.raw).estimatedCycles).toBeCloseTo(4, 0);
  });

  it('never produces NaN/Infinity across control extremes', () => {
    const { frequency: f, amplitude: a, noise: n, window: w } = signalLimits;
    for (const frequency of [f.min, f.max]) for (const amplitude of [a.min, a.max])
      for (const noise of [n.min, n.max]) for (const window of [w.min, w.max]) {
        const sig = generateSignal({ frequency, amplitude, noise, window });
        expect(sig.raw).toHaveLength(SAMPLES);
        const stats = computeStats(sig, movingAverage(sig.raw, window));
        Object.values(stats).forEach((v) => expect(Number.isFinite(v)).toBe(true));
      }
  });
});
