/**
 * Login Page.
 * Form validation, password visibility toggle, mock auth.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock authentication - accept any valid email/password
        try {
            login({ email, name: email.split('@')[0] });
            navigate('/feed');
        } catch {
            setErrors({ general: 'Invalid credentials. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        HIVE
                    </Link>
                    <p className="text-secondary mt-2">Welcome back</p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* General error */}
                        {errors.general && (
                            <div className="p-3 bg-error-100 dark:bg-error-900/30 border border-error-500 rounded-lg">
                                <p className="text-sm text-error-700 dark:text-error-400">{errors.general}</p>
                            </div>
                        )}

                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            autoComplete="email"
                            autoFocus
                        />

                        {/* Password */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-primary">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className={`
                                        w-full px-3 py-2 pr-10 text-sm
                                        bg-secondary text-primary
                                        border rounded-md
                                        placeholder:text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                                        ${errors.password ? 'border-error-500 focus:ring-error-500' : 'border-default'}
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-error-500">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Log in
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-secondary">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-accent-600 hover:text-accent-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-secondary hover:text-primary">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
