/**
 * Mock data generators.
 * Creates realistic fake data for testing.
 */

import { generateId } from './utils';

// =============================================================================
// USER DATA
// =============================================================================

const FIRST_NAMES = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Sage', 'Drew', 'Avery'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Anderson', 'Lee'];

export function generateUserName(): string {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
}

export function generateEmail(name: string): string {
    const normalized = name.toLowerCase().replace(/\s+/g, '.');
    return `${normalized}@example.com`;
}

export function generateBio(): string | null {
    const bios = [
        'Building things on the web.',
        'Coffee enthusiast ☕',
        'Open source contributor',
        'Learning something new every day.',
        null,
        null, // 1/3 chance of no bio
    ];
    return bios[Math.floor(Math.random() * bios.length)];
}

export interface MockUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
}

export interface MockUserProfile extends MockUser {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
}

export function generateUser(id?: string): MockUser {
    const userId = id ?? generateId('user');
    const name = generateUserName();

    return {
        id: userId,
        name,
        email: generateEmail(name),
        avatarUrl: null, // No external avatar URLs
        bio: generateBio(),
        createdAt: generatePastDate(365).toISOString(),
    };
}

export function generateUserProfile(id?: string): MockUserProfile {
    const user = generateUser(id);
    return {
        ...user,
        postsCount: Math.floor(Math.random() * 50),
        followersCount: Math.floor(Math.random() * 500),
        followingCount: Math.floor(Math.random() * 200),
        isFollowing: Math.random() > 0.5,
    };
}

// =============================================================================
// POST DATA
// =============================================================================

const POST_CONTENTS = [
    'Just shipped a new feature! 🚀',
    'Working on something exciting...',
    'Anyone else dealing with this bug?',
    'Great discussion at the standup today!',
    'Finally figured out that tricky algorithm.',
    'Code review took longer than expected but learned a lot.',
    'Hot take: tabs > spaces',
    'Just discovered a new library that changes everything.',
    'Remember to take breaks and stretch!',
    'Debugging is like being a detective in a crime movie where you are also the murderer.',
    'The best code is no code at all.',
    'Documentation is a love letter to your future self.',
    'Just pushed to main on a Friday. Living dangerously.',
    'Coffee + music + code = flow state ✨',
    'Learning TypeScript was the best decision I made this year.',
];

export interface MockPost {
    id: string;
    userId: string;
    authorName: string;
    authorAvatarUrl: string | null;
    content: string;
    imageUrl: string | null;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MockFeedItem {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
}

export function generatePost(userId?: string, authorName?: string): MockPost {
    const postId = generateId('post');
    const createdAt = generatePastDate(30);

    return {
        id: postId,
        userId: userId ?? generateId('user'),
        authorName: authorName ?? generateUserName(),
        authorAvatarUrl: null,
        content: POST_CONTENTS[Math.floor(Math.random() * POST_CONTENTS.length)],
        imageUrl: null,
        likesCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 20),
        isLiked: Math.random() > 0.7,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
    };
}

export function generateFeedItem(userId?: string, authorName?: string): MockFeedItem {
    const post = generatePost(userId, authorName);
    return {
        id: post.id,
        userId: post.userId,
        authorName: post.authorName,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
    };
}

export function generateFeedItems(count: number): MockFeedItem[] {
    return Array.from({ length: count }, () => generateFeedItem());
}

// =============================================================================
// DATE UTILITIES
// =============================================================================

/** Generate a random date within the past N days */
export function generatePastDate(maxDaysAgo: number): Date {
    const now = Date.now();
    const daysAgo = Math.random() * maxDaysAgo;
    const msAgo = daysAgo * 24 * 60 * 60 * 1000;
    return new Date(now - msAgo);
}

// =============================================================================
// DATA STORE (in-memory)
// =============================================================================

/** Simple in-memory store for mock data persistence within a session */
class MockDataStore {
    private users: Map<string, MockUserProfile> = new Map();
    private posts: Map<string, MockPost> = new Map();
    private currentUserId: string | null = null;

    constructor() {
        this.seed();
    }

    /** Seed initial data */
    seed(): void {
        // Create current user
        const currentUser = generateUserProfile('current-user');
        currentUser.name = 'Demo User';
        currentUser.email = 'demo@example.com';
        this.users.set(currentUser.id, currentUser);
        this.currentUserId = currentUser.id;

        // Create some other users
        for (let i = 0; i < 5; i++) {
            const user = generateUserProfile();
            this.users.set(user.id, user);
        }

        // Create posts
        const userIds = Array.from(this.users.keys());
        for (let i = 0; i < 30; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const user = this.users.get(userId)!;
            const post = generatePost(userId, user.name);
            this.posts.set(post.id, post);
        }
    }

    getCurrentUser(): MockUserProfile | null {
        return this.currentUserId ? this.users.get(this.currentUserId) ?? null : null;
    }

    getUser(id: string): MockUserProfile | null {
        return this.users.get(id) ?? null;
    }

    getAllPosts(): MockPost[] {
        return Array.from(this.posts.values())
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    getPostsByUser(userId: string): MockPost[] {
        return this.getAllPosts().filter((p) => p.userId === userId);
    }

    getPost(id: string): MockPost | null {
        return this.posts.get(id) ?? null;
    }

    createPost(content: string, imageUrl?: string): MockPost {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No current user');

        const post: MockPost = {
            id: generateId('post'),
            userId: user.id,
            authorName: user.name,
            authorAvatarUrl: user.avatarUrl,
            content,
            imageUrl: imageUrl ?? null,
            likesCount: 0,
            commentsCount: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.posts.set(post.id, post);
        user.postsCount += 1;
        return post;
    }

    deletePost(id: string): boolean {
        const post = this.posts.get(id);
        if (!post) return false;

        const user = this.users.get(post.userId);
        if (user) user.postsCount -= 1;

        return this.posts.delete(id);
    }

    likePost(id: string): boolean {
        const post = this.posts.get(id);
        if (!post || post.isLiked) return false;
        post.isLiked = true;
        post.likesCount += 1;
        return true;
    }

    unlikePost(id: string): boolean {
        const post = this.posts.get(id);
        if (!post || !post.isLiked) return false;
        post.isLiked = false;
        post.likesCount -= 1;
        return true;
    }

    getFeed(page: number, size: number): { items: MockFeedItem[]; hasMore: boolean } {
        const allPosts = this.getAllPosts();
        const start = page * size;
        const end = start + size;
        const items = allPosts.slice(start, end).map((p) => ({
            id: p.id,
            userId: p.userId,
            authorName: p.authorName,
            content: p.content,
            imageUrl: p.imageUrl,
            createdAt: p.createdAt,
        }));

        return {
            items,
            hasMore: end < allPosts.length,
        };
    }
}

export const mockStore = new MockDataStore();
