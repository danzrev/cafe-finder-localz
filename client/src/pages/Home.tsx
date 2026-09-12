import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Plus, Search } from 'lucide-react';
import { CafeSummary, Paginated } from '@cafefinder/shared';
import { cafesApi } from '@/services/api';
import { CafeCard, Button, LoadingState, ErrorState } from '@/components';
import { useDocumentTitle } from '@/hooks';

export default function HomePage() {
  useDocumentTitle('');
  const [featured, setFeatured] = useState<CafeSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    cafesApi
      .list({ pageSize: 6, sort: 'top' })
      .then((res: Paginated<CafeSummary>) => setFeatured(res.items))
      .catch(setError);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-espresso/10 bg-paper-deep">
        <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-leaf/10 px-3 py-1 text-xs font-medium text-leaf-deep">
              <MapPin className="h-3.5 w-3.5" /> Davao City, Philippines
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Where Davao
              <br />
              goes for coffee.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cocoa">
              From backyard roasteries in Toril to riverside brews along the boulevard —
              discover the cafés that make this city so easy to love.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                icon={<Search className="h-5 w-5" />}
                onClick={() => (window.location.href = '/explore')}
              >
                Explore cafés
              </Button>
              <Button
                size="lg"
                variant="outline"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => (window.location.href = '/submit')}
              >
                Add a café
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="flex h-72 items-center justify-center rounded-dewdrop bg-latte text-6xl">
              ☕
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Top-rated this month</h2>
            <p className="mt-1 text-cocoa">The places locals keep coming back to.</p>
          </div>
          <Link to="/explore" className="hidden items-center gap-1 text-sm font-medium text-leaf-deep hover:underline sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error ? (
          <ErrorState message="We couldn’t load the featured cafés." onRetry={() => setError(null)} />
        ) : featured ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <LoadingState label="Brewing up the top cafés…" />
        )}
      </section>
    </>
  );
}