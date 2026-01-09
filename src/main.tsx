import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './lib/queryClient';
import { QueryErrorBoundary } from './components/common/QueryErrorBoundary';
import App from './App';
import './index.css';

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
