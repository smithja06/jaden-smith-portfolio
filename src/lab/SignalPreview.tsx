import { generateSignal, movingAverage, signalDefaults } from './signal';
import { toPath } from './chart';

const sig = generateSignal({ ...signalDefaults, frequency: 2.5, noise: 0.3 }, 0, 11, 160);
const proc = movingAverage(sig.raw, 11);

/** Small static waveform preview for the homepage and lab index. */
export function SignalPreview() {
  return (
    <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="sp-preview" aria-hidden="true">
      <path d={toPath(sig.raw, 400, 140)} fill="none" stroke="#80B9FF" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={toPath(proc, 400, 140)} fill="none" stroke="#327EFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
