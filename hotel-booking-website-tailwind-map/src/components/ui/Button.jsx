import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Note: the primary button's background is a gold gradient that stays gold
// in both light and dark mode (it's a brand accent, not a surface color),
// so its text intentionally stays `text-ink` (dark) in both modes for
// contrast — it does not get a `dark:text-white` override.
const VARIANTS = {
  primary: 'bg-gradient-to-br from-gold-400 to-gold-500 text-ink shadow-lg shadow-gold-400/30 hover:shadow-xl hover:shadow-gold-400/40 hover:-translate-y-0.5',
  dark: 'bg-brand-800 text-white hover:bg-brand-900 dark:bg-white dark:text-brand-900 dark:hover:bg-brand-100',
  outline: 'border-1.5 border-brand-800/20 text-ink hover:border-brand-800/40 hover:bg-brand-50 dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10',
  ghost: 'text-ink hover:bg-brand-50 dark:text-white dark:hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES = {
  sm: 'text-sm px-3.5 py-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-base px-7 py-3.5 rounded-xl',
};

const Button = forwardRef(function Button(
  { as, to, variant = 'primary', size = 'md', fullWidth, className = '', disabled, children, ...props },
  ref
) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
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
