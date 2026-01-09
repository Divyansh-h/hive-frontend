/**
 * Users API functions.
 */

import { api } from '@/lib/api';
import type { User } from './types';

export const usersApi = {
    /**
     * Get current authenticated user.
     */
    getMe: (): Promise<User> => {
        return api.get<User>('/users/me');
    },

    /**
     * Get user by ID.
     */
    getById: (id: string): Promise<User> => {
        return api.get<User>(`/users/${id}`);
    },
};
