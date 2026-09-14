import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="container-page py-12 sm:py-16">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-bold text-espresso sm:text-5xl">
            Explore Davao&apos;s{' '}
            <span className="bg-gradient-to-r from-leaf-deep to-leaf bg-clip-text text-transparent">
              coffee scene
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-cocoa">
            Search by name or neighborhood, then filter down to your perfect cup.
          </p>
        </motion.div>
      </header>

      {/* Search controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 grid gap-4 rounded-dewdrop bg-paper-deep p-6 shadow-soft sm:grid-cols-[1fr_200px_180px]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cocoa-light" />
          <Input
            type="search"
            placeholder="Search cafés or neighborhoods…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-12 pl-12 text-base shadow-sm"
          />
        </div>
        <Select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="District"
          className="h-12 shadow-sm"
        >
          <option value="">All districts</option>
          {DAVAO_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort"
          className="h-12 shadow-sm"
        >
          <option value="newest">Newest</option>
          <option value="top">Top rated</option>
          <option value="name">A–Z</option>
        </Select>
      </motion.div>

      {/* Results count */}
      {items && items.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-sm text-cocoa"
        >
          Found <span className="font-semibold text-espresso">{items.length}</span>{‘ ‘}
          {items.length === 1 ? ‘cafe’ : ‘cafes’}
          {district && ` in ${district}`}
        </motion.div>
      )}

      {loading ? (
        <LoadingState label="Searching cafés…" />
      ) : error ? (
        <ErrorState onRetry={() => setError(null)} />
      ) : items && items.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CafeCard cafe={cafe} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-20">
          <EmptyState
            title="No cafés match that search"
            description="Try a different search term or district — or add the spot you’re thinking of."
          />
        </div>
      )}
    </div>
  );
}