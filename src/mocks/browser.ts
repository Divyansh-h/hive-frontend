/**
 * MSW browser setup.
 * Initializes the mock service worker for development.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
