/**
 * Accessible Image component with lazy loading and error handling.
 */

import { useState, memo } from 'react';

interface ImageProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    fallback?: string;
    loading?: 'lazy' | 'eager';
}

export const Image = memo(function Image({
    src,
    alt,
    width,
    height,
    className = '',
    fallback,
    loading = 'lazy',
}: ImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    // Show fallback if error and fallback provided
    if (hasError && fallback) {
        return (
            <img
                src={fallback}
                alt={alt}
                width={width}
                height={height}
                className={className}
                loading={loading}
            />
        );
    }

    // Show placeholder on error without fallback
    if (hasError) {
        return (
            <div
                className={`bg-tertiary flex items-center justify-center text-secondary ${className}`}
                style={{ width, height }}
                role="img"
                aria-label={alt}
            >
                <span className="text-2xl">🖼️</span>
            </div>
        );
    }

    return (
        <div className="relative" style={{ width, height }}>
            {/* Loading placeholder */}
            {!isLoaded && (
                <div
                    className={`absolute inset-0 bg-tertiary animate-pulse ${className}`}
                    aria-hidden="true"
                />
            )}
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                onError={handleError}
                onLoad={handleLoad}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            />
        </div>
    );
});
