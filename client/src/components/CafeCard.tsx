import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { CafeSummary, PRICE_LABELS } from '@cafefinder/shared';
import { cn } from '@/utils/cn';
import { Card, CardMedia } from './Card';
import { openStatusLabel } from '@/utils/status';

interface CafeCardProps {
  cafe: CafeSummary;
  className?: string;
}

/** A café result tile used across the Explore list and featured grids. */
export function CafeCard({ cafe, className }: CafeCardProps) {
  const statusTone =
    cafe.openStatus === 'OPEN'
      ? 'bg-leaf/15 text-leaf-deep border-leaf/20'
      : cafe.openStatus === 'CLOSED'
        ? 'bg-cocoa/10 text-cocoa border-cocoa/20'
        : 'bg-crema text-cocoa border-espresso/10';

  return (
    <Link to={`/cafe/${cafe.slug}`} className="group block focus-ring rounded-dewdrop">
      <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lift hover:-translate-y-1', className)}>
        <div className="relative overflow-hidden">
          <CardMedia
            src={cafe.coverImageUrl}
            alt={cafe.name}
            className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 right-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-bold text-espresso shadow-md backdrop-blur-sm">
            {PRICE_LABELS[cafe.priceLevel]}
          </div>
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                statusTone
              )}
            >
              <span className={cn(
                'h-1.5 w-1.5 rounded-full',
                cafe.openStatus === 'OPEN' ? 'bg-leaf-deep animate-pulse' : 'bg-current'
              )} />
              {openStatusLabel(cafe.openStatus)}
            </span>
            {cafe.averageRating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-mango/10 px-2.5 py-1 font-semibold text-mango-deep">
                <Star className="h-3.5 w-3.5 fill-current" />
                {cafe.averageRating.toFixed(1)}
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-bold leading-tight text-espresso transition-colors group-hover:text-leaf-deep">
            {cafe.name}
          </h3>
          {cafe.tagline && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cocoa">
              {cafe.tagline}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-espresso/5 pt-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-cocoa-light">
              <MapPin className="h-4 w-4" />
              {cafe.district ?? cafe.city}
            </span>
            {cafe.reviewCount > 0 && (
              <span className="text-xs text-cocoa-light">
                {cafe.reviewCount} {cafe.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}