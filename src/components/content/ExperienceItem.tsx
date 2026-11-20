import { Link } from 'react-router-dom';
import { isProvided, type ExperienceEntry } from '../../content/types';
import { getExperience } from '../../content/experience';
import { caseStudiesByIds, ownershipLabels } from '../../content/projects';
import { Arrow } from '../Icons';
import { MetricList, TechList } from './Meta';

/** Has enough depth for its own /experience/:id page. */
export const hasExperiencePage = (e: ExperienceEntry) =>
  !!(e.initiatives?.length || (e.contributions?.length && e.projects?.length));

export function orgLine(e: ExperienceEntry) {
  return [isProvided(e.org) ? e.org : null, isProvided(e.location) ? e.location : null].filter(Boolean).join(' · ');
}

/**
 * One role. Level 1 (always visible): title, org, dates, summary.
 * Level 2 (one disclosure): contributions, initiatives, technologies, linked projects.
 */
export function ExperienceItem({
  entry: e,
  headingLevel: H = 'h3',
  compact,
}: {
  entry: ExperienceEntry;
  headingLevel?: 'h2' | 'h3' | 'h4';
  compact?: boolean;
}) {
  const linked = caseStudiesByIds(e.projects);
  const parent = e.seeAlso ? getExperience(e.seeAlso) : undefined;
  const hasMore = !!(e.contributions?.length || e.initiatives?.length || e.metrics?.length || e.tech?.length || linked.length);

  return (
    <article className={`sec-card sec-role ${compact ? 'is-compact' : ''}`}>
      <div className="sec-role-top">
        <div>
          <H className="sec-card-title">{e.title}</H>
          {orgLine(e) && <p className="sec-org">{orgLine(e)}</p>}
          {e.note && <p className="sec-note">{e.note}</p>}
        </div>
        {isProvided(e.dates) && <p className="sec-date mono">{e.dates}</p>}
      </div>
      <p className="sec-text">{e.summary}</p>

      {!compact && hasMore && (
        <details className="disclose">
          <summary className="disclose-summary">
            {e.initiatives?.length ? 'Initiatives, outcomes & technologies' : 'Responsibilities & technologies'}
          </summary>
          <div className="disclose-body">
            <MetricList metrics={e.metrics} compact />
            {e.contributions && e.contributions.length > 0 && (
              <ul className="sec-dash">{e.contributions.map((c) => <li key={c}>{c}</li>)}</ul>
            )}
            {e.initiatives && e.initiatives.length > 0 && (
              <ol className="init-list">
                {e.initiatives.map((i) => (
                  <li key={i.title}>
                    <p className="init-title">{i.title} <span className="init-own mono">{ownershipLabels[i.ownership]}</span></p>
                    <p className="sec-text">{i.summary}</p>
                  </li>
                ))}
              </ol>
            )}
            <TechList tech={e.tech} />
            {linked.length > 0 && !e.initiatives && (
              <p className="disclose-links">
                <span className="mono muted">Projects</span>
                {linked.map((p) => <Link key={p.id} to={`/work/${p.id}`} className="inline-link">{p.title}</Link>)}
              </p>
            )}
          </div>
        </details>
      )}

      {(hasExperiencePage(e) || parent || (compact && linked.length > 0)) && (
        <div className="sec-role-links">
          {hasExperiencePage(e) && (
            <Link to={`/experience/${e.id}`} className="text-link">
              Full details <Arrow /><span className="sr-only">: {e.title}{isProvided(e.org) ? `, ${e.org}` : ''}</span>
            </Link>
          )}
          {parent && hasExperiencePage(parent) && (
            <Link to={`/experience/${parent.id}`} className="text-link">
              Technical work <Arrow /><span className="sr-only">: {isProvided(parent.org) ? parent.org : parent.title}</span>
            </Link>
          )}
          {compact && !hasExperiencePage(e) && linked.slice(0, 1).map((p) => (
            <Link key={p.id} to={`/work/${p.id}`} className="text-link">{p.title} <Arrow /></Link>
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * Compact editorial row for supporting roles (student teams, leadership,
 * additional employment): who/what/when on the left, the summary and any
 * link on the right, so sentences get a full reading width.
 */
export function ExperienceRow({ entry: e }: { entry: ExperienceEntry }) {
  const linked = caseStudiesByIds(e.projects);
  const parent = e.seeAlso ? getExperience(e.seeAlso) : undefined;
  return (
    <li className="exp-row">
      <div className="exp-row-head">
        <h3 className="exp-row-title">{e.title}</h3>
        {isProvided(e.org) && <p className="exp-row-org">{e.org}</p>}
        {isProvided(e.dates) && <p className="exp-row-date mono">{e.dates}</p>}
      </div>
      <div className="exp-row-body">
        <p className="exp-row-sum">{e.summary}</p>
        {(parent || linked.length > 0) && (
          <p className="exp-row-links">
            {parent && hasExperiencePage(parent) && (
              <Link to={`/experience/${parent.id}`} className="text-link">
                Technical work <Arrow /><span className="sr-only">: {isProvided(parent.org) ? parent.org : parent.title}</span>
              </Link>
            )}
            {linked.map((p) => (
              <Link key={p.id} to={`/work/${p.id}`} className="text-link">{p.title.split(' — ')[0]} <Arrow /></Link>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}
