import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full ' +
  'transition-colors focus-ring disabled:opacity-60 disabled:pointer-events-none select-none';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-espresso text-paper hover:bg-espresso-soft',
  secondary: 'bg-leaf text-paper hover:bg-leaf-deep',
  ghost: 'text-espresso hover:bg-crema',
  outline: 'border border-espresso/20 text-espresso hover:border-leaf hover:text-leaf-deep',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', icon, loading, fullWidth, className, children, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={rest.disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Shared inline loading spinner. */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const dims = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return (
    <svg
      className={cn('animate-spin', dims[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}