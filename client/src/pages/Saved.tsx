import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { CafeSummary, Paginated } from '@cafefinder/shared';
import { savedApi } from '@/services/api';
import { CafeCard, Button, EmptyState, ErrorState, LoadingState } from '@/components';
import { useDocumentTitle } from '@/hooks';

export default function SavedPage() {
  useDocumentTitle('Saved cafés');
  const [items, setItems] = useState<CafeSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  const load = () => {
    savedApi
      .list({ pageSize: 50 })
      .then((res: Paginated<CafeSummary>) => setItems(res.items))
      .catch(setError);
  };

  useEffect(load, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-semibold">
          <Heart className="h-7 w-7 fill-leaf text-leaf" /> Saved cafés
        </h1>
        <p className="mt-1 text-cocoa">The spots you’ve bookmarked for later.</p>
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
              title="Nothing saved yet"
              description="Tap the bookmark on any café to keep it here."
              action={
                <Button variant="outline" onClick={() => (window.location.href = '/explore')}>
                  Start exploring
                </Button>
              }
            />
          </div>
        )
      ) : (
        <LoadingState label="Loading your saves…" />
      )}
    </div>
  );
}