/**
 * Settings Page - User preferences and account management.
 * Features: Profile editing, Theme toggle, Account actions.
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const MAX_NAME_LENGTH = 50;
const MAX_BIO_LENGTH = 160;

// =============================================================================
// ICONS
// =============================================================================

const SunIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const MonitorIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

// =============================================================================
// TYPES
// =============================================================================

type ThemeMode = 'light' | 'dark' | 'system';

// =============================================================================
// SETTINGS SECTION COMPONENT
// =============================================================================

interface SettingsSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
    return (
        <div className="bg-secondary border border-default rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-default">
                <h2 className="text-base font-semibold text-primary">{title}</h2>
                {description && <p className="text-sm text-secondary mt-0.5">{description}</p>}
            </div>
            <div className="px-5 py-4">
                {children}
            </div>
        </div>
    );
}

// =============================================================================
// THEME SELECTOR
// =============================================================================

interface ThemeSelectorProps {
    value: ThemeMode;
    onChange: (mode: ThemeMode) => void;
}

function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
    const options: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
        { mode: 'light', icon: <SunIcon />, label: 'Light' },
        { mode: 'dark', icon: <MoonIcon />, label: 'Dark' },
        { mode: 'system', icon: <MonitorIcon />, label: 'System' },
    ];

    return (
        <div className="flex gap-2">
            {options.map(({ mode, icon, label }) => (
                <button
                    key={mode}
                    onClick={() => onChange(mode)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        value === mode
                            ? "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400 ring-2 ring-accent-500"
                            : "bg-tertiary text-secondary hover:text-primary hover:bg-opacity-80"
                    )}
                >
                    {icon}
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SettingsPage() {
    const { user, updateProfile, logout, isAuthenticated } = useAuth();

    const [name, setName] = useState(user?.name ?? '');
    const [bio, setBio] = useState(user?.bio ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeMode>('system');

    const handleThemeChange = (mode: ThemeMode) => {
        setTheme(mode);
        // Apply theme
        const root = document.documentElement;
        if (mode === 'dark') {
            root.classList.add('dark');
        } else if (mode === 'light') {
            root.classList.remove('dark');
        } else {
            // System preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const handleSave = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setSaveMessage('Name is required');
            return;
        }
        setIsSaving(true);
        setSaveMessage(null);
        await new Promise((resolve) => setTimeout(resolve, 500));
        updateProfile({ name: name.trim(), bio: bio.trim() || null });
        setIsSaving(false);
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
    }, [name, bio, updateProfile]);

    if (!isAuthenticated) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="bg-secondary border border-default rounded-xl p-8 text-center">
                    <span className="text-5xl mb-4 block">🔒</span>
                    <h2 className="text-xl font-semibold text-primary mb-2">Sign in required</h2>
                    <p className="text-sm text-secondary mb-4">Please sign in to access settings.</p>
                    <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-primary">Settings</h1>
                <Link to="/profile" className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                    View Profile
                </Link>
            </div>

            {/* Appearance Section */}
            <SettingsSection title="Appearance" description="Customize how HIVE looks">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-primary">Theme</label>
                    <ThemeSelector value={theme} onChange={handleThemeChange} />
                </div>
            </SettingsSection>

            {/* Profile Section */}
            <SettingsSection title="Profile" description="Update your profile information">
                <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-primary mb-1.5">
                            Display Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                            className="w-full px-3 py-2 bg-primary border border-default rounded-lg text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-accent-500"
                            placeholder="Your name"
                            disabled={isSaving}
                        />
                        <p className="text-xs text-tertiary mt-1">{name.length}/{MAX_NAME_LENGTH}</p>
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1.5">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
                            className="w-full px-3 py-2 bg-primary border border-default rounded-lg text-primary placeholder-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-accent-500"
                            placeholder="A short bio about yourself"
                            rows={3}
                            disabled={isSaving}
                        />
                        <p className="text-xs text-tertiary mt-1">{bio.length}/{MAX_BIO_LENGTH}</p>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email ?? ''}
                            className="w-full px-3 py-2 bg-tertiary border border-default rounded-lg text-tertiary cursor-not-allowed"
                            disabled
                        />
                        <p className="text-xs text-tertiary mt-1">Email cannot be changed</p>
                    </div>

                    {/* Save */}
                    <div className="flex items-center justify-between pt-2">
                        {saveMessage && (
                            <p className={cn("text-sm", saveMessage.includes('success') ? 'text-success-500' : 'text-error-500')}>
                                {saveMessage}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="ml-auto px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </SettingsSection>

            {/* Account Section */}
            <SettingsSection title="Account">
                <div className="space-y-4">
                    {/* Password placeholder */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium text-primary">Password</p>
                            <p className="text-xs text-tertiary">Change your password</p>
                        </div>
                        <button disabled className="px-3 py-1.5 text-sm font-medium text-secondary border border-default rounded-lg opacity-50 cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    {/* Notifications placeholder */}
                    <div className="flex items-center justify-between py-2 border-t border-default">
                        <div>
                            <p className="text-sm font-medium text-primary">Notifications</p>
                            <p className="text-xs text-tertiary">Manage email notifications</p>
                        </div>
                        <button disabled className="px-3 py-1.5 text-sm font-medium text-secondary border border-default rounded-lg opacity-50 cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    {/* Sign out */}
                    <div className="pt-4 border-t border-default">
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-error-500 border border-error-500 rounded-lg hover:bg-error-500 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                        <p className="text-xs text-tertiary mt-2">
                            This will sign you out of the demo session.
                        </p>
                    </div>
                </div>
            </SettingsSection>

            {/* Danger Zone */}
            <SettingsSection title="Danger Zone">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">Delete Account</p>
                        <p className="text-xs text-tertiary">Permanently delete your account and all data</p>
                    </div>
                    <button disabled className="px-3 py-1.5 text-sm font-medium text-error-500 border border-error-500 rounded-lg opacity-50 cursor-not-allowed">
                        Delete Account
                    </button>
                </div>
            </SettingsSection>
        </div>
    );
}
