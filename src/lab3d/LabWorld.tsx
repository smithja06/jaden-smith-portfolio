import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type StationId } from './config/stations';
import { useLabNavigation } from './hooks/useLabNavigation';
import { StationNavigation } from './ui/StationNavigation';
import { LabToolbar } from './ui/LabToolbar';
import { LabFallback } from './ui/LabFallback';
import { StationPanel } from './ui/StationPanel';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { usePageTitle } from '../hooks/usePageTitle';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './lab3d.css';

// three.js, R3F and drei live only in this chunk.
const LabScene = lazy(() => import('./LabScene'));

/** Camera flight time before the station panel appears (matches LabCameraController). */
const FLY_MS = 950;

function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export default function LabWorld() {
  usePageTitle('Lab', 'An explorable 3D engineering lab: experience, projects, skills, education and contact arranged around a central hub.');
  const nav = useLabNavigation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const [webgl] = useState(detectWebGL);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState<StationId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [flying, setFlying] = useState<StationId | null>(null);
  const [flyingHome, setFlyingHome] = useState(false);
  const [panel, setPanel] = useState<StationId | null>(null);
  const [highQuality, setHighQuality] = useState(() =>
    window.matchMedia('(min-width: 900px) and (pointer: fine)').matches,
  );
  const timer = useRef<number>();

  /** Fly to the station, then show its intro panel (title, highlights, one way in). */
  const open = useCallback((id: StationId) => {
    window.clearTimeout(timer.current);
    setFlyingHome(false);
    setPanel(null);
    setFlying(id);
    timer.current = window.setTimeout(() => setPanel(id), reduced ? 0 : FLY_MS * 0.8);
  }, [reduced]);

  /** Fly to the hub, then open the homepage — same feel as a station. */
  const goHome = useCallback(() => {
    window.clearTimeout(timer.current);
    setFlying(null);
    setPanel(null);
    setFlyingHome(true);
    timer.current = window.setTimeout(() => navigate('/'), reduced ? 0 : FLY_MS);
  }, [navigate, reduced]);

  const reset = useCallback(() => {
    window.clearTimeout(timer.current);
    setFlying(null);
    setPanel(null);
    setFlyingHome(false);
    setZoom(1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') reset(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); window.clearTimeout(timer.current); };
  }, [reset]);

  // Never leave a pointer cursor behind when leaving the page.
  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  if (nav.view === 'list') return <LabFallback reason="list" onEnterWorld={() => nav.setView('world')} />;
  if (!webgl) return <LabFallback reason="no-webgl" />;
  if (failed) return <LabFallback reason="error" />;

  return (
    <div className="lab3d">
      <h1 className="sr-only">Cobalt Lab — interactive 3D engineering lab</h1>
      <p className="sr-only" id="lab3d-desc">
        A miniature engineering facility seen from above. A glowing central hub sits in the middle of a dark grid floor,
        connected by thin light paths to six stations: a portrait frame for about, server racks with a holographic career timeline for experience,
        a gallery of floating displays for projects, a robotic workstation for skills, a research desk for education,
        and a communication dish for contact. Choosing a station flies there and shows a short introduction with a link to its full page.
      </p>

      <div className="lab3d-stage" aria-describedby="lab3d-desc">
        <ErrorBoundary onError={() => setFailed(true)} fallback={null}>
          <Suspense fallback={<div className="lab3d-loading" role="status"><span className="live-dot" aria-hidden="true" /> Building the lab…</div>}>
            <LabScene
              selected={flying}
              hovered={hovered}
              onHover={setHovered}
              onSelect={open}
              onHome={goHome}
              hubSelected={flyingHome}
              reduced={reduced}
              highQuality={highQuality}
              zoom={zoom}
              isDesktop={isDesktop}
              paused={false}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <LabToolbar
        atOverview={!flying && !flyingHome && zoom === 1}
        onOverview={reset}
        zoom={zoom}
        onZoom={setZoom}
        highQuality={highQuality}
        onToggleQuality={() => setHighQuality((q) => !q)}
        onListView={() => nav.setView('list')}
      />

      <StationNavigation selected={flying} hovered={hovered} onSelect={open} onHover={setHovered} />
      {panel && <StationPanel id={panel} onClose={() => { const id = panel; reset(); document.getElementById(`lab-station-${id}`)?.focus(); }} />}
    </div>
  );
}
