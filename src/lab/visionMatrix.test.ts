import { describe, expect, it } from 'vitest';
import {
  CELLS, applyGain, defaultSettings, downsampleLuma, mapField, presetField, presets,
  quantizeLevel, rampToward, smoothField, stateVector, thresholdLevel,
} from './visionMatrix';

describe('vision matrix model', () => {
  it('every preset yields 16 finite values in [0,1]', () => {
    for (const p of presets) {
      for (const t of [0, 1.3, 10]) {
        const f = presetField(p.id, t);
        expect(f).toHaveLength(CELLS);
        f.forEach((v) => {
          expect(Number.isFinite(v)).toBe(true);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        });
      }
    }
  });

  it('gradient increases toward bottom-right', () => {
    const f = presetField('gradient');
    expect(f[0]).toBe(0);
    expect(f[15]).toBe(1);
  });

  it('threshold is binary 0 / 3', () => {
    expect(thresholdLevel(0.49, 0.5)).toBe(0);
    expect(thresholdLevel(0.5, 0.5)).toBe(3);
  });

  it('quantize maps to four ordered levels, even with unsorted bounds', () => {
    const b: [number, number, number] = [0.75, 0.25, 0.5];
    expect([0.1, 0.3, 0.6, 0.9].map((v) => quantizeLevel(v, b))).toEqual([0, 1, 2, 3]);
  });

  it('checkerboard maps cell-for-cell (no coordinate swap)', () => {
    const { levels } = mapField(presetField('checker'), { ...defaultSettings, mode: 'threshold' });
    expect(stateVector(levels)).toBe('3030 0303 3030 0303');
  });

  it('smoothing 0 is identity; 1 reduces contrast', () => {
    const f = presetField('checker');
    expect(smoothField(f, 0)).toEqual(f);
    const s = smoothField(f, 1);
    expect(Math.max(...s) - Math.min(...s)).toBeLessThan(Math.max(...f) - Math.min(...f));
  });

  it('gain clamps to [0,1] and tolerates bad input', () => {
    expect(applyGain([0.6], 3)).toEqual([1]);
    expect(applyGain([0.6], NaN)).toEqual([0.6]);
  });

  it('ramp moves by at most step and lands exactly on target', () => {
    expect(rampToward([0, 1], [1, 0], 0.25)).toEqual([0.25, 0.75]);
    expect(rampToward([0.9], [1], 0.25)).toEqual([1]);
  });

  it('downsamples an 8×8 image into the right quadrant cells', () => {
    const w = 8, h = 8;
    const data = new Uint8ClampedArray(w * h * 4);
    // white top-left 2×2 block only
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const p = (y * w + x) * 4;
      data[p] = data[p + 1] = data[p + 2] = 255;
    }
    const f = downsampleLuma(data, w, h);
    expect(f[0]).toBeCloseTo(1, 5);
    expect(f.slice(1).every((v) => v === 0)).toBe(true);
  });
});
