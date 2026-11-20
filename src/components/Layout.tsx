import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { Nav } from './Nav';
import { site } from '../content/site';
import { isProvided } from '../content/types';
import { recallScroll, rememberScroll, type ScrollRestoreState } from '../hooks/scrollMemory';

/** Scrolls to `y` once the page is tall enough (lazy content may still be arriving). */
function scrollWhenReady(y: number): () => void {
  let tries = 0;
  let raf = 0;
  const tick = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max >= y - 1 || tries++ > 60) window.scrollTo(0, Math.min(y, Math.max(0, max)));
    else raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Scroll and focus on route change: #hash targets are scrolled into view;
 * back / forward and links carrying `restoreScroll` return to the remembered
 * position; everything else starts at the top.
 */
function useRouteFocus() {
  const location = useLocation();
  const { pathname, hash, key } = location;
  const navType = useNavigationType();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);
  const keyRef = useRef(key);
  const pathRef = useRef(pathname);

  // Remember where each history entry was scrolled to.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const onScroll = () => rememberScroll(keyRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    // Same page, new entry (e.g. a search updating the query string): keep the position.
    const samePage = pathRef.current === pathname;
    keyRef.current = key;
    pathRef.current = pathname;
    if (samePage) rememberScroll(key, window.scrollY);
  }, [key, pathname]);

  useEffect(() => {
    const requested = (location.state as ScrollRestoreState | null)?.restoreScroll;
    const restore = typeof requested === 'number' ? requested : navType === 'POP' ? recallScroll(key) : undefined;
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
    const wasFirst = first.current;
    first.current = false;
    let cancel: (() => void) | undefined;
    if (restore !== undefined && restore > 0) cancel = scrollWhenReady(restore);
    else window.scrollTo(0, 0);
    if (!wasFirst) mainRef.current?.focus({ preventScroll: true });
    return cancel;
    // Runs per page (path or hash), not per query-string change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <li><Link to="/lab/projects">Projects</Link></li>
            <li><Link to="/lab">Lab</Link></li>
            <li><Link to="/about">About</Link></li>
            {site.socials.filter((s) => isProvided(s.href)).map((s) => (
              <li key={s.label}><a href={s.href as string} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </nav>
        <p className="muted footer-copy">© {new Date().getFullYear()} {site.name}. Built with intention.</p>
      </div>
    </footer>
  );
}
