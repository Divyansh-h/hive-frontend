/**
 * Empty state component for when there's no content.
 */

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <span className="text-5xl mb-6" role="img" aria-hidden="true">
                {icon}
            </span>
            <h3 className="text-lg font-semibold text-primary mb-2 text-balance">{title}</h3>
            {description && <p className="text-sm text-secondary mb-6 max-w-sm leading-relaxed">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-5 py-2.5 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

