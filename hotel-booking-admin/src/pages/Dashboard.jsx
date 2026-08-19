import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Stack, LinearProgress, Chip } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import HotelIcon from '@mui/icons-material/ApartmentOutlined';
import ChaletIcon from '@mui/icons-material/CabinOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import BookingIcon from '@mui/icons-material/EventNoteOutlined';
import RevenueIcon from '@mui/icons-material/PaidOutlined';
import ReviewIcon from '@mui/icons-material/StarBorderRounded';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import AvgIcon from '@mui/icons-material/CalculateOutlined';
import dashboardService from '../services/dashboard.service';
import StatCard from '../components/StatCard';
import StatusChip from '../components/StatusChip';
import { tokens } from '../styles/theme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [bookingsByStatus, setBookingsByStatus] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [popularAmenities, setPopularAmenities] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ov, rc, bs, occ, amenities, activity] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getRevenueChart(30),
        dashboardService.getBookingsByStatus(),
        dashboardService.getOccupancyRate(30),
        dashboardService.getPopularAmenities(6),
        dashboardService.getRecentActivity(8),
      ]);
      setOverview(ov);
      setRevenueChart(rc);
      setBookingsByStatus(bs);
      setOccupancy(occ);
      setPopularAmenities(amenities);
      setRecentActivity(activity);
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
  const maxAmenityUsage = Math.max(...popularAmenities.map((a) => a.usageCount), 1);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {t('dashboard.overview')}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={HotelIcon} label={t('dashboard.totalHotels')} value={overview.totalHotels} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={ChaletIcon} label={t('dashboard.totalChalets')} value={overview.totalChalets} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={PeopleIcon} label={t('dashboard.totalCustomers')} value={overview.totalCustomers} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={BookingIcon} label={t('dashboard.totalBookings')} value={overview.totalBookings} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={RevenueIcon} label={t('dashboard.totalRevenue')} value={`$${overview.totalRevenue.toLocaleString()}`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.7}>
          <StatCard icon={ReviewIcon} label={t('dashboard.pendingReviews')} value={overview.pendingReviews} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={ImageIcon} label="Total images" value={overview.totalImages} accent="secondary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={AvgIcon} label="Avg. booking value" value={`$${overview.averageBookingValue.toLocaleString()}`} accent="secondary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Active vs inactive
            </Typography>
            <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.5 }}>
              <Typography variant="h5" fontWeight={700} color="success.main">{overview.activeProperties}</Typography>
              <Typography variant="body2" color="text.secondary">active</Typography>
              <Typography variant="h6" color="text.disabled">/</Typography>
              <Typography variant="h6" color="text.disabled">{overview.inactiveProperties} inactive</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={PeopleIcon} label="Total amenities" value={overview.totalAmenities} accent="secondary.main" />
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
              {bookingsByStatus.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No bookings yet</Typography>
              ) : (
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
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Popular amenities
            </Typography>
            {popularAmenities.filter((a) => a.usageCount > 0).length === 0 ? (
              <Typography variant="body2" color="text.secondary">No amenities assigned to any property yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {popularAmenities.map((a) => (
                  <Box key={a.id}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{a.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.usageCount}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(a.usageCount / maxAmenityUsage) * 100}
                      color="secondary"
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Recent activity
            </Typography>
            {recentActivity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No recent activity yet.</Typography>
            ) : (
              <Stack spacing={1.5} sx={{ maxHeight: 220, overflowY: 'auto' }}>
                {recentActivity.map((item) => (
                  <Stack key={`${item.type}-${item.id}`} direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </Typography>
                    </Box>
                    {item.status && <StatusChip status={item.status} />}
                  </Stack>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
