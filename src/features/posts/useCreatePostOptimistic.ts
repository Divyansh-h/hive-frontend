/**
 * Create post hook with optimistic updates and rollback.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { postsApi } from './api';
import type { CreatePostInput, Post } from './types';
import type { FeedItem, FeedResponse } from '@/features/feed/types';

interface OptimisticContext {
    previousFeedData: [readonly unknown[], FeedResponse | undefined][] | undefined;
}

export function useCreatePostOptimistic() {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, CreatePostInput, OptimisticContext>({
        mutationFn: (data) => postsApi.create(data),

        onMutate: async (newPostData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.feed.all });

            // Snapshot previous value
            const previousFeedData = queryClient.getQueriesData<FeedResponse>({
                queryKey: queryKeys.feed.all,
            });

            // Optimistically update feed with new post
            const optimisticPost: FeedItem = {
                id: `temp-${Date.now()}`,
                type: 'post',
                createdAt: new Date().toISOString(),
                post: {
                    id: `temp-${Date.now()}`,
                    content: newPostData.content,
                    author: {
                        id: 'current-user',
                        name: 'You',
                    },
                    likesCount: 0,
                    commentsCount: 0,
                    createdAt: new Date().toISOString(),
                },
            };

            // Update all feed queries
            queryClient.setQueriesData<{ pages: FeedResponse[] }>(
                { queryKey: queryKeys.feed.all },
                (old) => {
                    if (!old?.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page, index) =>
                            index === 0
                                ? { ...page, items: [optimisticPost, ...page.items] }
                                : page
                        ),
                    };
                }
            );

            return { previousFeedData };
        },

        onError: (_error, _variables, context) => {
            // Rollback on failure
            if (context?.previousFeedData) {
                context.previousFeedData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },

        onSettled: () => {
            // Always refetch after error or success
            void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
            void queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
    });
}
