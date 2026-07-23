import { useState } from 'react';
import { MenuItem, TextField, Box, Rating, Button, Stack, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import useDataTable from '../hooks/useDataTable';
import useToast from '../hooks/useToast';
import reviewService from '../services/review.service';
import { format } from 'date-fns';

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function Reviews() {
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState('pending');
  const table = useDataTable(reviewService.listReviews, {
    extraParams: { status: statusFilter === 'all' ? undefined : statusFilter },
  });

  const handleModerate = async (id, status) => {
    try {
      await reviewService.moderateReview(id, status);
      toast.success(`Review ${status}`);
      table.refetch();
    } catch (err) {
      toast.error(err);
    }
  };

  const columns = [
    { key: 'guest', label: 'Guest', render: (r) => `${r.first_name} ${r.last_name}` },
    { key: 'bookable_type', label: 'For', render: (r) => `${r.bookable_type} #${r.bookable_id}` },
    { key: 'rating', label: 'Rating', render: (r) => <Rating value={Number(r.rating)} precision={0.5} readOnly size="small" /> },
    { key: 'comment', label: 'Comment', render: (r) => <Typography variant="body2" sx={{ maxWidth: 260 }}>{r.comment || '—'}</Typography> },
    { key: 'created_at', label: 'Date', render: (r) => format(new Date(r.created_at), 'MMM d, yyyy') },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) =>
        r.status === 'pending' ? (
          <Stack direction="row" spacing={1}>
            <Button size="small" color="success" onClick={() => handleModerate(r.id, 'approved')}>Approve</Button>
            <Button size="small" color="error" onClick={() => handleModerate(r.id, 'rejected')}>Reject</Button>
          </Stack>
        ) : (
          <Button size="small" onClick={() => handleModerate(r.id, 'pending')}>Reset</Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Reviews" subtitle="Moderate guest ratings and comments" />

      <Box sx={{ mb: 2 }}>
        <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 180 }}>
          {STATUS_FILTERS.map((s) => <MenuItem key={s} value={s}>{s === 'all' ? 'All statuses' : s}</MenuItem>)}
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
