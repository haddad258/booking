import api from './api';

async function getOverview() {
  const { data } = await api.get('/admin/dashboard/overview');
  return data.data;
}

async function getRevenueChart(days = 30) {
  const { data } = await api.get('/admin/dashboard/charts/revenue', { params: { days } });
  return data.data;
}

async function getBookingsByStatus() {
  const { data } = await api.get('/admin/dashboard/charts/bookings-by-status');
  return data.data;
}

async function getOccupancyRate(days = 30) {
  const { data } = await api.get('/admin/dashboard/occupancy-rate', { params: { days } });
  return data.data;
}

async function getBookingReport(params) {
  const { data } = await api.get('/admin/dashboard/reports/bookings', { params });
  return data.data;
}

async function getRevenueReport(params) {
  const { data } = await api.get('/admin/dashboard/reports/revenue', { params });
  return data.data;
}

export default {
  getOverview,
  getRevenueChart,
  getBookingsByStatus,
  getOccupancyRate,
  getBookingReport,
  getRevenueReport,
};
