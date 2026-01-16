/**
 * Button component with variants.
 * Built on Radix Slot for composition.
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    // Base styles
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-accent-600 text-white hover:bg-accent-700',
                destructive: 'bg-error-500 text-white hover:bg-error-600',
                outline: 'border border-default bg-transparent text-primary hover:bg-tertiary',
                secondary: 'bg-tertiary text-primary hover:bg-neutral-200 dark:hover:bg-neutral-700',
                ghost: 'text-secondary hover:bg-tertiary hover:text-primary',
                link: 'text-accent-600 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-12 px-6 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, disabled, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled ?? isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
