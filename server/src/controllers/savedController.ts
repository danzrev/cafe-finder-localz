import type { Request, Response } from 'express';
import { savedService } from '../services/savedService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listSaved = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as Record<string, string>;
  const saved = await savedService.list(req.user!.id, {
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(saved);
});

/**
 * Toggle (or set) the bookmark for a café. A bare PUT flips the current state;
 * an explicit { saved: boolean } sets it exactly.
 */
export const setSaved = asyncHandler(async (req: Request, res: Response) => {
  const cafeId = req.params.cafeId;
  const current = await savedService.status(req.user!.id, cafeId);

  const target = typeof req.body?.saved === 'boolean' ? req.body.saved : !current.saved;
  const result =
    current.saved === target ? current : target
      ? await savedService.save(req.user!.id, cafeId)
      : await savedService.unsave(req.user!.id, cafeId);

  res.json(result);
});

export const savedStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await savedService.status(req.user!.id, req.params.cafeId);
  res.json(result);
});