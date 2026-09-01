const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const bookingService = require('../services/booking.service');

// --- Customer-facing ---

const create = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.customer.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Booking created', data: booking });
});

/**
 * Public checkout — no authentication required. Always creates a Customer
 * record; optionally issues login tokens if the shopper ticked "create an
 * account". See booking.service#createGuestBooking.
 */
const createGuest = catchAsync(async (req, res) => {
  const { booking, customer, tokens } = await bookingService.createGuestBooking(req.body);
  const message = tokens
    ? `Booking created and account set up — your username is "${customer.username}".`
    : 'Booking created';
  ApiResponse.send(res, { statusCode: 201, message, data: { booking, customer, tokens } });
});

const myBookings = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await bookingService.listBookings(req.query, { customerId: req.customer.id });
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getMyBookingById = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id, { customerId: req.customer.id });
  ApiResponse.send(res, { data: booking });
});

const cancel = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.customer.id);
  ApiResponse.send(res, { message: 'Booking cancelled', data: booking });
});

// --- Admin-facing ---

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await bookingService.listBookings(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getById = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  ApiResponse.send(res, { data: booking });
});

const updateStatus = catchAsync(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
  ApiResponse.send(res, { message: 'Booking status updated', data: booking });
});

module.exports = { create, createGuest, myBookings, getMyBookingById, cancel, list, getById, updateStatus };
