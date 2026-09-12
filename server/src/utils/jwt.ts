import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

/** Claims carried in a Café Finder token. */
export interface TokenClaims {
  sub: string; // user id
  email: string;
  role: Role;
  type: 'access' | 'refresh';
}

export function signAccessToken(claims: {
  sub: string;
  email: string;
  role: Role;
}): string {
  return jwt.sign({ ...claims, type: 'access' }, env.jwt.accessSecret, {
    expiresIn: `${env.jwt.accessTtlMin}m`,
  });
}

export function signRefreshToken(claims: {
  sub: string;
  email: string;
  role: Role;
}): string {
  return jwt.sign({ ...claims, type: 'refresh' }, env.jwt.refreshSecret, {
    expiresIn: `${env.jwt.refreshTtlDays}d`,
  });
}

/** Verify an access token; throws 401 on failure. */
export function verifyAccessToken(token: string): TokenClaims {
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret) as TokenClaims;
    if (decoded.type !== 'access') throw new Error('wrong token type');
    return decoded;
  } catch {
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }
}

/** Verify a refresh token; throws 401 on failure. */
export function verifyRefreshToken(token: string): TokenClaims {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret) as TokenClaims;
    if (decoded.type !== 'refresh') throw new Error('wrong token type');
    return decoded;
  } catch {
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }
}