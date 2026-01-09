/**
 * Feed page with full backend-awareness UX:
 * - Infinite scroll
 * - Skeleton loading
 * - Empty/error states
 * - Cached data fallback banners
 * - Slow response indicators
 * - Backend down handling
 * - Offline support
 * - Latency badge (Fast/Slow)
 */

import { useEffect } from 'react';
import { useInfiniteFeed } from '@/features/feed/hooks';
import { PostCard } from '@/features/feed/components/PostCard';
import { FeedSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CachedDataBanner, BackendDownBanner, OfflineBanner } from '@/components/ui/StatusBanner';
import { SlowLoadingIndicator } from '@/components/ui/SlowLoadingIndicator';
import { RetryControls } from '@/components/ui/RetryControls';
import { LatencyBadge } from '@/components/ui/LatencyBadge';
import { useIntersectionObserver, useNetworkStatus } from '@/hooks';
import { ApiError } from '@/lib/api';

export default function FeedPage() {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isFetching,
        failureCount,
        dataUpdatedAt,
        isStale,
    } = useInfiniteFeed(20);

    const { isOffline } = useNetworkStatus();

    const { targetRef, isIntersecting } = useIntersectionObserver({
        enabled: hasNextPage && !isFetchingNextPage && !isError,
    });

    // Trigger fetch when sentinel intersects
    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Check if we have cached data
    const hasCachedData = !!data?.pages.length;
    const allItems = data?.pages.flatMap((page) => page.items) ?? [];

    // Determine if this is a backend down situation
    const isBackendDown =
        isError && error instanceof ApiError && (error.status >= 500 || error.status === 0);

    // Determine if showing stale/cached data
    const showCachedBanner = hasCachedData && isStale && !isRefetching;
    const cacheAge = dataUpdatedAt ? Date.now() - dataUpdatedAt : 0;
    const isCacheOld = cacheAge > 5 * 60 * 1000; // More than 5 minutes old

    // Initial loading state
    if (isLoading && !hasCachedData) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <FeedSkeleton count={5} />
                <SlowLoadingIndicator
                    isLoading={isLoading}
                    delay={3000}
                    message="Taking longer than expected. Please wait..."
                />
            </div>
        );
    }

    // Backend down with no cached data
    if (isBackendDown && !hasCachedData) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                {isOffline ? (
                    <OfflineBanner />
                ) : (
                    <BackendDownBanner onRetry={() => void refetch()} isRetrying={isRefetching} />
                )}
                <RetryControls
                    onRetry={() => void refetch()}
                    isRetrying={isRefetching}
                    failureCount={failureCount}
                    maxRetries={3}
                />
            </div>
        );
    }

    // Error with no cached data (non-backend errors)
    if (isError && !hasCachedData) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-secondary border border-default rounded-lg p-6 text-center">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <h3 className="text-lg font-medium text-primary mb-2">Failed to load feed</h3>
                    <p className="text-sm text-secondary mb-4">
                        {error instanceof Error ? error.message : 'An unexpected error occurred'}
                    </p>
                    <RetryControls
                        onRetry={() => void refetch()}
                        isRetrying={isRefetching}
                        failureCount={failureCount}
                    />
                </div>
            </div>
        );
    }

    // Empty state
    if (allItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <EmptyState
                    icon="📝"
                    title="No posts yet"
                    description="Be the first to share something with the community."
                />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Feed header with latency indicator */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-primary">Feed</h1>
                <LatencyBadge isLoading={isLoading} isFetching={isFetching} />
            </div>

            {/* Status banners - don't hide failures */}
            {isOffline && <OfflineBanner />}

            {isBackendDown && hasCachedData && (
                <BackendDownBanner onRetry={() => void refetch()} isRetrying={isRefetching} />
            )}

            {showCachedBanner && isCacheOld && !isBackendDown && !isOffline && (
                <CachedDataBanner onRefresh={() => void refetch()} isRefreshing={isRefetching} />
            )}

            {/* Feed content */}
            <div className="space-y-4">
                {allItems.map((item) => (
                    <PostCard key={item.id} item={item} />
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={targetRef} className="py-4">
                {isFetchingNextPage && (
                    <>
                        <FeedSkeleton count={2} />
                        <SlowLoadingIndicator
                            isLoading={isFetchingNextPage}
                            delay={3000}
                            message="Loading more posts..."
                        />
                    </>
                )}
                {!hasNextPage && allItems.length > 0 && (
                    <p className="text-center text-sm text-secondary py-4">
                        You've reached the end
                    </p>
                )}
            </div>
        </div>
    );
}
