/**
 * Auth feature types.
 * Session management and authentication contracts.
 */

// =============================================================================
// SESSION
// =============================================================================

/** Current auth session state */
export interface AuthSession {
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}

/** Session info returned from GET /v1/auth/session */
export interface SessionResponse {
    user: AuthUserSummary;
    expiresAt: string;
}

/** Minimal user info for auth context */
export interface AuthUserSummary {
    id: string;
    name: string;
    avatarUrl: string | null;
}

// =============================================================================
// REQUESTS
// =============================================================================

/** POST /v1/auth/login */
export interface LoginRequest {
    email: string;
    password: string;
}

/** POST /v1/auth/register */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

// =============================================================================
// RESPONSES
// =============================================================================

/** Login/Register response */
export interface AuthResponse {
    session: AuthSession;
    user: AuthUserSummary;
}

// =============================================================================
// AUTH STATE
// =============================================================================

/** Client-side auth state */
export type AuthState =
    | { status: 'loading' }
    | { status: 'unauthenticated' }
    | { status: 'authenticated'; session: AuthSession; user: AuthUserSummary };
