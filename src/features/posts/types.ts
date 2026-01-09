/**
 * Posts feature types.
 */

export interface Post {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PostComment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

export interface CreatePostInput {
    content: string;
}

export interface CreateCommentInput {
    content: string;
}

export interface PostListFilters {
    authorId?: string;
    page?: number;
    limit?: number;
}

export interface PostListResponse {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
}
