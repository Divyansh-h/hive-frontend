/**
 * Signup Page.
 * Form validation, password visibility toggle, mock auth.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Password must include uppercase, lowercase, and number';
        }

        // Confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock registration - accept any valid data
        try {
            login({ email, name: name.trim() });
            navigate('/feed');
        } catch {
            setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
            aria-label={show ? 'Hide password' : 'Show password'}
        >
            {show ? (
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
    );

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        HIVE
                    </Link>
                    <p className="text-secondary mt-2">Create your account</p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* General error */}
                        {errors.general && (
                            <div className="p-3 bg-error-100 dark:bg-error-900/30 border border-error-500 rounded-lg">
                                <p className="text-sm text-error-700 dark:text-error-400">{errors.general}</p>
                            </div>
                        )}

                        {/* Name */}
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                            autoComplete="name"
                            autoFocus
                        />

                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            autoComplete="email"
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
                                    autoComplete="new-password"
                                    className={`
                                        w-full px-3 py-2 pr-10 text-sm
                                        bg-secondary text-primary
                                        border rounded-md
                                        placeholder:text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                                        ${errors.password ? 'border-error-500 focus:ring-error-500' : 'border-default'}
                                    `}
                                />
                                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            </div>
                            {errors.password && <p className="text-sm text-error-500">{errors.password}</p>}
                            <p className="text-xs text-tertiary mt-1">
                                At least 8 characters with uppercase, lowercase, and number
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-primary">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className={`
                                        w-full px-3 py-2 pr-10 text-sm
                                        bg-secondary text-primary
                                        border rounded-md
                                        placeholder:text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                                        ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : 'border-default'}
                                    `}
                                />
                                <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-error-500">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Create Account
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="mt-4 text-xs text-center text-tertiary">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-accent-600 hover:underline">Terms</a> and{' '}
                        <a href="#" className="text-accent-600 hover:underline">Privacy Policy</a>.
                    </p>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                                Log in
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
