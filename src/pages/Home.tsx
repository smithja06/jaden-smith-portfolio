import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { stations, stationPath } from '../lab3d/config/stations';
import { sectionBodies, sectionCount } from '../components/sections/SiteSections';
import { SignalField } from '../components/SignalField';
import { Reveal } from '../components/Reveal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Home() {
  usePageTitle();

  return (
    <>
      {/* Hero: name, role line, links — with the About card overlapping the visual */}
      <section className="hero2 container" aria-labelledby="hero-title">
        <div className="hero2-copy">
          <p className="eyebrow hero-in" style={{ animationDelay: '0ms' }}><span className="dot" aria-hidden="true" />{site.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero2-name hero-in" style={{ animationDelay: '80ms' }}>
            {(() => {
              const [first, ...rest] = site.name.split(' ');
              return <><span>{first}</span><span className="hero2-name-last">{rest.join(' ')}</span></>;
            })()}
          </h1>
          <p className="hero2-desc hero-in" style={{ animationDelay: '180ms' }}>{site.hero.description}</p>
          <div className="hero2-links hero-in" style={{ animationDelay: '260ms' }}>
            <Link to="/#projects" className="hero2-link is-primary">Selected work <span aria-hidden="true">↓</span></Link>
            {isProvided(site.resumeUrl) && <a href={site.resumeUrl} className="hero2-link" download={site.resumeFilename}>Résumé (PDF)</a>}
            {isProvided(site.email) && <a href={`mailto:${site.email}`} className="hero2-link">Email</a>}
            <Link to="/about" className="hero2-link">About</Link>
          </div>
        </div>

        <div className="hero2-visual hero-in" style={{ animationDelay: '200ms' }}>
          <ErrorBoundary fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}>
            <SignalField />
          </ErrorBoundary>
        </div>

        <aside className="hero2-about glass hero-in" style={{ animationDelay: '320ms' }} aria-labelledby="about-card-title">
          <picture>
            <source srcSet={site.headshot.webp} type="image/webp" />
            <img className="hero2-photo" src={site.headshot.jpg} alt={site.headshot.alt} width={640} height={800} loading="eager" decoding="async" />
          </picture>
          <div className="hero2-about-text">
            <h2 id="about-card-title" className="hero2-about-label mono">About</h2>
            {site.about.map((para) => <p key={para}>{para}</p>)}
            <Link to="/about" className="text-link hero2-about-more">More about me <Arrow /></Link>
          </div>
        </aside>
      </section>

      {/* One scrolling page: the same five sections as the Lab, in order. */}
      {stations.map((st) => {
        const Body = sectionBodies[st.id];
        const count = sectionCount[st.id];
        return (
          <section
            key={st.id}
            id={st.id}
            className={`home-sec container ${st.id === 'contact' ? 'home-sec-contact' : ''}`}
            aria-labelledby={`home-${st.id}-title`}
            tabIndex={-1}
          >
            {st.id === 'contact' && <div className="contact-band" aria-hidden="true" />}
            <Reveal as="header" className="sec-head">
              <span className="sec-index mono" aria-hidden="true">{st.letter}</span>
              <div className="sec-head-main">
                <h2 id={`home-${st.id}-title`} className="sec-title">{st.title}</h2>
              </div>
              {count && <span className="sec-count mono">{count}</span>}
            </Reveal>
            <Reveal className="sec-body"><Body /></Reveal>
            {st.id !== 'contact' && (
              <div className="sec-body">
                <Link to={stationPath(st.id)} className="sec-more">
                  <span className="mono">[{st.letter}]</span> More in the Lab <Arrow />
                </Link>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
