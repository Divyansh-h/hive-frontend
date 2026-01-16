/**
 * Users API functions.
 * Connects to mock backend /v1/users endpoints.
 */

import { api } from '@/lib/api';
import type { User, UserProfile } from './types';

export const usersApi = {
    /**
     * Get current authenticated user.
     */
    getMe: (): Promise<User> => {
        return api.get<User>('/v1/users/me');
    },

    /**
     * Get user by ID (basic info).
     */
    getById: (id: string): Promise<User> => {
        return api.get<User>(`/v1/users/${id}`);
    },

    /**
     * Get user profile with counts.
     */
    getProfile: (id: string): Promise<UserProfile> => {
        return api.get<UserProfile>(`/v1/users/${id}`);
    },
};


