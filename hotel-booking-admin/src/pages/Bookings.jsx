import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, TextField, Box, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import useDataTable from '../hooks/useDataTable';
import bookingService from '../services/booking.service';
import { format } from 'date-fns';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

export default function Bookings() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const table = useDataTable(bookingService.list, {
    extraParams: { status: statusFilter === 'all' ? undefined : statusFilter },
  });

  const columns = [
    { key: 'booking_number', label: 'Booking #', render: (r) => <span className="mono">{r.booking_number}</span> },
    { key: 'bookable_type', label: 'Type', render: (r) => (r.bookable_type === 'hotel' ? 'Hotel' : 'Chalet') },
    { key: 'dates', label: 'Dates', render: (r) => `${format(new Date(r.check_in), 'MMM d')} → ${format(new Date(r.check_out), 'MMM d, yyyy')}` },
    { key: 'total_price', label: 'Total', render: (r) => <span className="mono">${Number(r.total_price).toFixed(2)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <IconButton size="small" onClick={() => navigate(`/bookings/${r.id}`)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Bookings" subtitle="Manage reservations across hotels and chalets" />

      <Box sx={{ mb: 2 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {STATUS_FILTERS.map((s) => (
            <MenuItem key={s} value={s}>{s === 'all' ? 'All statuses' : s}</MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        rows={table.rows}
        total={table.total}
        page={table.page}
        limit={table.limit}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        loading={table.loading}
      />
    </>
  );
}
