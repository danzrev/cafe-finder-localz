import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Role } from '@prisma/client';
import { ACCESS_COOKIE } from '../utils/cookies.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Requires a valid access-token cookie and loads the matching user.
 * Attaches the user to `req.user`. 401 when absent/expired.
 */
export const requireAuth: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
    if (!token) throw ApiError.unauthorized();

    const claims = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    if (!user) throw ApiError.unauthorized();

    req.user = user;
    req.userRole = user.role;
    next();
  }
);

/**
 * Restricts a route to a specific role. Must run after `requireAuth`.
 * Usage: requireAuth, requireRole(Role.ADMIN)
 */
export function requireRole(...roles: Role[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}

/** Convenience guards. */
export const requireAdmin = requireRole(Role.ADMIN);