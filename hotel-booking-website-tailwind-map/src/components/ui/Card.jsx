export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={['rounded-2xl border border-brand-800/10 dark:border-white/10 bg-white dark:bg-brand-800 shadow-sm', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
