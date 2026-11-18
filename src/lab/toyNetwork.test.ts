import { describe, expect, it } from 'vitest';
import { LAYERS, forward } from './toyNetwork';

describe('toy network', () => {
  it('produces one activation array per layer with the right sizes', () => {
    const { activations, contributions } = forward([0.2, 0.5, 0.9]);
    expect(activations.map((a) => a.length)).toEqual([...LAYERS]);
    expect(contributions).toHaveLength(LAYERS.length - 1);
  });

  it('keeps every activation in [0,1] and finite, even for bad input', () => {
    for (const input of [[0, 0, 0], [1, 1, 1], [NaN, -5, 9]]) {
      forward(input).activations.flat().forEach((v) => {
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    }
  });

  it('responds to its inputs', () => {
    const a = forward([0, 0, 0]).activations[2];
    const b = forward([1, 0, 0]).activations[2];
    expect(a).not.toEqual(b);
  });
});
