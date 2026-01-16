/**
 * Suspense wrapper with loading fallback.
 * Provides consistent loading UI for lazy-loaded components.
 */

import { Suspense, type ReactNode } from 'react';

interface SuspenseWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Default loading spinner for Suspense boundaries.
 */
function DefaultLoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
                <p className="text-sm text-secondary">Loading...</p>
            </div>
        </div>
    );
}

/**
 * Full-page loading spinner.
 */
export function PageLoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-3 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
                <p className="text-sm text-secondary">Loading page...</p>
            </div>
        </div>
    );
}

/**
 * Suspense boundary with default loading fallback.
 */
export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
    return (
        <Suspense fallback={fallback ?? <DefaultLoadingFallback />}>
            {children}
        </Suspense>
    );
}

/**
 * Suspense boundary for page-level lazy loading.
 */
export function PageSuspense({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<PageLoadingFallback />}>
            {children}
        </Suspense>
    );
}
