import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Coffee, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button } from '@/components';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/blog', label: 'Journal' },
  { to: '/about', label: 'About' },
];

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close the user dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm font-medium transition-colors focus-ring rounded px-2 py-1',
      isActive ? 'text-leaf-deep' : 'text-cocoa hover:text-espresso'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-paper/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 focus-ring rounded">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-paper">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold leading-none">
            Café&nbsp;Finder&nbsp;Localz
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full p-1.5 pr-3 hover:bg-crema focus-ring"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-paper">
                  {user.name ? user.name[0]?.toUpperCase() : <User className="h-4 w-4" />}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {user.name ?? user.email}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-espresso/10 bg-paper shadow-lift">
                  <div className="border-b border-espresso/10 px-4 py-3">
                    <p className="truncate text-sm font-medium">{user.name ?? 'Member'}</p>
                    <p className="truncate text-xs text-cocoa-light">{user.email}</p>
                  </div>
                  <MenuItems onNavigate={() => setUserMenuOpen(false)} onLogout={handleLogout} />
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Join
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="rounded-full p-2 hover:bg-crema focus-ring md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="border-t border-espresso/10 px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" fullWidth onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button fullWidth onClick={() => navigate('/register')}>
                  Join
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function MenuItems({
  onNavigate,
  onLogout,
}: {
  onNavigate: () => void;
  onLogout: () => void;
}) {
  const links = [
    { to: '/profile', label: 'My profile' },
    { to: '/saved', label: 'Saved cafés' },
    { to: '/owner', label: 'Owner dashboard' },
  ];
  return (
    <div className="p-1">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-espresso hover:bg-crema"
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={onLogout}
        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}