import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided, type ExperienceEntry, type Project } from '../content/types';
import { experienceHref, getExperience } from '../content/experience';
import { getProject, projectHref } from '../content/projects';
import { pathMilestones, type Milestone } from '../content/about';
import { stationPath } from '../lab3d/config/stations';
import { SignalField } from '../components/SignalField';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Lights a timeline's rail as it scrolls past the reading line, and marks each
 * milestone active once it's been reached. Each timeline has its own instance,
 * so separate timelines fill independently. Reduced motion shows the finished state.
 */
function useTimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('.atl-item')];
    if (reduced) {
      el.style.setProperty('--p', '1');
      items.forEach((i) => i.classList.add('is-active'));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.62;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty('--p', p.toFixed(4));
      for (const i of items) if (i.getBoundingClientRect().top < line) i.classList.add('is-active');
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);
  return ref;
}

/** One self-contained animated timeline: its own rail, its own progress. */
function ProgressTimeline({ children }: { children: ReactNode }) {
  const ref = useTimelineProgress();
  return (
    <div ref={ref} className="atl">
      <div className="atl-rail" aria-hidden="true"><div className="atl-fill" /></div>
      <ol className="atl-list">{children}</ol>
    </div>
  );
}

/** Short link label: an org's acronym if it has one, e.g. "(BMETT)" → "BMETT". */
const shortOrg = (e: ExperienceEntry) => {
  if (!isProvided(e.org)) return e.title;
  const org = e.org.split(' — ')[0];
  return org.match(/\(([^)]+)\)\s*$/)?.[1] ?? org;
};

/** Where a milestone points: its role pages and projects, by name. */
function MilestoneLinks({ m }: { m: Milestone }) {
  const roles = (m.experience ?? []).map(getExperience).filter((e): e is ExperienceEntry => !!e);
  const work = (m.projects ?? []).map(getProject).filter((p): p is Project => !!p);
  if (!roles.length && !work.length) return null;
  return (
    <p className="atl-links">
      {roles.map((e) => (
        <Link key={e.id} to={experienceHref(e)} className="inline-link">{shortOrg(e)}</Link>
      ))}
      {work.map((p) => (
        <Link key={p.id} to={projectHref(p)} className="inline-link">{p.title.split(' — ')[0]}</Link>
      ))}
    </p>
  );
}

export default function About() {
  usePageTitle('About', `About ${site.name}: Electrical & Biomedical Engineering student working across software, AI and embedded systems.`);
  const clusters = site.focusAreas.map((a) => ({ label: a.label, detail: a.hint }));

  return (
    <div className="page container about">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="eyebrow">About</p>
          <h1 id="about-title" className="h-section">Software, AI and hardware — built for real people.</h1>
          <div className="prose about-bio">
            {site.bio.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="about-actions">
            {isProvided(site.resumeUrl) && <a href={site.resumeUrl} className="btn btn-primary" download={site.resumeFilename}>Download résumé</a>}
            <Link to="/#contact" className="btn btn-ghost">Get in touch <Arrow /></Link>
          </div>
        </div>
        <div className="about-hero-visual">
          <ErrorBoundary fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}>
            <SignalField clusters={clusters} />
          </ErrorBoundary>
        </div>
      </section>

      <Reveal as="section" className="about-section" aria-labelledby="areas">
        <h2 id="areas" className="h-sub about-section-title">What I work on</h2>
        <div className="areas">
          {site.focusAreas.map((a) => (
            <article key={a.title} className="area">
              <span className="area-mark" aria-hidden="true" />
              <h3>{a.title}</h3>
              <p className="secondary">{a.body}</p>
            </article>
          ))}
        </div>
      </Reveal>

      {/* The story in five steps; every detail lives on Experience and Projects. */}
      <section className="about-section" aria-labelledby="path">
        <div className="about-section-head">
          <h2 id="path" className="h-sub about-section-title">Path so far</h2>
          <Link to={stationPath('experience')} className="text-link">Full experience, with details <Arrow /></Link>
        </div>
        <ProgressTimeline>
          {pathMilestones.map((m) => (
            <li key={m.id} className={`atl-item ${m.current ? 'is-current' : ''}`}>
              <span className="atl-node" aria-hidden="true" />
              <p className="atl-date mono">
                {m.date}
                {m.current && <span className="atl-now">Current</span>}
              </p>
              <div className="atl-body">
                <h3 className="atl-title">{m.title}</h3>
                <p className="atl-sum">{m.text}</p>
                <MilestoneLinks m={m} />
              </div>
            </li>
          ))}
        </ProgressTimeline>
      </section>
    </div>
  );
}
