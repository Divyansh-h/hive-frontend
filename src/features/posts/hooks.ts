/**
 * Posts query and mutation hooks.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { postsApi } from './api';
import type { PostListFilters, CreatePostInput, CreateCommentInput } from './types';

/**
 * Fetch paginated posts list.
 */
export function usePosts(filters?: PostListFilters) {
    return useQuery({
        queryKey: queryKeys.posts.list(filters),
        queryFn: () => postsApi.getList(filters),
    });
}

/**
 * Fetch single post by ID.
 */
export function usePost(id: string) {
    return useQuery({
        queryKey: queryKeys.posts.detail(id),
        queryFn: () => postsApi.getById(id),
        enabled: !!id,
    });
}

/**
 * Fetch comments for a post.
 */
export function usePostComments(postId: string) {
    return useQuery({
        queryKey: queryKeys.posts.comments(postId),
        queryFn: () => postsApi.getComments(postId),
        enabled: !!postId,
    });
}

/**
 * Create a new post.
 */
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostInput) => postsApi.create(data),
        onSuccess: () => {
            // Invalidate posts list and feed
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
        },
    });
}

/**
 * Delete a post.
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => postsApi.delete(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
        },
    });
}

/**
 * Like/unlike a post with optimistic update.
 */
export function useLikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isLiked }: { id: string; isLiked: boolean }) =>
            isLiked ? postsApi.unlike(id) : postsApi.like(id),
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
        },
    });
}

/**
 * Add comment to a post.
 */
export function useAddComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCommentInput) => postsApi.addComment(postId, data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
        },
    });
}
