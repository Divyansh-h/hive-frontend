/**
 * Feed API functions.
 * Connects to backend GET /api/v1/feed
 */

import { api } from '@/lib/api';
import type { FeedFilters, FeedResponse, BackendApiResponse, PostItem } from './types';

/**
 * Transform backend response to FeedResponse format expected by hooks.
 */
function transformResponse(backendResponse: BackendApiResponse<PostItem[]>, limit: number): FeedResponse {
    const items = backendResponse.data ?? [];
    return {
        items,
        hasMore: items.length >= limit,
        nextCursor: items.length >= limit ? String(items.length) : undefined,
    };
}

export const feedApi = {
    /**
     * Fetch paginated feed items.
     * GET /api/v1/feed
     */
    getList: async (filters?: FeedFilters): Promise<FeedResponse> => {
        const params = new URLSearchParams();
        if (filters?.page) params.set('page', String(filters.page));
        const limit = filters?.limit ?? 20;
        params.set('size', String(limit));
        const query = params.toString();
        const response = await api.get<BackendApiResponse<PostItem[]>>(`/v1/feed${query ? `?${query}` : ''}`);
        return transformResponse(response, limit);
    },

    /**
     * Fetch feed with cursor-based pagination for infinite scroll.
     * GET /api/v1/feed?page=...&size=...
     */
    getInfinite: async (cursor?: string, limit = 20): Promise<FeedResponse> => {
        const page = cursor ? parseInt(cursor, 10) / limit : 0;
        const params = new URLSearchParams({
            page: String(Math.floor(page)),
            size: String(limit)
        });
        const response = await api.get<BackendApiResponse<PostItem[]>>(`/v1/feed?${params.toString()}`);
        return transformResponse(response, limit);
    },
};
