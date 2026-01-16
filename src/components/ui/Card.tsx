/**
 * Card component for consistent content containers.
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
    return (
        <div
            className={cn('bg-secondary border border-default rounded-lg shadow-sm', paddingStyles[padding], className)}
            {...props}
        >
            {children}
        </div>
    );
}

/** Card header section */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    );
}

/** Card title */
export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-primary', className)} {...props}>
            {children}
        </h3>
    );
}

/** Card description */
export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-secondary', className)} {...props}>
            {children}
        </p>
    );
}

/** Card content wrapper */
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

/** Card footer for actions */
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)}>
            {children}
        </div>
    );
}

