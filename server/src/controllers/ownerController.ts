import type { Request, Response } from 'express';
import { ownerService } from '../services/ownerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as Record<string, string>;
  const result = await ownerService.mine(req.user!.id, {
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(result);
});

export const submitClaim = asyncHandler(async (req: Request, res: Response) => {
  const { cafeId, message } = req.body as { cafeId?: string; message?: string };
  if (!cafeId) {
    res.status(400).json({ message: 'cafeId is required', statusCode: 400 });
    return;
  }
  const claim = await ownerService.claim(req.user!.id, cafeId, message);
  res.status(201).json(claim);
});

export const listMyClaims = asyncHandler(async (req: Request, res: Response) => {
  const claims = await ownerService.myClaims(req.user!.id);
  res.json(claims);
});