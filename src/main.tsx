import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './lib/queryClient';
import { QueryErrorBoundary } from './components/common/QueryErrorBoundary';
import App from './App';
import './index.css';

/**
 * Start the application.
 * In development, initializes MSW before rendering.
 */
async function startApp() {
  // Start MSW in development mode
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      quiet: false, // Log intercepted requests
    });
    console.log('[MSW] Mock service worker started');
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={getQueryClient()}>
        <QueryErrorBoundary>
          <App />
        </QueryErrorBoundary>
      </QueryClientProvider>
    </StrictMode>
  );
}

startApp();
