import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/** A labelled field wrapper that renders label, control, and helper/error text. */
export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-cocoa">
          {label}
          {required && <span className="ml-0.5 text-leaf">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-cocoa-light">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const controlStyles =
  'w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-espresso ' +
  'placeholder:text-cocoa-light focus:border-leaf focus:ring-2 focus:ring-leaf/30 ' +
  'focus:outline-none disabled:opacity-60 transition-colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...rest }, ref) => {
  const id = useId();
  return (
    <input
      ref={ref}
      id={id}
      className={cn(controlStyles, error && 'border-red-500 focus:ring-red-300', className)}
      {...rest}
    />
  );
});
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={cn(controlStyles, 'min-h-28 resize-y', error && 'border-red-500', className)}
      {...rest}
    />
  )
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...rest }, ref) => (
    <select ref={ref} className={cn(controlStyles, error && 'border-red-500', className)} {...rest}>
      {children}
    </select>
  )
);
Select.displayName = 'Select';