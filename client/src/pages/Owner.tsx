import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { CafeSummary, Paginated } from '@cafefinder/shared';
import { ownerApi } from '@/services/api';
import { CafeCard, Button, EmptyState, ErrorState, LoadingState } from '@/components';
import { useDocumentTitle } from '@/hooks';

export default function OwnerPage() {
  useDocumentTitle('Owner dashboard');
  const [items, setItems] = useState<CafeSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  const load = () => {
    ownerApi
      .mine({ pageSize: 50 })
      .then((res: Paginated<CafeSummary>) => setItems(res.items))
      .catch(setError);
  };

  useEffect(load, []);

  return (
    <div>
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-semibold">
            <Store className="h-7 w-7 text-leaf" /> Owner dashboard
          </h1>
          <p className="mt-1 text-cocoa">Manage the cafés you own and their profile details.</p>
        </div>
        <Link to="/owner/claim">
          <Button variant="outline">Claim a café</Button>
        </Link>
      </header>

      {error ? (
        <ErrorState onRetry={load} />
      ) : items ? (
        items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              title="You don’t own any cafés yet"
              description="If you run a café, claim it to start managing your listing."
              action={
                <Link to="/owner/claim">
                  <Button>Claim your café</Button>
                </Link>
              }
            />
          </div>
        )
      ) : (
        <LoadingState label="Loading your cafés…" />
      )}
    </div>
  );
}