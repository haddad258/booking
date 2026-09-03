import { Component } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Same fix as the admin app (see AUDIT-PHASE-1.md / Phase 2B): no error
 * boundary existed anywhere, so an uncaught render error on the public
 * site — the one place a broken page directly costs bookings — showed a
 * blank white screen with zero recovery path.
 *
 * The fallback intentionally uses plain <a>/<button> tags rather than
 * RouterLink or the shared Button component: this is a last-resort safety
 * net, and it needs to render correctly even if the error originated
 * inside routing context itself.
 */
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
        <ExclamationTriangleIcon className="mb-4 h-14 w-14 text-gold-500" />
        <h1 className="font-display mb-2 text-2xl font-semibold text-ink dark:text-white">Something went wrong</h1>
        <p className="mb-6 max-w-sm text-ink/60 dark:text-white/60">
          An unexpected error occurred. Your booking data is safe — try reloading, or head back home.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-ink/20 dark:border-white/20 px-5 py-2.5 text-sm font-semibold text-ink dark:text-white hover:border-ink/40 dark:hover:border-white/40 hover:bg-ink/5 dark:hover:bg-white/10"
          >
            Reload page
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-800 px-5 py-2.5 text-sm font-semibold text-canvas shadow-md shadow-brand-900/20"
          >
            Back home
          </a>
        </div>
      </div>
    );
  }
}
