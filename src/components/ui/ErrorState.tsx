/**
 * Error state component with retry functionality.
 */

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = 'Something went wrong',
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="text-4xl mb-4" role="img" aria-hidden="true">
                ⚠️
            </span>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
            <p className="text-sm text-gray-500 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                    Try again
                </button>
            )}
        </div>
    );
}
