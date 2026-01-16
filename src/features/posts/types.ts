/**
 * Posts feature types.
 * Aligned with API contract spec.
 */

import type { OffsetPaginationParams } from '@/types/api';

// =============================================================================
// ENTITIES
// =============================================================================

/** Full post entity from API */
export interface Post {
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

/** Comment on a post */
export interface PostComment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    authorAvatarUrl: string | null;
    content: string;
    createdAt: string;
}

// =============================================================================
// REQUESTS
// =============================================================================

/** POST /v1/posts */
export interface CreatePostRequest {
    content: string;
    imageUrl?: string;
}

/** POST /v1/posts/:id/comments */
export interface CreateCommentRequest {
    content: string;
}

/** GET /v1/posts query params */
export interface PostListParams extends OffsetPaginationParams {
    authorId?: string;
}

// =============================================================================
// RESPONSES
// =============================================================================

/** POST /v1/posts response */
export interface CreatePostResponse {
    id: string;
    createdAt: string;
}

// =============================================================================
// LEGACY ALIASES
// =============================================================================

/** @deprecated Use CreatePostRequest */
export type CreatePostInput = CreatePostRequest;

/** @deprecated Use CreateCommentRequest */
export type CreateCommentInput = CreateCommentRequest;

/** @deprecated Use PostListParams */
export type PostListFilters = PostListParams;

/** @deprecated Use OffsetPaginatedResponse<Post> */
export interface PostListResponse {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
}

