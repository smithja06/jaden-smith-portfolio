/**
 * A tiny 3 → 4 → 2 feed-forward network with hand-set weights.
 * It is NOT trained on anything; it exists to make "activations flowing
 * through weighted connections" visible and touchable.
 */

export const LAYERS = [3, 4, 2] as const;

/** weights[l][j][i]: from neuron i in layer l to neuron j in layer l+1. */
export const weights: number[][][] = [
  [
    [1.6, -0.8, 0.4],
    [-1.1, 1.4, 0.9],
    [0.5, 0.7, -1.5],
    [1.2, 1.0, 1.1],
  ],
  [
    [1.4, -1.2, 0.8, 0.9],
    [-0.7, 1.3, 1.1, -0.6],
  ],
];

export const biases: number[][] = [
  [-0.4, -0.3, 0.2, -1.2],
  [-0.6, -0.2],
];

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export interface ForwardResult {
  /** Activations per layer, each value in [0,1] (inputs clamped, tanh rescaled, sigmoid). */
  activations: number[][];
  /** Signed contribution weight × source activation for every edge, per layer gap. */
  contributions: number[][][];
}

export function forward(inputs: number[]): ForwardResult {
  const input = Array.from({ length: LAYERS[0] }, (_, i) => {
    const v = inputs[i];
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
  });
  const activations: number[][] = [input];
  const contributions: number[][][] = [];
  for (let l = 0; l < weights.length; l++) {
    const prev = activations[l];
    const contrib = weights[l].map((row) => row.map((w, i) => w * prev[i]));
    const sums = contrib.map((row, j) => row.reduce((s, v) => s + v, 0) + biases[l][j]);
    const isOutput = l === weights.length - 1;
    activations.push(sums.map((z) => (isOutput ? sigmoid(z) : (Math.tanh(z) + 1) / 2)));
    contributions.push(contrib);
  }
  return { activations, contributions };
}
