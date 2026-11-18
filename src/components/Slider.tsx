const fmt = (v: number) => v.toFixed(2);

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export function Slider({ id, label, value, min, max, step, onChange, format = fmt }: SliderProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="ctl">
      <div className="ctl-top">
        <label htmlFor={id} className="ctl-label">{label}</label>
        <output htmlFor={id} className="mono ctl-value">{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--fill' as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
