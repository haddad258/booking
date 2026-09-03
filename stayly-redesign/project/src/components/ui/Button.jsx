import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Pill-shaped, restrained accent palette: one strong solid color per
// variant rather than gradients, which reads calmer/more "editorial" than
// a bright CTA gradient. `primary` intentionally flips light/dark (ink
// pine in light mode, warm cream in dark mode) rather than reusing one
// fixed color, so it always reads as the highest-contrast element on the
// page in either theme.
const VARIANTS = {
  primary: 'bg-brand-800 text-canvas shadow-md shadow-brand-900/20 hover:bg-brand-900 hover:-translate-y-0.5 dark:bg-gold-300 dark:text-brand-950 dark:hover:bg-gold-200 dark:shadow-gold-400/20',
  dark: 'bg-ink text-canvas hover:bg-brand-900 dark:bg-white dark:text-brand-900 dark:hover:bg-brand-100',
  outline: 'border border-ink/25 text-ink hover:border-ink/50 hover:bg-ink/5 dark:border-white/25 dark:text-white dark:hover:border-white/45 dark:hover:bg-white/10',
  ghost: 'text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

const SIZES = {
  sm: 'text-sm px-4 py-1.5 rounded-full',
  md: 'text-sm px-5 py-2.5 rounded-full',
  lg: 'text-base px-7 py-3.5 rounded-full',
};

const Button = forwardRef(function Button(
  { as, to, variant = 'primary', size = 'md', fullWidth, className = '', disabled, children, ...props },
  ref
) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  if (to) {
    return (
      <RouterLink ref={ref} to={to} className={classes} {...props}>
        {children}
      </RouterLink>
    );
  }

  const Comp = as || 'button';
  return (
    <Comp ref={ref} className={classes} disabled={disabled} {...props}>
      {children}
    </Comp>
  );
});

export default Button;
