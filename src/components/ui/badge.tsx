/**
 * Badge component with variants.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
                secondary: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
                success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                outline: 'border border-default text-secondary',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
