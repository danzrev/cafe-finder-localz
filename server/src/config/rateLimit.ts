import rateLimit from 'express-rate-limit';
import { env } from './env.js';

/** General API limiter applied to all /api routes. */
export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down and try again later.', statusCode: 429 },
});

/** Stricter limiter for the auth endpoints (login/register/refresh). */
export const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Please wait a moment and try again.',
    statusCode: 429,
  },
});