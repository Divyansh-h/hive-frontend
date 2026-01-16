/**
 * MSW request handlers.
 * Mock API endpoints matching api-contracts.md.
 */

import { http, HttpResponse, delay as mswDelay } from 'msw';
import { config } from '@/lib/config';
import {
    getRandomLatency,
    shouldInjectError,
    getRandomError,
    buildResponse,
    buildErrorResponse,
    LATENCY,
} from './utils';
import { mockStore } from './data';

const baseUrl = config.api.baseUrl;

// =============================================================================
// MIDDLEWARE HELPERS
// =============================================================================

/** Apply latency and potential error injection. Returns error Response or null to continue. */
async function applyMiddleware(): Promise<Response | null> {
    // Simulate network latency
    await mswDelay(getRandomLatency(LATENCY.normal));

    // Random error injection (5-10%)
    if (shouldInjectError({ probability: 0.075 })) {
        const error = getRandomError();
        return HttpResponse.json(
            buildErrorResponse(error.code, error.message),
            { status: error.status }
        );
    }
    return null;
}

// =============================================================================
// AUTH HANDLERS
// =============================================================================

const authHandlers = [
    // POST /v1/auth/login
    http.post(`${baseUrl}/v1/auth/login`, async ({ request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const body = await request.json() as { email?: string; password?: string };

        if (!body.email || !body.password) {
            return HttpResponse.json(
                buildErrorResponse('VALIDATION_ERROR', 'Email and password are required'),
                { status: 400 }
            );
        }

        const user = mockStore.getCurrentUser();
        if (!user) {
            return HttpResponse.json(
                buildErrorResponse('UNAUTHORIZED', 'Invalid credentials'),
                { status: 401 }
            );
        }

        return HttpResponse.json(buildResponse({
            session: {
                userId: user.id,
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
            },
            user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
        }));
    }),

    // POST /v1/auth/register
    http.post(`${baseUrl}/v1/auth/register`, async ({ request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const body = await request.json() as { name?: string; email?: string; password?: string };

        if (!body.name || !body.email || !body.password) {
            return HttpResponse.json(
                buildErrorResponse('VALIDATION_ERROR', 'Name, email, and password are required'),
                { status: 400 }
            );
        }

        return HttpResponse.json(buildResponse({
            session: {
                userId: 'new-user-id',
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
            },
            user: {
                id: 'new-user-id',
                name: body.name,
                avatarUrl: null,
            },
        }), { status: 201 });
    }),

    // POST /v1/auth/logout
    http.post(`${baseUrl}/v1/auth/logout`, async () => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        return HttpResponse.json(buildResponse(null, 'Logged out successfully'));
    }),

    // GET /v1/auth/session
    http.get(`${baseUrl}/v1/auth/session`, async () => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const user = mockStore.getCurrentUser();
        if (!user) {
            return HttpResponse.json(
                buildErrorResponse('UNAUTHORIZED', 'No active session'),
                { status: 401 }
            );
        }

        return HttpResponse.json(buildResponse({
            user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
        }));
    }),

    // POST /v1/auth/refresh
    http.post(`${baseUrl}/v1/auth/refresh`, async () => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        return HttpResponse.json(buildResponse({
            accessToken: 'new-mock-access-token',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
        }));
    }),
];

// =============================================================================
// USER HANDLERS
// =============================================================================

const userHandlers = [
    // GET /v1/users/me
    http.get(`${baseUrl}/v1/users/me`, async () => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const user = mockStore.getCurrentUser();
        if (!user) {
            return HttpResponse.json(
                buildErrorResponse('UNAUTHORIZED', 'Not authenticated'),
                { status: 401 }
            );
        }

        return HttpResponse.json(buildResponse(user));
    }),

    // PATCH /v1/users/me
    http.patch(`${baseUrl}/v1/users/me`, async ({ request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const body = await request.json() as { name?: string; bio?: string };
        const user = mockStore.getCurrentUser();

        if (!user) {
            return HttpResponse.json(
                buildErrorResponse('UNAUTHORIZED', 'Not authenticated'),
                { status: 401 }
            );
        }

        // Update user (in real impl, would modify store)
        const updated = { ...user, ...body };
        return HttpResponse.json(buildResponse(updated));
    }),

    // GET /v1/users/:id
    http.get(`${baseUrl}/v1/users/:id`, async ({ params }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const user = mockStore.getUser(id as string);

        if (!user) {
            return HttpResponse.json(
                buildErrorResponse('NOT_FOUND', 'User not found'),
                { status: 404 }
            );
        }

        return HttpResponse.json(buildResponse(user));
    }),

    // GET /v1/users/:id/posts
    http.get(`${baseUrl}/v1/users/:id/posts`, async ({ params, request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') ?? '0', 10);
        const size = parseInt(url.searchParams.get('size') ?? '20', 10);

        const allPosts = mockStore.getPostsByUser(id as string);
        const start = page * size;
        const end = start + size;
        const posts = allPosts.slice(start, end);

        return HttpResponse.json(buildResponse({
            posts,
            total: allPosts.length,
            page,
            totalPages: Math.ceil(allPosts.length / size),
        }));
    }),
];

// =============================================================================
// POST HANDLERS
// =============================================================================

const postHandlers = [
    // POST /v1/posts
    http.post(`${baseUrl}/v1/posts`, async ({ request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const body = await request.json() as { content?: string; imageUrl?: string };

        if (!body.content?.trim()) {
            return HttpResponse.json(
                buildErrorResponse('VALIDATION_ERROR', 'Content is required'),
                { status: 400 }
            );
        }

        const post = mockStore.createPost(body.content, body.imageUrl);
        return HttpResponse.json(buildResponse({
            id: post.id,
            createdAt: post.createdAt,
        }), { status: 201 });
    }),

    // GET /v1/posts/:id
    http.get(`${baseUrl}/v1/posts/:id`, async ({ params }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const post = mockStore.getPost(id as string);

        if (!post) {
            return HttpResponse.json(
                buildErrorResponse('NOT_FOUND', 'Post not found'),
                { status: 404 }
            );
        }

        return HttpResponse.json(buildResponse(post));
    }),

    // DELETE /v1/posts/:id
    http.delete(`${baseUrl}/v1/posts/:id`, async ({ params }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const deleted = mockStore.deletePost(id as string);

        if (!deleted) {
            return HttpResponse.json(
                buildErrorResponse('NOT_FOUND', 'Post not found'),
                { status: 404 }
            );
        }

        return new HttpResponse(null, { status: 204 });
    }),

    // POST /v1/posts/:id/like
    http.post(`${baseUrl}/v1/posts/:id/like`, async ({ params }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const liked = mockStore.likePost(id as string);

        if (!liked) {
            return HttpResponse.json(
                buildErrorResponse('NOT_FOUND', 'Post not found or already liked'),
                { status: 404 }
            );
        }

        return new HttpResponse(null, { status: 204 });
    }),

    // DELETE /v1/posts/:id/like
    http.delete(`${baseUrl}/v1/posts/:id/like`, async ({ params }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const { id } = params;
        const unliked = mockStore.unlikePost(id as string);

        if (!unliked) {
            return HttpResponse.json(
                buildErrorResponse('NOT_FOUND', 'Post not found or not liked'),
                { status: 404 }
            );
        }

        return new HttpResponse(null, { status: 204 });
    }),
];

// =============================================================================
// FEED HANDLERS
// =============================================================================

const feedHandlers = [
    // GET /v1/feed
    http.get(`${baseUrl}/v1/feed`, async ({ request }) => {
        const errorResponse = await applyMiddleware();
        if (errorResponse) return errorResponse;

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') ?? '0', 10);
        const size = parseInt(url.searchParams.get('size') ?? '20', 10);

        const { items, hasMore } = mockStore.getFeed(page, size);

        return HttpResponse.json(buildResponse({
            items,
            hasMore,
            nextCursor: hasMore ? String((page + 1) * size) : null,
        }));
    }),
];

// =============================================================================
// EXPORT ALL HANDLERS
// =============================================================================

export const handlers = [
    ...authHandlers,
    ...userHandlers,
    ...postHandlers,
    ...feedHandlers,
];
