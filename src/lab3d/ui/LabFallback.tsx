import { stations } from '../config/stations';
import { StationContent } from './StationContent';

interface Props {
  reason: 'list' | 'no-webgl' | 'error';
  onEnterWorld?: () => void;
}

const messages = {
  list: 'You’re viewing the Lab as a list. Everything in the 3D world is here too.',
  'no-webgl': 'Your browser can’t start WebGL, so the 3D lab isn’t available — but every station and experiment is listed below.',
  error: 'The 3D lab ran into a problem in your browser, so here’s the same content as a list.',
};

/** Conventional, fully accessible Lab — used for list view and as the non-WebGL fallback. */
export function LabFallback({ reason, onEnterWorld }: Props) {
  return (
    <div className="page container lab-list">
      <header className="page-head">
        <p className="eyebrow">Lab</p>
        <h1 className="h-section">Curiosity, in working form.</h1>
        <p className="lead">Small, honest experiments and the work behind them. Everything runs in your browser — no backend, no connected sensors, no uploads.</p>
        <div className="note" role="status">
          <span>{messages[reason]}</span>
          {reason === 'list' && onEnterWorld && (
            <button type="button" className="text-link lab-list-enter" onClick={onEnterWorld}>Enter the 3D lab</button>
          )}
        </div>
      </header>

      <nav className="lab-list-toc" aria-label="Stations">
        <ol>
          {stations.map((s) => (
            <li key={s.id}><a href={`#station-${s.id}`}><span className="mono muted">{s.letter}</span> {s.title}</a></li>
          ))}
        </ol>
      </nav>

      {stations.map((s) => (
        <section key={s.id} id={`station-${s.id}`} className="lab-list-station" aria-labelledby={`lst-${s.id}`}>
          <div className="lab-list-side">
            <p className="mono muted">Station {s.letter} · {s.category}</p>
            <h2 id={`lst-${s.id}`} className="h-sub">{s.title}</h2>
            <p className="secondary">{s.summary}</p>
          </div>
          <div className="lab-list-body">
            <StationContent id={s.id} />
          </div>
        </section>
      ))}
    </div>
  );
}
