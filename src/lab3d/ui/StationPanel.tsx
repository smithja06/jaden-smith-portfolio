import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { stationById, stationPath, type StationId } from '../config/stations';
import { Arrow } from '../../components/Icons';

interface Props {
  id: StationId;
  onClose: () => void;
}

/**
 * Small intro shown once the camera has reached a station: title, one line,
 * two or three highlights, and one way into the full page. Never the archive.
 */
export function StationPanel({ id, onClose }: Props) {
  const s = stationById(id)!;
  const cta = useRef<HTMLAnchorElement>(null);
  useEffect(() => { cta.current?.focus({ preventScroll: true }); }, [id]);

  return (
    <section className="lab3d-panel glass" aria-labelledby="lab3d-panel-title" role="dialog" aria-modal="false">
      <div className="lab3d-panel-top">
        <span className="lab3d-letter" aria-hidden="true">{s.letter}</span>
        <span className="lab3d-panel-cat mono">{s.category}</span>
        <button type="button" className="lab3d-panel-close" onClick={onClose} aria-label="Back to the lab overview">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
      <h2 id="lab3d-panel-title" className="lab3d-panel-title">{s.title}</h2>
      <p className="lab3d-panel-sum">{s.summary}</p>
      <ul className="lab3d-panel-list">
        {s.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>
      <div className="lab3d-panel-actions">
        <Link ref={cta} to={stationPath(id)} className="btn btn-primary btn-sm">Explore {s.title} <Arrow /></Link>
        <button type="button" className="lab3d-panel-back" onClick={onClose}>Back to overview <kbd>Esc</kbd></button>
      </div>
    </section>
  );
}
