import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from '../utils/cookies.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Register a new account. Sets HTTP-only auth cookies.
 * Body validated by the registerSchema middleware.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
  res.status(201).json({ user: result.user });
});

/** Log in an existing account. */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
  res.json({ user: result.user });
});

/** Exchange a valid refresh cookie for a fresh access cookie. */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!rawToken) throw ApiError.unauthorized();

  const result = await authService.refresh(rawToken);
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: rawToken });
  res.json({ user: result.user });
});

/** Clear the auth cookies. */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ success: true });
});

/** Current user from the access token (requires requireAuth). */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.me(req.user!.id);
  res.json({ user });
});