import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stations, stationPath, experiments, type StationId } from '../../lab3d/config/stations';
import { featuredProjects, projects } from '../../content/projects';
import { timeline } from '../../content/experience';
import { education } from '../../content/education';
import { skillCategories } from '../../content/skills';
import { site } from '../../content/site';
import { isProvided, type Project } from '../../content/types';
import { NetworkToy } from '../../lab/NetworkToy';
import { Arrow } from '../../components/Icons';
import { usePageTitle } from '../../hooks/usePageTitle';
import './sections.css';

/**
 * Full-page view for one Lab station: section bar with a 01–05 pager,
 * an indexed heading, and section-specific content. Esc returns to the 3D lab.
 */
export default function LabSectionPage({ id }: { id: StationId }) {
  const index = stations.findIndex((s) => s.id === id);
  const station = stations[index];
  const navigate = useNavigate();
  usePageTitle(station.title, `${station.title} — ${station.summary}`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack Esc while someone is typing or using a native control.
      if (e.key !== 'Escape') return;
      const t = e.target;
      if (t instanceof Element && t.closest('input, textarea, select')) return;
      navigate('/lab');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate]);

  const body: Record<StationId, { count?: string; content: ReactNode }> = {
    experience: { count: `${timeline.filter((t) => t.kind !== 'education').length} roles`, content: <ExperienceSection /> },
    projects: { count: `${projects.length} projects`, content: <ProjectsSection /> },
    skills: { count: `${skillCategories.length} areas`, content: <SkillsSection /> },
    education: { content: <EducationSection /> },
    contact: { content: <ContactSection /> },
  };
  const { count, content } = body[id];

  return (
    <div className="page sec">
      <div className="container">
        <nav className="sec-bar" aria-label="Lab sections">
          <p className="sec-crumb mono"><span className="sec-crumb-index">[{station.letter}]</span> {station.title}</p>
          <div className="sec-bar-right">
            <ol className="sec-pager">
              {stations.map((s) => (
                <li key={s.id}>
                  <Link
                    to={stationPath(s.id)}
                    className={`sec-pager-link mono ${s.id === id ? 'is-on' : ''}`}
                    aria-current={s.id === id ? 'page' : undefined}
                    aria-label={`${s.letter} ${s.title}`}
                    title={s.title}
                  >
                    {s.letter}
                  </Link>
                </li>
              ))}
            </ol>
            <Link to="/lab" className="sec-back mono">Back to lab <kbd>Esc</kbd></Link>
          </div>
        </nav>

        <header className="sec-head">
          <span className="sec-index mono" aria-hidden="true">{station.letter}</span>
          <div className="sec-head-main">
            <h1 className="sec-title">{station.title}</h1>
            <p className="sec-summary">{station.summary}</p>
          </div>
          {count && <span className="sec-count mono">{count}</span>}
        </header>

        <div className="sec-body">{content}</div>

        <nav className="sec-next" aria-label="Next section">
          {index > 0 ? (
            <Link to={stationPath(stations[index - 1].id)} className="sec-next-link">
              <span className="mono muted">← {stations[index - 1].letter}</span>
              <span>{stations[index - 1].title}</span>
            </Link>
          ) : <span />}
          {index < stations.length - 1 && (
            <Link to={stationPath(stations[index + 1].id)} className="sec-next-link is-right">
              <span className="mono muted">{stations[index + 1].letter} →</span>
              <span>{stations[index + 1].title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

/* ---------- 01 · Experience ---------- */

type ExpFilter = 'all' | 'work' | 'team';

function ExperienceSection() {
  const [filter, setFilter] = useState<ExpFilter>('all');
  const entries = timeline.filter((t) => t.kind !== 'education' && (filter === 'all' || t.kind === filter));
  const opts: { id: ExpFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'work', label: 'Professional' },
    { id: 'team', label: 'Student teams' },
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
      <p className="sr-only" aria-live="polite">{entries.length} shown</p>
      <div className="sec-roles">
        {entries.map((t) => (
          <article key={t.org + t.title} className="sec-card sec-role">
            <div className="sec-role-top">
              <div>
                <p className="sec-kicker mono">{t.kind === 'work' ? 'Professional' : 'Student team'}</p>
                <h2 className="sec-card-title">{t.title}</h2>
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

/* ---------- 02 · Projects ---------- */

function ProjectsSection() {
  const featured = featuredProjects(projects.length);
  const ordered: Project[] = [...featured, ...projects.filter((p) => !featured.includes(p))];
  return (
    <>
      <div className="sec-grid">
        {ordered.map((p) => (
          <article key={p.slug} className="sec-card sec-project">
            <h2 className="sec-card-title">{p.title}</h2>
            <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />{p.status}</p>
            <p className="sec-text">{p.cardText}</p>
            <ul className="sec-tags">{p.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
            <Link to={`/work/${p.slug}`} className="sec-card-link text-link">View case study <Arrow /><span className="sr-only">: {p.title}</span></Link>
          </article>
        ))}
      </div>

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

/* ---------- 03 · Skills ---------- */

function SkillsSection() {
  return (
    <>
      <ol className="sec-rows">
        {skillCategories.map((c, i) => (
          <li key={c.id} className="sec-row">
            <span className="sec-row-index mono">{String(i + 1).padStart(2, '0')}</span>
            <div className="sec-row-label">
              <h2>{c.label}</h2>
              <p>{c.summary}</p>
            </div>
            <p className="sec-row-items">{c.items.join(', ')}</p>
          </li>
        ))}
      </ol>
      <h2 className="sec-subhead mono">Hands-on · Toy network</h2>
      <div className="sec-toy"><NetworkToy /></div>
    </>
  );
}

/* ---------- 04 · Education ---------- */

function EducationSection() {
  return (
    <div className="sec-edu">
      {isProvided(education.period) && <p className="sec-date mono">{education.period}</p>}
      <h2 className="sec-edu-program">{education.program}</h2>
      <p className="sec-org sec-edu-school">{education.school}</p>
      <p className="sec-text sec-edu-summary">{education.summary}</p>

      {education.stats.length > 0 && (
        <dl className="sec-stats">
          {education.stats.map((s) => (
            <div key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
      )}

      <h3 className="sec-subhead mono">Coursework</h3>
      {education.coursework.length > 0
        ? <ul className="sec-dash">{education.coursework.map((c) => <li key={c}>{c}</li>)}</ul>
        : <p className="sec-pending">Relevant McMaster coursework will be listed here.</p>}

      <h3 className="sec-subhead mono">Achievements</h3>
      {education.achievements.length > 0
        ? <ul className="sec-dash">{education.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
        : <p className="sec-pending">Academic achievements will be listed here.</p>}
    </div>
  );
}

/* ---------- 05 · Contact ---------- */

function ContactSection() {
  const hasEmail = isProvided(site.email);
  const hasResume = isProvided(site.resumeUrl);
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
        {hasResume && <a className="btn btn-primary" href={site.resumeUrl as string} download>Download résumé ↓</a>}
      </div>
    </div>
  );
}
