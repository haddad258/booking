const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');
const hotelService = require('./hotel.service');
const chaletService = require('./chalet.service');
const customerService = require('./customer.service');

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function generateBookingNumber() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

async function priceHotelBooking({ roomId, checkIn, checkOut }) {
  const { room, availableUnits } = await hotelService.checkRoomAvailability(roomId, checkIn, checkOut);
  if (availableUnits < 1) throw ApiError.conflict('No rooms available for the selected dates');

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) throw ApiError.badRequest('checkOut must be after checkIn');

  return { totalPrice: Number(room.price) * nights, currency: 'USD', hotelId: room.hotel_id };
}

async function priceChaletBooking({ chaletId, checkIn, checkOut }) {
  const chalet = await db('chalets').where({ id: chaletId }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const { available } = await chaletService.checkAvailability(chaletId, checkIn, checkOut);
  if (!available) throw ApiError.conflict('Chalet is not available for the selected dates');

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) throw ApiError.badRequest('checkOut must be after checkIn');

  return { totalPrice: Number(chalet.base_price) * nights, currency: chalet.currency };
}

async function createBooking(customerId, payload) {
  const { bookableType, bookableId, roomId, checkIn, checkOut, guestsAdults, guestsChildren, notes } = payload;

  let pricing;
  if (bookableType === 'hotel') {
    if (!roomId) throw ApiError.badRequest('roomId is required for hotel bookings');
    pricing = await priceHotelBooking({ roomId, checkIn, checkOut });
  } else {
    pricing = await priceChaletBooking({ chaletId: bookableId, checkIn, checkOut });
  }

  const [booking] = await db('bookings')
    .insert({
      booking_number: generateBookingNumber(),
      customer_id: customerId,
      bookable_type: bookableType,
      bookable_id: bookableId,
      room_id: bookableType === 'hotel' ? roomId : null,
      check_in: checkIn,
      check_out: checkOut,
      guests_adults: guestsAdults || 1,
      guests_children: guestsChildren || 0,
      status: 'pending',
      total_price: pricing.totalPrice,
      currency: pricing.currency,
      notes: notes || null,
    })
    .returning('*');

  return booking;
}

/**
 * Checkout without requiring a prior login. Always creates a Customer
 * record — either a full account (if `createAccount` is true, with
 * generated username + issued tokens so the frontend can log the new
 * user in immediately) or a guest-only record with no login credentials
 * at all. Reuses `createBooking` for the actual reservation so pricing/
 * availability logic stays identical to the authenticated path.
 */
async function createGuestBooking(payload) {
  const { firstName, lastName, email, phone, createAccount, password, ...bookingPayload } = payload;

  const { customer, tokens } = await customerService.createCustomerForBooking({
    firstName,
    lastName,
    email,
    phone,
    createAccount: !!createAccount,
    password,
  });

  const booking = await createBooking(customer.id, bookingPayload);

  return { booking, customer, tokens };
}

async function listBookings(query, scope = {}) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('bookings').select('*');

  if (scope.customerId) qb.where('customer_id', scope.customerId);
  if (query.status) qb.where('status', query.status);
  if (query.bookableType) qb.where('bookable_type', query.bookableType);

  const totalQuery = qb.clone().clearSelect().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);

  const [{ count }, bookings] = await Promise.all([totalQuery, rowsQuery]);
  return { data: bookings, page, limit, total: Number(count) };
}

async function getBookingById(id, scope = {}) {
  const qb = db('bookings').where({ id });
  if (scope.customerId) qb.where('customer_id', scope.customerId);
  const booking = await qb.first();
  if (!booking) throw ApiError.notFound('Booking not found');

  const payments = await db('payments').where({ booking_id: id }).orderBy('created_at', 'desc');
  return { ...booking, payments };
}

async function updateBookingStatus(id, status) {
  const booking = await db('bookings').where({ id }).first();
  if (!booking) throw ApiError.notFound('Booking not found');

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],
    completed: [],
  };
  if (!validTransitions[booking.status].includes(status)) {
    throw ApiError.badRequest(`Cannot transition booking from ${booking.status} to ${status}`);
  }

  await db('bookings').where({ id }).update({ status, updated_at: db.fn.now() });
  return db('bookings').where({ id }).first();
}

async function cancelBooking(id, customerId) {
  const booking = await db('bookings').where({ id, customer_id: customerId }).first();
  if (!booking) throw ApiError.notFound('Booking not found');
  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw ApiError.badRequest('Only pending or confirmed bookings can be cancelled');
  }
  await db('bookings').where({ id }).update({ status: 'cancelled', updated_at: db.fn.now() });
  return db('bookings').where({ id }).first();
}

module.exports = {
  createBooking,
  createGuestBooking,
  listBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
