import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryLabels, getProject, nextProject } from '../content/projects';
import { isProvided } from '../content/types';
import { ProjectArt } from '../components/art/ProjectArt';
import { SystemDiagram } from '../components/SystemDiagram';
import { Arrow, ArrowLeft } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  usePageTitle(p?.title ?? 'Page not found', p?.summary);
  if (!p) return <NotFound />;
  const cs = p.caseStudy;
  const next = nextProject(p.slug);

  const meta: [string, string | undefined][] = [
    ['Category', p.categories.map((c) => categoryLabels[c]).join(' · ')],
    ['Status', p.status],
    ['Role', isProvided(p.role) ? p.role : undefined],
    ['Timeline', isProvided(p.timeline) ? p.timeline : undefined],
    ['Stack', isProvided(p.stack) ? p.stack.join(', ') : undefined],
  ];

  return (
    <article className="page case">
      <div className="container">
        <Link to="/work" className="text-link back-link"><ArrowLeft /> All work</Link>
        <header className="case-hero">
          <div className="case-hero-copy">
            <p className="eyebrow">Case study</p>
            <h1 className="h-section">{p.title}</h1>
            <p className="lead">{p.summary}</p>
            {(p.labLink || p.links.length > 0) && (
              <div className="case-actions">
                {p.labLink && <Link to={p.labLink.to} className="btn btn-primary">{p.labLink.label} <Arrow /></Link>}
                {p.links.map((l) => <a key={l.href} href={l.href} className="btn btn-ghost" target="_blank" rel="noreferrer">{l.label}</a>)}
              </div>
            )}
          </div>
          <dl className="case-meta glass">
            {meta.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt className="mono muted">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </header>

        <div className="case-art">
          <ProjectArt art={p.art} />
          {p.conceptVisual && <span className="concept-badge project-art-badge">Concept visual</span>}
        </div>

        {cs.contentNote && <p className="note case-note"><b>Work in progress.</b> {cs.contentNote}</p>}

        <div className="case-body">
          <CaseSection n="01" title="The problem">{cs.problem.map((t, i) => <p key={i}>{t}</p>)}</CaseSection>
          <CaseSection n="02" title="My role & scope">{cs.role.map((t, i) => <p key={i}>{t}</p>)}</CaseSection>
          <Reveal as="section" className="case-section case-wide">
            <h2 className="case-h"><span className="mono muted">03</span> System overview</h2>
            <SystemDiagram nodes={cs.system.nodes} caption={cs.system.caption} />
          </Reveal>
          <Reveal as="section" className="case-section case-wide">
            <h2 className="case-h"><span className="mono muted">04</span> Engineering decisions</h2>
            <div className="decisions">
              {cs.decisions.map((d) => (
                <div key={d.title} className="decision">
                  <h3 className="h-sub">{d.title}</h3>
                  <p className="secondary">{d.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <CaseSection n="05" title="Implementation">{cs.implementation.map((t, i) => <p key={i}>{t}</p>)}</CaseSection>
          <CaseSection n="06" title="Outcome & learning">{cs.outcome.map((t, i) => <p key={i}>{t}</p>)}</CaseSection>
        </div>

        <nav className="case-next" aria-label="More projects">
          <Link to="/work" className="text-link"><ArrowLeft /> Back to all work</Link>
          <Link to={`/work/${next.slug}`} className="case-next-link">
            <span className="mono muted">Next project</span>
            <span className="h-sub">{next.title} <Arrow /></span>
          </Link>
        </nav>
      </div>
    </article>
  );
}

function CaseSection({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="case-section">
      <h2 className="case-h"><span className="mono muted">{n}</span> {title}</h2>
      <div className="prose">{children}</div>
    </Reveal>
  );
}
