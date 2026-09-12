import { Link } from 'react-router-dom';
import { Coffee, MapPin } from 'lucide-react';

const COLUMNS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: 'Discover',
    links: [
      { label: 'Explore cafés', to: '/explore' },
      { label: 'Journal', to: '/blog' },
      { label: 'Add a café', to: '/submit' },
    ],
  },
  {
    title: 'For owners',
    links: [
      { label: 'Owner dashboard', to: '/owner' },
      { label: 'Claim your café', to: '/owner/claim' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Log in', to: '/login' },
      { label: 'Create account', to: '/register' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-espresso/10 bg-latte-light">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-paper">
              <Coffee className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">Café Finder Localz</span>
          </Link>
          <p className="flex items-center gap-1.5 text-sm text-cocoa">
            <MapPin className="h-4 w-4 text-leaf" />
            Davao City, Philippines
          </p>
          <p className="text-sm leading-relaxed text-cocoa">
            A community-powered guide to the coffee culture of Davao — from backyard roasteries in
            Toril to riverside spots along the boulevard.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-espresso">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-cocoa transition-colors hover:text-leaf-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-espresso/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-cocoa-light sm:flex-row">
          <p>© {new Date().getFullYear()} Café Finder Localz. Brewed in Davao City.</p>
          <p>Made for coffee lovers, by coffee lovers.</p>
        </div>
      </div>
    </footer>
  );
}