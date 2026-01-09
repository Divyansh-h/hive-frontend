/**
 * Profile page with user info and their posts.
 * Demonstrates cold cache behavior with placeholderData.
 */

import { useUser } from '@/features/users/hooks';
import { usePosts } from '@/features/posts/hooks';
import { Skeleton, PostSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

interface ProfilePageProps {
    userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
    const {
        data: user,
        isLoading: isLoadingUser,
        isError: isUserError,
        error: userError,
        refetch: refetchUser,
        isPlaceholderData,
    } = useUser(userId);

    const {
        data: postsData,
        isLoading: isLoadingPosts,
        isError: isPostsError,
        refetch: refetchPosts,
    } = usePosts({ authorId: userId });

    // User loading state
    if (isLoadingUser && !isPlaceholderData) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <ProfileSkeleton />
            </div>
        );
    }

    // User error state
    if (isUserError) {
        return (
            <div className="max-w-2xl mx-auto">
                <ErrorState
                    message={userError instanceof Error ? userError.message : 'Failed to load profile'}
                    onRetry={() => void refetchUser()}
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto">
                <EmptyState icon="👤" title="User not found" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <div
                className={`bg-white border border-gray-200 rounded-lg p-6 ${isPlaceholderData ? 'opacity-70' : ''}`}
            >
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 text-xl font-medium">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-semibold text-gray-900 truncate">{user.name}</h1>
                        {user.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-900">{user.postsCount}</span>
                                <span className="text-gray-500 ml-1">posts</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">{user.followersCount}</span>
                                <span className="text-gray-500 ml-1">followers</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">{user.followingCount}</span>
                                <span className="text-gray-500 ml-1">following</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cold cache indicator */}
                {isPlaceholderData && (
                    <p className="text-xs text-gray-400 mt-4">Loading latest data...</p>
                )}
            </div>

            {/* User's Posts */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Posts</h2>

                {isLoadingPosts ? (
                    <div className="space-y-4">
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                ) : isPostsError ? (
                    <ErrorState message="Failed to load posts" onRetry={() => void refetchPosts()} />
                ) : postsData?.posts.length === 0 ? (
                    <EmptyState icon="📝" title="No posts yet" description="This user hasn't posted anything." />
                ) : (
                    <div className="space-y-4">
                        {postsData?.posts.map((post) => (
                            <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">❤️ {post.likesCount}</span>
                                    <span className="text-xs text-gray-500">💬 {post.commentsCount}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/** Profile header skeleton */
function ProfileSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-4 mt-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
