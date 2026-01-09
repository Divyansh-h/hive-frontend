/**
 * Card component for consistent content containers.
 */

import type { HTMLAttributes, ReactNode } from 'react';

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
            className={`bg-secondary border border-default rounded-lg shadow-sm ${paddingStyles[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

/** Card header with title and optional action */
interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {description && <p className="text-sm text-secondary mt-1">{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

/** Card content wrapper */
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

/** Card footer for actions */
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`mt-4 pt-4 border-t border-subtle flex items-center justify-end gap-3 ${className}`}>
            {children}
        </div>
    );
}
