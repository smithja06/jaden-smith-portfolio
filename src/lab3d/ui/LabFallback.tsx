import { Link } from 'react-router-dom';
import { stations, stationPath } from '../config/stations';
import { Arrow } from '../../components/Icons';

interface Props {
  reason: 'list' | 'no-webgl' | 'error';
  onEnterWorld?: () => void;
}

const messages = {
  list: 'You’re viewing the Lab as a list. Every station in the 3D world is here too.',
  'no-webgl': 'Your browser can’t start WebGL, so the 3D lab isn’t available — but every section is listed below.',
  error: 'The 3D lab ran into a problem in your browser, so here are the same sections as a list.',
};

/** Conventional, fully accessible Lab index — list view and non-WebGL fallback. Never loads three.js. */
export function LabFallback({ reason, onEnterWorld }: Props) {
  return (
    <div className="page container lab-list">
      <header className="page-head">
        <p className="eyebrow">Lab</p>
        <h1 className="h-section">Curiosity, in working form.</h1>
        <div className="note" role="status">
          <span>{messages[reason]}</span>
          {reason === 'list' && onEnterWorld && (
            <button type="button" className="text-link lab-list-enter" onClick={onEnterWorld}>Enter the 3D lab</button>
          )}
        </div>
      </header>

      <ol className="lab-list-index">
        {stations.map((s) => (
          <li key={s.id}>
            <Link to={stationPath(s.id)} className="lab-list-row">
              <span className="mono lab-list-num">{s.letter}</span>
              <span className="lab-list-text">
                <span className="lab-list-title">{s.title}</span>
                <span className="lab-list-sum">{s.summary}</span>
              </span>
              <Arrow />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
