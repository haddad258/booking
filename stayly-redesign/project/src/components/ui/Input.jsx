import { forwardRef } from 'react';

const FIELD_BASE = [
  'w-full rounded-xl border bg-white dark:bg-brand-800 px-3.5 py-2.5 text-sm text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40',
  'outline-none transition focus:ring-2 focus:ring-brand-300 dark:focus:ring-gold-400/40',
].join(' ');

export const Input = forwardRef(function Input({ label, error, helperText, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-white">{label}</span>}
      <input
        ref={ref}
        className={[
          FIELD_BASE,
          error ? 'border-red-400 focus:ring-red-200' : 'border-ink/15 dark:border-white/15 focus:border-brand-500 dark:focus:border-gold-400',
          className,
        ].join(' ')}
        {...props}
      />
      {helperText && <span className={`mt-1 block text-xs ${error ? 'text-red-600' : 'text-ink/50 dark:text-white/50'}`}>{helperText}</span>}
    </label>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, helperText, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-white">{label}</span>}
      <textarea
        ref={ref}
        className={[
          FIELD_BASE,
          error ? 'border-red-400 focus:ring-red-200' : 'border-ink/15 dark:border-white/15 focus:border-brand-500 dark:focus:border-gold-400',
          className,
        ].join(' ')}
        {...props}
      />
      {helperText && <span className={`mt-1 block text-xs ${error ? 'text-red-600' : 'text-ink/50 dark:text-white/50'}`}>{helperText}</span>}
    </label>
  );
});

export const Select = forwardRef(function Select({ label, error, className = '', children, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-white">{label}</span>}
      <select
        ref={ref}
        className={[
          FIELD_BASE,
          error ? 'border-red-400' : 'border-ink/15 dark:border-white/15 focus:border-brand-500 dark:focus:border-gold-400',
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
