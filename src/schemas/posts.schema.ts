import { z } from "zod";

export const postSchema = z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    author: z.string(),
    source: z.string(),
    publishedAt: z.string().datetime(), // ISO 8601 datetime string
    url: z.string().url(),
    imageUrl: z.string().url(),
    category: z.string(),
    tags: z.array(z.string())
});

export const metadataSchema = z.object({
    totalPosts: z.number(),
    lastUpdated: z.string().datetime(),
    version: z.string()
});

export const postsSchema = z.object({
    posts: z.array(postSchema),
    metadata: metadataSchema
});

export const postsSearchSchema = z.object({
    search: z.string().default(""),
    page: z.number().catch(1).default(1),
    pageSize: z.number().catch(10).default(10),
})

// Export types for TypeScript
export type Post = z.infer<typeof postSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type PostsResponse = z.infer<typeof postsSchema>;
export type PostsSearchParams = z.infer<typeof postsSearchSchema>;