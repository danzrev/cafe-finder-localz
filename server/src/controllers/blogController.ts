import type { Request, Response } from 'express';
import { blogService } from '../services/blogService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as Record<string, string>;
  const posts = await blogService.list({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(posts);
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.bySlug(req.params.slug);
  res.json(post);
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.create(req.body, req.user!.id);
  res.status(201).json(post);
});