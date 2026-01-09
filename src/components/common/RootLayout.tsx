/**
 * RootLayout - Base layout shell for the application.
 * Provides consistent structure with ARIA landmarks and skip link.
 */

import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SkipLink } from '@/components/ui/SkipLink';

interface RootLayoutProps {
    children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-primary">
            {/* Skip link for keyboard navigation */}
            <SkipLink targetId="main-content" />

            {/* Header */}
            <header
                className="h-16 border-b border-default bg-secondary px-6 flex items-center justify-between shrink-0"
                role="banner"
            >
                <a
                    href="/"
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded"
                    aria-label="HIVE home"
                >
                    <span className="text-xl font-semibold text-primary">HIVE</span>
                </a>
                <nav className="flex items-center gap-4" role="navigation" aria-label="Main navigation">
                    <ThemeToggle />
                </nav>
            </header>

            {/* Main content */}
            <main id="main-content" className="flex-1 p-6" role="main" tabIndex={-1}>
                {children}
            </main>

            {/* Footer */}
            <footer
                className="h-12 border-t border-default bg-secondary px-6 flex items-center justify-center shrink-0"
                role="contentinfo"
            >
                <span className="text-sm text-secondary">© 2026 HIVE</span>
            </footer>
        </div>
    );
}
