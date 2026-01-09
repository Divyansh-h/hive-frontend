/**
 * Users query hooks.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { usersApi } from './api';

/**
 * Get current authenticated user.
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: queryKeys.users.me(),
        queryFn: () => usersApi.getMe(),
        // User data is stable, keep it longer
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Get user by ID.
 * Uses placeholder data for cold cache when prefetched data exists.
 */
export function useUser(id: string) {
    return useQuery({
        queryKey: queryKeys.users.detail(id),
        queryFn: () => usersApi.getById(id),
        enabled: !!id,
        // Use existing list data as placeholder for faster initial render
        placeholderData: (previousData) => previousData,
    });
}
