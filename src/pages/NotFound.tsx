import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="page container notfound">
      <p className="eyebrow">404 · No signal</p>
      <h1 className="h-section">This page isn’t on the grid.</h1>
      <p className="lead">The link may be old or mistyped. Here’s where you can go instead:</p>
      <div className="hero-ctas">
        <Link to="/" className="btn btn-primary">Home</Link>
        <Link to="/lab/projects" className="btn btn-ghost">Projects</Link>
        <Link to="/lab" className="btn btn-ghost">Lab</Link>
        <Link to="/about" className="btn btn-ghost">About</Link>
      </div>
    </div>
  );
}
