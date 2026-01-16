/**
 * Input component with consistent styling and spacing.
 */

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-primary">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
                    w-full px-3 py-2.5 text-sm
                    bg-secondary text-primary
                    border border-default rounded-lg
                    placeholder:text-tertiary
                    transition-all duration-150 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500
                    disabled:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50
                    ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500 animate-shake' : 'hover:border-subtle'}
                    ${className}
                `}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                {...props}
            />
            {hint && !error && (
                <p id={`${inputId}-hint`} className="text-xs text-tertiary">{hint}</p>
            )}
            {error && (
                <p id={`${inputId}-error`} className="text-sm text-error-500">{error}</p>
            )}
        </div>
    );
}

/** Textarea variant */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-primary">
                    {label}
                </label>
            )}
            <textarea
                id={inputId}
                className={`
          w-full px-3 py-2 text-sm resize-none
          bg-secondary text-primary
          border border-default rounded-md
          placeholder:text-tertiary
          focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
          disabled:bg-tertiary disabled:cursor-not-allowed
          ${error ? 'border-error-500 focus:ring-error-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-sm text-error-500">{error}</p>}
        </div>
    );
}
