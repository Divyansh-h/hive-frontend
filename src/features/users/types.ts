/**
 * Users feature types.
 * Aligned with API contract spec.
 */

/** Minimal user info for embedding in other entities */
export interface UserSummary {
    id: string;
    name: string;
    avatarUrl: string | null;
}

/** Full user entity from GET /v1/users/:id */
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
}

/** Extended user profile with counts */
export interface UserProfile extends User {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
}

/** PATCH /v1/users/me request */
export interface UpdateUserRequest {
    name?: string;
    bio?: string;
    avatarUrl?: string;
}

