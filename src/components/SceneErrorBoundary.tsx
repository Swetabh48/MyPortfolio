import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/** Keeps the portfolio mounted if the 3D layer throws. */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ScrollWorld]', error, info.componentStack);
    (window as unknown as { __sceneError?: string }).__sceneError =
      `${error.message}\n${info.componentStack ?? ''}`;
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="pointer-events-none fixed bottom-4 left-4 z-[60] max-w-sm rounded-xl border border-rose-400/30 bg-[#12080c]/92 px-3 py-2 text-[11px] text-rose-100">
            3D layer failed: {this.state.error.message}
          </div>
        )
      );
    }
    return this.props.children;
  }
}
