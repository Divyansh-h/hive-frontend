/**
 * Button component with variants and sizes.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-accent-600 text-white hover:bg-accent-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700',
    secondary:
        'bg-secondary text-primary border border-default hover:bg-tertiary disabled:opacity-50',
    ghost:
        'bg-transparent text-secondary hover:bg-tertiary hover:text-primary disabled:opacity-50',
    danger:
        'bg-error-500 text-white hover:bg-error-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled ?? isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
