import { stations, type StationId } from '../config/stations';

interface Props {
  selected: StationId | null;
  hovered: StationId | null;
  onSelect: (id: StationId) => void;
  onHover: (id: StationId | null) => void;
}

/** Keyboard/touch-friendly station list — the HTML twin of the 3D scene. */
export function StationNavigation({ selected, hovered, onSelect, onHover }: Props) {
  return (
    <nav className="lab3d-stations glass" aria-label="Lab stations">
      <p className="lab3d-stations-title mono">Stations</p>
      <ol>
        {stations.map((s) => (
          <li key={s.id}>
            <button
              id={`lab-station-${s.id}`}
              type="button"
              className={`lab3d-station-btn ${selected === s.id ? 'is-on' : ''} ${hovered === s.id ? 'is-hover' : ''}`}
              aria-current={selected === s.id ? 'true' : undefined}
              onClick={() => onSelect(s.id)}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(s.id)}
              onBlur={() => onHover(null)}
            >
              <span className="lab3d-letter" aria-hidden="true">{s.letter}</span>
              <span className="lab3d-station-text">
                <span className="lab3d-station-name">{s.title}</span>
                <span className="lab3d-station-tip">{s.tooltip}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
