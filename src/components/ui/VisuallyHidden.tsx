/**
 * VisuallyHidden component for accessible screen reader text.
 */

import type { ReactNode } from 'react';

interface VisuallyHiddenProps {
    children: ReactNode;
    as?: 'span' | 'div';
}

export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
    return (
        <Tag
            className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            style={{ clip: 'rect(0, 0, 0, 0)' }}
        >
            {children}
        </Tag>
    );
}
