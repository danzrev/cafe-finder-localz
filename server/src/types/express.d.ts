import type { Role, User } from '@prisma/client';

/* Augment Express's `req.user` with the authenticated user. */
declare global {
  namespace Express {
    interface Request {
      /** The authenticated user, set by the `requireAuth` middleware. */
      user?: User;
      /**
       * The authenticated user's role as a raw enum, for convenient checks.
       * (Duplicated from user.role so role gates don't need the full user.)
       */
      userRole?: Role;
    }
  }
}

export {};