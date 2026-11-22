import { Link, useSearchParams } from 'react-router-dom';
import type { SectionStationId } from '../../lab3d/config/stations';
import { getProject, isPublicProject, projectHref } from '../../content/projects';
import { experience, experienceGroupLabels, experienceGroupOrder, experienceHref, experienceInGroup, getExperience } from '../../content/experience';
import { awards, coursework, schools, type CourseTopic } from '../../content/education';
import { site } from '../../content/site';
import { isProvided, type ExperienceGroup } from '../../content/types';
import { ExperienceItem, ExperienceRow } from '../content/ExperienceItem';
import { ProjectsHub } from '../content/ProjectsHub';
import { SkillExplorer } from '../content/SkillExplorer';
import { MetricList } from '../content/Meta';
import { useHubLinkState } from '../../hooks/useProjectsReturn';

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
  // The filter lives in the URL (?group=…) so "All Experience" on a role page can restore it.
  const [params, setParams] = useSearchParams();
  const raw = params.get('group');
  const filter: ExpFilter = experienceGroupOrder.includes(raw as ExperienceGroup) ? (raw as ExperienceGroup) : 'all';
  const setFilter = (f: ExpFilter) => setParams(f === 'all' ? {} : { group: f }, { replace: true });
  const linkState = useHubLinkState();
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
              {experienceInGroup(g).map((e) => <ExperienceItem key={e.id} entry={e} linkState={linkState} />)}
            </div>
          ) : (
            <ol className="exp-rows">
              {experienceInGroup(g).map((e) => <ExperienceRow key={e.id} entry={e} linkState={linkState} />)}
            </ol>
          )}
        </section>
      ))}
    </>
  );
}

/* ---------- Projects ---------- */

export function ProjectsSection() {
  return <ProjectsHub />;
}

/* ---------- Skills ---------- */

export function SkillsSection() {
  // The toy network now lives with the other experiments at /lab/neural-network.
  return <SkillExplorer />;
}

/* ---------- Education ---------- */

function SchoolBlock({ id, secondary }: { id: string; secondary?: boolean }) {
  const s = schools.find((x) => x.id === id)!;
  const H = secondary ? 'h3' : 'h2';
  const teams = (s.teams ?? []).map(getExperience).filter((e) => !!e);
  const projectsHere = (s.projects ?? []).map(getProject).filter((p) => !!p && isPublicProject(p));
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
          {projectsHere.map((p) => <Link key={p!.id} to={projectHref(p!)} className="inline-link">{p!.title.split(' — ')[0]}</Link>)}
          {teams.length > 0 && <span className="mono muted">Teams</span>}
          {teams.map((t) => <Link key={t!.id} to={experienceHref(t!)} className="inline-link">{isProvided(t!.org) ? t!.org : t!.title}</Link>)}
        </p>
      )}
    </article>
  );
}

function AwardsList() {
  const received = awards.filter((a) => a.kind === 'received');
  // Split by school so high-school awards aren't read as university ones.
  const university = received.filter((a) => a.school === 'mcmaster');
  const highSchool = received.filter((a) => a.school === 'cathedral');
  const item = (a: (typeof awards)[number]) => <li key={a.title}>{a.title}{a.detail && <span className="muted"> · {a.detail}</span>}</li>;
  const candidate = awards.filter((a) => a.kind === 'candidate');
  const certs = awards.filter((a) => a.kind === 'certification');
  return (
    <div className="awards">
      <section aria-labelledby="awards-university">
        <h3 id="awards-university" className="awards-title mono">University · McMaster</h3>
        <ul className="sec-dash">{university.map(item)}</ul>
        <h3 id="awards-high-school" className="awards-title mono">High school · Cathedral High School</h3>
        <ul className="sec-dash">{highSchool.map(item)}</ul>
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

const statusLabel = { 'in-progress': 'In progress' } as const;

/** One coursework entry; only populated fields are shown. */
function CourseItem({ topic }: { topic: CourseTopic }) {
  const t = typeof topic === 'string' ? { title: topic } : topic;
  return (
    <li className="course-item">
      <span className="course-name">
        {t.title}
        {t.code && <span className="course-code mono">{t.code}</span>}
        {t.status === 'in-progress' && <span className="course-status mono">{statusLabel[t.status]}</span>}
      </span>
      {t.description && <span className="course-desc">{t.description}</span>}
    </li>
  );
}

/**
 * Coursework by discipline, in two independent columns on wide screens:
 * each area is as tall as its content, and any number of areas fits
 * without stretched rows or empty cells. Related projects appear once per
 * area as a secondary line.
 */
function CourseworkList() {
  return (
    <div className="course-cols">
      {coursework.map((c) => {
        // Hidden records and planned courses stay in data but aren't shown; an area with nothing to show is skipped.
        const topics = c.topics.filter((t) => typeof t === 'string' || (!t.hidden && t.status !== 'planned'));
        if (!topics.length) return null;
        const linked = [...new Set(c.projects ?? [])].map(getProject).filter((p) => !!p && isPublicProject(p));
        return (
          <section key={c.id} className="course" aria-labelledby={`course-${c.id}`}>
            <h3 id={`course-${c.id}`} className="course-title">{c.label}</h3>
            <ul className="course-topics">{topics.map((t) => <CourseItem key={typeof t === 'string' ? t : t.title} topic={t} />)}</ul>
            {linked.length > 0 && (
              <p className="course-links">
                <span className="course-links-label mono">Related work</span>
                {linked.map((p) => <Link key={p!.id} to={projectHref(p!)} className="inline-link">{p!.title.split(' — ')[0]}</Link>)}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function EducationSection() {
  return (
    <div className="sec-edu">
      <SchoolBlock id="mcmaster" />

      <h2 className="sec-subhead mono">Awards &amp; recognition</h2>
      <AwardsList />

      <h2 className="sec-subhead mono">Relevant coursework</h2>
      <CourseworkList />

      <h2 className="sec-subhead mono">Earlier</h2>
      <SchoolBlock id="cathedral" secondary />
    </div>
  );
}

/* ---------- Contact ---------- */

/** Portrait + invitation, email and profiles — the same on the homepage and the Contact page. */
export function ContactSection(_props: SectionProps) {
  const socials = site.socials.filter((s) => isProvided(s.href));
  return (
    <div className="sec-contact">
      <div className="sec-contact-intro">
        <picture>
          <source srcSet={site.headshot.webp} type="image/webp" />
          <img className="sec-contact-avatar" src={site.headshot.jpg} alt="" width={56} height={56} loading="lazy" decoding="async" />
        </picture>
        <p className="sec-contact-lead">{site.contactLead}</p>
      </div>
      {isProvided(site.email) && <a className="sec-email" href={`mailto:${site.email}`}>{site.email}</a>}
      <div className="sec-contact-row">
        {socials.length > 0 && (
          <ul className="sec-socials">
            {socials.map((s) => (
              <li key={s.label}>
                <span className="mono muted">{s.label}</span>
                <a href={s.href as string} target="_blank" rel="noreferrer">{(s.href as string).replace(/^https?:\/\/(www\.)?/, '')} ↗</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const sectionBodies: Record<SectionStationId, (p: SectionProps) => JSX.Element> = {
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  education: EducationSection,
  contact: ContactSection,
};
