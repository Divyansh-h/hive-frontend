/**
 * Core API type definitions.
 * Shared response wrappers, error shapes, and pagination models.
 */

// =============================================================================
// BASE RESPONSE
// =============================================================================

/** Standard API response wrapper (matches backend) */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode: string | null;
    timestamp: string;
}

// =============================================================================
// ERROR SHAPES
// =============================================================================

/** API error response structure */
export interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
    errorCode: ApiErrorCode;
    timestamp: string;
}

/** Known error codes from backend */
export type ApiErrorCode =
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'RATE_LIMITED'
    | 'SERVER_ERROR'
    | string; // Allow unknown codes

/** HTTP status to error code mapping */
export const ERROR_STATUS_MAP: Record<number, ApiErrorCode> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    429: 'RATE_LIMITED',
    500: 'SERVER_ERROR',
} as const;

// =============================================================================
// PAGINATION
// =============================================================================

/** Cursor-based pagination parameters (for infinite scroll) */
export interface CursorPaginationParams {
    cursor?: string;
    limit?: number;
}

/** Cursor-based pagination response */
export interface CursorPaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

/** Offset-based pagination parameters (for page navigation) */
export interface OffsetPaginationParams {
    page?: number;
    size?: number;
}

/** Offset-based pagination response */
export interface OffsetPaginatedResponse<T> {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

// =============================================================================
// REQUEST HEADERS
// =============================================================================

/** Standard request headers */
export interface RequestHeaders {
    'Content-Type': 'application/json';
    Authorization?: `Bearer ${string}`;
    'X-Request-Id'?: string;
}
