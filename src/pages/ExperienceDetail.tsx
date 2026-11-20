import { Link, Navigate, useParams } from 'react-router-dom';
import { experienceGroupLabels, experienceHref, getExperience, hasExperiencePage } from '../content/experience';
import { caseStudiesByIds, ownershipLabels, statusLabels } from '../content/projects';
import { isProvided, type Initiative, type Ownership } from '../content/types';
import { orgLine } from '../components/content/ExperienceItem';
import { EvidenceLinks, MetricList, TechList } from '../components/content/Meta';
import { Arrow, ArrowLeft } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { useExperienceReturn } from '../hooks/useProjectsReturn';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFound from './NotFound';

/** Initiatives I built alone or led, versus team efforts I contributed to. */
const OWNED: Ownership[] = ['sole', 'lead'];

/**
 * One role (Level 2): context, responsibilities, outcomes, leadership,
 * skills and related case studies. Engineering detail stays in the case
 * studies (Level 3). Entries without enough depth for a page redirect to
 * their primary role or to their row on the hub.
 */
export default function ExperienceDetail() {
  const { id = '' } = useParams();
  const e = getExperience(id);
  const back = useExperienceReturn();
  usePageTitle(e ? `${e.title}${isProvided(e.org) ? ` — ${e.org}` : ''}` : 'Page not found', e?.summary);
  if (!e) return <NotFound />;
  if (!hasExperiencePage(e)) return <Navigate to={experienceHref(e)} replace />;

  const linked = caseStudiesByIds(e.projects);
  const inits = e.initiatives ?? [];
  const groups = [
    { key: 'owned', title: 'Built alone or led', items: inits.filter((i) => OWNED.includes(i.ownership)) },
    { key: 'team', title: 'Team work I contributed to', items: inits.filter((i) => !OWNED.includes(i.ownership)) },
  ].filter((g) => g.items.length);
  // Numbered in reading order, across both groups.
  const order = groups.flatMap((g) => g.items);
  const number = (i: Initiative) => String(order.indexOf(i) + 1).padStart(2, '0');
  const hasBoth = !!(e.contributions?.length && e.leadership?.length);

  return (
    <article className="page case exp-detail">
      <div className="container">
        <Link to={back.to} state={back.state} className="case-back">
          <ArrowLeft /> All Experience
        </Link>

        <header className="case-hero">
          <div className="case-hero-copy">
            <p className="eyebrow">{experienceGroupLabels[e.group]}</p>
            <h1 className="h-section">{e.title}</h1>
            {orgLine(e) && <p className="exp-org">{orgLine(e)}</p>}
            <p className="lead">{e.summary}</p>
            <EvidenceLinks evidence={e.evidence} className="case-evidence" />
          </div>
          <dl className="case-meta glass">
            {isProvided(e.dates) && <div><dt className="mono muted">Dates</dt><dd>{e.dates}</dd></div>}
            {e.note && <div><dt className="mono muted">Notes</dt><dd>{e.note}</dd></div>}
            {isProvided(e.location) && <div><dt className="mono muted">Location</dt><dd>{e.location}</dd></div>}
          </dl>
        </header>

        {e.id === 'rbc' && (
          <p className="note case-note">
            <b>Employer work.</b> These descriptions and figures are approved for public discussion. RBC code, repositories, screenshots, reports and data are not shared. Figures come from my own validation and testing against production results; they are not claims about production deployment.
          </p>
        )}

        {e.metrics && e.metrics.length > 0 && <div className="case-facts"><MetricList metrics={e.metrics} /></div>}

        {groups.length > 0 && (
          <Reveal as="section" className="exp-inits" aria-labelledby="inits">
            <h2 id="inits" className="case-h">Initiatives</h2>
            <div className="init-groups">
            {groups.map((g) => (
              <section key={g.key} className="init-group" aria-labelledby={`inits-${g.key}`}>
                <h3 id={`inits-${g.key}`} className="sec-subhead mono">{g.title}</h3>
                <ol className="init-rows">
                  {g.items.map((i) => <InitiativeRow key={i.title} i={i} n={number(i)} />)}
                </ol>
              </section>
            ))}
            </div>
          </Reveal>
        )}

        {(e.contributions?.length || e.leadership?.length) ? (
          <Reveal as="section" className={`exp-section exp-cols ${hasBoth ? 'is-split' : ''}`}>
            {e.contributions && e.contributions.length > 0 && (
              <div>
                <h2 className="case-h">What I did</h2>
                <ul className="sec-dash">{e.contributions.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            )}
            {e.leadership && e.leadership.length > 0 && (
              <div>
                <h2 className="case-h">Leadership &amp; collaboration</h2>
                <ul className="sec-dash">{e.leadership.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            )}
          </Reveal>
        ) : null}

        {e.tech && e.tech.length > 0 && (
          <div className="case-tech">
            <p className="mono muted case-tech-label">Technical skills</p>
            <TechList tech={e.tech} />
          </div>
        )}

        {linked.length > 0 && (
          <aside className="case-related exp-related" aria-labelledby="exp-projects">
            <div>
              <h2 id="exp-projects" className="sec-subhead mono">Engineering detail · {linked.length === 1 ? 'case study' : 'case studies'}</h2>
              <ul className="rel-list">
                {linked.map((p) => <li key={p.id}><Link to={`/work/${p.id}`} className="rel-link"><span>{p.title}</span><span className="muted">{statusLabels[p.status]}</span><Arrow /></Link></li>)}
              </ul>
            </div>
          </aside>
        )}

        <nav className="case-next" aria-label="Back to experience">
          <Link to={back.to} state={back.state} className="case-back case-back-end">
            <ArrowLeft /> All Experience
          </Link>
        </nav>
      </div>
    </article>
  );
}

/** One initiative: the summary and headline figures visible, points and caveats on demand. */
function InitiativeRow({ i, n }: { i: Initiative; n: string }) {
  const projects = caseStudiesByIds(i.projects);
  const notes = (i.metrics ?? []).filter((m) => m.note);
  const hasMore = !!(i.points?.length || notes.length || projects.length);
  return (
    <li className="init-row">
      <span className="init-num mono" aria-hidden="true">{n}</span>
      <div className="init-body">
        <h4 className="init-title">{i.title}</h4>
        <p className="init-own mono">{ownershipLabels[i.ownership]}{i.ownershipNote ? <span className="init-own-note"> · {i.ownershipNote}</span> : null}</p>
        <p className="sec-text">{i.summary}</p>
        <MetricList metrics={i.metrics} compact />
        {hasMore && (
          <details className="disclose init-more">
            <summary className="disclose-summary">Details<span className="sr-only">: {i.title}</span></summary>
            <div className="disclose-body">
              {i.points && <ul className="sec-dash">{i.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
              {notes.map((m) => <p key={m.label} className="init-note"><b>{m.value} {m.label}.</b> {m.note}</p>)}
              {projects.length > 0 && (
                <p className="disclose-links">
                  <span className="mono muted">Case study</span>
                  {projects.map((p) => <Link key={p.id} to={`/work/${p.id}`} className="inline-link">{p.title}</Link>)}
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </li>
  );
}
