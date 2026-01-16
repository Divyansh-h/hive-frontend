/**
 * Posts API functions.
 * Connects to mock backend /v1/posts endpoints.
 */

import { api } from '@/lib/api';
import type {
    Post,
    PostListResponse,
    PostListParams,
    PostComment,
    CreatePostRequest,
    CreateCommentRequest,
} from './types';

export const postsApi = {
    /**
     * Fetch paginated posts list.
     */
    getList: (filters?: PostListParams): Promise<PostListResponse> => {
        const params = new URLSearchParams();
        if (filters?.authorId) params.set('authorId', filters.authorId);
        if (filters?.page) params.set('page', String(filters.page));
        if (filters?.size) params.set('size', String(filters.size));
        const query = params.toString();
        return api.get<PostListResponse>(`/v1/posts${query ? `?${query}` : ''}`);
    },

    /**
     * Fetch single post by ID.
     */
    getById: (id: string): Promise<Post> => {
        return api.get<Post>(`/v1/posts/${id}`);
    },

    /**
     * Create a new post.
     */
    create: (data: CreatePostRequest): Promise<Post> => {
        return api.post<Post>('/v1/posts', data);
    },

    /**
     * Delete a post.
     */
    delete: (id: string): Promise<void> => {
        return api.delete<void>(`/v1/posts/${id}`);
    },

    /**
     * Like a post.
     */
    like: (id: string): Promise<void> => {
        return api.post<void>(`/v1/posts/${id}/like`);
    },

    /**
     * Unlike a post.
     */
    unlike: (id: string): Promise<void> => {
        return api.delete<void>(`/v1/posts/${id}/like`);
    },

    /**
     * Fetch comments for a post.
     */
    getComments: (postId: string): Promise<PostComment[]> => {
        return api.get<PostComment[]>(`/v1/posts/${postId}/comments`);
    },

    /**
     * Add comment to a post.
     */
    addComment: (postId: string, data: CreateCommentRequest): Promise<PostComment> => {
        return api.post<PostComment>(`/v1/posts/${postId}/comments`, data);
    },
};

