export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={['rounded-3xl border border-brand-500/10 dark:border-white/10 bg-white dark:bg-brand-900 shadow-[0_1px_2px_rgba(18,11,41,0.05)]', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
