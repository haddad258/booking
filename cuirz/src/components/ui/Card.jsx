export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={['rounded-2xl border border-brand-800/10 bg-white shadow-sm', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
