import { Link } from 'react-router-dom';
import { VisionMatrixDemo } from '../lab/VisionMatrixDemo';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow, ArrowLeft } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

export default function VisionMatrixPage() {
  usePageTitle('Vision → 4×4 Matrix', 'Interactive browser model of reducing an image to a 4×4 LED grid.');
  return (
    <div className="page container">
      <Link to="/lab" className="text-link back-link"><ArrowLeft /> Lab</Link>
      <header className="page-head">
        <p className="eyebrow">Experiment A</p>
        <h1 className="h-section">Vision → 4×4 Matrix</h1>
        <p className="lead">How much of an image survives when you only have sixteen outputs? Pick a pattern or your own image, choose a mapping rule, and watch the grid respond.</p>
      </header>
      <ErrorBoundary><VisionMatrixDemo /></ErrorBoundary>
      <div className="exp-foot">
        <p className="secondary">A teaching model of the idea behind <Link to="/work/med-t-sensory-substitution" className="inline-link">MED-T Sensory Substitution</Link>.</p>
        <Link to="/lab/signal-playground" className="text-link">Next: Signal Playground <Arrow /></Link>
      </div>
    </div>
  );
}
