/**
 * Status Banner component for displaying connectivity/cache state.
 */

import { Button } from './Button';

type BannerVariant = 'info' | 'warning' | 'error' | 'offline';

interface StatusBannerProps {
    variant: BannerVariant;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
        isLoading?: boolean;
    };
    onDismiss?: () => void;
}

const variantStyles: Record<BannerVariant, { bg: string; border: string; icon: string }> = {
    info: {
        bg: 'bg-blue-50 dark:bg-blue-950',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'ℹ️',
    },
    warning: {
        bg: 'bg-amber-50 dark:bg-amber-950',
        border: 'border-amber-200 dark:border-amber-800',
        icon: '⚠️',
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-950',
        border: 'border-red-200 dark:border-red-800',
        icon: '❌',
    },
    offline: {
        bg: 'bg-neutral-100 dark:bg-neutral-800',
        border: 'border-neutral-300 dark:border-neutral-600',
        icon: '📡',
    },
};

export function StatusBanner({ variant, message, action, onDismiss }: StatusBannerProps) {
    const styles = variantStyles[variant];

    return (
        <div
            className={`${styles.bg} ${styles.border} border rounded-md px-4 py-3 flex items-center justify-between gap-4`}
            role="alert"
        >
            <div className="flex items-center gap-3">
                <span className="text-lg" role="img" aria-hidden="true">
                    {styles.icon}
                </span>
                <p className="text-sm text-primary">{message}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {action && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={action.onClick}
                        isLoading={action.isLoading}
                    >
                        {action.label}
                    </Button>
                )}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-secondary hover:text-primary p-1"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

/** Cached data fallback banner */
export function CachedDataBanner({ onRefresh, isRefreshing }: { onRefresh: () => void; isRefreshing: boolean }) {
    return (
        <StatusBanner
            variant="warning"
            message="Showing cached data. Some content may be outdated."
            action={{ label: 'Refresh', onClick: onRefresh, isLoading: isRefreshing }}
        />
    );
}

/** Backend down banner */
export function BackendDownBanner({ onRetry, isRetrying }: { onRetry: () => void; isRetrying: boolean }) {
    return (
        <StatusBanner
            variant="error"
            message="Unable to connect to the server. Please check your connection."
            action={{ label: 'Retry', onClick: onRetry, isLoading: isRetrying }}
        />
    );
}

/** Offline banner */
export function OfflineBanner() {
    return (
        <StatusBanner
            variant="offline"
            message="You're offline. Showing cached content."
        />
    );
}
