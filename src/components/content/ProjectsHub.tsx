import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  archiveProjects,
  caseStudyProjects,
  categoryLabels,
  categoryOrder,
  publicProjects,
  searchProjects,
} from '../../content/projects';
import { featuredCards, featuredProjectIds } from '../../content/featured';
import type { Project, ProjectCategory } from '../../content/types';
import { experiments } from '../../lab3d/config/stations';
import { useHubLinkState } from '../../hooks/useProjectsReturn';
import { Arrow } from '../Icons';
import { FeaturedCard } from './FeaturedCard';
import { ArchiveRow } from './ArchiveItem';
import { noBreakHyphens } from '../../lib/text';

type Filter = 'all' | ProjectCategory;

/** Categories that have at least one public project. */
const filterCategories = categoryOrder.filter((c) => publicProjects.some((p) => p.category === c));

/**
 * The Projects hub (/lab/projects) — the one place to browse every public
 * project: Featured, More projects, the Technical archive and Interactive
 * experiments. Search and the category filter narrow the first three; their
 * state lives in the URL (?q=…&category=…) so results can be linked and a
 * case study's "All Projects" link can return to them.
 */
export function ProjectsHub() {
  const [params, setParams] = useSearchParams();
  const searchId = useId();
  const urlQ = params.get('q') ?? '';
  // Typed text lives in local state so fast typing is never overwritten by
  // the (transition-scheduled) URL update; the URL mirrors it.
  const [q, setQ] = useState(urlQ);
  const pushed = useRef(new Set<string>());
  useEffect(() => {
    // Ignore URL updates we caused; adopt ones from elsewhere (back button, links).
    if (pushed.current.delete(urlQ)) return;
    setQ(urlQ);
  }, [urlQ]);
  const raw = params.get('category') as Filter | null;
  const active: Filter = raw && (filterCategories as string[]).includes(raw) ? raw : 'all';

  const update = (next: { q?: string; category?: Filter }) => {
    if (next.q !== undefined) { setQ(next.q); if (next.q !== urlQ) pushed.current.add(next.q); }
    const p = new URLSearchParams(params);
    const nq = next.q ?? q;
    const nc = next.category ?? active;
    if (nq) p.set('q', nq); else p.delete('q');
    if (nc !== 'all') p.set('category', nc); else p.delete('category');
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const matches = useMemo(() => searchProjects(q), [q]);
  const shown = useMemo(
    () => new Set(matches.filter((p) => active === 'all' || p.category === active).map((p) => p.id)),
    [matches, active],
  );
  const filtering = q !== '' || active !== 'all';

  const featured = featuredCards().filter((c) => shown.has(c.projectId));
  const more = caseStudyProjects.filter((p) => !featuredProjectIds.has(p.id) && shown.has(p.id));
  const archive = archiveProjects.filter((p) => shown.has(p.id));
  const linkState = useHubLinkState();

  return (
    <div className="hub">
      <div className="arch-controls">
        <div className="arch-search">
          <label htmlFor={searchId} className="sr-only">Search projects</label>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arch-search-icon">
            <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
            <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id={searchId}
            type="search"
            className="arch-input"
            placeholder="Search by title, technology or topic — e.g. ESP32, React, RAG"
            value={q}
            onChange={(e) => update({ q: e.target.value })}
            autoComplete="off"
          />
        </div>
        <div className="sec-filters" role="group" aria-label="Filter projects by category">
          {(['all', ...filterCategories] as Filter[]).map((f) => {
            const count = f === 'all' ? matches.length : matches.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                type="button"
                className={`chip chip-sm ${active === f ? 'is-on' : ''}`}
                aria-pressed={active === f}
                onClick={() => update({ category: f })}
              >
                {f === 'all' ? 'All' : categoryLabels[f]}
                <span className="chip-count" aria-hidden="true">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="arch-result mono" aria-live="polite">
          {filtering ? `${shown.size} of ${publicProjects.length} projects shown` : `${publicProjects.length} projects`}
          {filtering && (
            <button type="button" className="text-link hub-clear" onClick={() => update({ q: '', category: 'all' })}>Clear filters</button>
          )}
        </p>
      </div>

      {shown.size === 0 && (
        <div className="arch-empty">
          <p>No projects match{q ? ` “${q}”` : ''}{active !== 'all' ? ` in ${categoryLabels[active]}` : ''}.</p>
          <button type="button" className="text-link" onClick={() => update({ q: '', category: 'all' })}>Clear filters</button>
        </div>
      )}

      {featured.length > 0 && (
        <section className="hub-sec" aria-labelledby="hub-featured">
          <h2 id="hub-featured" className="sec-subhead mono sec-subhead-first">Featured</h2>
          <div className="feat-grid">
            {featured.map((c) => <FeaturedCard key={c.key} card={c} headingLevel="h3" linkState={linkState} />)}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section id="more" className="hub-sec" aria-labelledby="hub-more" tabIndex={-1}>
          <h2 id="hub-more" className="sec-subhead mono">More projects</h2>
          <ul className="more-grid">
            {more.map((p) => <MoreCard key={p.id} project={p} linkState={linkState} />)}
          </ul>
        </section>
      )}

      {archive.length > 0 && (
        <section id="archive" className="hub-sec" aria-labelledby="hub-archive" tabIndex={-1}>
          <h2 id="hub-archive" className="sec-subhead mono">Technical archive</h2>
          <p className="sec-intro">Coursework, labs and smaller engineering studies. Open a row for the details.</p>
          <ul className="arch-list arch-rows">
            {archive.map((p) => <ArchiveRow key={p.id} project={p} />)}
          </ul>
        </section>
      )}

      <section id="experiments" className="hub-sec" aria-labelledby="hub-experiments" tabIndex={-1}>
        <h2 id="hub-experiments" className="sec-subhead mono">Interactive experiments</h2>
        <div className="sec-grid sec-grid-2">
          {experiments.map((e) => (
            <article key={e.id} className="sec-card sec-project">
              <h3 className="sec-card-title">{e.title}</h3>
              <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />Runs in your browser{e.project ? ` · ${e.project}` : ''}</p>
              <p className="sec-text">{e.blurb}</p>
              <Link to={e.route} className="sec-card-link text-link">Open experiment <Arrow /><span className="sr-only">: {e.title}</span></Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Smaller card for case studies outside the Featured collection: context, title, one sentence. */
function MoreCard({ project: p, linkState }: { project: Project; linkState: object }) {
  return (
    <li className="more-card">
      <p className="more-context mono">{p.context}</p>
      <h3 className="more-title">{noBreakHyphens(p.title)}</h3>
      <p className="more-text">{p.summary}</p>
      <Link to={`/work/${p.id}`} state={linkState} className="more-link">
        Case study <Arrow /><span className="sr-only">: {p.title}</span>
      </Link>
    </li>
  );
}
