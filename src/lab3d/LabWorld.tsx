import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { stationById, type StationId } from './config/stations';
import { useLabNavigation } from './hooks/useLabNavigation';
import { StationNavigation } from './ui/StationNavigation';
import { StationPanel } from './ui/StationPanel';
import { LabToolbar } from './ui/LabToolbar';
import { LabFallback } from './ui/LabFallback';
import { ExperimentWorkspace } from './ui/ExperimentWorkspace';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { usePageTitle } from '../hooks/usePageTitle';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './lab3d.css';

// three.js, R3F and drei live only in this chunk.
const LabScene = lazy(() => import('./LabScene'));

function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export default function LabWorld() {
  usePageTitle('Lab', 'An explorable 3D engineering lab: projects, experience, skills, education and contact arranged around a central hub.');
  const nav = useLabNavigation();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const [webgl] = useState(detectWebGL);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState<StationId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [highQuality, setHighQuality] = useState(() =>
    window.matchMedia('(min-width: 900px) and (pointer: fine)').matches,
  );

  const station = stationById(nav.selected);

  const close = useCallback(() => {
    const prev = nav.selected;
    nav.reset();
    // Return focus to the station's list button so keyboard users keep their place.
    if (prev) requestAnimationFrame(() => document.getElementById(`lab-station-${prev}`)?.focus({ preventScroll: true }));
  }, [nav]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (nav.experiment) nav.closeExperiment();
      else if (nav.selected) close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [nav, close]);

  // Never leave a pointer cursor behind when leaving the page.
  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  if (nav.view === 'list') return <LabFallback reason="list" onEnterWorld={() => nav.setView('world')} />;
  if (!webgl) return <LabFallback reason="no-webgl" />;
  if (failed) return <LabFallback reason="error" />;

  return (
    <div className={`lab3d ${station ? 'has-panel' : ''}`}>
      <h1 className="sr-only">Cobalt Lab — interactive 3D engineering lab</h1>
      <p className="sr-only" id="lab3d-desc">
        A miniature engineering facility seen from above. A glowing central hub sits in the middle of a dark grid floor,
        connected by thin light paths to five stations: a projects gallery of floating displays, server racks with a
        holographic career timeline for experience, a robotic workstation for skills, a research desk for education,
        and a communication dish for contact. Use the station list to open each one.
      </p>

      <div className="lab3d-stage" aria-describedby="lab3d-desc">
        <ErrorBoundary onError={() => setFailed(true)} fallback={null}>
          <Suspense fallback={<div className="lab3d-loading" role="status"><span className="live-dot" aria-hidden="true" /> Building the lab…</div>}>
            <LabScene
              selected={nav.selected}
              hovered={hovered}
              onHover={setHovered}
              onSelect={nav.select}
              onReset={close}
              reduced={reduced}
              highQuality={highQuality}
              zoom={zoom}
              isDesktop={isDesktop}
              paused={!!nav.experiment}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <LabToolbar
        atOverview={!station && zoom === 1}
        onOverview={() => { setZoom(1); close(); }}
        zoom={zoom}
        onZoom={setZoom}
        highQuality={highQuality}
        onToggleQuality={() => setHighQuality((q) => !q)}
        onListView={() => nav.setView('list')}
      />

      <StationNavigation selected={nav.selected} hovered={hovered} onSelect={nav.select} onHover={setHovered} />

      {station && <StationPanel station={station} onClose={close} onOpenExperiment={nav.openExperiment} />}
      {nav.experiment && <ExperimentWorkspace id={nav.experiment} onClose={nav.closeExperiment} />}
    </div>
  );
}
