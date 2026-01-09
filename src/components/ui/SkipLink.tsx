/**
 * SkipLink component for keyboard navigation.
 * Allows users to skip to main content.
 */

export function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
    return (
        <a
            href={`#${targetId}`}
            className="
        absolute -top-10 left-4 z-50
        bg-primary-600 text-white px-4 py-2 rounded-md
        focus:top-4 transition-all
        focus:outline-none focus:ring-2 focus:ring-white
      "
        >
            Skip to main content
        </a>
    );
}
