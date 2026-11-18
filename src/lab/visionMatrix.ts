/**
 * Vision → 4×4 matrix: pure, UI-free model.
 * A simplified teaching model of the MED-T idea. Not the project's real pipeline.
 */

export const GRID = 4;
export const CELLS = GRID * GRID;

/** Row-major brightness values in [0, 1]. Length is always 16. */
export type Field = number[];
/** Output levels 0..3. */
export type Level = 0 | 1 | 2 | 3;

export type PresetId = 'gradient' | 'hotspot' | 'diagonal' | 'checker' | 'moving';

export const presets: { id: PresetId; label: string; animated: boolean }[] = [
  { id: 'gradient', label: 'Gradient', animated: false },
  { id: 'hotspot', label: 'Center hotspot', animated: false },
  { id: 'diagonal', label: 'Diagonal edge', animated: false },
  { id: 'checker', label: 'Checkerboard', animated: false },
  { id: 'moving', label: 'Moving spot', animated: true },
];

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

export function cellIndex(row: number, col: number) {
  return row * GRID + col;
}

export function cellCoords(i: number) {
  return { row: Math.floor(i / GRID), col: i % GRID };
}

/** Generate a preset field. `t` is time in seconds (only used by animated presets). */
export function presetField(id: PresetId, t = 0): Field {
  const out: Field = new Array(CELLS);
  for (let i = 0; i < CELLS; i++) {
    const { row, col } = cellCoords(i);
    const x = col / (GRID - 1);
    const y = row / (GRID - 1);
    let v = 0;
    switch (id) {
      case 'gradient':
        v = (x + y) / 2;
        break;
      case 'hotspot': {
        // Normalise so the four centre cells reach 1 and corners reach 0.
        const d = Math.hypot(x - 0.5, y - 0.5);
        const dMin = Math.hypot(1 / 6, 1 / 6);
        v = 1 - (d - dMin) / (Math.SQRT1_2 - dMin);
        break;
      }
      case 'diagonal':
        v = x > y ? 0.9 : x === y ? 0.5 : 0.08;
        break;
      case 'checker':
        v = (row + col) % 2 === 0 ? 0.85 : 0.1;
        break;
      case 'moving': {
        // Spot travels a slow Lissajous path across the grid.
        const cx = 0.5 + 0.5 * Math.sin(t * 0.9);
        const cy = 0.5 + 0.5 * Math.sin(t * 0.6 + 1.2);
        const d = Math.hypot(x - cx, y - cy);
        v = Math.exp(-(d * d) / 0.09);
        break;
      }
    }
    out[i] = clamp01(v);
  }
  return out;
}

/**
 * Blend each cell with the mean of its 3×3 neighbourhood.
 * amount 0 = untouched, 1 = full box blur.
 */
export function smoothField(field: Field, amount: number): Field {
  const a = clamp01(amount);
  if (a === 0) return field.slice();
  return field.map((v, i) => {
    const { row, col } = cellCoords(i);
    let sum = 0;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < GRID && c >= 0 && c < GRID) {
          sum += field[cellIndex(r, c)];
          n++;
        }
      }
    }
    return clamp01(v * (1 - a) + (sum / n) * a);
  });
}

/** Multiply brightness by a gain factor, clamped to [0, 1]. */
export function applyGain(field: Field, gain: number): Field {
  const g = Number.isFinite(gain) ? Math.max(0, gain) : 1;
  return field.map((v) => clamp01(v * g));
}

export type Mode = 'threshold' | 'quantize';

/** Threshold mode: cell is fully on (3) at or above threshold, off (0) below. */
export function thresholdLevel(v: number, threshold: number): Level {
  return v >= threshold ? 3 : 0;
}

/**
 * Quantize mode: three ascending boundaries split [0,1] into levels 0..3.
 * Boundaries are sorted defensively so the mapping is always monotonic.
 */
export function quantizeLevel(v: number, bounds: [number, number, number]): Level {
  const [b1, b2, b3] = [...bounds].sort((a, b) => a - b);
  if (v >= b3) return 3;
  if (v >= b2) return 2;
  if (v >= b1) return 1;
  return 0;
}

export interface MapSettings {
  mode: Mode;
  threshold: number;
  bounds: [number, number, number];
  smoothing: number;
  gain: number;
}

export const defaultSettings: MapSettings = {
  mode: 'quantize',
  threshold: 0.5,
  bounds: [0.25, 0.5, 0.75],
  smoothing: 0,
  gain: 1,
};

/** Full pipeline: input field → processed field → output levels. */
export function mapField(input: Field, s: MapSettings): { processed: Field; levels: Level[] } {
  const processed = applyGain(smoothField(input, s.smoothing), s.gain);
  const levels = processed.map((v) =>
    s.mode === 'threshold' ? thresholdLevel(v, s.threshold) : quantizeLevel(v, s.bounds),
  );
  return { processed, levels };
}

/** Level → duty cycle fraction used for display intensity. */
export function levelToDuty(level: Level): number {
  return level / 3;
}

/**
 * Move each displayed duty value toward its target by at most `step`.
 * Visual illustration of output ramping; not real firmware timing.
 */
export function rampToward(current: number[], target: number[], step: number): number[] {
  const s = Math.max(0, step);
  return current.map((c, i) => {
    const t = target[i] ?? 0;
    const d = t - c;
    if (Math.abs(d) <= s) return t;
    return c + Math.sign(d) * s;
  });
}

/** Compact state vector, e.g. "0123 0123 0123 0123". Illustrative format only. */
export function stateVector(levels: Level[]): string {
  const rows: string[] = [];
  for (let r = 0; r < GRID; r++) rows.push(levels.slice(r * GRID, r * GRID + GRID).join(''));
  return rows.join(' ');
}

/**
 * Downsample RGBA pixel data to a 4×4 luminance field by area-averaging.
 * Uses Rec. 709 luma weights on sRGB values (a simple approximation).
 */
export function downsampleLuma(data: ArrayLike<number>, width: number, height: number): Field {
  const sums = new Array(CELLS).fill(0);
  const counts = new Array(CELLS).fill(0);
  if (width <= 0 || height <= 0) return sums;
  for (let y = 0; y < height; y++) {
    const row = Math.min(GRID - 1, Math.floor((y * GRID) / height));
    for (let x = 0; x < width; x++) {
      const col = Math.min(GRID - 1, Math.floor((x * GRID) / width));
      const p = (y * width + x) * 4;
      const luma = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
      const i = cellIndex(row, col);
      sums[i] += luma;
      counts[i]++;
    }
  }
  return sums.map((s, i) => clamp01(counts[i] ? s / counts[i] : 0));
}
