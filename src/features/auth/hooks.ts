/**
 * Auth feature React Query hooks.
 * Handles login, register, logout, and session management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    SessionResponse,
    AuthUserSummary,
} from './types';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const authKeys = {
    all: ['auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
};

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get current session.
 * Returns user info if authenticated, null if not.
 */
export function useSession() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: async () => {
            try {
                return await api.get<SessionResponse>('/v1/auth/session');
            } catch {
                // Not authenticated - this is expected
                return null;
            }
        },
        // Session is relatively stable
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Don't retry auth checks
        retry: false,
    });
}

/**
 * Get current user from session.
 * Convenience hook that extracts user from session.
 */
export function useCurrentAuthUser(): AuthUserSummary | null {
    const { data: session } = useSession();
    return session?.user ?? null;
}

/**
 * Check if user is authenticated.
 */
export function useIsAuthenticated(): boolean {
    const { data: session, isLoading } = useSession();
    return !isLoading && session !== null;
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Login mutation.
 * On success, invalidates session query to refetch user data.
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginRequest) =>
            api.post<AuthResponse>('/v1/auth/login', credentials),

        onSuccess: (data) => {
            // Update session cache directly for instant UI update
            queryClient.setQueryData(authKeys.session(), {
                user: data.user,
                expiresAt: data.session.expiresAt,
            });
        },

        onError: () => {
            // Clear any stale session data on login failure
            queryClient.setQueryData(authKeys.session(), null);
        },
    });
}

/**
 * Register mutation.
 * On success, user is automatically logged in.
 */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterRequest) =>
            api.post<AuthResponse>('/v1/auth/register', data),

        onSuccess: (data) => {
            // Update session cache - user is now logged in
            queryClient.setQueryData(authKeys.session(), {
                user: data.user,
                expiresAt: data.session.expiresAt,
            });
        },
    });
}

/**
 * Logout mutation.
 * Clears all cached data on success.
 */
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.post<void>('/v1/auth/logout'),

        onSuccess: () => {
            // Clear session
            queryClient.setQueryData(authKeys.session(), null);
            // Clear all user-specific cached data
            queryClient.clear();
        },

        // Even if logout fails, clear local state
        onError: () => {
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.clear();
        },
    });
}
