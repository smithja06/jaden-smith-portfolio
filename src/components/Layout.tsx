import { Suspense, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Nav } from './Nav';
import { site } from '../content/site';

/** Resets scroll and focus on route change; scrolls to #hash targets when present. */
function useRouteFocus() {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target exists after a route change.
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          el.focus({ preventScroll: true });
        } else if (tries++ < 20) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return;
    }
    window.scrollTo(0, 0);
    if (first.current) { first.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return mainRef;
}

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRouteFocus();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="atmosphere" aria-hidden="true" />
      <Nav />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <div key={pathname} className="route-fade">
          <Suspense fallback={<div className="page container" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-id">
          <span className="nav-mono" aria-hidden="true">{site.initials}</span>
          <div>
            <p className="footer-name">{site.name}</p>
            <p className="muted">{site.descriptor}</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/lab">Lab</Link></li>
            <li><Link to="/about">About</Link></li>
            {site.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </nav>
        <p className="muted footer-copy">© {new Date().getFullYear()} {site.name}. Built with intention.</p>
      </div>
    </footer>
  );
}
