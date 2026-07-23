const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboard.service');

const overview = catchAsync(async (req, res) => {
  const data = await dashboardService.getOverview();
  ApiResponse.send(res, { data });
});

const revenueChart = catchAsync(async (req, res) => {
  const data = await dashboardService.getRevenueChart({ days: req.query.days });
  ApiResponse.send(res, { data });
});

const bookingsByStatus = catchAsync(async (req, res) => {
  const data = await dashboardService.getBookingsByStatus();
  ApiResponse.send(res, { data });
});

const occupancyRate = catchAsync(async (req, res) => {
  const data = await dashboardService.getOccupancyRate({ days: req.query.days });
  ApiResponse.send(res, { data });
});

const bookingReport = catchAsync(async (req, res) => {
  const data = await dashboardService.getBookingReport(req.query);
  ApiResponse.send(res, { data });
});

const revenueReport = catchAsync(async (req, res) => {
  const data = await dashboardService.getRevenueReport(req.query);
  ApiResponse.send(res, { data });
});

module.exports = { overview, revenueChart, bookingsByStatus, occupancyRate, bookingReport, revenueReport };
