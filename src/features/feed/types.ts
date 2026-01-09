/**
 * Feed feature types - aligned with backend API response.
 */

/**
 * Post response from the backend API.
 * Maps to com.hive.content.dto.PostResponse
 */
export interface PostItem {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
}

export interface FeedFilters {
    page?: number;
    limit?: number;
}

/**
 * Backend API response structure.
 * The backend returns { success, message, data: PostItem[], timestamp }
 */
export interface BackendApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode: string | null;
    timestamp: string;
}

/**
 * Feed response for React Query hooks.
 * Transformed from backend response.
 */
export interface FeedResponse {
    items: PostItem[];
    nextCursor?: string;
    hasMore: boolean;
}
