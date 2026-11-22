import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { homepageCards, homepageExperienceIds } from '../content/featured';
import { getExperience } from '../content/experience';
import { stationPath } from '../lab3d/config/stations';
import { homepageSkills, skillGroups } from '../content/skills';
import { awards, schools } from '../content/education';
import { ContactSection } from '../components/sections/SiteSections';
import { ProjectGridCard } from '../components/content/ProjectGridCard';
import { SignalField } from '../components/SignalField';
import { Reveal } from '../components/Reveal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';
import { homeSections } from '../content/homeSections';

type HomeId = (typeof homeSections)[number]['id'];

function HomeSection({ id, children, className = '', count }: { id: HomeId; children: ReactNode; className?: string; count?: string }) {
  const s = homeSections.find((x) => x.id === id)!;
  return (
    <section id={id} className={`home-sec container ${className}`} aria-labelledby={`home-${id}-title`} tabIndex={-1}>
      <Reveal as="header" className="sec-head">
        <span className="sec-index mono" aria-hidden="true">{s.index}</span>
        <div className="sec-head-main">
          <h2 id={`home-${id}-title`} className="sec-title">{s.title}</h2>
        </div>
        {count && <span className="sec-count mono">{count}</span>}
      </Reveal>
      {children}
    </section>
  );
}

export default function Home() {
  usePageTitle();
  const cards = homepageCards();
  const roles = homepageExperienceIds.map(getExperience).filter((e) => !!e);
  const uni = schools[0];
  const uniAwards = awards.filter((a) => a.school === uni.id && a.kind === 'received');

  return (
    <>
      {/* Hero: name, one statement, one supporting line, two actions. */}
      <section className="hero2 container" aria-labelledby="hero-title">
        <div className="hero2-copy">
          <p className="eyebrow hero-in" style={{ animationDelay: '0ms' }}><span className="dot" aria-hidden="true" />{site.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero2-name hero-in" style={{ animationDelay: '80ms' }}>
            {(() => {
              const [first, ...rest] = site.name.split(' ');
              return <><span>{first}</span><span className="hero2-name-last">{rest.join(' ')}</span></>;
            })()}
          </h1>
          <p className="hero2-statement hero-in" style={{ animationDelay: '160ms' }}>{site.hero.statement}</p>
          <p className="hero2-desc hero-in" style={{ animationDelay: '220ms' }}>{site.hero.description}</p>
          <div className="hero2-actions hero-in" style={{ animationDelay: '280ms' }}>
            <Link to="/#projects" className="btn btn-primary">View projects <span aria-hidden="true">↓</span></Link>
            <Link to="/lab" className="btn btn-ghost">Enter the Lab <Arrow /></Link>
            {isProvided(site.resumeUrl) && (
              <a href={site.resumeUrl} className="hero2-link" download={site.resumeFilename}>Résumé (PDF)</a>
            )}
          </div>
        </div>

        <div className="hero2-visual hero-in" style={{ animationDelay: '200ms' }}>
          <ErrorBoundary fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}>
            <SignalField />
          </ErrorBoundary>
        </div>
      </section>

      {/* About: portrait + a short, specific introduction. */}
      <HomeSection id="about">
        <Reveal className="sec-body home-about">
          <picture className="home-about-photo">
            <source srcSet={site.headshot.webp} type="image/webp" />
            <img src={site.headshot.jpg} alt={site.headshot.alt} width={640} height={800} loading="lazy" decoding="async" />
          </picture>
          <div className="home-about-text">
            {site.about.map((para) => <p key={para}>{para}</p>)}
            <Link to="/about" className="text-link">More about me <Arrow /></Link>
          </div>
        </Reveal>
      </HomeSection>

      {/* Experience: three technical roles only. */}
      <HomeSection id="experience">
        <Reveal className="sec-body">
          <ol className="home-roles">
            {roles.map((e) => (
              <li key={e!.id} className="home-role">
                <div className="home-role-side">
                  {isProvided(e!.dates) && <p className="mono home-role-date">{e!.dates}</p>}
                  {isProvided(e!.org) && <p className="home-role-org">{e!.org}</p>}
                </div>
                <div className="home-role-main">
                  <h3 className="home-role-title">{e!.title}</h3>
                  <p className="home-role-sum">{e!.summary}</p>
                  <Link to={`/experience/${e!.id}`} className="text-link">
                    Details <Arrow /><span className="sr-only">: {e!.title}{isProvided(e!.org) ? `, ${e!.org}` : ''}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ol>
          <Link to={stationPath('experience')} className="home-more">
            All experience, teams and leadership <Arrow />
          </Link>
        </Reveal>
      </HomeSection>

      {/* Featured projects: three flagships, then one way into the archive. */}
      <HomeSection id="projects" count={`${cards.length} selected`}>
        <Reveal className="sec-body">
          <ul className="pgc-grid">
            {cards.map((c) => <ProjectGridCard key={c.key} card={c} />)}
          </ul>
          <Link to={`${stationPath('projects')}`} className="home-more">
            Explore all projects <Arrow />
          </Link>
        </Reveal>
      </HomeSection>

      {/* Skills: one row per capability — number, name, then the technologies. */}
      <HomeSection id="skills" count={`${skillGroups.length} groups`}>
        <Reveal className="sec-body">
          <ol className="home-skills">
            {skillGroups.map((g, i) => (
              <li key={g.id} className="home-skill">
                <span className="home-skill-index mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="home-skill-label">{g.label}</h3>
                <p className="home-skill-list">{(homepageSkills[g.id] ?? g.skills.map((k) => k.name)).join(', ')}</p>
              </li>
            ))}
          </ol>
          <Link to={stationPath('skills')} className="home-more">
            Every skill, with where I’ve used it <Arrow />
          </Link>
        </Reveal>
      </HomeSection>

      {/* Education: the degree first, then its key facts and recognition. */}
      <HomeSection id="education">
        <Reveal className="sec-body home-edu">
          <p className="home-edu-dates mono">{uni.dates}</p>
          <h3 className="home-edu-degree">{uni.credential}</h3>
          <p className="home-edu-school">{uni.program ? `${uni.program} / ` : ''}{uni.institution}, {uni.location}</p>
          <dl className="home-edu-facts">
            {uni.stats.map((m) => (
              <div key={m.label} className="home-edu-fact">
                <dt className="mono">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          {uniAwards.length > 0 && (
            <div className="home-edu-awards">
              <p className="home-edu-label mono">Recognition</p>
              <ul className="sec-dash">
                {uniAwards.map((a) => <li key={a.title}>{a.title}{a.detail ? ` · ${a.detail}` : ''}</li>)}
              </ul>
            </div>
          )}
          <Link to={stationPath('education')} className="home-more">
            Coursework, awards and earlier schooling <Arrow />
          </Link>
        </Reveal>
      </HomeSection>

      <section id="contact" className="home-sec home-sec-contact container" aria-labelledby="home-contact-title" tabIndex={-1}>
        <div className="contact-band" aria-hidden="true" />
        <Reveal as="header" className="sec-head">
          <span className="sec-index mono" aria-hidden="true">06</span>
          <div className="sec-head-main">
            <h2 id="home-contact-title" className="sec-title">Contact</h2>
          </div>
        </Reveal>
        <Reveal className="sec-body"><ContactSection /></Reveal>
      </section>
    </>
  );
}
