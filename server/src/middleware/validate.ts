import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

interface ValidateConfig<TBody, TQuery extends Record<string, unknown>> {
  body?: ZodSchema<TBody>;
  query?: ZodSchema<TQuery>;
  params?: ZodSchema;
}

/**
 * Validates req.body/query/params against zod schemas. Throws ZodError on
 * failure, which the error middleware turns into a 400 with field errors.
 */
export function validate<TBody, TQuery extends Record<string, unknown> = Record<string, unknown>>(
  schemas: ValidateConfig<TBody, TQuery>
): RequestHandler {
  return (req, _res, next) => {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    // Query may be typed loosely; only run if a schema is supplied.
    if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
    next();
  };
}