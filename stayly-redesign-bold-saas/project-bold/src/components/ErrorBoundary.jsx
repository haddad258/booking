import { Component } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas dark:bg-brand-950 px-4 text-center">
        <ExclamationTriangleIcon className="mb-4 h-14 w-14 text-gold-400" />
        <h1 className="font-display mb-2 text-2xl font-bold text-ink dark:text-white">Something went wrong</h1>
        <p className="mb-6 max-w-sm text-ink/60 dark:text-white/60">
          An unexpected error occurred. Your booking data is safe — try reloading, or head back home.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-brand-300/50 dark:border-white/20 px-5 py-2.5 text-sm font-semibold text-ink dark:text-white hover:bg-brand-500/8 dark:hover:bg-white/10"
          >
            Reload page
          </button>
          <a href="/" className="brand-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30">
            Back home
          </a>
        </div>
      </div>
    );
  }
}
