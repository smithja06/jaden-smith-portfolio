import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { experienceGroupLabels, experienceGroupOrder, experienceInGroup } from '../content/experience';
import { stationPath } from '../lab3d/config/stations';
import { Arrow } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { usePageTitle } from '../hooks/usePageTitle';

export default function About() {
  usePageTitle('About', `About ${site.name}: Electrical & Biomedical Engineering student working across software, AI and embedded systems.`);
  return (
    <div className="page container about">
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1 className="h-section">Software, AI and hardware — built for real people.</h1>
      </header>

      <div className="about-intro">
        <div className="prose">
          {site.bio.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="about-actions">
          {isProvided(site.resumeUrl) && <a href={site.resumeUrl} className="btn btn-primary" download={site.resumeFilename}>Download résumé</a>}
          <Link to="/#contact" className="btn btn-ghost">Get in touch <Arrow /></Link>
        </div>
      </div>

      <Reveal as="section" className="about-block" aria-labelledby="areas">
        <h2 id="areas" className="h-sub block-title">What I work on</h2>
        <div className="areas">
          {site.focusAreas.map((a) => (
            <div key={a.title} className="area">
              <h3>{a.title}</h3>
              <p className="secondary">{a.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="about-block" aria-labelledby="exp">
        <h2 id="exp" className="h-sub block-title">Timeline</h2>
        {experienceGroupOrder.map((g) => (
          <div key={g} className="about-tl-group">
            <h3 className="mono muted tg-title">{experienceGroupLabels[g]}</h3>
            <ol className="timeline">
              {experienceInGroup(g).map((t) => (
                <li key={t.id} className="tl-item">
                  <div className="tl-side mono muted">{isProvided(t.dates) ? t.dates : ''}</div>
                  <div>
                    <h4 className="tl-title">{t.title}</h4>
                    {isProvided(t.org) && <p className="tl-org">{t.org}</p>}
                    <p className="secondary">{t.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <Link to={stationPath('experience')} className="text-link">Full experience, with details <Arrow /></Link>
      </Reveal>
    </div>
  );
}
