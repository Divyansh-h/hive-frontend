/**
 * Utility for merging Tailwind CSS classes.
 * Used by shadcn-style components for className composition.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
