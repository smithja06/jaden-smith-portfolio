import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  categoryLabels,
  childProjects,
  getProject,
  legacyProjectRedirects,
  ownershipLabels,
  projectsByIds,
  siblingProjects,
  statusLabels,
} from '../content/projects';
import { getExperience } from '../content/experience';
import { isProvided, type Project } from '../content/types';
import { experiments, stationPath } from '../lab3d/config/stations';
import { ProjectArt } from '../components/art/ProjectArt';
import { SystemDiagram } from '../components/SystemDiagram';
import { Arrow } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { EvidenceLinks, MediaGallery, MetricList, TechList, evidenceItems } from '../components/content/Meta';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFound from './NotFound';

/**
 * One template for every project. Sections render only when their field is
 * filled in, so a short archive record and a full case study share this page.
 */
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  usePageTitle(p?.title ?? 'Page not found', p?.summary);
  if (!p && legacyProjectRedirects[slug]) return <Navigate to={legacyProjectRedirects[slug]} replace />;
  if (!p) return <NotFound />;
  return <ProjectDetail key={p.id} p={p} />;
}

function ProjectDetail({ p }: { p: Project }) {
  const cs = p.caseStudy ?? {};
  const { prev, next } = siblingProjects(p);
  const parent = p.parent ? getProject(p.parent) : undefined;
  const children = childProjects(p.id);
  const related = projectsByIds(p.related).filter((r) => r.id !== parent?.id);
  const roles = (p.experience ?? []).map(getExperience).filter((e) => !!e);
  const sim = p.simulation ? experiments.find((e) => e.id === p.simulation!.id) : undefined;
  const hasEvidence = evidenceItems(p.evidence).length > 0;

  const meta: [string, string | undefined][] = [
    ['Context', p.context],
    ['Dates', isProvided(p.dates) ? p.dates : undefined],
    ['Category', categoryLabels[p.category]],
    ['Status', statusLabels[p.status]],
    ['Role', p.ownership ? ownershipLabels[p.ownership] : undefined],
  ];

  // Build the numbered sections from whatever is filled in.
  const sections: { title: string; wide?: boolean; body: ReactNode }[] = [];
  const para = (items?: string[]) => items?.length ? items.map((t, i) => <p key={i}>{t}</p>) : null;
  const bullets = (items?: string[]) => items?.length ? <ul className="sec-dash">{items.map((t) => <li key={t}>{t}</li>)}</ul> : null;
  const add = (title: string, body: ReactNode, wide?: boolean) => { if (body) sections.push({ title, body, wide }); };

  add('The problem', para(cs.problem));
  add('What I built', bullets(cs.contributions));
  add('Team contributions', para(cs.team));
  if (cs.architecture) add('Architecture', <SystemDiagram nodes={cs.architecture.nodes} caption={cs.architecture.caption} />, true);
  add('Implementation', para(cs.implementation));
  if (cs.decisions?.length) {
    add('Design decisions', (
      <div className="decisions">
        {cs.decisions.map((d) => (
          <div key={d.title} className="decision">
            <h3 className="h-sub">{d.title}</h3>
            <p className="secondary">{d.body}</p>
          </div>
        ))}
      </div>
    ), true);
  }
  add('Engineering challenges', para(cs.challenges));
  add('Testing & validation', para(cs.validation));
  add('Outcomes', para(cs.outcomes));
  add('Limitations', bullets(cs.limitations));
  add('Next steps', bullets(cs.future));
  if (p.media?.length) add('Media', <MediaGallery media={p.media} />, true);

  return (
    <article className="page case">
      <div className="container">
        <nav aria-label="Breadcrumb" className="crumbs mono">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to={stationPath('projects')}>Projects</Link></li>
            <li><Link to={`${stationPath('projects')}?category=${p.category}#archive`}>{categoryLabels[p.category]}</Link></li>
            <li aria-current="page">{p.title.split(' — ')[0]}</li>
          </ol>
        </nav>

        <header className="case-hero">
          <div className="case-hero-copy">
            <p className="eyebrow">{parent ? <>Part of <Link to={`/work/${parent.id}`} className="inline-link">{parent.title.split(' — ')[0]}</Link></> : 'Case study'}</p>
            <h1 className="h-section">{p.title}</h1>
            <p className="lead">{p.summary}</p>
            {(sim || hasEvidence) && (
              <div className="case-actions">
                {sim && p.simulation && <Link to={sim.route} className="btn btn-primary">{p.simulation.label} <Arrow /></Link>}
                <EvidenceLinks evidence={p.evidence} className="case-evidence" />
              </div>
            )}
          </div>
          <dl className="case-meta glass">
            {meta.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt className="mono muted">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </header>

        {p.ownershipNote && <p className="case-own"><span className="mono">My part</span>{p.ownershipNote}</p>}
        {p.restricted && (
          <p className="note case-note">
            <b>Employer work.</b> The description and figures here are approved for public discussion. Code, internal screenshots, reports and data are not shared.
          </p>
        )}

        {p.art && (
          <div className="case-art">
            <ProjectArt art={p.art} />
            <span className="concept-badge project-art-badge">Illustration — not a screenshot</span>
          </div>
        )}

        {(p.metrics?.length || (!p.metrics?.length && p.highlights?.length)) ? (
          <div className="case-facts">
            {p.metrics?.length ? <MetricList metrics={p.metrics} /> : (
              <ul className="feat-highlights">{p.highlights!.map((h) => <li key={h}>{h}</li>)}</ul>
            )}
          </div>
        ) : null}

        {p.tech.length > 0 && (
          <div className="case-tech">
            <p className="mono muted case-tech-label">Technologies</p>
            <TechList tech={p.tech} />
          </div>
        )}

        {sections.length > 0 && (
          <div className="case-body">
            {sections.map((s, i) => (
              <Reveal key={s.title} as="section" className={`case-section ${s.wide ? 'case-wide' : ''}`}>
                <h2 className="case-h"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span> {s.title}</h2>
                {s.wide ? s.body : <div className="prose">{s.body}</div>}
              </Reveal>
            ))}
          </div>
        )}

        {(roles.length > 0 || children.length > 0 || related.length > 0) && (
          <aside className="case-related" aria-label="Related work">
            {roles.length > 0 && (
              <div>
                <h2 className="sec-subhead mono">Experience</h2>
                <ul className="rel-list">
                  {roles.map((e) => (
                    <li key={e!.id}><Link to={`/experience/${e!.id}`} className="rel-link"><span>{e!.title}</span><span className="muted">{isProvided(e!.org) ? e!.org : ''}</span><Arrow /></Link></li>
                  ))}
                </ul>
              </div>
            )}
            {children.length > 0 && (
              <div>
                <h2 className="sec-subhead mono">Modules</h2>
                <ul className="rel-list">
                  {children.map((c) => <li key={c.id}><Link to={`/work/${c.id}`} className="rel-link"><span>{c.title}</span><span className="muted">{statusLabels[c.status]}</span><Arrow /></Link></li>)}
                </ul>
              </div>
            )}
            {related.length > 0 && (
              <div>
                <h2 className="sec-subhead mono">Related projects</h2>
                <ul className="rel-list">
                  {related.map((r) => <li key={r.id}><Link to={`/work/${r.id}`} className="rel-link"><span>{r.title}</span><span className="muted">{categoryLabels[r.category]}</span><Arrow /></Link></li>)}
                </ul>
              </div>
            )}
          </aside>
        )}

        <nav className="case-next" aria-label="More projects">
          <Link to={`/work/${prev.id}`} className="case-next-link is-left">
            <span className="mono muted">← Previous in {categoryLabels[p.category]}</span>
            <span className="h-sub">{prev.title.split(' — ')[0]}</span>
          </Link>
          <Link to={`/work/${next.id}`} className="case-next-link">
            <span className="mono muted">Next →</span>
            <span className="h-sub">{next.title.split(' — ')[0]} <Arrow /></span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
