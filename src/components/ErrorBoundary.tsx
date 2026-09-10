import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
          <h2 className="text-xl font-bold text-rose-400 mb-2">Something went wrong in the game</h2>
          <p className="text-sm text-slate-400 mb-4 max-w-md font-mono">{this.state.error?.message}</p>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = window.location.pathname;
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold cursor-pointer transition-colors"
          >
            Reset & Return Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
