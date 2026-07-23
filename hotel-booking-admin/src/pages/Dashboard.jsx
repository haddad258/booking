import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import HotelIcon from '@mui/icons-material/ApartmentOutlined';
import ChaletIcon from '@mui/icons-material/CabinOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import BookingIcon from '@mui/icons-material/EventNoteOutlined';
import RevenueIcon from '@mui/icons-material/PaidOutlined';
import ReviewIcon from '@mui/icons-material/StarBorderRounded';
import dashboardService from '../services/dashboard.service';
import StatCard from '../components/StatCard';
import { tokens } from '../styles/theme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [bookingsByStatus, setBookingsByStatus] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ov, rc, bs, occ] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getRevenueChart(30),
        dashboardService.getBookingsByStatus(),
        dashboardService.getOccupancyRate(30),
      ]);
      setOverview(ov);
      setRevenueChart(rc);
      setBookingsByStatus(bs);
      setOccupancy(occ);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const statusColors = { pending: tokens.warning, confirmed: tokens.success, cancelled: tokens.danger, completed: tokens.slate };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {t('dashboard.overview')}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={HotelIcon} label={t('dashboard.totalHotels')} value={overview.totalHotels} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={ChaletIcon} label={t('dashboard.totalChalets')} value={overview.totalChalets} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={PeopleIcon} label={t('dashboard.totalCustomers')} value={overview.totalCustomers} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={BookingIcon} label={t('dashboard.totalBookings')} value={overview.totalBookings} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={RevenueIcon} label={t('dashboard.totalRevenue')} value={`$${overview.totalRevenue.toLocaleString()}`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard icon={ReviewIcon} label={t('dashboard.pendingReviews')} value={overview.pendingReviews} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2.5, height: 360 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t('dashboard.revenueChart')}
            </Typography>
            <Box sx={{ height: 280 }}>
              <Line
                data={{
                  labels: revenueChart.map((r) => r.date),
                  datasets: [
                    {
                      label: 'Revenue',
                      data: revenueChart.map((r) => r.total),
                      borderColor: tokens.brass,
                      backgroundColor: 'rgba(184,134,59,0.12)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, height: 360, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t('dashboard.bookingsByStatus')}
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={{
                  labels: bookingsByStatus.map((b) => b.status),
                  datasets: [
                    {
                      data: bookingsByStatus.map((b) => b.count),
                      backgroundColor: bookingsByStatus.map((b) => statusColors[b.status] || tokens.slate),
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              {t('dashboard.occupancyRate')}
            </Typography>
            <Typography variant="h3" fontWeight={700} color="secondary.main">
              {occupancy?.occupancyRate ?? 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on the last 30 days across all hotel rooms
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
