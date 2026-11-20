import { useState } from 'react';
import { Link } from 'react-router-dom';
import { experiments, type StationId } from '../../lab3d/config/stations';
import { featuredProjects, projects } from '../../content/projects';
import { timeline } from '../../content/experience';
import { education } from '../../content/education';
import { skillCategories } from '../../content/skills';
import { site } from '../../content/site';
import { isProvided, type Project } from '../../content/types';
import { NetworkToy } from '../../lab/NetworkToy';
import { Arrow } from '../Icons';

/**
 * Section bodies shared by the single-page homepage and the Lab section pages.
 * `detailed` adds the extras that only the Lab pages show.
 */
export interface SectionProps {
  detailed?: boolean;
}

/** Count shown at the right of each section heading. */
export const sectionCount: Partial<Record<StationId, string>> = {
  experience: `${timeline.filter((t) => t.kind !== 'education').length} roles`,
  projects: `${projects.length} projects`,
  skills: `${skillCategories.length} areas`,
};

/* ---------- Experience ---------- */

type ExpFilter = 'all' | 'work' | 'team';

export function ExperienceSection({ detailed }: SectionProps) {
  const [filter, setFilter] = useState<ExpFilter>('all');
  const entries = timeline.filter((t) => t.kind !== 'education' && (filter === 'all' || t.kind === filter));
  const opts: { id: ExpFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'work', label: 'Professional' },
    { id: 'team', label: 'Student teams' },
  ];
  return (
    <>
      {detailed && (
        <>
          <div className="sec-filters" role="group" aria-label="Filter experience">
            {opts.map((o) => (
              <button key={o.id} type="button" className={`chip chip-sm ${filter === o.id ? 'is-on' : ''}`} aria-pressed={filter === o.id} onClick={() => setFilter(o.id)}>
                {o.label}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">{entries.length} shown</p>
        </>
      )}
      <div className="sec-roles">
        {entries.map((t) => (
          <article key={t.org + t.title} className="sec-card sec-role">
            <div className="sec-role-top">
              <div>
                <p className="sec-kicker mono">{t.kind === 'work' ? 'Professional' : 'Student team'}</p>
                <h3 className="sec-card-title">{t.title}</h3>
                <p className="sec-org">{t.org}</p>
              </div>
              {isProvided(t.period) && <p className="sec-date mono">{t.period}</p>}
            </div>
            {t.highlights && t.highlights.length > 0 ? (
              <ul className="sec-dash">{t.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            ) : (
              <p className="sec-text">{t.description}</p>
            )}
            {t.project && <Link to={`/work/${t.project}`} className="text-link sec-card-link">Related case study <Arrow /></Link>}
          </article>
        ))}
      </div>
    </>
  );
}

/* ---------- Projects ---------- */

export function ProjectsSection({ detailed }: SectionProps) {
  const featured = featuredProjects(projects.length);
  const ordered: Project[] = [...featured, ...projects.filter((p) => !featured.includes(p))];
  return (
    <>
      <div className="sec-grid">
        {ordered.map((p) => (
          <article key={p.slug} className="sec-card sec-project">
            <h3 className="sec-card-title">{p.title}</h3>
            <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />{p.status}</p>
            <p className="sec-text">{p.cardText}</p>
            <ul className="sec-tags">{p.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
            <Link to={`/work/${p.slug}`} className="sec-card-link text-link">View case study <Arrow /><span className="sr-only">: {p.title}</span></Link>
          </article>
        ))}
      </div>

      {detailed && (
        <>
          <h3 className="sec-subhead mono">Interactive prototypes</h3>
          <div className="sec-grid sec-grid-2">
            {experiments.map((e) => (
              <article key={e.id} className="sec-card sec-project">
                <h4 className="sec-card-title">{e.title}</h4>
                <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />Runs in your browser · {e.project}</p>
                <p className="sec-text">{e.blurb}</p>
                <Link to={e.route} className="sec-card-link text-link">Open experiment <Arrow /></Link>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ---------- Skills ---------- */

export function SkillsSection({ detailed }: SectionProps) {
  return (
    <>
      <ol className="sec-rows">
        {skillCategories.map((c, i) => (
          <li key={c.id} className="sec-row">
            <span className="sec-row-index mono">{String(i + 1).padStart(2, '0')}</span>
            <div className="sec-row-label">
              <h3>{c.label}</h3>
              <p>{c.summary}</p>
            </div>
            <p className="sec-row-items">{c.items.join(', ')}</p>
          </li>
        ))}
      </ol>
      {detailed && (
        <>
          <h3 className="sec-subhead mono">Hands-on · Toy network</h3>
          <div className="sec-toy"><NetworkToy /></div>
        </>
      )}
    </>
  );
}

/* ---------- Education ---------- */

export function EducationSection() {
  return (
    <div className="sec-edu">
      {isProvided(education.period) && <p className="sec-date mono">{education.period}</p>}
      <h3 className="sec-edu-program">{education.program}</h3>
      <p className="sec-org sec-edu-school">{education.school}</p>
      <p className="sec-text sec-edu-summary">{education.summary}</p>

      {education.stats.length > 0 && (
        <dl className="sec-stats">
          {education.stats.map((s) => (
            <div key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
      )}

      <h4 className="sec-subhead mono">Coursework</h4>
      {education.coursework.length > 0
        ? <ul className="sec-dash">{education.coursework.map((c) => <li key={c}>{c}</li>)}</ul>
        : <p className="sec-pending">Relevant McMaster coursework will be listed here.</p>}

      <h4 className="sec-subhead mono">Achievements</h4>
      {education.achievements.length > 0
        ? <ul className="sec-dash">{education.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
        : <p className="sec-pending">Academic achievements will be listed here.</p>}
    </div>
  );
}

/* ---------- Contact ---------- */

export function ResumeButton({ className = 'btn btn-primary' }: { className?: string }) {
  if (!isProvided(site.resumeUrl)) return null;
  return <a className={className} href={site.resumeUrl} download={site.resumeFilename}>Download résumé <span aria-hidden="true">↓</span></a>;
}

export function ContactSection() {
  const hasEmail = isProvided(site.email);
  return (
    <div className="sec-contact">
      <p className="sec-contact-lead">Open to conversations about software, AI and embedded engineering roles.</p>
      {hasEmail
        ? <a className="sec-email" href={`mailto:${site.email}`}>{site.email as string}</a>
        : <p className="sec-email sec-email-pending">Email address coming soon.</p>}
      <div className="sec-contact-row">
        <ul className="sec-socials">
          {site.socials.map((s) => (
            <li key={s.href}>
              <span className="mono muted">{s.label}</span>
              <a href={s.href} target="_blank" rel="noreferrer">{s.href.replace(/^https?:\/\/(www\.)?/, '')} ↗</a>
            </li>
          ))}
          <li><span className="mono muted">About</span><Link to="/about">Read more about me</Link></li>
        </ul>
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
