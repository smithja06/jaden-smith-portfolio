import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  categoryBlurbs,
  categoryLabels,
  categoryOrder,
  projects,
  searchProjects,
} from '../../content/projects';
import type { ProjectCategory } from '../../content/types';
import { ArchiveItem } from './ArchiveItem';

type Filter = 'all' | ProjectCategory;

/**
 * Full archive with search and category filters. State lives in the URL
 * (?q=…&category=…) so results can be linked and the back button works.
 */
export function SearchableArchive({ hideWhenIdle }: { hideWhenIdle?: Set<string> }) {
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
  const active: Filter = raw && (categoryOrder as string[]).includes(raw) ? raw : 'all';

  const update = (next: { q?: string; category?: Filter }) => {
    if (next.q !== undefined) { setQ(next.q); if (next.q !== urlQ) pushed.current.add(next.q); }
    const p = new URLSearchParams(params);
    const nq = next.q ?? q;
    const nc = next.category ?? active;
    if (nq) p.set('q', nq); else p.delete('q');
    if (nc !== 'all') p.set('category', nc); else p.delete('category');
    setParams(p, { replace: true, preventScrollReset: true });
  };

  // With no search, leave out projects already shown as featured cards above.
  const pool = useMemo(() => (q || !hideWhenIdle ? projects : projects.filter((p) => !hideWhenIdle.has(p.id))), [q, hideWhenIdle]);
  const matches = useMemo(() => searchProjects(q, pool), [q, pool]);
  const shown = active === 'all' ? matches : matches.filter((p) => p.category === active);
  const grouped = categoryOrder
    .filter((c) => active === 'all' || c === active)
    .map((c) => ({ c, items: shown.filter((p) => p.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="arch">
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
          {(['all', ...categoryOrder] as Filter[]).map((f) => {
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
      </div>

      <p className="arch-result mono" aria-live="polite">
        {q ? `${shown.length} of ${projects.length} projects match “${q}”` : `${shown.length} projects`}
      </p>

      {grouped.length > 0 ? (
        <div className="arch-groups">
          {grouped.map(({ c, items }) => (
            <section key={c} className="arch-group" aria-labelledby={`arch-${c}`}>
              <header className="arch-group-head">
                <h3 id={`arch-${c}`} className="arch-group-title">{categoryLabels[c]}</h3>
                <span className="mono muted arch-group-count">{items.length}</span>
              </header>
              {!q && <p className="arch-group-blurb">{categoryBlurbs[c]}</p>}
              <ul className="arch-list">
                {items.map((p) => <ArchiveItem key={p.id} project={p} />)}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="arch-empty">
          <p>No projects match “{q}”.</p>
          <button type="button" className="text-link" onClick={() => update({ q: '', category: 'all' })}>Clear search</button>
        </div>
      )}
    </div>
  );
}
