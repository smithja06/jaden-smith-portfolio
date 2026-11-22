import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { stations, stationPath } from '../lab3d/config/stations';

/**
 * 01 About … 06 Contact, in station order. Each opens that section's full
 * page; About opens /about, the same page the homepage's About links to.
 * The 3D Lab itself is the button on the right, not a link here.
 */
const links = stations.map((s) => ({ id: s.id, index: s.letter, label: s.title, to: stationPath(s.id) }));

/** Pages that belong to a section: its own page, plus detail pages under it. */
const owns: Record<string, (path: string) => boolean> = {
  about: (p) => p === '/about',
  experience: (p) => p === '/lab/experience' || p.startsWith('/experience/'),
  projects: (p) => p === '/lab/projects' || p.startsWith('/work/'),
  skills: (p) => p === '/lab/skills',
  education: (p) => p === '/lab/education',
  contact: (p) => p === '/lab/contact',
};

export function Nav() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on navigation.
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('scroll-locked');
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        // Keep focus within button + panel while open.
        const items = [buttonRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hasResume = isProvided(site.resumeUrl);
  const isActive = (l: (typeof links)[number]) => owns[l.id]?.(pathname) ?? false;

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="nav glass" aria-label="Primary">
        <Link to="/" className="nav-brand" aria-label={`${site.name} — home`}>
          <span className="nav-name">{site.name}</span>
          <span className="nav-role mono">{site.role}</span>
        </Link>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className={`nav-link ${isActive(l) ? 'is-active' : ''}`} aria-current={isActive(l) ? 'page' : undefined}>
                <span className="nav-index mono" aria-hidden="true">{l.index}</span>{l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-cta">
          <Link className="btn btn-primary btn-sm nav-lab-cta" to="/lab"><span className="nav-lab-dot" aria-hidden="true" />Enter the Lab</Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </nav>

      <div id="mobile-menu" ref={panelRef} className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className={isActive(l) ? 'is-active' : ''} aria-current={isActive(l) ? 'page' : undefined}>
                <span className="nav-index mono" aria-hidden="true">{l.index}</span>{l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn btn-primary" to="/lab">Enter the Lab</Link>
        {hasResume && <a className="btn btn-ghost" href={site.resumeUrl as string} download={site.resumeFilename}>Download résumé</a>}
      </div>
    </header>
  );
}
