import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site } from '../content/site';
import { isProvided } from '../content/types';

const links = [
  { label: 'Work', to: '/work', match: (p: string) => p.startsWith('/work') },
  { label: 'Lab', to: '/lab', match: (p: string) => p.startsWith('/lab') },
  { label: 'About', to: '/about', match: (p: string) => p.startsWith('/about') },
  { label: 'Contact', to: '/#contact', match: (_p: string, h: string) => h === '#contact' },
];

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
  const isActive = (l: (typeof links)[number]) => l.match(pathname, pathname === '/' ? hash : '');

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="nav glass" aria-label="Primary">
        <Link to="/" className="nav-brand" aria-label={`${site.name} — home`}>
          <span className="nav-mono" aria-hidden="true">{site.initials}</span>
          <span className="nav-name">{site.name}</span>
        </Link>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className={`nav-link ${isActive(l) ? 'is-active' : ''}`} aria-current={isActive(l) ? 'page' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-cta">
          {hasResume ? (
            <a className="btn btn-ghost btn-sm" href={site.resumeUrl as string} download>Résumé</a>
          ) : (
            <Link className="btn btn-ghost btn-sm" to="/#contact">Let’s talk</Link>
          )}
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
              <Link to={l.to} className={isActive(l) ? 'is-active' : ''} aria-current={isActive(l) ? 'page' : undefined}>{l.label}</Link>
            </li>
          ))}
        </ul>
        {hasResume && <a className="btn btn-primary" href={site.resumeUrl as string} download>Download résumé</a>}
      </div>
    </header>
  );
}
