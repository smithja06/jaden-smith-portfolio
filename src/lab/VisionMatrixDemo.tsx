import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  CELLS, GRID, cellCoords, defaultSettings, downsampleLuma, levelToDuty, mapField,
  presetField, presets, rampToward, stateVector, type Field, type Level, type MapSettings, type PresetId,
} from './visionMatrix';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInView } from '../hooks/useInView';
import { Slider } from '../components/Slider';

interface Props {
  /** Compact = homepage console; full = /lab/vision-matrix with every control. */
  compact?: boolean;
}

const pct = (v: number) => v.toFixed(2);

function heatColor(v: number) {
  // midnight → soft blue
  const a = [8, 20, 43];
  const b = [128, 185, 255];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * v));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export function VisionMatrixDemo({ compact = false }: Props) {
  const reduced = useReducedMotion();
  const [rootRef, inView] = useInView<HTMLDivElement>();
  const [preset, setPreset] = useState<PresetId>('hotspot');
  const [settings, setSettings] = useState<MapSettings>(defaultSettings);
  const [playing, setPlaying] = useState(!reduced);
  const [ramp, setRamp] = useState(!compact);
  const [t, setT] = useState(0);
  const [image, setImage] = useState<{ field: Field; name: string; url: string } | null>(null);
  const [imageError, setImageError] = useState('');
  const [selected, setSelected] = useState(5);
  const [showHow, setShowHow] = useState(false);

  const presetMeta = presets.find((p) => p.id === preset)!;
  const animated = !image && presetMeta.animated;
  const input = useMemo(() => image?.field ?? presetField(preset, t), [image, preset, t]);
  const { processed, levels } = useMemo(() => mapField(input, settings), [input, settings]);
  const target = useMemo(() => levels.map(levelToDuty), [levels]);
  const [display, setDisplay] = useState<number[]>(target);
  const shown = ramp ? display : target;

  // Refs so the animation loop reads fresh values without restarting each frame.
  const targetRef = useRef(target);
  targetRef.current = target;
  const displayRef = useRef(display);
  displayRef.current = display;

  const animating = animated && playing && inView;
  const settled = display.every((d, i) => Math.abs(d - target[i]) < 1e-6);

  useEffect(() => {
    if (!ramp) setDisplay(targetRef.current);
  }, [ramp, target]);

  useEffect(() => {
    if (!animating && (!ramp || settled)) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (animating) setT((x) => x + dt);
      if (ramp) setDisplay((d) => rampToward(d, targetRef.current, dt * 2.4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animating, ramp, settled]);

  const update = <K extends keyof MapSettings>(k: K, v: MapSettings[K]) => setSettings((s) => ({ ...s, [k]: v }));

  const setBound = (i: 0 | 1 | 2, v: number) => {
    setSettings((s) => {
      const b = [...s.bounds] as [number, number, number];
      const lo = i === 0 ? 0.02 : b[i - 1] + 0.02;
      const hi = i === 2 ? 0.98 : b[i + 1] - 0.02;
      b[i] = Math.min(hi, Math.max(lo, v));
      return { ...s, bounds: b };
    });
  };

  const reset = () => {
    setPreset('hotspot');
    setSettings(defaultSettings);
    setT(0);
    setPlaying(!reduced);
    clearImage();
  };

  const clearImage = () => {
    setImage((img) => { if (img) URL.revokeObjectURL(img.url); return null; });
    setImageError('');
  };

  const onFile = useCallback(async (file: File | undefined) => {
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Please choose an image file.'); return; }
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('no canvas');
      // centre-crop to a square, then area-average down to 4×4
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      const field = downsampleLuma(ctx.getImageData(0, 0, size, size).data, size, size);
      setImage((old) => { if (old) URL.revokeObjectURL(old.url); return { field, name: file.name, url }; });
    } catch {
      URL.revokeObjectURL(url);
      setImageError('That image couldn’t be read. Try a PNG or JPEG.');
    }
  }, []);

  // Release the object URL when the demo unmounts.
  const imageUrlRef = useRef<string | null>(null);
  imageUrlRef.current = image?.url ?? null;
  useEffect(() => () => { if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current); }, []);

  // Roving focus across the output grid with arrow keys.
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onGridKey = (e: KeyboardEvent, i: number) => {
    const { row, col } = cellCoords(i);
    let next = i;
    if (e.key === 'ArrowRight') next = row * GRID + Math.min(GRID - 1, col + 1);
    else if (e.key === 'ArrowLeft') next = row * GRID + Math.max(0, col - 1);
    else if (e.key === 'ArrowDown') next = Math.min(GRID - 1, row + 1) * GRID + col;
    else if (e.key === 'ArrowUp') next = Math.max(0, row - 1) * GRID + col;
    else return;
    e.preventDefault();
    setSelected(next);
    cellRefs.current[next]?.focus();
  };

  const activeCount = levels.filter((l) => l > 0).length;
  const sel = cellCoords(selected);
  const rule = settings.mode === 'threshold'
    ? `on (3) if value ≥ ${pct(settings.threshold)}, else off (0)`
    : `≥ ${pct(settings.bounds[2])} → 3 · ≥ ${pct(settings.bounds[1])} → 2 · ≥ ${pct(settings.bounds[0])} → 1 · else 0`;
  const sourceLabel = image ? 'LOCAL IMAGE · LOCAL DEMO' : 'SIMULATED INPUT · LOCAL DEMO';

  return (
    <div ref={rootRef} className={`vm ${compact ? 'is-compact' : ''}`}>
      <div className="vm-console glass">
        <div className="vm-head">
          <span className="vm-status mono"><span className="live-dot" aria-hidden="true" />{sourceLabel}</span>
          <span className="mono muted">4×4 · {settings.mode === 'threshold' ? 'THRESHOLD' : '4-LEVEL'}</span>
        </div>

        <div className="vm-stages">
          {/* Stage 1 */}
          <section className="vm-stage" aria-labelledby="vm-in">
            <h3 id="vm-in" className="vm-stage-title mono">01 · Input brightness field</h3>
            <div className="vm-grid" role="img" aria-label={`Input brightness, row by row: ${processed.map(pct).join(', ')}`}>
              {processed.map((v, i) => (
                <div key={i} className={`vm-heat ${i === selected ? 'is-selected' : ''}`} style={{ background: heatColor(v), color: v > 0.55 ? '#06112a' : 'var(--text-secondary)' }}>
                  <span>{pct(v)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Stage 2 */}
          <section className="vm-stage vm-map" aria-labelledby="vm-map">
            <h3 id="vm-map" className="vm-stage-title mono">02 · State mapping</h3>
            <p className="vm-rule"><span className="muted">Rule</span> {rule}</p>
            <p className="vm-rule"><span className="muted">State</span> <code className="mono">{stateVector(levels)}</code></p>
            <p className="vm-rule"><span className="muted">Active</span> {activeCount} / {CELLS} cells</p>
          </section>

          {/* Stage 3 */}
          <section className="vm-stage" aria-labelledby="vm-out">
            <h3 id="vm-out" className="vm-stage-title mono">03 · 4×4 LED output</h3>
            <div className="vm-grid vm-leds" role="grid" aria-label="LED output grid. Use arrow keys to inspect cells.">
              {Array.from({ length: GRID }, (_, r) => (
                <div role="row" key={r} className="vm-row">
                  {Array.from({ length: GRID }, (_, c) => {
                    const i = r * GRID + c;
                    const duty = shown[i];
                    return (
                      <button
                        key={i}
                        ref={(el) => { cellRefs.current[i] = el; }}
                        role="gridcell"
                        type="button"
                        tabIndex={i === selected ? 0 : -1}
                        className={`vm-led ${i === selected ? 'is-selected' : ''}`}
                        aria-label={`Row ${r + 1}, column ${c + 1}: input ${pct(processed[i])}, level ${levels[i]}`}
                        aria-selected={i === selected}
                        onClick={() => setSelected(i)}
                        onFocus={() => setSelected(i)}
                        onKeyDown={(e) => onGridKey(e, i)}
                        style={{ ['--duty' as string]: duty }}
                      >
                        <span className="vm-led-light" aria-hidden="true" />
                        <span className="vm-led-level mono" aria-hidden="true">{levels[i]}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </div>

        <p className="vm-readout mono" aria-live="polite">
          Cell [{sel.row + 1},{sel.col + 1}] · input {pct(processed[selected])} → level {levels[selected] as Level} · duty {Math.round(levelToDuty(levels[selected]) * 100)}/100
        </p>

        <div className="vm-controls">
          <fieldset className="ctl ctl-wide">
            <legend className="ctl-label">Input pattern</legend>
            <div className="seg" role="radiogroup" aria-label="Input pattern">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={!image && preset === p.id}
                  className={`seg-btn ${!image && preset === p.id ? 'is-on' : ''}`}
                  onClick={() => { clearImage(); setPreset(p.id); }}
                >{p.label}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ctl">
            <legend className="ctl-label">Mapping mode</legend>
            <div className="seg" role="radiogroup" aria-label="Mapping mode">
              {(['threshold', 'quantize'] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={settings.mode === m}
                  className={`seg-btn ${settings.mode === m ? 'is-on' : ''}`} onClick={() => update('mode', m)}>
                  {m === 'threshold' ? 'Threshold' : '4 levels'}
                </button>
              ))}
            </div>
          </fieldset>

          {settings.mode === 'threshold' ? (
            <Slider id="vm-th" label="Threshold" value={settings.threshold} min={0.05} max={0.95} step={0.01} onChange={(v) => update('threshold', v)} />
          ) : (
            <div className="ctl ctl-bounds">
              <Slider id="vm-b1" label="Level 1 at" value={settings.bounds[0]} min={0.02} max={0.98} step={0.01} onChange={(v) => setBound(0, v)} />
              <Slider id="vm-b2" label="Level 2 at" value={settings.bounds[1]} min={0.02} max={0.98} step={0.01} onChange={(v) => setBound(1, v)} />
              <Slider id="vm-b3" label="Level 3 at" value={settings.bounds[2]} min={0.02} max={0.98} step={0.01} onChange={(v) => setBound(2, v)} />
            </div>
          )}

          {!compact && (
            <>
              <Slider id="vm-sm" label="Spatial smoothing" value={settings.smoothing} min={0} max={1} step={0.05} onChange={(v) => update('smoothing', v)} />
              <Slider id="vm-gain" label="Input gain" value={settings.gain} min={0.5} max={2} step={0.05} onChange={(v) => update('gain', v)} format={(v) => `×${v.toFixed(2)}`} />
              <div className="ctl">
                <span className="ctl-label" id="vm-img-label">Your own image</span>
                <div className="ctl-row">
                  <label className="btn btn-ghost btn-sm file-btn">
                    Choose image…
                    <input type="file" accept="image/*" className="sr-only" aria-describedby="vm-img-note" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
                  </label>
                  {image && <button type="button" className="btn btn-ghost btn-sm" onClick={clearImage}>Clear image</button>}
                </div>
                <p id="vm-img-note" className="ctl-hint">{image ? `Using “${image.name}” — processed locally, never uploaded.` : 'Downsampled to 4×4 in your browser. Nothing is uploaded.'}</p>
                {imageError && <p className="ctl-hint ctl-error" role="alert">{imageError}</p>}
              </div>
            </>
          )}

          <div className="ctl ctl-actions">
            {animated && (
              <button type="button" className="btn btn-ghost btn-sm" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>
                {playing ? 'Pause' : 'Play'}
              </button>
            )}
            <label className="check">
              <input type="checkbox" checked={ramp} onChange={(e) => setRamp(e.target.checked)} />
              <span>Ramp output</span>
            </label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="vm-legend" aria-label="Legend">
          {[0, 1, 2, 3].map((l) => (
            <span key={l} className="vm-legend-item">
              <span className="vm-legend-swatch" style={{ ['--duty' as string]: l / 3 }} aria-hidden="true" />
              <span className="mono">{l}</span>
              <span className="muted">{['off', 'low', 'mid', 'full'][l]}</span>
            </span>
          ))}
        </div>

        {!compact && (
          <div className="vm-explain">
            <button type="button" className="text-link" aria-expanded={showHow} aria-controls="vm-how" onClick={() => setShowHow((s) => !s)}>
              {showHow ? 'Hide' : 'Show'} how it works & what it leaves out
            </button>
            <div id="vm-how" hidden={!showHow} className="vm-how">
              <div>
                <h4>How it works</h4>
                <p>An input is reduced to sixteen brightness values (0–1). Optional smoothing blends each cell with its neighbours; gain scales brightness. Each value is then mapped to an output level — either binary (threshold) or one of four levels. “Ramp output” moves each LED toward its new level gradually instead of jumping, to illustrate temporal smoothing.</p>
              </div>
              <div>
                <h4>What this demo leaves out</h4>
                <p>This is a simplified client-side model. It isn’t connected to the real ESP32 hardware, doesn’t use the project’s actual image pipeline or any ML, and the ramp is a visual illustration rather than real firmware timing.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
