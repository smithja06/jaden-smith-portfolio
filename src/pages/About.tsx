import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { approach, practiceAreas, timeline } from '../content/experience';
import { skillCategories } from '../content/skills';
import { Arrow } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { usePageTitle } from '../hooks/usePageTitle';

const kindLabel = { education: 'Education', work: 'Industry', team: 'Team project' } as const;

export default function About() {
  usePageTitle('About', `About ${site.name}: engineering student and software developer working across AI, software and hardware.`);
  return (
    <div className="page container about">
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1 className="h-section">I like building things that work beyond the screen.</h1>
      </header>

      <div className="about-intro">
        <div className="prose">
          <p>I’m {site.name} — a software engineer and electrical &amp; biomedical engineering student at McMaster University (iBioMed).</p>
          <p>I’m drawn to problems where software has to meet the physical world: a camera frame that has to become something a person can feel, a noisy sensor stream that has to become a decision, a developer workflow that has to get out of the way. I enjoy both halves — writing careful, production-minded code, and wiring up the prototype to see if the idea survives contact with reality.</p>
          <p>I also care about how things feel to use. That’s why some of my work, like the brthday collection interface, is unapologetically about interaction and craft.</p>
        </div>
        <div className="about-actions">
          {isProvided(site.resumeUrl) && <a href={site.resumeUrl} className="btn btn-primary" download>Download résumé</a>}
          <Link to="/#contact" className="btn btn-ghost">Get in touch <Arrow /></Link>
        </div>
      </div>

      <Reveal as="section" id="experience" className="about-block" aria-labelledby="exp">
        <h2 id="exp" className="h-sub block-title">Experience &amp; education</h2>
        <ol className="timeline">
          {timeline.map((t) => (
            <li key={t.org + t.title} className="tl-item">
              <div className="tl-side mono muted">{isProvided(t.period) ? t.period : kindLabel[t.kind]}</div>
              <div>
                <h3 className="tl-title">{t.title}</h3>
                <p className="tl-org">{t.org}</p>
                <p className="secondary">{t.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal as="section" className="about-block" aria-labelledby="areas">
        <h2 id="areas" className="h-sub block-title">Areas of practice</h2>
        <div className="areas">
          {practiceAreas.map((a) => (
            <div key={a.title} className="area">
              <h3>{a.title}</h3>
              <p className="secondary">{a.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="about-block" aria-labelledby="tools">
        <h2 id="tools" className="h-sub block-title">Tools, by what they’re for</h2>
        <div className="toolgroups">
          {skillCategories.map((g) => (
            <div key={g.id}>
              <h3 className="mono muted tg-title">{g.label}</h3>
              <ul className="tags">{g.items.map((i) => <li key={i} className="tag">{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="about-block" aria-labelledby="approach">
        <h2 id="approach" className="h-sub block-title">How I approach problems</h2>
        <ol className="approach">
          {approach.map((a, i) => (
            <li key={a.step}>
              <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
              <h3>{a.step}</h3>
              <p className="secondary">{a.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
