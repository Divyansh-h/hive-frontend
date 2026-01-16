/**
 * PostCard component for displaying a single post.
 * Memoized to prevent unnecessary re-renders in lists.
 */

import { memo, useMemo } from 'react';
import type { PostItem } from '@/features/feed/types';
import { Avatar } from '@/components/ui/Avatar';

interface PostCardProps {
    item: PostItem;
}

/** Format relative date - memoized outside component */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export const PostCard = memo(function PostCard({ item }: PostCardProps) {
    // Memoize formatted date since it only depends on createdAt
    const relativeTime = useMemo(() => formatDate(item.createdAt), [item.createdAt]);

    // Generate unique IDs for accessibility
    const postId = `post-${item.id}`;
    const contentId = `${postId}-content`;

    return (
        <article
            className="card"
            aria-labelledby={postId}
            tabIndex={0}
        >
            <div className="card-body">
                {/* Header */}
                <header className="flex items-center gap-3 mb-4">
                    <Avatar name={item.authorName} size="md" />
                    <div className="min-w-0 flex-1">
                        <p id={postId} className="text-sm font-semibold text-primary truncate">
                            {item.authorName}
                        </p>
                        <time
                            dateTime={item.createdAt}
                            className="text-xs text-tertiary"
                            title={new Date(item.createdAt).toLocaleString()}
                        >
                            {relativeTime}
                        </time>
                    </div>
                </header>

                {/* Content */}
                <div
                    id={contentId}
                    className="text-primary text-sm leading-relaxed whitespace-pre-wrap"
                >
                    {item.content}
                </div>

                {/* Image if present */}
                {item.imageUrl && (
                    <div className="mt-4">
                        <img
                            src={item.imageUrl}
                            alt="Post image"
                            className="rounded-lg max-h-96 w-full object-cover"
                        />
                    </div>
                )}

                {/* Actions */}
                <footer
                    className="flex items-center gap-6 mt-4 pt-4 border-t border-subtle"
                    role="group"
                    aria-label="Post actions"
                >
                    <button
                        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1 py-0.5"
                        aria-label="Like post"
                        type="button"
                    >
                        <span aria-hidden="true">❤️</span>
                        <span className="font-medium">Like</span>
                    </button>
                    <button
                        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1 py-0.5"
                        aria-label="Comment on post"
                        type="button"
                    >
                        <span aria-hidden="true">💬</span>
                        <span className="font-medium">Comment</span>
                    </button>
                </footer>
            </div>
        </article>
    );
});

