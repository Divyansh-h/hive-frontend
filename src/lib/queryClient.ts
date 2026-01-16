/**
 * QueryClient configuration with production-ready defaults.
 *
 * Key behaviors:
 * - Stale time: 2 minutes (balance freshness vs. network)
 * - Cache time: 10 minutes (keep data for quick back-nav)
 * - Retry: Based on ApiError.retryable flag
 * - Exponential backoff: 1s, 2s, 4s
 */

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';
import { ApiError } from './api';

// =============================================================================
// RETRY LOGIC
// =============================================================================

/** Max retry attempts for queries */
const MAX_RETRIES = 3;

/**
 * Determines if a failed request should be retried.
 * Uses ApiError.retryable flag for intelligent retry decisions.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
    // Exceeded max retries
    if (failureCount >= MAX_RETRIES) return false;

    // Use retryable flag from ApiError
    if (error instanceof ApiError) {
        return error.retryable;
    }

    // Unknown errors: retry once
    return failureCount < 1;
}

/**
 * Calculate retry delay with exponential backoff and jitter.
 */
function getRetryDelay(attemptIndex: number): number {
    // Base delay: 1s, 2s, 4s, 8s... capped at 30s
    const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
    // Add jitter (±25%) to prevent thundering herd
    const jitter = baseDelay * 0.25 * (Math.random() - 0.5);
    return baseDelay + jitter;
}

// =============================================================================
// CACHE TIMES
// =============================================================================

/** How long data is considered fresh (won't refetch) */
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

/** How long unused data stays in cache */
const GC_TIME = 10 * 60 * 1000; // 10 minutes

// =============================================================================
// QUERY CLIENT CONFIG
// =============================================================================

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            // Stale-while-revalidate pattern
            staleTime: STALE_TIME,

            // Garbage collection time
            gcTime: GC_TIME,

            // Smart retry with backoff
            retry: shouldRetryQuery,
            retryDelay: getRetryDelay,

            // Refetch on window focus (production only)
            refetchOnWindowFocus: import.meta.env.PROD,

            // Refetch on reconnect (for offline recovery)
            refetchOnReconnect: true,

            // Don't throw - let components handle errors
            throwOnError: false,

            // Network mode: always try (we handle offline in error)
            networkMode: 'always',
        },
        mutations: {
            // Never auto-retry mutations (non-idempotent)
            retry: false,

            // Handle errors in callbacks, not boundary
            throwOnError: false,

            // Network mode
            networkMode: 'always',
        },
    },
};

// =============================================================================
// FACTORY & SINGLETON
// =============================================================================

export function createQueryClient(): QueryClient {
    return new QueryClient(queryClientConfig);
}

// Singleton for app usage
let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
    if (!queryClient) {
        queryClient = createQueryClient();
    }
    return queryClient;
}

/** Reset query client (for testing) */
export function resetQueryClient(): void {
    queryClient?.clear();
    queryClient = null;
}

