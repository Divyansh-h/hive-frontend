/**
 * Network Status Banner.
 * Shows a persistent banner when the user goes offline.
 */

import { useNetworkStatus } from '@/hooks';
import { useEffect, useState } from 'react';

export function NetworkStatusBanner() {
    const { isOffline, isOnline } = useNetworkStatus();
    const [showReconnected, setShowReconnected] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    // Track when user comes back online
    useEffect(() => {
        if (isOffline) {
            setWasOffline(true);
        } else if (wasOffline && isOnline) {
            setShowReconnected(true);
            // Hide reconnected message after 3 seconds
            const timer = setTimeout(() => {
                setShowReconnected(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOffline, isOnline, wasOffline]);

    if (isOffline) {
        return (
            <div
                className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2 text-center text-sm font-medium"
                role="alert"
                aria-live="assertive"
            >
                <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12v.01" />
                    </svg>
                    You're offline. Some features may be unavailable.
                </span>
            </div>
        );
    }

    if (showReconnected) {
        return (
            <div
                className="fixed top-0 left-0 right-0 z-50 bg-success-500 text-white px-4 py-2 text-center text-sm font-medium animate-slide-in"
                role="status"
                aria-live="polite"
            >
                <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You're back online!
                </span>
            </div>
        );
    }

    return null;
}
