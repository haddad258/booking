import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// Delays enabling the global color-transition CSS (see .theme-ready in
// index.css) until just after first paint, so switching themes cross-fades
// smoothly while the very first page load never shows a transition flash.
function TransitionGate({ children }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));
    return () => cancelAnimationFrame(id);
  }, []);
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TransitionGate>
          <App />
        </TransitionGate>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
