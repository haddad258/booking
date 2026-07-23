const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const paymentService = require('../services/payment.service');

const recordPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.recordPayment(req.params.bookingId, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Payment recorded', data: payment });
});

const listForBooking = catchAsync(async (req, res) => {
  const payments = await paymentService.listPaymentsForBooking(req.params.bookingId);
  ApiResponse.send(res, { data: payments });
});

const refund = catchAsync(async (req, res) => {
  const payment = await paymentService.refundPayment(req.params.id);
  ApiResponse.send(res, { message: 'Payment refunded', data: payment });
});

module.exports = { recordPayment, listForBooking, refund };
