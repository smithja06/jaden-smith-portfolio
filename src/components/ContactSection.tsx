import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { Arrow } from './Icons';
import { Reveal } from './Reveal';

export function ContactSection() {
  const hasEmail = isProvided(site.email);
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact-band" aria-hidden="true" />
      <Reveal className="container contact-inner">
        <p className="eyebrow">04 / Contact</p>
        <h2 id="contact-title" className="contact-title">
          Have something interesting in mind?<br />
          <span className="text-gradient">Let’s build something worth exploring.</span>
        </h2>
        <div className="contact-actions">
          {hasEmail ? (
            <a className="btn btn-primary" href={`mailto:${site.email}`}>Email me <Arrow /></a>
          ) : (
            <Link className="btn btn-ghost" to="/about">Read more about me <Arrow /></Link>
          )}
          {site.socials.map((s) => (
            <a key={s.href} className="btn btn-ghost" href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
          ))}
          {isProvided(site.resumeUrl) && <a className="text-link" href={site.resumeUrl} download>Download résumé</a>}
        </div>
        {!hasEmail && import.meta.env.DEV && (
          <p className="note" style={{ marginTop: 24 }}><b>Dev note:</b> set <code>email</code> and <code>socials</code> in <code>src/content/site.ts</code> to enable contact actions. This note is hidden in production.</p>
        )}
      </Reveal>
    </section>
  );
}
