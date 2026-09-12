import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout, AuthLayout, DashboardLayout } from '@/layouts/layouts';
import { Guard, RedirectIfAuthed } from './Guards';
import { LoadingState } from '@/components';
import { UserRole } from '@cafefinder/shared';

/* Auth pages (loaded eagerly so login redirects are instant). */
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';

/* Lazy-loaded pages split on the route boundary. */
const HomePage = lazy(() => import('@/pages/Home'));
const ExplorePage = lazy(() => import('@/pages/Explore'));
const CafeDetailPage = lazy(() => import('@/pages/CafeDetail'));
const SubmitPage = lazy(() => import('@/pages/Submit'));
const AboutPage = lazy(() => import('@/pages/About'));
const BlogPage = lazy(() => import('@/pages/Blog'));
const BlogPostPage = lazy(() => import('@/pages/BlogPost'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const SavedPage = lazy(() => import('@/pages/Saved'));
const OwnerPage = lazy(() => import('@/pages/Owner'));
const OwnerClaimPage = lazy(() => import('@/pages/OwnerClaim'));
const AdminPage = lazy(() => import('@/pages/Admin'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<LoadingState />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/explore', element: withSuspense(<ExplorePage />) },
      { path: '/cafe/:slug', element: withSuspense(<CafeDetailPage />) },
      {
        path: '/submit',
        element: (
          <Guard>
            {withSuspense(<SubmitPage />)}
          </Guard>
        ),
      },
      { path: '/about', element: withSuspense(<AboutPage />) },
      { path: '/blog', element: withSuspense(<BlogPage />) },
      { path: '/blog/:slug', element: withSuspense(<BlogPostPage />) },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            ),
          },
          {
            path: '/register',
            element: (
              <RedirectIfAuthed>
                <RegisterPage />
              </RedirectIfAuthed>
            ),
          },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/profile',
            element: (
              <Guard>
                {withSuspense(<ProfilePage />)}
              </Guard>
            ),
          },
          {
            path: '/saved',
            element: (
              <Guard>
                {withSuspense(<SavedPage />)}
              </Guard>
            ),
          },
          {
            path: '/owner',
            element: (
              <Guard>
                {withSuspense(<OwnerPage />)}
              </Guard>
            ),
          },
          {
            path: '/owner/claim',
            element: (
              <Guard>
                {withSuspense(<OwnerClaimPage />)}
              </Guard>
            ),
          },
          {
            path: '/admin',
            element: (
              <Guard minRole={UserRole.ADMIN}>
                {withSuspense(<AdminPage />)}
              </Guard>
            ),
          },
        ],
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);