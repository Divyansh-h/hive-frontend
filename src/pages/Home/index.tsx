/**
 * Public Landing Page - Minimal, Calm, Professional.
 * L6: Enhanced scroll experience with progress awareness.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// Animation variants - total < 800ms, no bounce/elastic
const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    }),
};

export default function HomePage() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll progress tracking (no hijacking)
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Navbar scroll shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-primary">
            {/* Scroll Progress Bar - Accessible, non-intrusive */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-accent-500 origin-left z-[100]"
                style={{ scaleX }}
                aria-hidden="true"
            />

            {/* ================================================================
                NAVBAR - with scroll shadow
            ================================================================ */}
            <header
                className={`sticky top-0 z-50 border-b bg-secondary/95 backdrop-blur-sm transition-shadow duration-200 ${isScrolled
                    ? 'border-default shadow-md'
                    : 'border-transparent shadow-none'
                    }`}
            >
                <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/hive.png"
                            alt="HIVE Logo"
                            className="w-8 h-8 transition-transform duration-150 group-hover:scale-105"
                        />
                        <span className="text-lg font-semibold text-primary">HIVE</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                    </div>
                </nav>
            </header>

            {/* ================================================================
                HERO SECTION - with framer-motion animations
            ================================================================ */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Headline: fade + upward motion, 0-200ms */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-primary leading-[1.15] tracking-tight"
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        variants={fadeUpVariants}
                    >
                        A social feed built for
                        <br />
                        <span className="text-accent-600">clarity and speed</span>
                    </motion.h1>

                    {/* Subtext: delayed fade, 200-400ms */}
                    <motion.p
                        className="mt-6 text-lg text-secondary leading-relaxed max-w-xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        custom={0.2}
                        variants={fadeUpVariants}
                    >
                        No algorithms. No noise. Just the content you chose to follow,
                        delivered instantly.
                    </motion.p>

                    {/* CTA buttons: staggered appearance, 400-700ms */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            custom={0.4}
                            variants={fadeUpVariants}
                        >
                            <Button size="lg" className="animate-pulse-once shadow-lg" asChild>
                                <Link to="/signup">Start for free →</Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            custom={0.5}
                            variants={fadeUpVariants}
                        >
                            <Button size="lg" variant="ghost" className="text-secondary hover:text-primary" asChild>
                                <Link to="#architecture" onClick={(e) => { e.preventDefault(); document.querySelector('#architecture')?.scrollIntoView({ behavior: 'smooth' }); }}>Learn how it works</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================================================================
                DIFFERENTIATORS (3 CARDS) - scroll-triggered animations
            ================================================================ */}
            <section className="py-20 px-6 bg-gradient-to-b from-secondary via-secondary to-primary/50">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        className="text-sm font-medium text-accent-600 text-center uppercase tracking-wider mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
                    >
                        Why HIVE?
                    </motion.h2>
                    <motion.p
                        className="text-2xl font-semibold text-primary text-center mb-12 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                    >
                        Built differently, on purpose.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Speed */}
                        <motion.div
                            className="group p-6 rounded-xl bg-primary border border-transparent hover:border-default hover:shadow-lg transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <svg
                                    className="w-5 h-5 text-accent-600 transition-transform duration-150 group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-semibold text-primary mb-2">Instant Loading</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Optimistic updates and smart caching. Your feed appears before you can blink.
                            </p>
                        </motion.div>

                        {/* Card 2: Privacy */}
                        <motion.div
                            className="group p-6 rounded-xl bg-primary border border-transparent hover:border-default hover:shadow-lg transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center mb-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <svg
                                    className="w-5 h-5 text-success-600 transition-transform duration-150 group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-semibold text-primary mb-2">Privacy Respecting</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                No tracking pixels. No behavioral profiling. Your data stays yours.
                            </p>
                        </motion.div>

                        {/* Card 3: Simplicity */}
                        <motion.div
                            className="group p-6 rounded-xl bg-primary border border-transparent hover:border-default hover:shadow-lg transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mb-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <svg
                                    className="w-5 h-5 text-warning-600 transition-transform duration-150 group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </motion.div>
                            <h3 className="text-base font-semibold text-primary mb-2">Distraction Free</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                A chronological feed. No endless scrolling tricks. Close the app when you're done.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================================================================
                BUILT LIKE INFRASTRUCTURE - Animated diagram
            ================================================================ */}
            <section id="architecture" className="py-20 px-6 bg-primary">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        className="text-sm font-medium text-accent-600 text-center uppercase tracking-wider mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4 }}
                    >
                        Architecture
                    </motion.h2>
                    <motion.p
                        className="text-2xl font-semibold text-primary text-center mb-16"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        Built like infrastructure.
                    </motion.p>

                    {/* Diagram: Feed → Cache → DB */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        {/* Layer 1: Feed */}
                        <motion.div
                            className="w-full md:w-48 p-6 rounded-xl bg-secondary border-2 border-accent-200 dark:border-accent-800 text-center"
                            initial={{ opacity: 0.3, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-primary">Feed</p>
                            <p className="text-xs text-secondary mt-1">React Query</p>
                        </motion.div>

                        {/* Arrow 1 */}
                        <motion.div
                            className="text-tertiary hidden md:block"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.div>
                        <motion.div
                            className="text-tertiary md:hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.div>

                        {/* Layer 2: Cache */}
                        <motion.div
                            className="w-full md:w-48 p-6 rounded-xl bg-secondary border-2 border-success-200 dark:border-success-800 text-center"
                            initial={{ opacity: 0.3, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-primary">Cache</p>
                            <p className="text-xs text-secondary mt-1">In-memory</p>
                        </motion.div>

                        {/* Arrow 2 */}
                        <motion.div
                            className="text-tertiary hidden md:block"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.div>
                        <motion.div
                            className="text-tertiary md:hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.div>

                        {/* Layer 3: Database */}
                        <motion.div
                            className="w-full md:w-48 p-6 rounded-xl bg-secondary border-2 border-warning-200 dark:border-warning-800 text-center"
                            initial={{ opacity: 0.3, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
                        >
                            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-warning-100 dark:bg-warning-900/40 flex items-center justify-center">
                                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-primary">Database</p>
                            <p className="text-xs text-secondary mt-1">PostgreSQL</p>
                        </motion.div>
                    </div>

                    {/* Description with performance targets */}
                    <motion.div
                        className="mt-12 text-center max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <p className="text-sm text-secondary leading-relaxed">
                            Requests hit the cache first. Only cold queries touch the database.
                            <br />
                            <span className="text-tertiary">Result: sub-100ms response times.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ================================================================
                CALL TO ACTION
            ================================================================ */}
            <section className="py-20 px-6 bg-secondary">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.h2
                        className="text-2xl font-semibold text-primary mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        Ready to try it?
                    </motion.h2>
                    <motion.p
                        className="text-secondary mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        No credit card. No commitment. Just sign up and start posting.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Button size="lg" className="shadow-lg" asChild>
                            <Link to="/signup">Create free account</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to="/login">Sign in</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ================================================================
                FOOTER
            ================================================================ */}
            <footer className="py-8 px-6 border-t border-default">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/hive.png" alt="HIVE" className="w-5 h-5 opacity-60" />
                        <span className="text-sm text-tertiary">© 2026 HIVE</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-secondary">
                        <a href="#" className="hover:text-primary transition-colors duration-150">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors duration-150">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors duration-150">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
