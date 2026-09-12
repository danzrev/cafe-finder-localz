import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { LoadingState } from '@/components';
import { UserRole } from '@cafefinder/shared';

interface GuardProps {
  children: ReactNode;
  /** When true, only signed-in users may view. */
  requireAuth?: boolean;
  /** Minimum role required to view. */
  minRole?: UserRole;
}

/**
 * Route guard for authenticated / role-restricted views.
 * Unauthenticated visitors are redirected to /login with a return path.
 */
export function Guard({ children, requireAuth = true, minRole }: GuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking your session…" />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (minRole && (!user || user.role !== minRole)) {
    // Signed-in users lacking the role see an access-denied screen.
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">You don’t have access to this page</h1>
        <p className="mt-2 text-cocoa">This area is restricted to the owner of this account.</p>
      </div>
    );
  }

  return <>{children}</>;
}

/** Redirect signed-in users away from auth pages to the app. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingState label="Loading…" />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}