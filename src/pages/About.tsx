import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided, type ExperienceEntry } from '../content/types';
import { experienceInGroup } from '../content/experience';
import { projectsByIds } from '../content/projects';
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
function ProgressTimeline({ compact, children }: { compact?: boolean; children: ReactNode }) {
  const ref = useTimelineProgress();
  return (
    <div ref={ref} className={`atl ${compact ? 'atl-compact' : ''}`}>
      <div className="atl-rail" aria-hidden="true"><div className="atl-fill" /></div>
      <ol className="atl-list">{children}</ol>
    </div>
  );
}

/** A compact milestone for supporting roles: date, role · organization, one line. */
function CompactMilestone({ entry: e }: { entry: ExperienceEntry }) {
  const project = projectsByIds(e.projects)[0];
  return (
    <li className="atl-item">
      <span className="atl-node" aria-hidden="true" />
      <p className="atl-date mono">{isProvided(e.dates) ? e.dates : ''}</p>
      <div className="atl-body">
        <h4 className="atl-title">{e.title}{isProvided(e.org) && <span className="atl-org-inline"> · {e.org}</span>}</h4>
        <p className="atl-sum">
          {e.summary}
          {project && <>{' '}<Link to={`/work/${project.id}`} className="inline-link">{project.title.split(' — ')[0]}</Link></>}
        </p>
      </div>
    </li>
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

      <section className="about-section" aria-labelledby="exp">
        <div className="about-section-head">
          <h2 id="exp" className="h-sub about-section-title">Experience</h2>
          <Link to={stationPath('experience')} className="text-link">Full experience, with details <Arrow /></Link>
        </div>

        {/* 01 — the four technical roles, full milestones. */}
        <section className="ah-part" aria-labelledby="ah-pro">
          <h3 id="ah-pro" className="ah-head"><span className="mono ah-num">01</span> Professional &amp; Technical Experience</h3>
          <ProgressTimeline>
            {experienceInGroup('technical').map((t, i) => {
              const current = i === 0 && isProvided(t.dates) && /present/i.test(t.dates);
              return (
                <li key={t.id} className={`atl-item ${current ? 'is-current' : ''}`}>
                  <span className="atl-node" aria-hidden="true" />
                  <p className="atl-date mono">
                    {isProvided(t.dates) ? t.dates : ''}
                    {current && <span className="atl-now">Current</span>}
                  </p>
                  <div className="atl-body">
                    <h4 className="atl-title">{t.title}</h4>
                    {isProvided(t.org) && <p className="atl-org">{t.org}</p>}
                    <p className="atl-sum">{t.summary}</p>
                    <Link to={`/experience/${t.id}`} className="text-link atl-link">
                      Details <Arrow /><span className="sr-only">: {t.title}{isProvided(t.org) ? `, ${t.org}` : ''}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ProgressTimeline>
        </section>

        {/* 02 — leadership, competitions and showcases: its own, more compact timeline. */}
        <section className="ah-part" aria-labelledby="ah-lead">
          <h3 id="ah-lead" className="ah-head"><span className="mono ah-num">02</span> Leadership &amp; Involvement</h3>
          <ProgressTimeline compact>
            {experienceInGroup('leadership').filter((e) => !e.seeAlso).map((e) => <CompactMilestone key={e.id} entry={e} />)}
          </ProgressTimeline>
        </section>

        {/* 03 — other employment: its own compact timeline. */}
        <section className="ah-part" aria-labelledby="ah-other">
          <h3 id="ah-other" className="ah-head"><span className="mono ah-num">03</span> Additional Employment</h3>
          <ProgressTimeline compact>
            {experienceInGroup('other').map((e) => <CompactMilestone key={e.id} entry={e} />)}
          </ProgressTimeline>
        </section>
      </section>
    </div>
  );
}
