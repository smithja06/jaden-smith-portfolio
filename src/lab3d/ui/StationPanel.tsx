import { useEffect, useRef } from 'react';
import type { ExperimentId, StationDef } from '../config/stations';
import { StationContent } from './StationContent';

interface Props {
  station: StationDef;
  onClose: () => void;
  onOpenExperiment: (id: ExperimentId) => void;
}

/** Liquid-glass panel layered over the canvas (side panel on desktop, bottom sheet on mobile). */
export function StationPanel({ station, onClose, onOpenExperiment }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Move focus into the panel whenever a new station opens.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    const raf = requestAnimationFrame(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; });
    return () => cancelAnimationFrame(raf);
  }, [station.id]);

  return (
    <aside key={station.id} className="lab3d-panel glass" aria-labelledby="lab3d-panel-title">
      <div className="lab3d-panel-head">
        <p className="lab3d-panel-kicker mono">Station {station.letter} · {station.category}</p>
        <button type="button" className="lab3d-close" onClick={onClose} aria-label="Close station and return to overview">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div ref={bodyRef} className="lab3d-panel-body">
        <h2 id="lab3d-panel-title" ref={headingRef} tabIndex={-1} className="lab3d-panel-title">{station.title}</h2>
        <p className="lab3d-panel-summary">{station.summary}</p>
        <StationContent id={station.id} onOpenExperiment={onOpenExperiment} />
      </div>
      <div className="lab3d-panel-foot">
        <button type="button" className="text-link lab3d-back" onClick={onClose}>← Back to overview <span className="mono muted">Esc</span></button>
      </div>
    </aside>
  );
}
