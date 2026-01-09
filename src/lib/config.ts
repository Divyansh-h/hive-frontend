/**
 * Application configuration derived from environment variables.
 * All env access should go through this module.
 */

export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL ?? '/api',
    },
    app: {
        name: import.meta.env.VITE_APP_NAME ?? 'HIVE',
        version: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
    },
} as const;
