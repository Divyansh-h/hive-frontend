/**
 * Latency badge to show request performance.
 */

import { useEffect, useState, useRef } from 'react';

type LatencyStatus = 'fast' | 'normal' | 'slow' | null;

interface LatencyBadgeProps {
    isLoading: boolean;
    isFetching: boolean;
}

export function LatencyBadge({ isLoading, isFetching }: LatencyBadgeProps) {
    const [status, setStatus] = useState<LatencyStatus>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading || isFetching) {
            startTimeRef.current = Date.now();
            setStatus(null);
        } else if (startTimeRef.current) {
            const duration = Date.now() - startTimeRef.current;
            startTimeRef.current = null;

            if (duration < 300) {
                setStatus('fast');
            } else if (duration < 1500) {
                setStatus('normal');
            } else {
                setStatus('slow');
            }

            // Clear badge after 3 seconds
            const timer = setTimeout(() => setStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, isFetching]);

    if (!status) return null;

    const styles = {
        fast: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        normal: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
        slow: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    };

    const labels = {
        fast: '⚡ Fast',
        normal: '● Normal',
        slow: '🐢 Slow',
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${styles[status]}`}
            role="status"
            aria-live="polite"
        >
            {labels[status]}
        </span>
    );
}

/**
 * Hook to track request latency.
 */
export function useLatencyTracker(isLoading: boolean) {
    const [latencyMs, setLatencyMs] = useState<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading) {
            startTimeRef.current = Date.now();
        } else if (startTimeRef.current) {
            setLatencyMs(Date.now() - startTimeRef.current);
            startTimeRef.current = null;
        }
    }, [isLoading]);

    const isFast = latencyMs !== null && latencyMs < 300;
    const isSlow = latencyMs !== null && latencyMs > 1500;

    return { latencyMs, isFast, isSlow };
}
