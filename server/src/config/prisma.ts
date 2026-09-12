import { PrismaClient } from '@prisma/client';

/**
 * Single shared Prisma client across the whole server process.
 * Prevents exhausting DB connections during development (hot reloads).
 */
export const prisma = new PrismaClient();