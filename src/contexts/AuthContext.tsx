/**
 * Mock Auth Context.
 * Provides fake authentication state for UI development.
 * No real login - just simulated auth state.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface MockUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
}

interface AuthContextValue {
    /** Current authenticated user (null if not logged in) */
    user: MockUser | null;
    /** Whether user is authenticated */
    isAuthenticated: boolean;
    /** Loading state */
    isLoading: boolean;
    /** Mock login function */
    login: (credentials?: { email: string; name?: string }) => void;
    /** Mock logout function */
    logout: () => void;
    /** Update user profile */
    updateProfile: (updates: Partial<Pick<MockUser, 'name' | 'bio'>>) => void;
}

// =============================================================================
// DEFAULT USER
// =============================================================================

const DEFAULT_MOCK_USER: MockUser = {
    id: 'current-user',
    name: 'Demo User',
    email: 'demo@example.com',
    avatarUrl: null,
    bio: 'Building amazing things with HIVE.',
};

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
    children: ReactNode;
    /** Start with user already logged in (default: true for demo) */
    defaultLoggedIn?: boolean;
}

export function AuthProvider({ children, defaultLoggedIn = true }: AuthProviderProps) {
    const [user, setUser] = useState<MockUser | null>(defaultLoggedIn ? DEFAULT_MOCK_USER : null);
    const [isLoading] = useState(false);

    const login = useCallback((credentials?: { email: string; name?: string }) => {
        setUser({
            ...DEFAULT_MOCK_USER,
            email: credentials?.email ?? DEFAULT_MOCK_USER.email,
            name: credentials?.name ?? DEFAULT_MOCK_USER.name,
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const updateProfile = useCallback((updates: Partial<Pick<MockUser, 'name' | 'bio'>>) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * Get current user ID (or null if not authenticated).
 */
export function useCurrentUserId(): string | null {
    const { user } = useAuth();
    return user?.id ?? null;
}
