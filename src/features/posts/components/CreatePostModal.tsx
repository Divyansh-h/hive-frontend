/**
 * Create Post Modal component.
 * Features: character limit, validation, optimistic updates.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useCreatePostOptimistic } from '../useCreatePostOptimistic';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_CONTENT_LENGTH = 500;
const WARNING_THRESHOLD = 450; // Show warning when approaching limit

// =============================================================================
// TYPES
// =============================================================================

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { mutate: createPost, isPending } = useCreatePostOptimistic();

    // Focus textarea when modal opens
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setError(null);
        }
    }, [isOpen]);

    // Handle content change with character limit
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_CONTENT_LENGTH) {
            setContent(newContent);
            setError(null);
        }
    }, []);

    // Handle submit
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setError('Post content cannot be empty');
            return;
        }

        if (trimmedContent.length > MAX_CONTENT_LENGTH) {
            setError(`Content exceeds ${MAX_CONTENT_LENGTH} characters`);
            return;
        }

        createPost(
            { content: trimmedContent },
            {
                onSuccess: () => {
                    setContent('');
                    setError(null);
                    onClose();
                    onSuccess?.();
                },
                onError: (err) => {
                    setError(getErrorMessage(err));
                },
            }
        );
    }, [content, createPost, onClose, onSuccess]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Cmd/Ctrl + Enter to submit
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
        // Escape to close
        if (e.key === 'Escape') {
            onClose();
        }
    }, [handleSubmit, onClose]);

    // Calculated values
    const charactersRemaining = MAX_CONTENT_LENGTH - content.length;
    const isOverLimit = charactersRemaining < 0;
    const isNearLimit = charactersRemaining <= (MAX_CONTENT_LENGTH - WARNING_THRESHOLD);
    const canSubmit = content.trim().length > 0 && !isOverLimit && !isPending;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-post-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-secondary rounded-xl border border-default shadow-lg"
                onKeyDown={handleKeyDown}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-default">
                    <h2
                        id="create-post-title"
                        className="text-lg font-semibold text-primary"
                    >
                        Create Post
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-tertiary transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-4">
                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="What's on your mind?"
                            className="w-full h-32 px-3 py-2 bg-primary border border-default rounded-lg text-primary placeholder-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                            disabled={isPending}
                            aria-describedby="char-count error-message"
                        />

                        {/* Character count */}
                        <div className="flex items-center justify-between mt-2">
                            <div id="char-count">
                                <span
                                    className={`text-sm ${isOverLimit
                                            ? 'text-error-500 font-medium'
                                            : isNearLimit
                                                ? 'text-warning-500'
                                                : 'text-tertiary'
                                        }`}
                                >
                                    {charactersRemaining} characters remaining
                                </span>
                            </div>

                            {/* Progress indicator */}
                            <div className="w-8 h-8 relative">
                                <svg
                                    className="w-8 h-8 -rotate-90"
                                    viewBox="0 0 32 32"
                                >
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="text-tertiary opacity-20"
                                    />
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray={`${(content.length / MAX_CONTENT_LENGTH) * 88} 88`}
                                        className={
                                            isOverLimit
                                                ? 'text-error-500'
                                                : isNearLimit
                                                    ? 'text-warning-500'
                                                    : 'text-accent-500'
                                        }
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p
                                id="error-message"
                                className="mt-2 text-sm text-error-500"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-default">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary rounded-lg hover:bg-tertiary transition-colors"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Posting...
                                </span>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </form>

                {/* Keyboard hint */}
                <div className="px-4 pb-3">
                    <p className="text-xs text-tertiary text-center">
                        Press <kbd className="px-1 py-0.5 bg-tertiary rounded text-secondary">⌘</kbd> + <kbd className="px-1 py-0.5 bg-tertiary rounded text-secondary">Enter</kbd> to post
                    </p>
                </div>
            </div>
        </div>
    );
}
