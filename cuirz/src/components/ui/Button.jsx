import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const VARIANTS = {
  primary: 'bg-gradient-to-br from-gold-400 to-gold-500 text-ink shadow-lg shadow-gold-400/30 hover:shadow-xl hover:shadow-gold-400/40 hover:-translate-y-0.5',
  dark: 'bg-brand-800 text-white hover:bg-brand-900',
  outline: 'border-1.5 border-brand-800/20 text-ink hover:border-brand-800/40 hover:bg-hover',
  ghost: 'text-ink hover:bg-hover',
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
