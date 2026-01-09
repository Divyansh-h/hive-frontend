/**
 * Global Error Boundary for React Query errors.
 * Catches errors thrown by queries (throwOnError: true).
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ApiError } from '@/lib/api';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class QueryErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log to error reporting service
        console.error('Query Error Boundary caught:', error, errorInfo);
    }

    private handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const error = this.state.error;
            const isApiError = error instanceof ApiError;

            return (
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {isApiError
                                ? `Error ${error.status}: ${error.message}`
                                : error?.message ?? 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
