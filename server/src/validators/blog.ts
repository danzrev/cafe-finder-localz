import { z } from 'zod';
import { PostStatus } from '@prisma/client';

export const createPostSchema = z.object({
  title: z.string().trim().min(3, 'Give the post a title of at least 3 characters.').max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with dashes, e.g. my-post'),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().trim().min(1, 'Post body is required.'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.ARCHIVED]).default(PostStatus.DRAFT),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;