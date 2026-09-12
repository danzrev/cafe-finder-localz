import { Spinner } from './Button';
import { cn } from '@/utils/cn';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

/** Full-bleed loading indicator used while async data is in flight. */
export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3 py-20 text-cocoa', className)}
    >
      <Spinner size="lg" className="text-leaf" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** Compact inline spinner for buttons and small in-page sections. */
export function InlineLoader({ className }: { className?: string }) {
  return <Spinner size="sm" className={cn('text-leaf', className)} />;
}