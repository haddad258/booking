export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={['rounded-[20px] border border-ink/10 dark:border-white/10 bg-white dark:bg-brand-800 shadow-[0_1px_2px_rgba(33,28,21,0.05)]', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
