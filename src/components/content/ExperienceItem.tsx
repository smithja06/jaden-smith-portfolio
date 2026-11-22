import { Link } from 'react-router-dom';
import { isProvided, type ExperienceEntry } from '../../content/types';
import { experienceHref, getExperience, hasExperiencePage, roleAnchor } from '../../content/experience';
import { caseStudiesByIds } from '../../content/projects';
import type { FromHubState } from '../../hooks/useProjectsReturn';
import { Arrow } from '../Icons';
import { MediaGallery, MetricList, TechList } from './Meta';

export { hasExperiencePage };

export function orgLine(e: ExperienceEntry) {
  return [isProvided(e.org) ? e.org : null, isProvided(e.location) ? e.location : null].filter(Boolean).join(' · ');
}

/**
 * Hub card for a primary role (Level 1): who, when, a short summary, one or
 * two verified outcomes, a few representative technologies and the way in.
 * Responsibilities, initiatives and the full stack live on the role's page.
 */
export function ExperienceItem({ entry: e, linkState }: { entry: ExperienceEntry; linkState?: FromHubState }) {
  const headline = e.metrics?.slice(0, 2) ?? [];
  return (
    <article id={roleAnchor(e.id)} className="sec-card sec-role">
      <div className="sec-role-top">
        <div>
          <h3 className="sec-card-title">{e.title}</h3>
          {orgLine(e) && <p className="sec-org">{orgLine(e)}</p>}
          {e.note && <p className="sec-note">{e.note}</p>}
        </div>
        {isProvided(e.dates) && <p className="sec-date mono">{e.dates}</p>}
      </div>
      <p className="sec-text role-sum">{e.summary}</p>
      {headline.length > 0
        ? <MetricList metrics={headline} compact />
        : e.outcome && <p className="role-outcome"><span className="mono">Outcome</span>{e.outcome}</p>}
      {(e.coreTech?.length || hasExperiencePage(e)) && (
        <div className="role-foot">
          <TechList tech={e.coreTech} label="Representative technologies" />
          {hasExperiencePage(e) && (
            <Link to={`/experience/${e.id}`} state={linkState} className="text-link role-more">
              View full experience <Arrow /><span className="sr-only">: {e.title}{isProvided(e.org) ? `, ${e.org}` : ''}</span>
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Compact editorial row for supporting roles (student teams, leadership,
 * additional employment). An entry that extends a primary role (`seeAlso`)
 * links to that role's page instead of having its own.
 */
export function ExperienceRow({ entry: e, linkState }: { entry: ExperienceEntry; linkState?: FromHubState }) {
  const linked = caseStudiesByIds(e.projects);
  const parent = e.seeAlso ? getExperience(e.seeAlso) : undefined;
  const parentPage = parent && hasExperiencePage(parent) ? parent : undefined;
  return (
    <li id={roleAnchor(e.id)} className="exp-row">
      <div className="exp-row-head">
        <h3 className="exp-row-title">{e.title}</h3>
        {isProvided(e.org) && <p className="exp-row-org">{e.org}</p>}
        {isProvided(e.dates) && <p className="exp-row-date mono">{e.dates}</p>}
      </div>
      <div className="exp-row-body">
        {/* Same title as the primary role: its summary would only repeat that card. */}
        {parentPage && parentPage.title === e.title
          ? <p className="exp-row-sum">Leadership responsibilities are covered on the role page.</p>
          : <p className="exp-row-sum">{e.summary}</p>}
        {/* Original images only; each thumbnail opens full size. */}
        <MediaGallery media={e.media} className="exp-row-media" zoom />
        {(parentPage || linked.length > 0) && (
          <p className="exp-row-links">
            {parentPage && (
              <Link to={experienceHref(parentPage)} state={linkState} className="text-link">
                Role details <Arrow /><span className="sr-only">: {parentPage.title}{isProvided(parentPage.org) ? `, ${parentPage.org}` : ''}</span>
              </Link>
            )}
            {!parentPage && linked.map((p) => (
              <Link key={p.id} to={`/work/${p.id}`} className="text-link">{p.title.split(' — ')[0]} <Arrow /></Link>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}
