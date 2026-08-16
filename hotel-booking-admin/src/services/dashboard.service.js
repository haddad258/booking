import api from './api';

async function getOverview() {
  const { data } = await api.get('/admin/dashboard/overview');
  return data.data;
}

async function getRecentProperties(params) {
  const { data } = await api.get('/admin/dashboard/recent-properties', { params });
  return data.data;
}

async function getPopularAmenities(limit = 8) {
  const { data } = await api.get('/admin/dashboard/popular-amenities', { params: { limit } });
  return data.data;
}

async function getCustomerStats(days = 30) {
  const { data } = await api.get('/admin/dashboard/customer-stats', { params: { days } });
  return data.data;
}

async function getRevenueByProperty(params) {
  const { data } = await api.get('/admin/dashboard/revenue-by-property', { params });
  return data.data;
}

async function getRecentActivity(limit = 8) {
  const { data } = await api.get('/admin/dashboard/recent-activity', { params: { limit } });
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
  getRecentProperties,
  getPopularAmenities,
  getCustomerStats,
  getRevenueByProperty,
  getRecentActivity,
  getRevenueChart,
  getBookingsByStatus,
  getOccupancyRate,
  getBookingReport,
  getRevenueReport,
};
