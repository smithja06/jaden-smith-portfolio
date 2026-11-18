import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryLabels, projects } from '../content/projects';
import type { Category } from '../content/types';
import { ProjectCard } from '../components/ProjectCard';
import { usePageTitle } from '../hooks/usePageTitle';

type Filter = 'all' | Category;
const filters: Filter[] = ['all', 'ai-software', 'embedded', 'biomedical', 'creative'];

export default function Work() {
  usePageTitle('Work', 'Selected engineering projects across AI, software, embedded systems and biomedical prototypes.');
  const [params, setParams] = useSearchParams();
  const raw = params.get('filter') as Filter | null;
  const active: Filter = raw && filters.includes(raw) ? raw : 'all';
  const shown = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categories.includes(active))),
    [active],
  );

  const choose = (f: Filter) => setParams(f === 'all' ? {} : { filter: f }, { replace: true, preventScrollReset: true });

  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow">Work</p>
        <h1 className="h-section">Selected work.</h1>
        <p className="lead">Prototypes, student projects and professional work. Each case study is honest about its stage — what was built, what was learned, and what’s still open.</p>
      </header>

      <div className="filters" role="group" aria-label="Filter projects by category">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`chip ${active === f ? 'is-on' : ''}`}
            aria-pressed={active === f}
            onClick={() => choose(f)}
          >
            {f === 'all' ? 'All' : categoryLabels[f]}
            <span className="chip-count" aria-hidden="true">{f === 'all' ? projects.length : projects.filter((p) => p.categories.includes(f)).length}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} project{shown.length === 1 ? '' : 's'} shown</p>

      <div className="work-grid">
        {shown.map((p) => <ProjectCard key={p.slug} project={p} headingLevel="h2" />)}
      </div>
      {shown.length === 0 && <p className="muted">No projects in this category yet.</p>}
    </div>
  );
}
