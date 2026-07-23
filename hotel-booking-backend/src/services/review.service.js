const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');

async function createReview(customerId, payload) {
  const { bookableType, bookableId, bookingId, rating, comment } = payload;

  if (bookingId) {
    const booking = await db('bookings')
      .where({ id: bookingId, customer_id: customerId, bookable_type: bookableType, bookable_id: bookableId })
      .first();
    if (!booking) throw ApiError.badRequest('Booking does not belong to this customer or does not match');
    if (booking.status !== 'completed') {
      throw ApiError.badRequest('You can only review after your stay is completed');
    }
  }

  const [review] = await db('reviews')
    .insert({
      customer_id: customerId,
      bookable_type: bookableType,
      bookable_id: bookableId,
      booking_id: bookingId || null,
      rating,
      comment: comment || null,
      status: 'pending',
    })
    .returning('*');

  return review;
}

async function listReviews(query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('reviews as r')
    .join('customers as c', 'c.id', 'r.customer_id')
    .select('r.*', 'c.first_name', 'c.last_name');

  if (query.bookableType) qb.where('r.bookable_type', query.bookableType);
  if (query.bookableId) qb.where('r.bookable_id', query.bookableId);
  if (query.status) qb.where('r.status', query.status);
  else if (!query.includeAll) qb.where('r.status', 'approved'); // public default: approved only

  const totalQuery = qb.clone().clearSelect().count('r.id as count').first();
  const rowsQuery = qb.clone().orderBy('r.created_at', 'desc').limit(limit).offset(offset);

  const [{ count }, reviews] = await Promise.all([totalQuery, rowsQuery]);
  return { data: reviews, page, limit, total: Number(count) };
}

async function updateReview(id, customerId, payload) {
  const review = await db('reviews').where({ id, customer_id: customerId }).first();
  if (!review) throw ApiError.notFound('Review not found');

  const updates = { status: 'pending' }; // edits require re-moderation
  if (payload.rating !== undefined) updates.rating = payload.rating;
  if (payload.comment !== undefined) updates.comment = payload.comment;
  updates.updated_at = db.fn.now();

  await db('reviews').where({ id }).update(updates);
  return db('reviews').where({ id }).first();
}

async function deleteReview(id, customerId) {
  const deleted = await db('reviews').where({ id, customer_id: customerId }).del();
  if (!deleted) throw ApiError.notFound('Review not found');
}

async function moderateReview(id, status) {
  const updated = await db('reviews').where({ id }).update({ status, updated_at: db.fn.now() });
  if (!updated) throw ApiError.notFound('Review not found');
  return db('reviews').where({ id }).first();
}

async function getAverageRating(bookableType, bookableId) {
  const result = await db('reviews')
    .where({ bookable_type: bookableType, bookable_id: bookableId, status: 'approved' })
    .avg('rating as avgRating')
    .count('id as count')
    .first();
  return {
    averageRating: result.avgRating ? Number(Number(result.avgRating).toFixed(2)) : 0,
    reviewCount: Number(result.count),
  };
}

module.exports = { createReview, listReviews, updateReview, deleteReview, moderateReview, getAverageRating };
