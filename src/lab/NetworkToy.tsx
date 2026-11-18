import { useMemo, useState } from 'react';
import { LAYERS, forward } from './toyNetwork';
import { Slider } from '../components/Slider';

const W = 300;
const H = 170;
const pos = (l: number, i: number) => ({
  x: 30 + l * ((W - 60) / (LAYERS.length - 1)),
  y: H / 2 + (i - (LAYERS[l] - 1) / 2) * 38,
});

/** Drive three inputs and watch activations propagate through fixed weights. */
export function NetworkToy() {
  const [inputs, setInputs] = useState([0.8, 0.2, 0.5]);
  const { activations, contributions } = useMemo(() => forward(inputs), [inputs]);
  const labels = ['Input A', 'Input B', 'Input C'];

  return (
    <div className="nettoy">
      <svg viewBox={`0 0 ${W} ${H}`} className="nettoy-svg" role="img"
        aria-label={`Toy network. Outputs: ${activations[2].map((v) => v.toFixed(2)).join(' and ')}.`}>
        {contributions.map((layer, l) => layer.map((row, j) => row.map((c, i) => {
          const a = pos(l, i);
          const b = pos(l + 1, j);
          const strength = Math.min(1, Math.abs(c));
          return (
            <line key={`${l}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={c >= 0 ? '#80B9FF' : '#8B9DBB'} strokeOpacity={0.12 + strength * 0.7}
              strokeWidth={0.6 + strength * 2} strokeDasharray={c >= 0 ? undefined : '3 3'} />
          );
        })))}
        {activations.map((layer, l) => layer.map((v, i) => {
          const p = pos(l, i);
          return (
            <g key={`${l}-${i}`}>
              <circle cx={p.x} cy={p.y} r={11} fill="#08142B" stroke="rgba(209,227,255,0.3)" />
              <circle cx={p.x} cy={p.y} r={11} fill="#327EFF" fillOpacity={v} />
              <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="8.5" fontFamily="JetBrains Mono Variable, monospace" fill={v > 0.6 ? '#06112a' : '#B5C5E1'}>{v.toFixed(2)}</text>
            </g>
          );
        }))}
      </svg>
      <div className="nettoy-controls">
        {inputs.map((v, i) => (
          <Slider key={i} id={`nt-${i}`} label={labels[i]} value={v} min={0} max={1} step={0.01}
            onChange={(nv) => setInputs((prev) => prev.map((x, k) => (k === i ? nv : x)))} />
        ))}
      </div>
      <p className="ctl-hint">
        Outputs: <span className="mono">{activations[2].map((v) => v.toFixed(2)).join(' / ')}</span>. Solid lines push activation up, dashed lines push it down; thickness shows how much.
        This is a 3→4→2 network with <b>hand-set weights</b> — it isn’t trained and doesn’t classify anything real.
      </p>
    </div>
  );
}
