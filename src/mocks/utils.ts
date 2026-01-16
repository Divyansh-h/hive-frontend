/**
 * MSW mock utilities.
 * Shared helpers for simulating backend behavior.
 */

// =============================================================================
// LATENCY SIMULATION
// =============================================================================

/** Latency range configuration */
export interface LatencyConfig {
    min: number;
    max: number;
}

/** Default latency ranges by operation type */
export const LATENCY: Record<string, LatencyConfig> = {
    fast: { min: 50, max: 150 },
    normal: { min: 100, max: 300 },
    slow: { min: 300, max: 800 },
    verySlow: { min: 800, max: 2000 },
} as const;

/** Get a random delay within the specified latency range */
export function getRandomLatency(config: LatencyConfig = LATENCY.normal): number {
    return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
}

/** Create a delay promise */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// ERROR INJECTION
// =============================================================================

/** Error injection configuration */
export interface ErrorInjectionConfig {
    /** Probability of error (0-1), default: 0.075 (7.5%) */
    probability?: number;
    /** Possible error codes to inject */
    errorCodes?: ErrorCode[];
}

export type ErrorCode = 'SERVER_ERROR' | 'RATE_LIMITED' | 'VALIDATION_ERROR';

const DEFAULT_ERROR_CONFIG: Required<ErrorInjectionConfig> = {
    probability: 0.075, // 7.5% - between 5-10%
    errorCodes: ['SERVER_ERROR', 'RATE_LIMITED'],
};

/** Error code to HTTP status mapping */
const ERROR_STATUS: Record<ErrorCode, number> = {
    SERVER_ERROR: 500,
    RATE_LIMITED: 429,
    VALIDATION_ERROR: 400,
};

/** Check if we should inject an error based on probability */
export function shouldInjectError(config: ErrorInjectionConfig = {}): boolean {
    const { probability = DEFAULT_ERROR_CONFIG.probability } = config;
    return Math.random() < probability;
}

/** Get a random error to inject */
export function getRandomError(config: ErrorInjectionConfig = {}): {
    status: number;
    code: ErrorCode;
    message: string;
} {
    const { errorCodes = DEFAULT_ERROR_CONFIG.errorCodes } = config;
    const code = errorCodes[Math.floor(Math.random() * errorCodes.length)];

    const messages: Record<ErrorCode, string> = {
        SERVER_ERROR: 'Internal server error. Please try again later.',
        RATE_LIMITED: 'Too many requests. Please slow down.',
        VALIDATION_ERROR: 'Invalid request data.',
    };

    return {
        status: ERROR_STATUS[code],
        code,
        message: messages[code],
    };
}

// =============================================================================
// RESPONSE BUILDERS
// =============================================================================

/** Build a successful API response */
export function buildResponse<T>(data: T, message = 'Success'): {
    success: true;
    message: string;
    data: T;
    errorCode: null;
    timestamp: string;
} {
    return {
        success: true,
        message,
        data,
        errorCode: null,
        timestamp: new Date().toISOString(),
    };
}

/** Build an error API response */
export function buildErrorResponse(
    code: string,
    message: string
): {
    success: false;
    message: string;
    data: null;
    errorCode: string;
    timestamp: string;
} {
    return {
        success: false,
        message,
        data: null,
        errorCode: code,
        timestamp: new Date().toISOString(),
    };
}

// =============================================================================
// ID GENERATION
// =============================================================================

let idCounter = 0;

/** Generate a unique ID */
export function generateId(prefix = ''): string {
    idCounter += 1;
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/** Reset ID counter (for testing) */
export function resetIdCounter(): void {
    idCounter = 0;
}
