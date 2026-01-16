/**
 * Centralized API client for all backend calls.
 * Handles error normalization, timeouts, and response unwrapping.
 */

import { config } from './config';

// =============================================================================
// ERROR TYPES
// =============================================================================

/** Normalized API error with rich metadata */
export class ApiError extends Error {
    /** HTTP status code (0 for network errors) */
    readonly status: number;
    /** Backend error code (e.g., 'UNAUTHORIZED', 'NOT_FOUND') */
    readonly code: string;
    /** Whether this error can be retried */
    readonly retryable: boolean;
    /** Original response data if available */
    readonly data?: unknown;

    constructor(
        message: string,
        status: number,
        code: string = 'UNKNOWN_ERROR',
        retryable: boolean = false,
        data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.retryable = retryable;
        this.data = data;
    }

    /** Check if error is a client error (4xx) */
    isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    /** Check if error is a server error (5xx) */
    isServerError(): boolean {
        return this.status >= 500;
    }

    /** Check if error is a network/timeout error */
    isNetworkError(): boolean {
        return this.status === 0;
    }
}

// =============================================================================
// ERROR HELPERS
// =============================================================================

/** Map HTTP status to retryable flag */
function isRetryableStatus(status: number): boolean {
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429 || status === 0;
}

/** Extract error details from response body */
function extractErrorDetails(body: unknown): { message: string; code: string } {
    if (typeof body === 'object' && body !== null) {
        const { message, errorCode } = body as { message?: string; errorCode?: string };
        return {
            message: message ?? 'Request failed',
            code: errorCode ?? 'UNKNOWN_ERROR',
        };
    }
    return { message: 'Request failed', code: 'UNKNOWN_ERROR' };
}

// =============================================================================
// REQUEST CONFIGURATION
// =============================================================================

const DEFAULT_TIMEOUT = 30000; // 30 seconds

interface RequestOptions extends Omit<RequestInit, 'body'> {
    timeout?: number;
    /** Skip response JSON parsing (for 204 responses) */
    skipParse?: boolean;
}

// =============================================================================
// CORE REQUEST FUNCTION
// =============================================================================

/** Base fetch wrapper with timeout, error normalization, and response unwrapping */
async function request<T>(
    endpoint: string,
    options: RequestOptions & { body?: unknown } = {}
): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, skipParse, body, ...fetchOptions } = options;

    const url = `${config.api.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const { message, code } = extractErrorDetails(errorBody);

            throw new ApiError(
                message,
                response.status,
                code,
                isRetryableStatus(response.status),
                errorBody
            );
        }

        // Handle 204 No Content
        if (response.status === 204 || skipParse) {
            return undefined as T;
        }

        // Parse and unwrap response
        const json = await response.json();

        // Backend wraps responses: { success, message, data, errorCode, timestamp }
        // Unwrap to return just the data
        if (typeof json === 'object' && json !== null && 'data' in json) {
            return json.data as T;
        }

        return json as T;
    } catch (error) {
        clearTimeout(timeoutId);

        // Already an ApiError, rethrow
        if (error instanceof ApiError) {
            throw error;
        }

        // Handle abort/timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError(
                'Request timeout',
                0,
                'TIMEOUT',
                true
            );
        }

        // Handle network errors
        if (error instanceof TypeError) {
            throw new ApiError(
                'Network error - please check your connection',
                0,
                'NETWORK_ERROR',
                true
            );
        }

        // Unknown error
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error',
            0,
            'UNKNOWN_ERROR',
            false
        );
    }
}

// =============================================================================
// HTTP METHOD HELPERS
// =============================================================================

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'POST', body: data }),

    put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PUT', body: data }),

    patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PATCH', body: data }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Check if an error is an ApiError */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

/** Get user-friendly error message */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}

