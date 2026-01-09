/**
 * Feed query hooks.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { feedApi } from './api';
import type { FeedFilters, FeedResponse } from './types';

/**
 * Fetch paginated feed list.
 */
export function useFeed(filters?: FeedFilters) {
    return useQuery({
        queryKey: queryKeys.feed.list(filters),
        queryFn: () => feedApi.getList(filters),
    });
}

/**
 * Infinite scroll feed.
 */
export function useInfiniteFeed(limit = 20) {
    return useInfiniteQuery({
        queryKey: queryKeys.feed.infinite({ limit }),
        queryFn: ({ pageParam }) => feedApi.getInfinite(pageParam, limit),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: FeedResponse) =>
            lastPage.hasMore ? lastPage.nextCursor : undefined,
    });
}
