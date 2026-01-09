/**
 * Loading indicator for slow responses.
 * Shows after a delay to avoid flashing for fast responses.
 */

import { useEffect, useState } from 'react';

interface SlowLoadingIndicatorProps {
    /** Delay in ms before showing indicator */
    delay?: number;
    /** Whether the operation is in progress */
    isLoading: boolean;
    /** Message to show */
    message?: string;
}

export function SlowLoadingIndicator({
    delay = 2000,
    isLoading,
    message = 'This is taking longer than usual...',
}: SlowLoadingIndicatorProps) {
    const [showSlow, setShowSlow] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setShowSlow(false);
            return;
        }

        const timer = setTimeout(() => {
            setShowSlow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [isLoading, delay]);

    if (!isLoading || !showSlow) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-secondary">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{message}</span>
        </div>
    );
}

/** Hook to track if a request is taking too long */
export function useSlowRequest(isLoading: boolean, thresholdMs = 2000) {
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsSlow(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsSlow(true);
        }, thresholdMs);

        return () => clearTimeout(timer);
    }, [isLoading, thresholdMs]);

    return isSlow;
}
