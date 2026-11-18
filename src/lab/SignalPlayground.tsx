import { useEffect, useMemo, useState } from 'react';
import {
  SAMPLES, computeStats, generateSignal, movingAverage, peakToPeak, signalDefaults, signalLimits, type SignalSettings,
} from './signal';
import { Slider } from '../components/Slider';
import { toPath } from './chart';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInView } from '../hooks/useInView';

const W = 720;
const H = 280;

export function SignalPlayground() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [s, setS] = useState<SignalSettings>(signalDefaults);
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [seed, setSeed] = useState(7);
  const [showRaw, setShowRaw] = useState(true);
  const [showClean, setShowClean] = useState(false);

  useEffect(() => {
    if (!playing || !inView) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      acc += (now - last) / 1000;
      last = now;
      // advance ~40 samples per second
      const steps = Math.floor(acc * 40);
      if (steps > 0) { acc -= steps / 40; setOffset((o) => o + steps); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView]);

  const sig = useMemo(() => generateSignal(s, offset, seed), [s, offset, seed]);
  const processed = useMemo(() => movingAverage(sig.raw, s.window), [sig, s.window]);
  const stats = useMemo(() => computeStats(sig, processed), [sig, processed]);
  const set = <K extends keyof SignalSettings>(k: K, v: number) => setS((p) => ({ ...p, [k]: v }));
  const reduction = stats.rawError > 1e-9 ? 1 - stats.processedError / stats.rawError : 0;
  // Smoothing "erases" the signal when the smoothed swing collapses well below the true swing.
  const cleanP2p = peakToPeak(sig.clean);
  const erasing = s.window > 1 && cleanP2p > 0.1 && stats.processedP2p < cleanP2p * 0.6;

  const L = signalLimits;
  return (
    <div ref={ref} className="sp glass">
      <div className="vm-head">
        <span className="vm-status mono"><span className="live-dot" aria-hidden="true" />GENERATED SIGNAL · LOCAL DEMO</span>
        <span className="mono muted">{SAMPLES} SAMPLES / WINDOW</span>
      </div>

      <figure className="sp-chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
          aria-label={`Waveform chart. Raw signal RMS ${stats.rawRms.toFixed(2)}, smoothed RMS ${stats.processedRms.toFixed(2)}.`}>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(173,203,255,0.08)" vectorEffect="non-scaling-stroke" />
          ))}
          {showClean && <path d={toPath(sig.clean, W, H)} fill="none" stroke="#F5F8FF" strokeOpacity="0.55" strokeDasharray="4 5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />}
          {showRaw && <path d={toPath(sig.raw, W, H)} fill="none" stroke="#80B9FF" strokeOpacity="0.38" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
          <path d={toPath(processed, W, H)} fill="none" stroke="#327EFF" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <figcaption className="sp-key">
          <span><i className="k k-proc" />Smoothed</span>
          {showRaw && <span><i className="k k-raw" />Raw</span>}
          {showClean && <span><i className="k k-clean" />Noise-free reference</span>}
        </figcaption>
      </figure>

      <dl className="sp-stats">
        <div><dt>RMS · raw / smoothed</dt><dd className="mono">{stats.rawRms.toFixed(3)} / {stats.processedRms.toFixed(3)}</dd></div>
        <div><dt>Peak-to-peak · raw / smoothed</dt><dd className="mono">{stats.rawP2p.toFixed(3)} / {stats.processedP2p.toFixed(3)}</dd></div>
        <div><dt>Error vs reference · raw / smoothed</dt><dd className="mono">{stats.rawError.toFixed(3)} / {stats.processedError.toFixed(3)}</dd></div>
        <div><dt>Estimated cycles / window</dt><dd className="mono">{stats.estimatedCycles.toFixed(1)} <span className="muted">(set {s.frequency.toFixed(1)})</span></dd></div>
      </dl>
      <p className="ctl-hint" aria-live="polite">
        {s.window <= 1
          ? 'Smoothing is off — the processed line equals the raw signal.'
          : erasing
            ? 'This window is too wide for the frequency — smoothing is flattening the signal itself, not just the noise.'
            : reduction >= 0
            ? `Smoothing cut the error against the reference by ${(reduction * 100).toFixed(0)} percent in this window.`
            : 'Smoothing made the error worse here — try a smaller window.'}
      </p>

      <div className="vm-controls sp-controls">
        <Slider id="sp-f" label="Frequency (cycles / window)" value={s.frequency} {...L.frequency} onChange={(v) => set('frequency', v)} format={(v) => v.toFixed(1)} />
        <Slider id="sp-a" label="Amplitude" value={s.amplitude} {...L.amplitude} onChange={(v) => set('amplitude', v)} />
        <Slider id="sp-n" label="Noise (std. dev.)" value={s.noise} {...L.noise} onChange={(v) => set('noise', v)} />
        <Slider id="sp-w" label="Moving-average window" value={s.window} {...L.window} onChange={(v) => set('window', v)} format={(v) => `${v} samples`} />
        <div className="ctl ctl-actions">
          <button type="button" className="btn btn-ghost btn-sm" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSeed((x) => x + 1)}>New noise</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setS(signalDefaults); setOffset(0); setSeed(7); }}>Reset</button>
          <label className="check"><input type="checkbox" checked={showRaw} onChange={(e) => setShowRaw(e.target.checked)} /><span>Show raw</span></label>
          <label className="check"><input type="checkbox" checked={showClean} onChange={(e) => setShowClean(e.target.checked)} /><span>Show reference</span></label>
        </div>
      </div>
    </div>
  );
}
