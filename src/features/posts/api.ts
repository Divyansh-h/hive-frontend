/**
 * Posts API functions.
 */

import { api } from '@/lib/api';
import type {
    Post,
    PostListResponse,
    PostListFilters,
    PostComment,
    CreatePostInput,
    CreateCommentInput,
} from './types';

export const postsApi = {
    /**
     * Fetch paginated posts list.
     */
    getList: (filters?: PostListFilters): Promise<PostListResponse> => {
        const params = new URLSearchParams();
        if (filters?.authorId) params.set('authorId', filters.authorId);
        if (filters?.page) params.set('page', String(filters.page));
        if (filters?.limit) params.set('limit', String(filters.limit));
        const query = params.toString();
        return api.get<PostListResponse>(`/posts${query ? `?${query}` : ''}`);
    },

    /**
     * Fetch single post by ID.
     */
    getById: (id: string): Promise<Post> => {
        return api.get<Post>(`/posts/${id}`);
    },

    /**
     * Create a new post.
     */
    create: (data: CreatePostInput): Promise<Post> => {
        return api.post<Post>('/posts', data);
    },

    /**
     * Delete a post.
     */
    delete: (id: string): Promise<void> => {
        return api.delete<void>(`/posts/${id}`);
    },

    /**
     * Like a post.
     */
    like: (id: string): Promise<void> => {
        return api.post<void>(`/posts/${id}/like`);
    },

    /**
     * Unlike a post.
     */
    unlike: (id: string): Promise<void> => {
        return api.delete<void>(`/posts/${id}/like`);
    },

    /**
     * Fetch comments for a post.
     */
    getComments: (postId: string): Promise<PostComment[]> => {
        return api.get<PostComment[]>(`/posts/${postId}/comments`);
    },

    /**
     * Add comment to a post.
     */
    addComment: (postId: string, data: CreateCommentInput): Promise<PostComment> => {
        return api.post<PostComment>(`/posts/${postId}/comments`, data);
    },
};
