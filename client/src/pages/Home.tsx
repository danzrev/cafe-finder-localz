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
      <section className="relative overflow-hidden border-b border-espresso/10 bg-gradient-to-br from-paper-deep via-paper to-latte-light">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(66,105,63,0.08),transparent_50%)]" />
        <div className="container-page relative grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-leaf/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-leaf-deep shadow-sm"
            >
              <MapPin className="h-4 w-4" /> Davao City, Philippines
            </motion.p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-espresso sm:text-6xl lg:text-7xl">
              Where Davao
              <br />
              <span className="bg-gradient-to-r from-leaf-deep to-leaf bg-clip-text text-transparent">
                goes for coffee
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-relaxed text-cocoa">
              From heritage roasteries to riverside gardens — discover the specialty coffee culture
              that makes Davao City unforgettable.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                icon={<Search className="h-5 w-5" />}
                onClick={() => (window.location.href = '/explore')}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                Explore cafés
              </Button>
              <Button
                size="lg"
                variant="outline"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => (window.location.href = '/submit')}
                className="border-2 hover:bg-leaf/5"
              >
                Add a café
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 flex items-center gap-6 text-sm text-cocoa"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-paper bg-gradient-to-br from-leaf to-leaf-deep"
                    />
                  ))}
                </div>
                <span className="font-medium">500+ coffee lovers</span>
              </div>
              <div className="h-4 w-px bg-cocoa/20" />
              <div>
                <span className="font-semibold text-espresso">{featured?.length || 12}</span> cafés featured
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-dewdrop bg-gradient-to-br from-mango/20 to-leaf/20 blur-2xl" />
              <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-dewdrop bg-gradient-to-br from-latte to-paper text-8xl shadow-lift">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ☕
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-paper/40 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl font-bold text-espresso sm:text-4xl"
            >
              Top-rated this month
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-lg text-cocoa"
            >
              The places locals keep coming back to.
            </motion.p>
          </div>
          <Link
            to="/explore"
            className="hidden items-center gap-2 rounded-full bg-leaf/10 px-5 py-2.5 text-sm font-semibold text-leaf-deep transition-all hover:bg-leaf/20 hover:gap-3 focus-ring sm:inline-flex"
          >
            View all cafés
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error ? (
          <ErrorState message="We couldn’t load the featured cafés." onRetry={() => setError(null)} />
        ) : featured ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((cafe, index) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CafeCard cafe={cafe} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <LoadingState label="Brewing up the top cafés…" />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-deep hover:underline"
          >
            View all cafés
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}