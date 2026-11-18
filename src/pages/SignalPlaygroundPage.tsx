import { Link } from 'react-router-dom';
import { SignalPlayground } from '../lab/SignalPlayground';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow, ArrowLeft } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SignalPlaygroundPage() {
  usePageTitle('Signal Playground', 'Interactive waveform filtering experiment: frequency, amplitude, noise and moving-average smoothing.');
  return (
    <div className="page container">
      <Link to="/lab" className="text-link back-link"><ArrowLeft /> Lab</Link>
      <header className="page-head">
        <p className="eyebrow">Experiment B</p>
        <h1 className="h-section">Signal Playground</h1>
        <p className="lead">Every wearable sensor fights noise. Add some, then try to remove it — and notice when smoothing starts erasing the signal you actually care about.</p>
      </header>
      <ErrorBoundary><SignalPlayground /></ErrorBoundary>
      <div className="exp-notes">
        <div>
          <h2 className="h-sub">How it works</h2>
          <p className="secondary">A sine wave is generated over a 240-sample window, and Gaussian noise is added from a seeded generator so results are repeatable. A centered moving average smooths it. Every readout is computed from the samples on screen.</p>
        </div>
        <div>
          <h2 className="h-sub">What this leaves out</h2>
          <p className="secondary">Real sensor data has drift, motion artifacts and non-Gaussian noise, and real pipelines often use better filters than a moving average. This is a sandbox for intuition, not a model of any specific device.</p>
        </div>
      </div>
      <div className="exp-foot"><Link to="/lab/vision-matrix" className="text-link">Try Vision → 4×4 Matrix <Arrow /></Link></div>
    </div>
  );
}
