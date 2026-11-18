import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { featuredProjects } from '../content/projects';
import { timeline } from '../content/experience';
import { SignalField } from '../components/SignalField';
import { ProjectCard } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow } from '../components/Icons';
import { ContactSection } from '../components/ContactSection';
import { usePageTitle } from '../hooks/usePageTitle';
import { SignalPreview } from '../lab/SignalPreview';

const VisionMatrixDemo = lazy(() => import('../lab/VisionMatrixDemo').then((m) => ({ default: m.VisionMatrixDemo })));

export default function Home() {
  usePageTitle();
  const work = featuredProjects(4);
  const [featured, ...rest] = work;

  return (
    <>
      {/* Hero */}
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-in" style={{ animationDelay: '0ms' }}><span className="dot" aria-hidden="true" />{site.hero.eyebrow}</p>
          <h1 id="hero-title" className="h-display hero-in" style={{ animationDelay: '80ms' }}>
            {site.hero.headlineLead} <span className="text-gradient">{site.hero.headlineEmphasis}</span>
          </h1>
          <p className="lead hero-in" style={{ animationDelay: '180ms' }}>{site.hero.description}</p>
          <div className="hero-ctas hero-in" style={{ animationDelay: '260ms' }}>
            <Link to="/#work" className="btn btn-primary">Explore selected work <Arrow /></Link>
            <Link to="/lab" className="btn btn-ghost">Enter the lab</Link>
            {isProvided(site.resumeUrl) && <a href={site.resumeUrl} className="text-link" download>Résumé (PDF)</a>}
          </div>
          <p className="hero-affil mono hero-in" style={{ animationDelay: '340ms' }}>{site.affiliationLine}</p>
        </div>
        <div className="hero-visual hero-in" style={{ animationDelay: '200ms' }}>
          <ErrorBoundary fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}>
            <SignalField />
          </ErrorBoundary>
        </div>
      </section>

      {/* Specialty strip */}
      <div className="container">
        <ul className="strip" aria-label="Disciplines">
          <li><span className="mono muted">A</span>Software &amp; AI</li>
          <li><span className="mono muted">B</span>Embedded Systems</li>
          <li><span className="mono muted">C</span>Human-Centered Products</li>
        </ul>
      </div>

      {/* Selected work */}
      <section id="work" className="section container" aria-labelledby="work-title" tabIndex={-1}>
        <Reveal className="section-head">
          <p className="eyebrow">01 / Selected work</p>
          <h2 id="work-title" className="h-section">Built to solve real problems.</h2>
          <p className="lead">Prototypes and professional work across sensing, software, and the people who use them.</p>
        </Reveal>
        <div className="bento">
          {featured && <Reveal className="bento-featured"><ProjectCard project={featured} variant="featured" /></Reveal>}
          {rest.map((p, i) => (
            <Reveal key={p.slug} className={`bento-item bento-${i}`} delay={i * 60}><ProjectCard project={p} /></Reveal>
          ))}
        </div>
        <div className="section-foot">
          <Link to="/work" className="text-link">See all work <Arrow /></Link>
        </div>
      </section>

      {/* Lab */}
      <section id="lab" className="section container lab-section" aria-labelledby="lab-title">
        <div className="lab-split">
          <Reveal className="lab-copy">
            <p className="eyebrow">02 / Interactive lab</p>
            <h2 id="lab-title" className="h-section">Curiosity, in working form.</h2>
            <p className="lead">Small experiments in sensing, signals, interfaces, and intelligent systems. Change a parameter. See what happens.</p>
            <p className="secondary">This console reduces a brightness field to a 4×4 grid of output levels — the core idea behind the MED-T prototype, rebuilt as a simplified browser model.</p>
            <div className="lab-links">
              <Link to="/lab/vision-matrix" className="btn btn-ghost">Open full experiment <Arrow /></Link>
            </div>
            <Link to="/lab/signal-playground" className="lab-next">
              <SignalPreview />
              <span className="lab-next-text">
                <span className="mono muted">Experiment B</span>
                <span className="lab-next-title">Signal Playground <Arrow /></span>
                <span className="muted">Filter a noisy waveform and watch the numbers change.</span>
              </span>
            </Link>
          </Reveal>
          <Reveal className="lab-console" delay={80}>
            <ErrorBoundary>
              <Suspense fallback={<div className="vm-placeholder glass" aria-busy="true" />}>
                <VisionMatrixDemo compact />
              </Suspense>
            </ErrorBoundary>
          </Reveal>
        </div>
      </section>

      {/* About teaser */}
      <section id="about" className="section container" aria-labelledby="about-title">
        <div className="about-split">
          <Reveal className="about-copy">
            <p className="eyebrow">03 / About</p>
            <h2 id="about-title" className="h-section">I like building things that work beyond the screen.</h2>
            <div className="prose">
              <p>I study electrical and biomedical engineering at McMaster, and I’ve worked as an AI/software developer in industry. What ties it together is curiosity about the full loop — from a raw signal or a developer’s frustration, through software, to something a person can actually use.</p>
              <p>Most of my favourite projects sit at that edge: production-quality code on one side, wires and sensors and real bodies on the other.</p>
            </div>
            <Link to="/about" className="text-link">More about me <Arrow /></Link>
          </Reveal>
          <Reveal as="ol" className="timeline-mini" delay={80}>
            {timeline.map((t) => (
              <li key={t.org + t.title}>
                <span className="mono muted">{t.kind === 'education' ? 'Study' : t.kind === 'work' ? 'Work' : 'Team'}</span>
                <span className="tl-title">{t.title}</span>
                <span className="secondary">{t.org}{isProvided(t.period) ? ` · ${t.period}` : ''}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
