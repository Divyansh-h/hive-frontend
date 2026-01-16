/**
 * Skeleton loading components with shimmer animation.
 * shadcn-style base skeleton with specific layout variants.
 */

import { cn } from '@/lib/utils';

// =============================================================================
// BASE SKELETON
// =============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 bg-[length:200%_100%] rounded',
                className
            )}
            aria-hidden="true"
            {...props}
        />
    );
}

// =============================================================================
// POST SKELETON - Matches PostCard layout exactly
// =============================================================================

export function PostSkeleton() {
    return (
        <div className="bg-secondary border border-default rounded-lg p-4">
            {/* Header: Avatar + Name + Timestamp */}
            <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mt-3 pl-13 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Actions */}
            <div className="mt-4 pl-13 flex items-center gap-6">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    );
}

// =============================================================================
// FEED SKELETON - Multiple posts
// =============================================================================

export function FeedSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
}

// =============================================================================
// PROFILE SKELETON - Matches Profile page layout
// =============================================================================

export function ProfileSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile header */}
            <div className="bg-secondary border border-default rounded-lg p-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Skeleton className="w-20 h-20 rounded-full shrink-0" />

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full max-w-xs" />
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex items-center gap-6">
                    <div className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-default pb-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>

            {/* Posts */}
            <FeedSkeleton count={3} />
        </div>
    );
}

// =============================================================================
// PROFILE HEADER SKELETON - Just the header part
// =============================================================================

export function ProfileHeaderSkeleton() {
    return (
        <div className="bg-secondary border border-default rounded-lg p-6">
            <div className="flex items-start gap-4">
                <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full max-w-xs" />
                </div>
            </div>
        </div>
    );
}
