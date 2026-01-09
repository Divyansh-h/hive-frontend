/**
 * Create Post page with optimistic updates.
 */

import { useState } from 'react';
import { useCreatePostOptimistic } from '@/features/posts/useCreatePostOptimistic';

interface CreatePostPageProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CreatePostPage({ onSuccess, onCancel }: CreatePostPageProps) {
    const [content, setContent] = useState('');
    const { mutate, isPending, isError, error } = useCreatePostOptimistic();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        mutate(
            { content: content.trim() },
            {
                onSuccess: () => {
                    setContent('');
                    onSuccess?.();
                },
            }
        );
    };

    const maxLength = 500;
    const remaining = maxLength - content.length;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Post</h2>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        maxLength={maxLength}
                        rows={4}
                        disabled={isPending}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />

                    {/* Character count */}
                    <div className="flex items-center justify-between mt-2">
                        <span
                            className={`text-xs ${remaining < 50 ? 'text-orange-500' : 'text-gray-400'}`}
                        >
                            {remaining} characters remaining
                        </span>
                    </div>

                    {/* Error message */}
                    {isError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {error instanceof Error ? error.message : 'Failed to create post'}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isPending || !content.trim()}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
