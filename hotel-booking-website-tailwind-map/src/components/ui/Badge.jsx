const COLORS = {
  default: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-white/5 dark:text-brand-200 dark:border-white/10',
  gold: 'bg-gold-100 text-gold-700 border-gold-200 dark:bg-gold-500/15 dark:text-gold-300 dark:border-gold-500/30',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
};

const STATUS_COLOR = {
  pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default',
  approved: 'success', rejected: 'danger',
  active: 'success', suspended: 'danger',
  paid: 'success', failed: 'danger', refunded: 'default',
  draft: 'default', published: 'success', archived: 'default',
};

export default function Badge({ children, color, status, className = '' }) {
  const resolvedColor = color || STATUS_COLOR[status] || 'default';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${COLORS[resolvedColor]} ${className}`}>
      {children || status}
    </span>
  );
}
