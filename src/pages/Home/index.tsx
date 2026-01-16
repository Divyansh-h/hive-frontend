/**
 * Public Landing Page (Marketing).
 * Clean, minimal, professional design.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';


export default function HomePage() {
    return (
        <div className="min-h-screen bg-primary">
            {/* Header */}
            <header className="border-b border-default bg-secondary">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-xl font-semibold text-primary">HIVE</span>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight text-balance">
                        The Social Feed Built for Speed
                    </h1>
                    <p className="mt-6 text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
                        HIVE delivers a lightning-fast, distraction-free social experience.
                        Share thoughts, connect with others, and enjoy a feed that respects
                        your time and privacy.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link to="/signup">Get Started — It's Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to="/login">Log in to Your Account</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-secondary">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold text-primary text-center mb-12">
                        Why Choose HIVE?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1: Speed */}
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-3">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <CardTitle>Lightning Fast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-secondary text-sm leading-relaxed">
                                    Optimistic updates and intelligent caching mean your feed loads
                                    instantly. No spinners, no waiting — just content.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2: Scale */}
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center mb-3">
                                    <span className="text-2xl">📈</span>
                                </div>
                                <CardTitle>Built to Scale</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-secondary text-sm leading-relaxed">
                                    Engineered with infinite scroll, smart pagination, and efficient
                                    data fetching. Handles millions of posts effortlessly.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3: Privacy */}
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mb-3">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <CardTitle>Privacy First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-secondary text-sm leading-relaxed">
                                    No invasive tracking, no algorithmic manipulation. Your data
                                    stays yours. A clean, honest social experience.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-primary text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-accent-600 text-white flex items-center justify-center mx-auto mb-4 font-semibold">
                                1
                            </div>
                            <h3 className="font-medium text-primary mb-2">Create Your Account</h3>
                            <p className="text-secondary text-sm">
                                Sign up in seconds. No lengthy forms, no unnecessary questions.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-accent-600 text-white flex items-center justify-center mx-auto mb-4 font-semibold">
                                2
                            </div>
                            <h3 className="font-medium text-primary mb-2">Share Your Thoughts</h3>
                            <p className="text-secondary text-sm">
                                Post updates, ideas, or moments. Simple text, maximum impact.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-accent-600 text-white flex items-center justify-center mx-auto mb-4 font-semibold">
                                3
                            </div>
                            <h3 className="font-medium text-primary mb-2">Connect & Engage</h3>
                            <p className="text-secondary text-sm">
                                Like, comment, and follow. Build genuine connections, not metrics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 bg-secondary border-t border-default">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-primary mb-4">
                        Ready to Join?
                    </h2>
                    <p className="text-secondary mb-8">
                        Experience social media the way it should be — fast, private, and focused.
                    </p>
                    <Button size="lg" asChild>
                        <Link to="/signup">Create Your Account</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-default">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-tertiary">© 2026 HIVE. All rights reserved.</span>
                    <div className="flex items-center gap-6 text-sm text-secondary">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
