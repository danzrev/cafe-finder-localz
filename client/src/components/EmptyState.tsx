import type { ReactNode } from 'react';
import { CoffeeGlyph } from './Card';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * A friendly empty view for "nothing here yet" moments.
 * The description should invite the next action rather than just state absence.
 * e.g. "There are no cafés here yet" → "Be the first to add your favorite spot."
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 text-center', className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-latte text-leaf">
        {icon ?? <CoffeeGlyph className="h-7 w-7" />}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-cocoa">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}