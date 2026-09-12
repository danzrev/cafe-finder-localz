import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

/** Primary app layout: sticky header, routed content, footer. */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** Centered, minimal layout for auth pages (login/register). */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-deep px-4 py-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

/** Layout for dashboard-style pages after the header. */
export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-page px-4 py-10 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}