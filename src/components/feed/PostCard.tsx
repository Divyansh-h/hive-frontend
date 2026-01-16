/**
 * PostCard component for feed items.
 * Displays avatar, author name, content, timestamp, and action buttons.
 * Polished UI with hover states, elevation, and refined spacing.
 */

import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface PostData {
    id: string;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    content: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    isLiked?: boolean;
}

// =============================================================================
// ICONS
// =============================================================================

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
    <svg
        className={cn(
            "w-[18px] h-[18px] transition-transform duration-150",
            filled && "scale-110"
        )}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
    </svg>
);

const CommentIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
    </svg>
);

const ShareIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
    </svg>
);

// =============================================================================
// HELPERS
// =============================================================================

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// =============================================================================
// ACTION BUTTON
// =============================================================================

interface ActionButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    activeColor?: string;
    hoverColor?: string;
    children: React.ReactNode;
}

function ActionButton({
    onClick,
    isActive,
    activeColor = 'text-error-500',
    hoverColor = 'hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20',
    children
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-full text-sm font-medium transition-all duration-150",
                isActive
                    ? activeColor
                    : cn("text-secondary", hoverColor)
            )}
        >
            {children}
        </button>
    );
}

// =============================================================================
// COMPONENT
// =============================================================================

interface PostCardProps {
    post: PostData;
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
    return (
        <article
            className={cn(
                "bg-secondary border border-default rounded-xl",
                "shadow-sm hover:shadow-md",
                "transition-shadow duration-200",
                "overflow-hidden"
            )}
        >
            <div className="p-5">
                {/* Header: Avatar + Author + Timestamp */}
                <div className="flex items-start gap-3">
                    <Avatar
                        src={post.author.avatarUrl}
                        name={post.author.name}
                        size="md"
                    />
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-primary text-[15px] truncate">
                                {post.author.name}
                            </span>
                            <span className="text-tertiary text-xs">·</span>
                            <time className="text-xs text-tertiary whitespace-nowrap">
                                {formatTimeAgo(post.createdAt)}
                            </time>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-3 ml-[52px]">
                    <p className="text-primary text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {post.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-4 ml-[52px] flex items-center gap-2">
                    <ActionButton
                        onClick={() => onLike?.(post.id)}
                        isActive={post.isLiked}
                        activeColor="text-error-500"
                        hoverColor="hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                    >
                        <HeartIcon filled={post.isLiked} />
                        <span>{post.likeCount > 0 ? post.likeCount : ''}</span>
                    </ActionButton>

                    <ActionButton
                        onClick={() => onComment?.(post.id)}
                        isActive={false}
                        hoverColor="hover:text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20"
                    >
                        <CommentIcon />
                        <span>{post.commentCount > 0 ? post.commentCount : ''}</span>
                    </ActionButton>

                    <ActionButton
                        hoverColor="hover:text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20"
                    >
                        <ShareIcon />
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}
