const Y_RANGE = 1.9;

/** Map a series to an SVG path in a w×h box, clamping to ±Y_RANGE. */
export function toPath(values: number[], w: number, h: number) {
  if (values.length < 2) return '';
  const dx = w / (values.length - 1);
  let d = '';
  values.forEach((v, i) => {
    const clamped = Math.max(-Y_RANGE, Math.min(Y_RANGE, v));
    const y = h / 2 - (clamped / Y_RANGE) * (h / 2 - 6);
    d += `${i === 0 ? 'M' : 'L'}${(i * dx).toFixed(1)} ${y.toFixed(1)}`;
  });
  return d;
}
