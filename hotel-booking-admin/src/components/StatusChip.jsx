import { Chip } from '@mui/material';

const COLOR_MAP = {
  // bookings
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'default',
  // reviews
  approved: 'success',
  rejected: 'error',
  // customers/admins
  active: 'success',
  suspended: 'error',
  // payments
  paid: 'success',
  failed: 'error',
  refunded: 'default',
  // properties
  draft: 'default',
  published: 'success',
  archived: 'default',
};

export default function StatusChip({ status }) {
  const color = COLOR_MAP[status] || 'default';
  return <Chip label={status} color={color} size="small" variant={color === 'default' ? 'outlined' : 'filled'} />;
}
