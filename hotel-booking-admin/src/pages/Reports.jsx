import { useEffect, useState } from 'react';
import { Box, Paper, Tabs, Tab, Button, Stack, TextField, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/DownloadRounded';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import dashboardService from '../services/dashboard.service';

function exportToExcel(rows, filename) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export default function Reports() {
  const [tab, setTab] = useState('bookings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingRows, setBookingRows] = useState([]);
  const [revenueRows, setRevenueRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = { startDate: startDate || undefined, endDate: endDate || undefined };
    const [bookings, revenue] = await Promise.all([
      dashboardService.getBookingReport(params),
      dashboardService.getRevenueReport(params),
    ]);
    setBookingRows(bookings);
    setRevenueRows(revenue);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bookingColumns = [
    { key: 'booking_number', label: 'Booking #', render: (r) => <span className="mono">{r.booking_number}</span> },
    { key: 'guest', label: 'Guest', render: (r) => `${r.first_name} ${r.last_name}` },
    { key: 'bookable_type', label: 'Type' },
    { key: 'check_in', label: 'Check-in', render: (r) => format(new Date(r.check_in), 'MMM d, yyyy') },
    { key: 'check_out', label: 'Check-out', render: (r) => format(new Date(r.check_out), 'MMM d, yyyy') },
    { key: 'total_price', label: 'Total', render: (r) => <span className="mono">${Number(r.total_price).toFixed(2)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
  ];

  const revenueColumns = [
    { key: 'bookableType', label: 'Type', render: (r) => (r.bookableType === 'hotel' ? 'Hotels' : 'Chalets') },
    { key: 'paymentCount', label: 'Payments' },
    { key: 'total', label: 'Total revenue', render: (r) => <span className="mono">${r.total.toFixed(2)}</span> },
  ];

  const activeRows = tab === 'bookings' ? bookingRows : revenueRows;

  const handleExportExcel = () => {
    if (tab === 'bookings') {
      exportToExcel(
        bookingRows.map((r) => ({
          BookingNumber: r.booking_number,
          Guest: `${r.first_name} ${r.last_name}`,
          Email: r.email,
          Type: r.bookable_type,
          CheckIn: r.check_in,
          CheckOut: r.check_out,
          Total: r.total_price,
          Status: r.status,
        })),
        'booking-report'
      );
    } else {
      exportToExcel(
        revenueRows.map((r) => ({ Type: r.bookableType, Payments: r.paymentCount, Total: r.total })),
        'revenue-report'
      );
    }
  };

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Booking and revenue reports, exportable to Excel or PDF" />

      <Paper elevation={0} sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 1 }}>
          <Tab value="bookings" label="Booking report" />
          <Tab value="revenue" label="Revenue report" />
        </Tabs>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }} flexWrap="wrap">
          <TextField size="small" type="date" label="Start date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <TextField size="small" type="date" label="End date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Button variant="outlined" size="small" onClick={load}>Apply</Button>
          <Box sx={{ flex: 1 }} />
          <Button size="small" startIcon={<DownloadIcon />} onClick={handleExportExcel}>Export Excel</Button>
          <Button size="small" startIcon={<PrintIcon />} onClick={() => window.print()}>Export PDF</Button>
        </Stack>
      </Paper>

      {tab === 'bookings' ? (
        <DataTable columns={bookingColumns} rows={bookingRows} total={bookingRows.length} loading={loading} />
      ) : (
        <DataTable columns={revenueColumns} rows={revenueRows} total={revenueRows.length} loading={loading} />
      )}

      {activeRows.length === 0 && !loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No data for the selected date range.
        </Typography>
      )}
    </Box>
  );
}
