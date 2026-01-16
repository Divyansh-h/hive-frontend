/**
 * Feed API functions.
 * Connects to mock backend GET /v1/feed
 */

import { api } from '@/lib/api';
import type { FeedFilters, FeedResponse, PostItem } from './types';

/**
 * Response from the feed endpoint (after api.ts unwraps the wrapper).
 */
interface FeedApiResponse {
    items: PostItem[];
    hasMore: boolean;
    nextCursor: string | null;
}

export const feedApi = {
    /**
     * Fetch paginated feed items.
     * GET /v1/feed?page=...&size=...
     */
    getList: async (filters?: FeedFilters): Promise<FeedResponse> => {
        const params = new URLSearchParams();
        if (filters?.page) params.set('page', String(filters.page));
        const limit = filters?.limit ?? 20;
        params.set('size', String(limit));
        const query = params.toString();

        const response = await api.get<FeedApiResponse>(`/v1/feed${query ? `?${query}` : ''}`);

        return {
            items: response.items,
            hasMore: response.hasMore,
            nextCursor: response.nextCursor ?? undefined,
        };
    },

    /**
     * Fetch feed with cursor-based pagination for infinite scroll.
     * GET /v1/feed?page=...&size=...
     */
    getInfinite: async (cursor?: string, limit = 20): Promise<FeedResponse> => {
        const page = cursor ? parseInt(cursor, 10) / limit : 0;
        const params = new URLSearchParams({
            page: String(Math.floor(page)),
            size: String(limit),
        });

        const response = await api.get<FeedApiResponse>(`/v1/feed?${params.toString()}`);

        return {
            items: response.items,
            hasMore: response.hasMore,
            nextCursor: response.nextCursor ?? undefined,
        };
    },
};

