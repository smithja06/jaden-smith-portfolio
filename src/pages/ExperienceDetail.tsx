import { Link, useParams } from 'react-router-dom';
import { experience, experienceGroupLabels, getExperience } from '../content/experience';
import { caseStudiesByIds, ownershipLabels, statusLabels } from '../content/projects';
import { isProvided } from '../content/types';
import { stationPath } from '../lab3d/config/stations';
import { orgLine } from '../components/content/ExperienceItem';
import { EvidenceLinks, MetricList, TechList } from '../components/content/Meta';
import { Arrow } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFound from './NotFound';

/** Full page for one role: summary, initiatives (nested), contributions, linked projects. */
export default function ExperienceDetail() {
  const { id = '' } = useParams();
  const e = getExperience(id);
  usePageTitle(e ? `${e.title}${isProvided(e.org) ? ` — ${e.org}` : ''}` : 'Page not found', e?.summary);
  if (!e) return <NotFound />;

  // Only public case studies are linked; RBC initiatives are described here in full instead.
  const linked = caseStudiesByIds(e.projects);
  const parent = e.seeAlso ? getExperience(e.seeAlso) : undefined;
  const related = experience.filter((x) => x.seeAlso === e.id);

  return (
    <article className="page case exp-detail">
      <div className="container">
        <nav aria-label="Breadcrumb" className="crumbs mono">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to={stationPath('experience')}>Experience</Link></li>
            <li aria-current="page">{isProvided(e.org) ? e.org.split(' (')[0] : e.title}</li>
          </ol>
        </nav>

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

        {e.initiatives && e.initiatives.length > 0 && (
          <Reveal as="section" className="exp-inits" aria-labelledby="inits">
            <h2 id="inits" className="case-h"><span className="mono muted">01</span> Initiatives</h2>
            <ol className="init-cards">
              {e.initiatives.map((i, n) => (
                <li key={i.title} className="sec-card init-card">
                  <div className="init-card-top">
                    <span className="mono muted">{String(n + 1).padStart(2, '0')}</span>
                    <span className="init-own mono">{ownershipLabels[i.ownership]}{i.ownershipNote ? ` · ${i.ownershipNote}` : ''}</span>
                  </div>
                  <h3 className="sec-card-title">{i.title}</h3>
                  <p className="sec-text">{i.summary}</p>
                  {i.points && <ul className="sec-dash">{i.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
                  <MetricList metrics={i.metrics} />
                  {caseStudiesByIds(i.projects).length > 0 && (
                    <p className="disclose-links">
                      <span className="mono muted">Case study</span>
                      {caseStudiesByIds(i.projects).map((p) => (
                        <Link key={p.id} to={`/work/${p.id}`} className="inline-link">{p.title}</Link>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {e.contributions && e.contributions.length > 0 && (
          <Reveal as="section" className="case-section exp-section">
            <h2 className="case-h">What I did</h2>
            <div className="prose"><ul className="sec-dash">{e.contributions.map((c) => <li key={c}>{c}</li>)}</ul></div>
          </Reveal>
        )}

        {e.tech && e.tech.length > 0 && (
          <div className="case-tech">
            <p className="mono muted case-tech-label">Technologies</p>
            <TechList tech={e.tech} />
          </div>
        )}

        {(linked.length > 0 || parent || related.length > 0) && (
          <aside className="case-related" aria-label="Related">
            {linked.length > 0 && (
              <div>
                <h2 className="sec-subhead mono">Projects from this role</h2>
                <ul className="rel-list">
                  {linked.map((p) => <li key={p.id}><Link to={`/work/${p.id}`} className="rel-link"><span>{p.title}</span><span className="muted">{statusLabels[p.status]}</span><Arrow /></Link></li>)}
                </ul>
              </div>
            )}
            {(parent || related.length > 0) && (
              <div>
                <h2 className="sec-subhead mono">See also</h2>
                <ul className="rel-list">
                  {[parent, ...related].filter((x) => !!x).map((x) => (
                    <li key={x!.id}><Link to={`/experience/${x!.id}`} className="rel-link"><span>{x!.title}</span><span className="muted">{experienceGroupLabels[x!.group]}</span><Arrow /></Link></li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}

        <nav className="case-next" aria-label="Back">
          <Link to={stationPath('experience')} className="text-link">← All experience</Link>
          <Link to="/lab" className="text-link">Back to the Lab <Arrow /></Link>
        </nav>
      </div>
    </article>
  );
}
