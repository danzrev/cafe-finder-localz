import type { Response } from 'express';
import { env } from '../config/env.js';

export const ACCESS_COOKIE = 'cf.access';
export const REFRESH_COOKIE = 'cf.refresh';

const BASE_OPTIONS = {
  httpOnly: true,
  secure: env.cookieSecure || env.isProd,
  sameSite: 'strict' as const,
  path: '/',
};

/** Set both the access and refresh cookies on the response. */
export function setAuthCookies(
  res: Response,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string }
): void {
  const accessMaxAge = env.jwt.accessTtlMin * 60_000;
  const refreshMaxAge = env.jwt.refreshTtlDays * 24 * 60 * 60_000;

  res.cookie(ACCESS_COOKIE, accessToken, { ...BASE_OPTIONS, maxAge: accessMaxAge });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...BASE_OPTIONS, maxAge: refreshMaxAge });
}

/** Clear both auth cookies (logout). */
export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...BASE_OPTIONS });
  res.clearCookie(REFRESH_COOKIE, { ...BASE_OPTIONS });
}