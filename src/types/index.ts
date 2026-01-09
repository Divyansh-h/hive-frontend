/**
 * Global TypeScript type definitions.
 * Feature-specific types should remain in their respective feature folders.
 */

/** Common API response wrapper */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

/** Pagination metadata */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationMeta;
}
