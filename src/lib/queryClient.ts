/**
 * QueryClient configuration with project-specific defaults.
 *
 * Key behaviors:
 * - Stale time: 5 minutes (stale-while-revalidate pattern)
 * - Retry: Only GET requests (idempotent), mutations never retry
 * - Error handling: Global error boundary integration
 */

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

/**
 * Determines if a failed request should be retried.
 * Only retries GET requests (idempotent).
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
    // Max 2 retries
    if (failureCount >= 2) return false;

    // Don't retry client errors (4xx)
    if (error instanceof Error && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status >= 400 && status < 500) return false;
    }

    return true;
};

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            // Stale-while-revalidate: data considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Keep unused data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,

            // Retry logic for queries (GET requests are idempotent)
            retry: shouldRetry,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Don't refetch on window focus in dev (can be noisy)
            refetchOnWindowFocus: import.meta.env.PROD,

            // Throw errors to error boundary
            throwOnError: true,
        },
        mutations: {
            // Never retry mutations (non-idempotent)
            retry: false,

            // Don't throw to boundary; handle in mutation callbacks
            throwOnError: false,
        },
    },
};

export function createQueryClient(): QueryClient {
    return new QueryClient(queryClientConfig);
}

// Singleton for use in App
let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
    if (!queryClient) {
        queryClient = createQueryClient();
    }
    return queryClient;
}
