/**
 * Feed Page - Structure First.
 * Static mock data with loading simulation.
 */

import { useState, useEffect } from 'react';
import { PostCard, type PostData } from '@/components/feed/PostCard';
import { FeedSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_POSTS: PostData[] = [
    {
        id: '1',
        author: {
            id: 'user-1',
            name: 'Sarah Chen',
            avatarUrl: undefined,
        },
        content: 'Just shipped a new feature! 🚀 The team worked incredibly hard on this one. Feeling grateful to work with such talented people.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        likeCount: 24,
        commentCount: 5,
        isLiked: true,
    },
    {
        id: '2',
        author: {
            id: 'user-2',
            name: 'Marcus Johnson',
            avatarUrl: undefined,
        },
        content: 'Hot take: TypeScript is just JavaScript with extra steps... and I love every single one of those steps. Type safety for the win! 💪',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
        likeCount: 89,
        commentCount: 23,
        isLiked: false,
    },
    {
        id: '3',
        author: {
            id: 'user-3',
            name: 'Emily Rodriguez',
            avatarUrl: undefined,
        },
        content: 'Reading "Designing Data-Intensive Applications" for the third time. Every read reveals something new. Highly recommend for anyone building scalable systems.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likeCount: 156,
        commentCount: 12,
        isLiked: false,
    },
    {
        id: '4',
        author: {
            id: 'user-4',
            name: 'Alex Kim',
            avatarUrl: undefined,
        },
        content: 'Morning coffee ☕ + VSCode + good music = perfect coding session.\n\nWhat\'s your ideal coding setup?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        likeCount: 67,
        commentCount: 31,
        isLiked: true,
    },
    {
        id: '5',
        author: {
            id: 'user-5',
            name: 'Jordan Lee',
            avatarUrl: undefined,
        },
        content: 'Finally figured out that bug that\'s been haunting me for 3 days. Turns out it was a single missing await. async/await is beautiful until it isn\'t. 😅',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        likeCount: 203,
        commentCount: 45,
        isLiked: false,
    },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function FeedPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<PostData[]>([]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setPosts(MOCK_POSTS);
            setIsLoading(false);
        }, 1500); // 1.5 second delay

        return () => clearTimeout(timer);
    }, []);

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
                : post
        ));
    };

    const handleComment = (postId: string) => {
        console.log('Comment clicked:', postId);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-primary">Feed</h1>
                <Button>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Button>
            </div>

            {/* Loading state */}
            {isLoading ? (
                <FeedSkeleton count={5} />
            ) : (
                <>
                    {/* Posts */}
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLike}
                                onComment={handleComment}
                            />
                        ))}
                    </div>

                    {/* End of feed */}
                    <p className="text-center text-sm text-tertiary py-8">
                        You've reached the end of your feed
                    </p>
                </>
            )}
        </div>
    );
}
