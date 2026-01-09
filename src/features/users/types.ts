/**
 * Users feature types.
 */

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    createdAt: string;
}
