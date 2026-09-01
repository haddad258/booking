import { useNavigate } from 'react-router-dom';
import { IconButton, Stack, Chip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import useDataTable from '../hooks/useDataTable';
import customerService from '../services/customer.service';
import { format } from 'date-fns';

export default function Customers() {
  const navigate = useNavigate();
  const table = useDataTable(customerService.list);

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <strong>{r.first_name} {r.last_name}</strong> },
    {
      key: 'username',
      label: 'Account',
      render: (r) =>
        r.is_guest ? (
          <Chip label="Guest (no login)" size="small" variant="outlined" />
        ) : (
          <Typography variant="body2" className="mono">{r.username}</Typography>
        ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
    { key: 'created_at', label: 'Joined', render: (r) => format(new Date(r.created_at), 'MMM d, yyyy') },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => navigate(`/customers/${r.id}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="View and manage customer accounts — includes guest checkouts with no login credentials"
      />
      <DataTable
        columns={columns}
        rows={table.rows}
        total={table.total}
        page={table.page}
        limit={table.limit}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSearch={table.onSearch}
        loading={table.loading}
        searchPlaceholder="Search customers…"
      />
    </>
  );
}
