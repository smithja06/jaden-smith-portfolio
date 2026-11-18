import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { experiments, type ExperimentId } from '../config/stations';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ArrowLeft } from '../../components/Icons';

const VisionMatrixDemo = lazy(() => import('../../lab/VisionMatrixDemo').then((m) => ({ default: m.VisionMatrixDemo })));
const SignalPlayground = lazy(() => import('../../lab/SignalPlayground').then((m) => ({ default: m.SignalPlayground })));

interface Props {
  id: ExperimentId;
  onClose: () => void;
}

/** Full-size 2D workspace over the paused 3D world. */
export function ExperimentWorkspace({ id, onClose }: Props) {
  const exp = experiments.find((e) => e.id === id)!;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [id]);

  return (
    <section className="lab3d-workspace" aria-labelledby="lab3d-ws-title">
      <div className="container lab3d-workspace-inner">
        <div className="lab3d-ws-head">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}><ArrowLeft /> Back to 3D lab</button>
          <Link to={exp.route} className="text-link st-small">Open as a standalone page</Link>
        </div>
        <p className="eyebrow">Experiment workspace</p>
        <h2 id="lab3d-ws-title" ref={headingRef} tabIndex={-1} className="h-section">{exp.title}</h2>
        <p className="lead">{exp.blurb}</p>
        <ErrorBoundary>
          <Suspense fallback={<div className="vm-placeholder glass" aria-busy="true" />}>
            {id === 'vision-matrix' ? <VisionMatrixDemo /> : <SignalPlayground />}
          </Suspense>
        </ErrorBoundary>
        <p className="ctl-hint lab3d-ws-note">Simulated, local, and simplified — outputs here are model results, not measurements from real hardware.</p>
      </div>
    </section>
  );
}
