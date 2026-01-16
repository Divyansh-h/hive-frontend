/**
 * AppShell - Application layout with navbar and sidebar.
 * Responsive design with collapsible sidebar on mobile.
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SkipLink } from '@/components/ui/SkipLink';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

// =============================================================================
// ICONS
// =============================================================================

const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// =============================================================================
// NAV ITEMS
// =============================================================================

const NAV_ITEMS = [
    { to: '/feed', label: 'Home', icon: HomeIcon },
    { to: '/profile', label: 'Profile', icon: UserIcon },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-primary">
            <SkipLink targetId="main-content" />

            {/* Top Navbar */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-secondary border-b border-default z-40">
                <div className="h-full px-4 flex items-center justify-between">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg"
                            aria-label="Toggle menu"
                        >
                            <MenuIcon />
                        </button>
                        <NavLink to="/feed" className="text-xl font-semibold text-primary">
                            HIVE
                        </NavLink>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <SearchIcon />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-tertiary text-primary border-none rounded-lg placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
                                <SearchIcon />
                            </div>
                        </div>
                    </div>

                    {/* Right: User menu */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-sm font-medium text-secondary">
                            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-14 left-0 bottom-0 w-64 bg-secondary border-r border-default z-50
                    transform transition-transform duration-200 ease-in-out
                    lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Mobile close button */}
                <div className="lg:hidden flex justify-end p-2">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg"
                        aria-label="Close menu"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1" role="navigation" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
                                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                                }`
                            }
                        >
                            <item.icon />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-default">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-sm font-medium text-secondary">
                            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">{user?.name ?? 'Guest'}</p>
                            <p className="text-xs text-tertiary truncate">{user?.email ?? 'Not logged in'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main
                id="main-content"
                className="pt-14 lg:pl-64 min-h-screen"
                role="main"
                tabIndex={-1}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
