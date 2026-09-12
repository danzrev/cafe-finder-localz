import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { DAVAO_DISTRICTS, CafeSummary, Paginated } from '@cafefinder/shared';
import { cafesApi } from '@/services/api';
import { CafeCard, EmptyState, ErrorState, LoadingState, Input, Select } from '@/components';
import { useDebounce, useDocumentTitle } from '@/hooks';

type Sort = 'newest' | 'top' | 'name';

export default function ExplorePage() {
  useDocumentTitle('Explore cafés');

  const [items, setItems] = useState<CafeSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    let active = true;
    setLoading(true);
    cafesApi
      .list({ q: debouncedQ, district: district || undefined, sort })
      .then((res: Paginated<CafeSummary>) => active && setItems(res.items))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedQ, district, sort]);

  return (
    <div className="container-page py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Explore the cafés</h1>
        <p className="mt-2 max-w-xl text-cocoa">
          Search by name or neighborhood, then filter down to your perfect cup.
        </p>
      </header>

      {/* Search controls */}
      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_180px_160px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cocoa-light" />
          <Input
            type="search"
            placeholder="Search cafés or neighborhoods…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-11"
          />
        </div>
        <Select value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District">
          <option value="">All districts</option>
          {DAVAO_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="top">Top rated</option>
          <option value="name">A–Z</option>
        </Select>
      </div>

      {loading ? (
        <LoadingState label="Searching cafés…" />
      ) : error ? (
        <ErrorState onRetry={() => setError(null)} />
      ) : items && items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      ) : (
        <div className="py-16">
          <EmptyState
            title="No cafés match that"
            description="Try a different search or district — or add the spot you’re thinking of."
          />
        </div>
      )}
    </div>
  );
}