/**
 * Toast notification system.
 * Provides a context for showing toast messages throughout the app.
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

const DEFAULT_DURATION = 4000;

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (type: ToastType, message: string, duration = DEFAULT_DURATION) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const toast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, toast]);

            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => removeToast(id), duration);
            }
        },
        [removeToast]
    );

    // Convenience methods
    const success = useCallback((message: string) => addToast('success', message), [addToast]);
    const error = useCallback((message: string) => addToast('error', message), [addToast]);
    const warning = useCallback((message: string) => addToast('warning', message), [addToast]);
    const info = useCallback((message: string) => addToast('info', message), [addToast]);

    return (
        <ToastContext.Provider
            value={{ toasts, addToast, removeToast, success, error, warning, info }}
        >
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

// =============================================================================
// HOOK
// =============================================================================

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// =============================================================================
// TOAST CONTAINER
// =============================================================================

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

// =============================================================================
// TOAST ITEM
// =============================================================================

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<ToastType, { bg: string; icon: string }> = {
    success: { bg: 'bg-success-500', icon: '✓' },
    error: { bg: 'bg-error-500', icon: '✕' },
    warning: { bg: 'bg-warning-500', icon: '⚠' },
    info: { bg: 'bg-accent-500', icon: 'ℹ' },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const style = TOAST_STYLES[toast.type];

    return (
        <div
            className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
            role="alert"
        >
            <span className="text-lg">{style.icon}</span>
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/80 hover:text-white text-lg leading-none"
                aria-label="Dismiss"
            >
                ×
            </button>
        </div>
    );
}
