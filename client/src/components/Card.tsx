import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the raised "lift" shadow for content that floats above the page. */
  lifted?: boolean;
}

/** Generic surface card used as the base for larger list/tile layouts. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, lifted, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-dewdrop border border-espresso/10 bg-latte-light',
        lifted ? 'shadow-lift' : 'shadow-soft',
        'transition-shadow',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

/** A silent image tile with an optional cover role. */
export function CardMedia({
  src,
  alt = '',
  className,
}: {
  src: string | null;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden bg-paper-deep', className)}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-latte text-cocoa-light">
          <CoffeeGlyph />
        </div>
      )}
    </div>
  );
}

/** Small inline coffee-cup glyph used when images are missing. */
export function CoffeeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn('h-8 w-8', className)} aria-hidden="true">
      <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 3c-.6.6-1 1-1 2s.4 1.4 1 2M12 3c-.6.6-1 1-1 2s.4 1.4 1 2" />
    </svg>
  );
}