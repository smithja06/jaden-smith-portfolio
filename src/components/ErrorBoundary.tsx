import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; onError?: (error: unknown) => void; }
interface State { failed: boolean; }

/** Keeps a failing visual or experiment from blanking the rest of the page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: unknown) {
    console.error('[portfolio] component failed:', error);
    this.props.onError?.(error);
  }
  render() {
    if (this.state.failed) {
      return this.props.fallback !== undefined ? this.props.fallback : (
        <div className="note" role="status">This interactive piece couldn’t load in your browser. The rest of the page still works.</div>
      );
    }
    return this.props.children;
  }
}
