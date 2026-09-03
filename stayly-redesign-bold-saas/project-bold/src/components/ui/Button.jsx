import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Gradient-forward, glow-on-hover CTAs — the primary variant carries the
// brand-gradient signature so it always reads as "the" action on a page.
const VARIANTS = {
  primary: 'brand-gradient text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5',
  dark: 'bg-ink text-white hover:bg-brand-900 dark:bg-white dark:text-brand-950 dark:hover:bg-brand-100',
  outline: 'border border-brand-300/60 text-brand-700 hover:bg-brand-50 hover:border-brand-400 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40',
  ghost: 'text-ink hover:bg-brand-500/8 dark:text-white dark:hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
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
