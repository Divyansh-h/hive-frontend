/**
 * Global Error Boundary.
 * Catches any unhandled errors in the component tree.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });
        // Log to error reporting service in production
        console.error('Global Error Boundary caught:', error, errorInfo);
    }

    private handleReload = (): void => {
        window.location.reload();
    };

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-primary p-6">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-6">💥</div>
                        <h1 className="text-2xl font-bold text-primary mb-3">
                            Something went wrong
                        </h1>
                        <p className="text-secondary mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>

                        {/* Error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="text-left bg-tertiary rounded-lg p-4 mb-6">
                                <summary className="text-sm text-secondary cursor-pointer">
                                    Error details
                                </summary>
                                <pre className="mt-2 text-xs text-error-500 overflow-auto max-h-40">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 text-sm font-medium text-secondary border border-default rounded-lg hover:bg-tertiary transition-colors"
                            >
                                Try again
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors"
                            >
                                Reload page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
