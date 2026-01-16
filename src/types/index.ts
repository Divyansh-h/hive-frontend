/**
 * Global TypeScript type definitions.
 * Re-exports core API types. Feature-specific types remain in their feature folders.
 */

// Core API types
export type {
    ApiResponse,
    ApiErrorResponse,
    ApiErrorCode,
    CursorPaginationParams,
    CursorPaginatedResponse,
    OffsetPaginationParams,
    OffsetPaginatedResponse,
    RequestHeaders,
} from './api';

export { ERROR_STATUS_MAP } from './api';

// Legacy aliases for backwards compatibility
export type { OffsetPaginatedResponse as PaginatedResponse } from './api';

