import type { Request, Response } from 'express';
import { adminService } from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminListCafes = asyncHandler(async (req: Request, res: Response) => {
  const { status, page, pageSize } = req.query as Record<string, string>;
  const result = await adminService.listCafes({
    status,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(result);
});

export const adminUpdateCafeStatus = asyncHandler(async (req: Request, res: Response) => {
  const cafe = await adminService.updateCafeStatus(req.params.id, req.body.status);
  res.json(cafe);
});

export const adminUpdateCafe = asyncHandler(async (req: Request, res: Response) => {
  const cafe = await adminService.updateCafe(req.params.id, req.body);
  res.json(cafe);
});

export const adminListClaims = asyncHandler(async (req: Request, res: Response) => {
  const { status, page, pageSize } = req.query as Record<string, string>;
  const result = await adminService.listClaims({
    status: status as never,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(result);
});

export const adminDecideClaim = asyncHandler(async (req: Request, res: Response) => {
  const decision = req.body.decision as 'APPROVED' | 'REJECTED';
  const claim = await adminService.decideClaim(req.params.id, decision);
  res.json(claim);
});

export const adminListUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as Record<string, string>;
  const result = await adminService.listUsers({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(result);
});