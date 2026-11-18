import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryLabels, featuredProjects, projects } from '../../content/projects';
import { site } from '../../content/site';
import { timeline } from '../../content/experience';
import { education } from '../../content/education';
import { skillCategories, type SkillCategory } from '../../content/skills';
import { isProvided, type Project } from '../../content/types';
import { experiments, type ExperimentId, type StationId } from '../config/stations';
import { NetworkToy } from '../../lab/NetworkToy';
import { Arrow } from '../../components/Icons';

interface Props {
  id: StationId;
  /** In the 3D panel, experiments open in the in-lab workspace; in list mode they link to their pages. */
  onOpenExperiment?: (id: ExperimentId) => void;
}

/** Station content — rendered both in the 3D panel and in the accessible list view. */
export function StationContent({ id, onOpenExperiment }: Props) {
  switch (id) {
    case 'projects': return <ProjectsContent onOpenExperiment={onOpenExperiment} />;
    case 'experience': return <ExperienceContent />;
    case 'skills': return <SkillsContent />;
    case 'education': return <EducationContent />;
    case 'contact': return <ContactContent />;
  }
}

/* ---------- A · Projects: the only place project cards appear ---------- */

function ProjectsContent({ onOpenExperiment }: { onOpenExperiment?: (id: ExperimentId) => void }) {
  // Featured first (in curated order), then everything else.
  const featured = featuredProjects(projects.length);
  const ordered: Project[] = [...featured, ...projects.filter((p) => !featured.includes(p))];
  return (
    <>
      <ul className="st-projects">
        {ordered.map((p) => (
          <li key={p.slug}>
            <Link to={`/work/${p.slug}`} className="st-project">
              <span className="st-project-title">{p.title} <Arrow /></span>
              <span className="st-project-meta">{p.categories.map((c) => categoryLabels[c]).join(' · ')} · <span className="st-status">{p.status}</span></span>
            </Link>
          </li>
        ))}
      </ul>
      <h4 className="st-sub">Interactive prototypes</h4>
      <ul className="st-exps">
        {experiments.map((e) => (
          <li key={e.id} className="st-exp">
            <div>
              <p className="st-exp-title">{e.title} <span className="st-exp-tag mono">{e.project}</span></p>
              <p className="st-exp-blurb">{e.blurb}</p>
            </div>
            <div className="st-exp-actions">
              {onOpenExperiment ? (
                <>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenExperiment(e.id)}>Open workspace <Arrow /></button>
                  <Link to={e.route} className="text-link st-small">Full page</Link>
                </>
              ) : (
                <Link to={e.route} className="btn btn-ghost btn-sm">Open experiment <Arrow /></Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link to="/work" className="btn btn-ghost btn-sm st-primary">Browse the work index <Arrow /></Link>
    </>
  );
}

/* ---------- B · Experience: professional roles + student teams ---------- */

type ExpFilter = 'all' | 'work' | 'team';
const expFilters: { id: ExpFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Professional' },
  { id: 'team', label: 'Student teams' },
];

function ExperienceContent() {
  const [filter, setFilter] = useState<ExpFilter>('all');
  const entries = timeline.filter((t) => t.kind !== 'education' && (filter === 'all' || t.kind === filter));
  return (
    <>
      <div className="st-filters" role="group" aria-label="Filter experience">
        {expFilters.map((f) => (
          <button key={f.id} type="button" className={`chip chip-sm ${filter === f.id ? 'is-on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <ol className="st-timeline" aria-live="polite">
        {entries.map((t) => (
          <li key={t.org + t.title}>
            <p className="st-tl-kind mono">{t.kind === 'work' ? 'Professional' : 'Student team'}</p>
            <p className="st-tl-title">{t.title}</p>
            <p className="st-tl-org">{t.org}{isProvided(t.period) ? ` · ${t.period}` : ''}</p>
            <p className="st-tl-desc">{t.description}</p>
            {t.project && <Link to={`/work/${t.project}`} className="text-link st-small">Related case study <Arrow /></Link>}
          </li>
        ))}
      </ol>
      <Link to="/about#experience" className="btn btn-ghost btn-sm st-primary">Full timeline on About <Arrow /></Link>
    </>
  );
}

/* ---------- C · Skills: selectable technology categories ---------- */

function SkillsContent() {
  const [active, setActive] = useState<SkillCategory['id']>(skillCategories[0].id);
  const uid = useId();
  const cat = skillCategories.find((c) => c.id === active)!;
  return (
    <>
      <div className="st-tabs" role="tablist" aria-label="Skill categories">
        {skillCategories.map((c) => (
          <button
            key={c.id}
            id={`${uid}-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            aria-controls={`${uid}-panel`}
            tabIndex={active === c.id ? 0 : -1}
            className={`chip chip-sm ${active === c.id ? 'is-on' : ''}`}
            onClick={() => setActive(c.id)}
            onKeyDown={(e) => {
              const i = skillCategories.findIndex((x) => x.id === active);
              const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const next = skillCategories[(i + d + skillCategories.length) % skillCategories.length];
              setActive(next.id);
              document.getElementById(`${uid}-tab-${next.id}`)?.focus();
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cat.id}`} className="st-skill">
        <p className="st-intro">{cat.summary}</p>
        <ul className="tags">{cat.items.map((i) => <li key={i} className="tag">{i}</li>)}</ul>
        {cat.id === 'ai' && (
          <>
            <h4 className="st-sub">Hands-on · Toy network</h4>
            <NetworkToy />
          </>
        )}
      </div>
    </>
  );
}

/* ---------- D · Education ---------- */

function EducationContent() {
  return (
    <>
      <div className="st-edu">
        <p className="st-tl-kind mono">{education.school}</p>
        <p className="st-edu-program">{education.program}</p>
        {isProvided(education.period) && <p className="st-tl-org">{education.period}</p>}
        <p className="st-tl-desc">{education.summary}</p>
      </div>
      <h4 className="st-sub">Coursework</h4>
      {education.coursework.length > 0
        ? <ul className="tags">{education.coursework.map((c) => <li key={c} className="tag">{c}</li>)}</ul>
        : <p className="st-note">Relevant McMaster coursework will be listed here.</p>}
      <h4 className="st-sub">Achievements</h4>
      {education.achievements.length > 0
        ? <ul className="st-list">{education.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
        : <p className="st-note">Academic achievements will be listed here.</p>}
    </>
  );
}

/* ---------- E · Contact ---------- */

function ContactContent() {
  const hasEmail = isProvided(site.email);
  const hasResume = isProvided(site.resumeUrl);
  return (
    <>
      <p className="st-intro">I’m {site.name} — a software engineer and electrical &amp; biomedical engineering student at McMaster. I like building things where software meets the physical world.</p>
      <div className="st-links">
        {hasEmail && <a className="btn btn-primary btn-sm" href={`mailto:${site.email}`}>Email me <Arrow /></a>}
        {site.socials.map((s) => <a key={s.href} className="btn btn-ghost btn-sm" href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}
        {hasResume && <a className="btn btn-ghost btn-sm" href={site.resumeUrl as string} download>Download résumé</a>}
        <Link className="btn btn-ghost btn-sm" to="/about">About me</Link>
      </div>
      {(!hasEmail || !hasResume) && (
        <p className="st-note">
          {!hasEmail && site.socials.length === 0 ? 'Direct contact links and the résumé are being added.' : !hasResume ? 'The résumé download is being added.' : ''}
          {' '}The <Link to="/#contact" className="inline-link">contact section</Link> on the homepage is the best place to start for now.
        </p>
      )}
    </>
  );
}
