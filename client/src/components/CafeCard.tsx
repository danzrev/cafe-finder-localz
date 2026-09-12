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
      ? 'bg-leaf/10 text-leaf-deep'
      : cafe.openStatus === 'CLOSED'
        ? 'bg-cocoa/10 text-cocoa'
        : 'bg-crema text-cocoa';

  return (
    <Link to={`/cafe/${cafe.slug}`} className="group block focus-ring rounded-dewdrop">
      <Card className={cn('overflow-hidden', className)}>
        <CardMedia src={cafe.coverImageUrl} alt={cafe.name} className="aspect-[4/3]" />
        <div className="p-4">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                statusTone
              )}
            >
              {cafe.openStatus === 'OPEN' ? '●' : cafe.openStatus === 'CLOSED' ? '○' : ''}
              {openStatusLabel(cafe.openStatus)}
            </span>
            <span className="text-xs text-cocoa-light">{PRICE_LABELS[cafe.priceLevel]}</span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-tight text-espresso group-hover:text-leaf-deep">
            {cafe.name}
          </h3>
          {cafe.tagline && <p className="mt-1 line-clamp-1 text-sm text-cocoa">{cafe.tagline}</p>}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1 text-cocoa-light">
              <MapPin className="h-3.5 w-3.5" />
              {cafe.district ?? cafe.city}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-espresso">
              <Star className="h-4 w-4 fill-mango text-mango" />
              {cafe.averageRating ? cafe.averageRating.toFixed(1) : '—'}
              <span className="text-xs font-normal text-cocoa-light">
                ({cafe.reviewCount})
              </span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}