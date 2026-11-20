import { useState } from 'react';
import { Link } from 'react-router-dom';
import { experiments, type StationId } from '../../lab3d/config/stations';
import { getProject } from '../../content/projects';
import { featuredCards, featuredProjectIds } from '../../content/featured';
import { experience, experienceGroupLabels, experienceGroupOrder, experienceInGroup, getExperience } from '../../content/experience';
import { awards, coursework, schools } from '../../content/education';
import { site } from '../../content/site';
import { isProvided, type ExperienceGroup } from '../../content/types';
import { NetworkToy } from '../../lab/NetworkToy';
import { Arrow } from '../Icons';
import { FeaturedCard } from '../content/FeaturedCard';
import { ExperienceItem, ExperienceRow } from '../content/ExperienceItem';
import { SearchableArchive } from '../content/ProjectArchive';
import { SkillExplorer } from '../content/SkillExplorer';
import { MetricList } from '../content/Meta';

/**
 * Full-section bodies for the Lab pages (/lab/<station>). The homepage has
 * its own, much shorter sections; only Contact is shared.
 */
export interface SectionProps {
  detailed?: boolean;
}

/* ---------- Experience ---------- */

type ExpFilter = 'all' | ExperienceGroup;

export function ExperienceSection() {
  const [filter, setFilter] = useState<ExpFilter>('all');
  const groups = experienceGroupOrder.filter((g) => filter === 'all' || filter === g);
  const opts: { id: ExpFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...experienceGroupOrder.map((g) => ({ id: g, label: experienceGroupLabels[g] })),
  ];
  return (
    <>
      <div className="sec-filters" role="group" aria-label="Filter experience">
        {opts.map((o) => (
          <button key={o.id} type="button" className={`chip chip-sm ${filter === o.id ? 'is-on' : ''}`} aria-pressed={filter === o.id} onClick={() => setFilter(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filter === 'all' ? experience.length : experienceInGroup(filter).length} entries shown
      </p>
      {groups.map((g) => (
        <section key={g} className="exp-group" aria-labelledby={`exp-${g}`}>
          <h2 id={`exp-${g}`} className="sec-subhead mono">{experienceGroupLabels[g]}</h2>
          {g === 'technical' ? (
            <div className="sec-roles">
              {experienceInGroup(g).map((e) => <ExperienceItem key={e.id} entry={e} />)}
            </div>
          ) : (
            <ol className="exp-rows">
              {experienceInGroup(g).map((e) => <ExperienceRow key={e.id} entry={e} />)}
            </ol>
          )}
        </section>
      ))}
    </>
  );
}

/* ---------- Projects ---------- */

export function ProjectsSection() {
  const cards = featuredCards();
  return (
    <>
      <h2 className="sec-subhead mono sec-subhead-first">Featured projects</h2>
      <div className="feat-grid">
        {cards.map((c) => <FeaturedCard key={c.key} card={c} headingLevel="h3" />)}
      </div>

      <h2 id="archive" className="sec-subhead mono" tabIndex={-1}>More projects</h2>
      <p className="sec-intro">Prototypes, products, lab work and experiments. Search covers every project, featured ones included.</p>
      <SearchableArchive hideWhenIdle={featuredProjectIds} />

      <h2 className="sec-subhead mono">Interactive prototypes</h2>
      <div className="sec-grid sec-grid-2">
        {experiments.map((e) => (
          <article key={e.id} className="sec-card sec-project">
            <h3 className="sec-card-title">{e.title}</h3>
            <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />Runs in your browser · {e.project}</p>
            <p className="sec-text">{e.blurb}</p>
            <Link to={e.route} className="sec-card-link text-link">Open experiment <Arrow /></Link>
          </article>
        ))}
      </div>
    </>
  );
}

/* ---------- Skills ---------- */

export function SkillsSection() {
  return (
    <>
      <SkillExplorer />
      <h2 className="sec-subhead mono">Hands-on · Toy network</h2>
      <div className="sec-toy"><NetworkToy /></div>
    </>
  );
}

/* ---------- Education ---------- */

function SchoolBlock({ id, secondary }: { id: string; secondary?: boolean }) {
  const s = schools.find((x) => x.id === id)!;
  const H = secondary ? 'h3' : 'h2';
  const teams = (s.teams ?? []).map(getExperience).filter((e) => !!e);
  const projectsHere = (s.projects ?? []).map(getProject).filter((p) => !!p);
  return (
    <article className={`edu-school ${secondary ? 'is-secondary' : ''}`}>
      <p className="sec-date mono">{s.dates}</p>
      <H className={secondary ? 'edu-name-sm' : 'sec-edu-program'}>{s.institution}</H>
      <p className="sec-org sec-edu-school">{s.credential}</p>
      <p className="sec-text edu-program">{s.program ? `${s.program} · ${s.location}` : s.location}</p>
      <MetricList metrics={s.stats} compact />
      <p className="sec-text">{s.summary}</p>
      {(projectsHere.length > 0 || teams.length > 0) && (
        <p className="disclose-links">
          {projectsHere.length > 0 && <span className="mono muted">Design work</span>}
          {projectsHere.map((p) => <Link key={p!.id} to={`/work/${p!.id}`} className="inline-link">{p!.title.split(' — ')[0]}</Link>)}
          {teams.length > 0 && <span className="mono muted">Teams</span>}
          {teams.map((t) => <Link key={t!.id} to={`/experience/${t!.id}`} className="inline-link">{isProvided(t!.org) ? t!.org : t!.title}</Link>)}
        </p>
      )}
    </article>
  );
}

function AwardsList() {
  const received = awards.filter((a) => a.kind === 'received');
  const candidate = awards.filter((a) => a.kind === 'candidate');
  const certs = awards.filter((a) => a.kind === 'certification');
  return (
    <div className="awards">
      <section aria-labelledby="awards-received">
        <h3 id="awards-received" className="awards-title mono">Awards received</h3>
        <ul className="sec-dash">{received.map((a) => <li key={a.title}>{a.title}{a.detail && <span className="muted"> · {a.detail}</span>}</li>)}</ul>
      </section>
      <section aria-labelledby="awards-candidate">
        <h3 id="awards-candidate" className="awards-title mono">Scholarship candidacies</h3>
        <ul className="sec-dash">{candidate.map((a) => <li key={a.title}>{a.title}<span className="muted"> · candidate, not recipient</span></li>)}</ul>
        <h3 className="awards-title mono">Certification</h3>
        <ul className="sec-dash">{certs.map((a) => <li key={a.title}>{a.title}{a.detail && <span className="muted"> · {a.detail}</span>}</li>)}</ul>
      </section>
    </div>
  );
}

export function EducationSection() {
  return (
    <div className="sec-edu">
      <SchoolBlock id="mcmaster" />

      <h2 className="sec-subhead mono">Awards &amp; recognition</h2>
      <AwardsList />

      <details className="disclose edu-courses">
        <summary className="disclose-summary">Relevant coursework, by discipline</summary>
        <div className="course-grid">
          {coursework.map((c) => {
            const linked = (c.projects ?? []).map(getProject).filter((p) => !!p);
            return (
              <section key={c.id} className="course" aria-labelledby={`course-${c.id}`}>
                <h3 id={`course-${c.id}`} className="course-title">{c.label}</h3>
                <ul className="course-topics">{c.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                {linked.length > 0 && (
                  <p className="course-links">
                    {linked.map((p) => <Link key={p!.id} to={`/work/${p!.id}`} className="inline-link">{p!.title.split(' — ')[0]}</Link>)}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </details>

      <h2 className="sec-subhead mono">Earlier</h2>
      <SchoolBlock id="cathedral" secondary />
    </div>
  );
}

/* ---------- Contact ---------- */

export function ResumeButton({ className = 'btn btn-primary' }: { className?: string }) {
  if (!isProvided(site.resumeUrl)) return null;
  return <a className={className} href={site.resumeUrl} download={site.resumeFilename}>Download résumé <span aria-hidden="true">↓</span></a>;
}

/** Homepage: invitation, email, résumé, profiles. `detailed` adds phone and location. */
export function ContactSection({ detailed }: SectionProps) {
  const socials = site.socials.filter((s) => isProvided(s.href));
  const hasPhone = detailed && isProvided(site.phone) && isProvided(site.phoneHref);
  return (
    <div className="sec-contact">
      <p className="sec-contact-lead">{site.contactLead}</p>
      {isProvided(site.email) && <a className="sec-email" href={`mailto:${site.email}`}>{site.email}</a>}
      <div className="sec-contact-row">
        {(hasPhone || detailed || socials.length > 0) && (
          <ul className="sec-socials">
            {hasPhone && <li><span className="mono muted">Phone</span><a href={`tel:${site.phoneHref}`}>{site.phone as string}</a></li>}
            {detailed && <li><span className="mono muted">Based in</span><span className="sec-plain">{site.location}</span></li>}
            {socials.map((s) => (
              <li key={s.label}>
                <span className="mono muted">{s.label}</span>
                <a href={s.href as string} target="_blank" rel="noreferrer">{(s.href as string).replace(/^https?:\/\/(www\.)?/, '')} ↗</a>
              </li>
            ))}
          </ul>
        )}
        <ResumeButton />
      </div>
    </div>
  );
}

export const sectionBodies: Record<StationId, (p: SectionProps) => JSX.Element> = {
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  education: EducationSection,
  contact: ContactSection,
};
