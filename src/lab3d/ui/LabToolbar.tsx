import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../components/Icons';

interface Props {
  atOverview: boolean;
  onOverview: () => void;
  zoom: number;
  onZoom: (z: number) => void;
  highQuality: boolean;
  onToggleQuality: () => void;
  onListView: () => void;
}

export const ZOOM_MIN = 0.75;
export const ZOOM_MAX = 1.3;

export function LabToolbar({ atOverview, onOverview, zoom, onZoom, highQuality, onToggleQuality, onListView }: Props) {
  return (
    <div className="lab3d-toolbar glass" role="toolbar" aria-label="Lab controls">
      <Link to="/" className="lab3d-tool lab3d-tool-wide"><ArrowLeft /> Portfolio</Link>
      <span className="lab3d-tool-sep" aria-hidden="true" />
      <button type="button" className="lab3d-tool" onClick={onOverview} disabled={atOverview} aria-label="Return to overview">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 7.2 8 2.8l5.5 4.4V13a.5.5 0 0 1-.5.5H9.5V10h-3v3.5H3a.5.5 0 0 1-.5-.5V7.2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        <span className="lab3d-tool-label">Overview</span>
      </button>
      <button type="button" className="lab3d-tool" onClick={() => onZoom(Math.max(ZOOM_MIN, +(zoom - 0.15).toFixed(2)))} disabled={zoom <= ZOOM_MIN} aria-label="Zoom in">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <button type="button" className="lab3d-tool" onClick={() => onZoom(Math.min(ZOOM_MAX, +(zoom + 0.15).toFixed(2)))} disabled={zoom >= ZOOM_MAX} aria-label="Zoom out">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <button type="button" className="lab3d-tool" onClick={onToggleQuality} aria-pressed={highQuality} title="Toggle glow and soft shadows">
        <span className="lab3d-tool-label">Effects: {highQuality ? 'High' : 'Low'}</span>
        <span className="lab3d-tool-label-short" aria-hidden="true">FX</span>
      </button>
      <button type="button" className="lab3d-tool" onClick={onListView}>
        <span className="lab3d-tool-label">List view</span>
        <span className="lab3d-tool-label-short" aria-hidden="true">List</span>
      </button>
    </div>
  );
}
