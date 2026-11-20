import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stations, stationPath, type StationId } from '../../lab3d/config/stations';
import { sectionBodies } from '../../components/sections/SiteSections';
import { usePageTitle } from '../../hooks/usePageTitle';

/**
 * Full-page view for one Lab station: section bar with a 01–05 pager,
 * an indexed heading, and the same section content as the homepage plus
 * Lab-only extras (filters, prototypes, toy network). Esc returns to the 3D lab.
 */
export default function LabSectionPage({ id }: { id: StationId }) {
  const index = stations.findIndex((s) => s.id === id);
  const station = stations[index];
  const navigate = useNavigate();
  usePageTitle(station.title, `${station.title} — ${station.summary}`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack Esc while someone is typing or using a native control.
      if (e.key !== 'Escape') return;
      const t = e.target;
      if (t instanceof Element && t.closest('input, textarea, select')) return;
      navigate('/lab');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate]);

  const Body = sectionBodies[id];

  return (
    <div className="page sec" data-station={id}>
      <div className="container">
        <nav className="sec-bar" aria-label="Lab sections">
          <p className="sec-crumb mono"><span className="sec-crumb-index">[{station.letter}]</span> {station.title}</p>
          <div className="sec-bar-right">
            <ol className="sec-pager">
              {stations.map((s) => (
                <li key={s.id}>
                  <Link
                    to={stationPath(s.id)}
                    className={`sec-pager-link mono ${s.id === id ? 'is-on' : ''}`}
                    aria-current={s.id === id ? 'page' : undefined}
                    aria-label={`${s.letter} ${s.title}`}
                    title={s.title}
                  >
                    {s.letter}
                  </Link>
                </li>
              ))}
            </ol>
            <Link to="/lab" className="sec-back mono">Back to lab <kbd>Esc</kbd></Link>
          </div>
        </nav>

        <header className="sec-head">
          <span className="sec-index mono" aria-hidden="true">{station.letter}</span>
          <div className="sec-head-main">
            <h1 className="sec-title">{station.title}</h1>
            {station.showSummaryOnPage !== false && <p className="sec-summary">{station.summary}</p>}
          </div>
        </header>

        <div className="sec-body"><Body detailed /></div>

        <nav className="sec-next" aria-label="Next section">
          {index > 0 ? (
            <Link to={stationPath(stations[index - 1].id)} className="sec-next-link">
              <span className="mono muted">← {stations[index - 1].letter}</span>
              <span>{stations[index - 1].title}</span>
            </Link>
          ) : <span />}
          {index < stations.length - 1 && (
            <Link to={stationPath(stations[index + 1].id)} className="sec-next-link is-right">
              <span className="mono muted">{stations[index + 1].letter} →</span>
              <span>{stations[index + 1].title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
