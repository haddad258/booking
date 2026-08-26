const COLORS = {
  default: 'bg-hover text-brand-700 border-brand-200',
  gold: 'bg-gold-100 text-gold-700 border-gold-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
};
// Note: the light-mode utility classes above are automatically adapted for
// dark mode via the `.dark` overrides defined once in src/index.css, so this
// map doesn't need per-variant `dark:` classes duplicated here.

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
