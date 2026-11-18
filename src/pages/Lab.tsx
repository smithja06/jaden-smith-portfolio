import { Link } from 'react-router-dom';
import { SignalPreview } from '../lab/SignalPreview';
import { Arrow } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

const previewLevels = [0, 1, 1, 0, 1, 2, 3, 1, 1, 3, 2, 1, 0, 1, 1, 0];

function MatrixPreview() {
  return (
    <div className="mini-matrix" aria-hidden="true">
      {previewLevels.map((l, i) => <span key={i} style={{ ['--duty' as string]: l / 3 }} />)}
    </div>
  );
}

export default function Lab() {
  usePageTitle('Lab', 'Interactive browser experiments in sensing, signals and output mapping.');
  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow">Lab</p>
        <h1 className="h-section">Curiosity, in working form.</h1>
        <p className="lead">Small, honest experiments that run entirely in your browser. No backend, no connected sensors, no uploads — just the ideas behind the projects, made touchable.</p>
      </header>

      <div className="lab-grid">
        <Link to="/lab/vision-matrix" className="lab-card glass">
          <div className="lab-card-visual"><MatrixPreview /></div>
          <div className="lab-card-body">
            <span className="mono muted">Experiment A · related to MED-T</span>
            <h2 className="h-sub">Vision → 4×4 Matrix</h2>
            <p className="secondary">Reduce a brightness field to sixteen output levels. Switch between threshold and four-level quantization, smooth the input, ramp the output, or try your own image.</p>
            <span className="project-cta">Open experiment <Arrow /></span>
          </div>
        </Link>
        <Link to="/lab/signal-playground" className="lab-card glass">
          <div className="lab-card-visual"><SignalPreview /></div>
          <div className="lab-card-body">
            <span className="mono muted">Experiment B · related to sensing work</span>
            <h2 className="h-sub">Signal Playground</h2>
            <p className="secondary">Generate a noisy waveform, filter it with a moving average, and compare raw vs smoothed using numbers computed from the data itself.</p>
            <span className="project-cta">Open experiment <Arrow /></span>
          </div>
        </Link>
      </div>

      <section className="lab-ideas" aria-labelledby="ideas">
        <h2 id="ideas" className="h-sub">On the bench</h2>
        <p className="secondary">Ideas only — not built yet, so there’s nothing to launch: a posture-angle visualizer for IMU data, and an EMG envelope explorer.</p>
      </section>
    </div>
  );
}
