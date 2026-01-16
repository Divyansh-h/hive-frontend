/**
 * Profile Page - Static mock data with loading simulation.
 * Features avatar, bio, stats, tabs, and posts.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { PostCard, type PostData } from '@/components/feed/PostCard';

// =============================================================================
// MOCK DATA
// =============================================================================

interface UserProfile {
    id: string;
    name: string;
    bio: string;
    avatarUrl?: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
}

const MOCK_USER: UserProfile = {
    id: 'current-user',
    name: 'Demo User',
    bio: 'Building amazing things with HIVE. Software engineer passionate about clean code and great UX.',
    avatarUrl: undefined,
    postsCount: 42,
    followersCount: 128,
    followingCount: 89,
};

const MOCK_USER_POSTS: PostData[] = [
    {
        id: 'p1',
        author: { id: 'current-user', name: 'Demo User' },
        content: 'Just finished setting up the new project! Excited to start building features. 🚀',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likeCount: 15,
        commentCount: 3,
        isLiked: false,
    },
    {
        id: 'p2',
        author: { id: 'current-user', name: 'Demo User' },
        content: 'TIL: React 19 has some amazing new features. The compiler looks promising for performance optimization.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        likeCount: 45,
        commentCount: 12,
        isLiked: true,
    },
    {
        id: 'p3',
        author: { id: 'current-user', name: 'Demo User' },
        content: 'Weekend project: building a social feed UI. Learning a lot about skeleton loading and shimmer animations!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        likeCount: 32,
        commentCount: 7,
        isLiked: false,
    },
];

// =============================================================================
// TYPES
// =============================================================================

interface ProfilePageProps {
    userId: string;
}

type Tab = 'posts' | 'likes';

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfilePage({ userId }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);

    const { user: currentUser } = useAuth();
    const isOwnProfile = currentUser?.id === userId || userId === 'current-user';

    // Simulate loading delay
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setUser(MOCK_USER);
            setPosts(MOCK_USER_POSTS);
            setIsLoading(false);
        }, 1200); // 1.2 second delay

        return () => clearTimeout(timer);
    }, [userId]);

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
                : post
        ));
    };

    // Loading state
    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <p className="text-secondary">User not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-secondary border border-default rounded-lg p-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-tertiary flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-secondary text-2xl font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-primary truncate">{user.name}</h1>
                            {isOwnProfile && (
                                <Link
                                    to="/settings"
                                    className="px-3 py-1.5 text-sm font-medium text-secondary border border-default rounded-lg hover:bg-tertiary transition-colors"
                                >
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                        {user.bio && <p className="text-sm text-secondary mt-2">{user.bio}</p>}

                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-4 text-sm">
                            <div>
                                <span className="font-semibold text-primary">{user.postsCount}</span>
                                <span className="text-secondary ml-1">posts</span>
                            </div>
                            <div>
                                <span className="font-semibold text-primary">{user.followersCount}</span>
                                <span className="text-secondary ml-1">followers</span>
                            </div>
                            <div>
                                <span className="font-semibold text-primary">{user.followingCount}</span>
                                <span className="text-secondary ml-1">following</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-default">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'posts'
                        ? 'border-accent-600 text-accent-600'
                        : 'border-transparent text-secondary hover:text-primary'
                        }`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('likes')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'likes'
                        ? 'border-accent-600 text-accent-600'
                        : 'border-transparent text-secondary hover:text-primary'
                        }`}
                >
                    Likes
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' && (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'likes' && (
                <div className="text-center py-12">
                    <span className="text-4xl mb-4 block">❤️</span>
                    <h3 className="text-lg font-medium text-primary mb-2">Liked posts</h3>
                    <p className="text-sm text-secondary">Posts you've liked will appear here.</p>
                </div>
            )}
        </div>
    );
}
