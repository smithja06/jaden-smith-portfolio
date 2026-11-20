import { Link } from 'react-router-dom';
import { NetworkToy } from '../lab/NetworkToy';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Arrow, ArrowLeft } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

/** The toy network, moved here from the Skills page so Skills stays about evidence. */
export default function NeuralNetworkPage() {
  usePageTitle('Toy Neural Network', 'Interactive 3→4→2 feed-forward network with hand-set weights: drive the inputs and watch activations propagate.');
  return (
    <div className="page container">
      <Link to="/lab" className="text-link back-link"><ArrowLeft /> Lab</Link>
      <header className="page-head">
        <p className="eyebrow">Experiment C</p>
        <h1 className="h-section">Toy Neural Network</h1>
        <p className="lead">Drive three inputs and watch activations flow through weighted connections to two outputs.</p>
      </header>
      <div className="sec-toy"><ErrorBoundary><NetworkToy /></ErrorBoundary></div>
      <div className="exp-notes">
        <div>
          <h2 className="h-sub">How it works</h2>
          <p className="secondary">A 3→4→2 feed-forward network. Each neuron sums its weighted inputs plus a bias; the hidden layer applies a rescaled tanh and the outputs a sigmoid, so every value stays between 0 and 1. Every number on screen is computed from the sliders.</p>
        </div>
        <div>
          <h2 className="h-sub">What this leaves out</h2>
          <p className="secondary">The weights are set by hand. The network isn’t trained and doesn’t classify anything real; it exists to make the forward pass visible and touchable.</p>
        </div>
      </div>
      <div className="exp-foot"><Link to="/lab/vision-matrix" className="text-link">Try Vision → 4×4 Matrix <Arrow /></Link></div>
    </div>
  );
}
