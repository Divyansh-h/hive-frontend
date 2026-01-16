/**
 * Query key factory for type-safe, consistent cache keys.
 * Each domain gets its own namespace to prevent collisions.
 */

export const queryKeys = {
    // Auth domain
    auth: {
        all: ['auth'] as const,
        session: () => [...queryKeys.auth.all, 'session'] as const,
    },

    // Feed domain
    feed: {
        all: ['feed'] as const,
        list: (filters?: { page?: number; limit?: number }) =>
            [...queryKeys.feed.all, 'list', filters] as const,
        infinite: (filters?: { limit?: number }) =>
            [...queryKeys.feed.all, 'infinite', filters] as const,
    },

    // Posts domain
    posts: {
        all: ['posts'] as const,
        list: (filters?: { authorId?: string; page?: number }) =>
            [...queryKeys.posts.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
        comments: (postId: string) =>
            [...queryKeys.posts.all, postId, 'comments'] as const,
    },

    // Users domain
    users: {
        all: ['users'] as const,
        detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
        me: () => [...queryKeys.users.all, 'me'] as const,
        posts: (userId: string) => [...queryKeys.users.all, userId, 'posts'] as const,
    },
} as const;

