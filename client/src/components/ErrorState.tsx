import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Called when the user taps "Try again". Omit to hide the button. */
  onRetry?: () => void;
  /** Pass a caught API error to surface a friendly message. */
  error?: unknown;
}

/** Full-bleed error view explaining what happened and offering a retry. */
export function ErrorState({ title = 'Something went wrong', message, onRetry, error }: ErrorStateProps) {
  const detail =
    message ||
    (typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : 'We couldn’t load this right now. Please try again.');

  return (
    <div
      role="alert"
      className="flex max-w-md flex-col items-center justify-center gap-3 py-20 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="text-sm text-cocoa">{detail}</p>
      {onRetry && (
        <Button variant="outline" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}