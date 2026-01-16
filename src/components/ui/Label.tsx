/**
 * Label component - consistent styling for form labels.
 */

import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export function Label({ className = '', children, required, ...props }: LabelProps) {
    return (
        <label
            className={`block text-sm font-medium text-primary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
    );
}
