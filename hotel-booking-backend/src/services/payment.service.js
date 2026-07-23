const db = require('../config/database');
const ApiError = require('../utils/ApiError');

function generateInvoiceNumber() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `INV-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

/**
 * Records a payment against a booking. In a real deployment this would be
 * called from a payment gateway webhook (Stripe/PayPal); here it exposes a
 * direct endpoint so the admin/API consumer can mark bookings as paid and
 * automatically generates an invoice once the payment succeeds.
 */
async function recordPayment(bookingId, { amount, currency, method, status, transactionRef }) {
  const booking = await db('bookings').where({ id: bookingId }).first();
  if (!booking) throw ApiError.notFound('Booking not found');

  const [payment] = await db('payments')
    .insert({
      booking_id: bookingId,
      amount,
      currency: currency || booking.currency,
      method: method || 'card',
      status: status || 'pending',
      transaction_ref: transactionRef || null,
      paid_at: status === 'paid' ? db.fn.now() : null,
    })
    .returning('*');

  if (status === 'paid') {
    await db('bookings').where({ id: bookingId }).update({ status: 'confirmed', updated_at: db.fn.now() });
    await generateInvoice(bookingId, amount);
  }

  return payment;
}

async function generateInvoice(bookingId, amount, taxRate = 0) {
  const existing = await db('invoices').where({ booking_id: bookingId }).first();
  if (existing) return existing;

  const tax = Number((amount * taxRate).toFixed(2));
  const [invoice] = await db('invoices')
    .insert({
      booking_id: bookingId,
      invoice_number: generateInvoiceNumber(),
      amount,
      tax,
      total: Number((amount + tax).toFixed(2)),
    })
    .returning('*');

  return invoice;
}

async function listPaymentsForBooking(bookingId) {
  return db('payments').where({ booking_id: bookingId }).orderBy('created_at', 'desc');
}

async function refundPayment(paymentId) {
  const payment = await db('payments').where({ id: paymentId }).first();
  if (!payment) throw ApiError.notFound('Payment not found');
  if (payment.status !== 'paid') throw ApiError.badRequest('Only paid payments can be refunded');

  await db('payments').where({ id: paymentId }).update({ status: 'refunded', updated_at: db.fn.now() });
  return db('payments').where({ id: paymentId }).first();
}

module.exports = { recordPayment, generateInvoice, listPaymentsForBooking, refundPayment };
