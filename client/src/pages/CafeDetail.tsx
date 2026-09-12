import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, Clock, Globe, MapPin, Phone, Star } from 'lucide-react';
import { CafeDetail, PRICE_LABELS, Review } from '@cafefinder/shared';
import { cafesApi } from '@/services/api';
import { ApiError } from '@/api/client';
import {
  Card,
  CardMedia,
  CoffeeGlyph,
  EmptyState,
  ErrorState,
  LoadingState,
  Button,
  Map,
  Field,
  Textarea,
} from '@/components';
import { useAuth, useDocumentTitle } from '@/hooks';
import { openStatusLabel } from '@/utils/status';
import { formatDate } from '@/utils/format';
import { openingHoursRows } from '@/utils/openingHours';

export default function CafeDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  /* Review form state. */
  const [rating, setRating] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([cafesApi.bySlug(slug), cafesApi.reviews(slug)])
      .then(([c, r]) => {
        setCafe(c);
        setReviews(r);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  useDocumentTitle(cafe?.name ?? 'Café');

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (e: FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setReviewError('Tap a star rating first.');
      return;
    }
    setSubmitting(true);
    setReviewError(null);
    try {
      await cafesApi.createReview(slug, { rating, body: reviewBody || undefined });
      setRating(0);
      setReviewBody('');
      setHoverRating(0);
      await Promise.all([cafesApi.bySlug(slug), cafesApi.reviews(slug)]).then(([c, r]) => {
        setCafe(c);
        setReviews(r);
      });
    } catch (err) {
      setReviewError(
        err instanceof ApiError ? err.message : 'Something went wrong posting your review.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState className="container-page" label="Loading café…" />;
  if (error || !cafe)
    return (
      <div className="container-page py-16">
        <ErrorState message="We couldn’t find that café." onRetry={load} />
      </div>
    );

  const hours = openingHoursRows(cafe.openingHours);

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-72 w-full sm:h-96">
        <CardMedia src={cafe.coverImageUrl} alt={cafe.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" />
        <div className="container-page absolute bottom-0 left-0 right-0 pb-6 text-paper">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="h-4 w-4" /> {cafe.district ?? cafe.city}
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{cafe.name}</h1>
          {cafe.tagline && <p className="mt-1 text-paper/80">{cafe.tagline}</p>}
        </div>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          {/* Rating + meta row */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-lg font-semibold">
              <Star className="h-5 w-5 fill-mango text-mango" />
              {cafe.averageRating ? cafe.averageRating.toFixed(1) : 'New'}
              <span className="text-sm font-normal text-cocoa">({cafe.reviewCount} reviews)</span>
            </span>
            <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-medium text-leaf-deep">
              {openStatusLabel(cafe.openStatus)}
            </span>
            <span className="rounded-full bg-crema px-3 py-1 text-xs font-medium text-cocoa">
              {PRICE_LABELS[cafe.priceLevel]}
            </span>
            {user && (
              <Button variant="outline" size="sm" icon={<Bookmark className="h-4 w-4" />}>
                {cafe.isSaved ? 'Saved' : 'Save'}
              </Button>
            )}
          </div>

          {cafe.description && (
            <p className="max-w-prose text-lg leading-relaxed text-cocoa">{cafe.description}</p>
          )}

          {/* Tags */}
          {cafe.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {cafe.tags.map((t) => (
                <span key={t} className="rounded-full bg-latte px-3 py-1 text-sm text-espresso">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Gallery */}
          {cafe.images.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-2">
              {cafe.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt ?? cafe.name}
                  className="aspect-square w-full rounded-xl object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Amenities */}
          {cafe.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Good to know</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {cafe.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-latte px-3 py-1 text-sm text-espresso">
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Reviews</h2>

            {user ? (
              <form
                onSubmit={handleReview}
                className="mt-4 rounded-xl border border-espresso/10 bg-latte-light p-4"
              >
                <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(n)}
                      className="p-0.5 focus-ring"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={
                          n <= (hoverRating || rating)
                            ? 'h-7 w-7 fill-mango text-mango'
                            : 'h-7 w-7 text-cocoa-light'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-cocoa">{rating ? `${rating}/5` : 'Rating'}</span>
                </div>
                <div className="mt-3">
                  <Field label="Your review (optional)">
                    <Textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="What did you love about it?"
                      maxLength={1000}
                    />
                  </Field>
                </div>
                {reviewError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {reviewError}
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <Button type="submit" loading={submitting}>
                    Post review
                  </Button>
                </div>
              </form>
            ) : (
              <p className="mt-4 text-sm text-cocoa">
                <Link to="/login" className="font-medium text-leaf-deep hover:underline">
                  Log in
                </Link>{' '}
                to leave a review.
              </p>
            )}

            {reviews.length ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-espresso/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.author.name ?? 'Café goer'}</span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-mango text-mango" /> {r.rating}
                      </span>
                    </div>
                    {r.body && <p className="mt-2 text-sm text-cocoa">{r.body}</p>}
                    <p className="mt-2 text-xs text-cocoa-light">{formatDate(r.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <EmptyState title="No reviews yet" description="Be the first to share your experience." />
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold">Details</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {cafe.website && (
                <li className="flex items-center gap-3 text-cocoa">
                  <Globe className="h-4 w-4 shrink-0 text-leaf" />
                  <a href={cafe.website} className="hover:underline" target="_blank" rel="noreferrer">
                    Website
                  </a>
                </li>
              )}
              {cafe.phone && (
                <li className="flex items-center gap-3 text-cocoa">
                  <Phone className="h-4 w-4 shrink-0 text-leaf" /> {cafe.phone}
                </li>
              )}
              {cafe.address && (
                <li className="flex items-start gap-3 text-cocoa">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf" /> {cafe.address}
                </li>
              )}
            </ul>

            {hours.length > 0 && (
              <div className="mt-4 border-t border-espresso/10 pt-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-espresso">
                  <Clock className="h-4 w-4 text-leaf" /> Opening hours
                </h4>
                <ul className="space-y-1 text-sm">
                  {hours.map((row) => (
                    <li key={row.key} className="flex items-center justify-between">
                      <span className="text-cocoa">{row.label}</span>
                      <span className={row.value ? 'text-espresso' : 'text-cocoa-light'}>
                        {row.value ?? 'Closed'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <Map
              center={
                cafe.latitude != null && cafe.longitude != null
                  ? { lat: cafe.latitude, lng: cafe.longitude }
                  : null
              }
              markerTitle={cafe.name}
            />
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold">A note for owners</h3>
            <p className="mt-2 text-sm text-cocoa">
              Is this your café? Claim it to manage your menu, hours, and photos.
            </p>
            <Link
              to="/owner/claim"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-leaf-deep hover:underline"
            >
              Claim this café <CoffeeGlyph className="h-4 w-4" />
            </Link>
          </Card>
        </aside>
      </div>
    </article>
  );
}