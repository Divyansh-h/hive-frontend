/**
 * Signup Page - A1: Structural Layout.
 * Centered AuthCard with logo, form, and switch link.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Simulate initial page load
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 500); // 500ms initial load simulation
        return () => clearTimeout(timer);
    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState((location.state as any)?.email || '');
    const [password, setPassword] = useState((location.state as any)?.password || '');
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
            disabled={isSubmitting}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors duration-150 disabled:opacity-50"
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

    if (isInitialLoading) {
        return (
            <div className="min-h-screen auth-background flex items-center justify-center p-6">
                <AuthSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen auth-background flex items-center justify-center p-6">
            <motion.div
                className="w-full max-w-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Logo + Header */}
                <motion.div className="text-center mb-8" variants={itemVariants}>
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <img src="/hive.png" alt="HIVE" className="w-10 h-10" />
                    </Link>
                    <h1 className="text-2xl font-semibold text-primary">Create your account</h1>
                    <p className="text-sm text-secondary mt-1">Join HIVE for a calmer feed</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card padding="lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                error={errors.email}
                                autoComplete="email"
                            />

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-primary">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting}
                                        autoComplete="new-password"
                                        className={`
                                        w-full px-3 py-2.5 pr-10 text-sm
                                        bg-secondary text-primary
                                        border rounded-lg
                                        placeholder:text-tertiary
                                        transition-all duration-150 ease-in-out
                                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500
                                        disabled:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50
                                        ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500 animate-shake' : 'hover:border-subtle'}
                                    `}
                                    />
                                    <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                </div>
                                {errors.password && <p className="text-sm text-error-500">{errors.password}</p>}
                                {!errors.password && (
                                    <p className="text-xs text-tertiary">
                                        At least 8 characters with uppercase, lowercase, and number
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-primary">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isSubmitting}
                                        autoComplete="new-password"
                                        className={`
                                        w-full px-3 py-2.5 pr-10 text-sm
                                        bg-secondary text-primary
                                        border rounded-lg
                                        placeholder:text-tertiary
                                        transition-all duration-150 ease-in-out
                                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500
                                        disabled:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50
                                        ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500 animate-shake' : 'hover:border-subtle'}
                                    `}
                                    />
                                    <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-error-500">{errors.confirmPassword}</p>}
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                                Create account
                            </Button>
                        </form>

                        {/* Terms */}
                        <p className="mt-6 text-xs text-center text-tertiary">
                            By signing up, you agree to our{' '}
                            <a href="#" className="text-accent-600 hover:underline">Terms</a>{' '}and{' '}
                            <a href="#" className="text-accent-600 hover:underline">Privacy Policy</a>.
                        </p>

                        {/* Footer */}
                        <div className="mt-4 pt-6 border-t border-default text-center">
                            <p className="text-sm text-secondary">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    state={{ email, password }}
                                    className="text-accent-600 hover:text-accent-700 font-medium"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* Back to home */}
                <motion.div className="mt-6 text-center" variants={itemVariants}>
                    <Link to="/" className="text-sm text-secondary hover:text-primary">
                        ← Back to home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
