import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, helperText, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>}
      <input
        ref={ref}
        className={[
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40',
          'outline-none transition focus:ring-2 focus:ring-gold-300',
          error ? 'border-red-400 focus:ring-red-200' : 'border-brand-800/15 focus:border-gold-400',
          className,
        ].join(' ')}
        {...props}
      />
      {helperText && <span className={`mt-1 block text-xs ${error ? 'text-red-600' : 'text-ink/50'}`}>{helperText}</span>}
    </label>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, helperText, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>}
      <textarea
        ref={ref}
        className={[
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40',
          'outline-none transition focus:ring-2 focus:ring-gold-300',
          error ? 'border-red-400 focus:ring-red-200' : 'border-brand-800/15 focus:border-gold-400',
          className,
        ].join(' ')}
        {...props}
      />
      {helperText && <span className={`mt-1 block text-xs ${error ? 'text-red-600' : 'text-ink/50'}`}>{helperText}</span>}
    </label>
  );
});

export const Select = forwardRef(function Select({ label, error, className = '', children, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>}
      <select
        ref={ref}
        className={[
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink',
          'outline-none transition focus:ring-2 focus:ring-gold-300',
          error ? 'border-red-400' : 'border-brand-800/15 focus:border-gold-400',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
    </label>
  );
});

export default Input;
