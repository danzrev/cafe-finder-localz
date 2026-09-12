import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/** Central error-rendering middleware. Maps thrown errors to HTTP responses. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Operational errors we raised on purpose.
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.fieldErrors);
  }

  // Zod validation errors → 400 with per-field messages.
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of err.issues) {
      const field = issue.path.join('.') || '_';
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return sendError(res, 400, 'Please correct the highlighted fields.', fieldErrors);
  }

  // Prisma known request errors (unique violations etc.).
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.join(', ');
      return sendError(res, 409, `That ${target ?? 'value'} is already in use.`);
    }
    return sendError(res, 400, 'The request could not be processed.');
  }

  console.error('[unhandled]', err);
  return sendError(
    res,
    500,
    env.isProd ? 'An unexpected error occurred.' : (err instanceof Error ? err.message : String(err))
  );
};

function sendError(
  res: { status: (code: number) => { json: (body: unknown) => void } },
  statusCode: number,
  message: string,
  fieldErrors?: Record<string, string>
) {
  res.status(statusCode).json({ message, statusCode, ...(fieldErrors ? { fieldErrors } : {}) });
}

/** Not-found handler for unknown routes under /api. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.path}`));
};