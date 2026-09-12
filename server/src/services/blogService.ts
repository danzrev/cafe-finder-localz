import { PostStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, paginate } from '../utils/pagination.js';
import { slugify } from '@cafefinder/shared';
import type { CreatePostBody } from '../validators/blog.js';

export const blogService = {
  async list(opts: { page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination({ page: opts.page, pageSize: opts.pageSize });

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: PostStatus.PUBLISHED },
        include: { author: { select: { id: true, name: true } } },
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
      }),
      prisma.blogPost.count({ where: { status: PostStatus.PUBLISHED } }),
    ]);

    return paginate(
      posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImageUrl: p.coverImageUrl,
        author: p.author,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      })),
      total,
      { page, pageSize }
    );
  },

  async bySlug(slug: string) {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: { author: { select: { id: true, name: true } } },
    });
    if (!post) throw ApiError.notFound('That article could not be found.');

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      coverImageUrl: post.coverImageUrl,
      tags: post.tags,
      status: post.status,
      author: post.author,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  async create(body: CreatePostBody, authorId: string) {
    const slug = body.slug || slugify(body.title);
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: body.title.trim(),
        excerpt: body.excerpt?.trim() || null,
        body: body.body.trim(),
        coverImageUrl: body.coverImageUrl?.trim() || null,
        tags: body.tags,
        status: body.status,
        publishedAt: body.status === PostStatus.PUBLISHED ? new Date() : null,
        authorId,
      },
      include: { author: { select: { id: true, name: true } } },
    });
    return post;
  },
};