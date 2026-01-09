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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="text-4xl mb-4" role="img" aria-hidden="true">
                {icon}
            </span>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
