/**
 * Retry controls component with exponential backoff info.
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';

interface RetryControlsProps {
    onRetry: () => void;
    isRetrying: boolean;
    failureCount: number;
    maxRetries?: number;
}

export function RetryControls({
    onRetry,
    isRetrying,
    failureCount,
    maxRetries = 3,
}: RetryControlsProps) {
    const [countdown, setCountdown] = useState<number | null>(null);

    // Calculate backoff delay
    const getBackoffDelay = useCallback((attempt: number) => {
        return Math.min(1000 * Math.pow(2, attempt), 30000);
    }, []);

    // Auto-retry with countdown
    useEffect(() => {
        if (failureCount === 0 || failureCount >= maxRetries || isRetrying) {
            setCountdown(null);
            return;
        }

        const delay = getBackoffDelay(failureCount);
        let remaining = Math.ceil(delay / 1000);
        setCountdown(remaining);

        const interval = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                setCountdown(null);
                onRetry();
            } else {
                setCountdown(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [failureCount, maxRetries, isRetrying, getBackoffDelay, onRetry]);

    const hasExhaustedRetries = failureCount >= maxRetries;

    return (
        <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-center">
                <p className="text-sm text-secondary">
                    {hasExhaustedRetries
                        ? 'Multiple attempts failed.'
                        : countdown !== null
                            ? `Retrying in ${countdown}s...`
                            : 'Request failed.'}
                </p>
                {failureCount > 0 && (
                    <p className="text-xs text-tertiary mt-1">
                        Attempt {Math.min(failureCount + 1, maxRetries)} of {maxRetries}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onRetry}
                    isLoading={isRetrying}
                    disabled={isRetrying}
                >
                    {countdown !== null ? 'Retry now' : 'Retry'}
                </Button>
                {countdown !== null && (
                    <Button variant="ghost" size="sm" onClick={() => setCountdown(null)}>
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
}
