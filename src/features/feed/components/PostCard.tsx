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
            className="bg-secondary border border-default rounded-lg p-4"
            aria-labelledby={postId}
            tabIndex={0}
        >
            {/* Header */}
            <header className="flex items-center gap-3 mb-3">
                <Avatar name={item.authorName} size="md" />
                <div>
                    <p id={postId} className="text-sm font-medium text-primary">
                        {item.authorName}
                    </p>
                    <time
                        dateTime={item.createdAt}
                        className="text-xs text-secondary"
                        title={new Date(item.createdAt).toLocaleString()}
                    >
                        {relativeTime}
                    </time>
                </div>
            </header>

            {/* Content */}
            <div id={contentId} className="text-primary text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {item.content}
            </div>

            {/* Image if present */}
            {item.imageUrl && (
                <div className="mb-3">
                    <img
                        src={item.imageUrl}
                        alt="Post image"
                        className="rounded-lg max-h-96 w-full object-cover"
                    />
                </div>
            )}

            {/* Actions */}
            <footer
                className="flex items-center gap-4 pt-2 border-t border-subtle"
                role="group"
                aria-label="Post actions"
            >
                <button
                    className="flex items-center gap-1 text-sm text-secondary hover:text-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1"
                    aria-label="Like post"
                    type="button"
                >
                    <span aria-hidden="true">❤️</span>
                    <span>Like</span>
                </button>
                <button
                    className="flex items-center gap-1 text-sm text-secondary hover:text-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1"
                    aria-label="Comment on post"
                    type="button"
                >
                    <span aria-hidden="true">💬</span>
                    <span>Comment</span>
                </button>
            </footer>
        </article>
    );
});
