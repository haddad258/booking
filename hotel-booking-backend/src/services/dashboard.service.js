const db = require('../config/database');

/**
 * High-level KPI cards for the dashboard home page.
 * Expanded (Phase 6) beyond the original 6 fields to cover property status
 * breakdown, image counts, amenity counts, and average booking value —
 * closing the gap flagged in AUDIT-PHASE-1.md against the original KPI spec.
 */
async function getOverview() {
  const [
    hotels, chalets, customers, bookings, revenue, pendingReviews,
    publishedHotels, publishedChalets, totalImages, totalAmenities, avgBooking,
  ] = await Promise.all([
    db('hotels').count('* as c').first(),
    db('chalets').count('* as c').first(),
    db('customers').count('* as c').first(),
    db('bookings').count('* as c').first(),
    db('payments').where({ status: 'paid' }).sum('amount as total').first(),
    db('reviews').where({ status: 'pending' }).count('* as c').first(),
    db('hotels').where({ status: 'published' }).count('* as c').first(),
    db('chalets').where({ status: 'published' }).count('* as c').first(),
    db('hotel_images')
      .count('* as c')
      .first()
      .then(async (r) => Number(r.c) + Number((await db('chalet_images').count('* as c').first()).c)),
    db('amenities').count('* as c').first(),
    db('bookings').avg('total_price as avg').first(),
  ]);

  const totalHotels = Number(hotels.c);
  const totalChalets = Number(chalets.c);

  return {
    totalHotels,
    totalChalets,
    activeProperties: Number(publishedHotels.c) + Number(publishedChalets.c),
    inactiveProperties: totalHotels + totalChalets - (Number(publishedHotels.c) + Number(publishedChalets.c)),
    totalCustomers: Number(customers.c),
    totalBookings: Number(bookings.c),
    totalRevenue: Number(revenue.total) || 0,
    averageBookingValue: Number(Number(avgBooking.avg || 0).toFixed(2)),
    pendingReviews: Number(pendingReviews.c),
    totalImages,
    totalAmenities: Number(totalAmenities.c),
  };
}

/** Properties (hotels + chalets) added within the last N days, newest first. */
async function getRecentProperties({ days = 30, limit = 10 } = {}) {
  const [hotels, chalets] = await Promise.all([
    db('hotels')
      .where('created_at', '>=', db.raw(`NOW() - INTERVAL '${Number(days)} days'`))
      .select('id', 'name', 'city', 'country', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit),
    db('chalets')
      .where('created_at', '>=', db.raw(`NOW() - INTERVAL '${Number(days)} days'`))
      .select('id', 'name', 'city', 'country', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit),
  ]);

  return [
    ...hotels.map((h) => ({ ...h, type: 'hotel' })),
    ...chalets.map((c) => ({ ...c, type: 'chalet' })),
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

/** Most-used amenities across both hotels and chalets, for the dashboard's "Popular Amenities" panel. */
async function getPopularAmenities({ limit = 8 } = {}) {
  const rows = await db('amenities as a')
    .leftJoin('hotel_amenities as ha', 'ha.amenity_id', 'a.id')
    .leftJoin('chalet_amenities as ca', 'ca.amenity_id', 'a.id')
    .select('a.id', 'a.name', 'a.icon')
    .count('ha.id as hotelUsage')
    .count('ca.id as chaletUsage')
    .groupBy('a.id', 'a.name', 'a.icon');

  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      usageCount: Number(r.hotelUsage) + Number(r.chaletUsage),
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

/**
 * Customer segmentation: new customers in the period vs. "returning"
 * (customers with 2+ bookings total, regardless of when).
 */
async function getCustomerStats({ days = 30 } = {}) {
  const [totalRow, newRow, returningRow] = await Promise.all([
    db('customers').count('* as c').first(),
    db('customers').where('created_at', '>=', db.raw(`NOW() - INTERVAL '${Number(days)} days'`)).count('* as c').first(),
    db('bookings')
      .select('customer_id')
      .groupBy('customer_id')
      .havingRaw('COUNT(*) >= 2'),
  ]);

  return {
    totalCustomers: Number(totalRow.c),
    newCustomers: Number(newRow.c),
    returningCustomers: returningRow.length,
  };
}

/** Revenue broken down per property (hotel or chalet), for the "Revenue by Property" report. */
async function getRevenueByProperty({ startDate, endDate, limit = 10 } = {}) {
  const qb = db('bookings as b')
    .join('payments as p', 'p.booking_id', 'b.id')
    .where('p.status', 'paid')
    .select('b.bookable_type', 'b.bookable_id')
    .sum('p.amount as total')
    .count('p.id as paymentCount')
    .groupBy('b.bookable_type', 'b.bookable_id')
    .orderBy('total', 'desc')
    .limit(limit);
  if (startDate) qb.where('p.paid_at', '>=', startDate);
  if (endDate) qb.where('p.paid_at', '<=', endDate);
  const rows = await qb;

  // Resolve property names in two batched queries rather than N+1.
  const hotelIds = rows.filter((r) => r.bookable_type === 'hotel').map((r) => r.bookable_id);
  const chaletIds = rows.filter((r) => r.bookable_type === 'chalet').map((r) => r.bookable_id);
  const [hotels, chalets] = await Promise.all([
    hotelIds.length ? db('hotels').whereIn('id', hotelIds).select('id', 'name') : [],
    chaletIds.length ? db('chalets').whereIn('id', chaletIds).select('id', 'name') : [],
  ]);
  const nameMap = Object.fromEntries([
    ...hotels.map((h) => [`hotel-${h.id}`, h.name]),
    ...chalets.map((c) => [`chalet-${c.id}`, c.name]),
  ]);

  return rows.map((r) => ({
    bookableType: r.bookable_type,
    bookableId: r.bookable_id,
    name: nameMap[`${r.bookable_type}-${r.bookable_id}`] || `#${r.bookable_id}`,
    total: Number(r.total),
    paymentCount: Number(r.paymentCount),
  }));
}

/** Recent activity feed: latest bookings and reviews combined, newest first. */
async function getRecentActivity({ limit = 10 } = {}) {
  const [bookings, reviews] = await Promise.all([
    db('bookings as b')
      .join('customers as c', 'c.id', 'b.customer_id')
      .select('b.id', 'b.booking_number', 'b.status', 'b.total_price', 'b.created_at', 'c.first_name', 'c.last_name')
      .orderBy('b.created_at', 'desc')
      .limit(limit),
    db('reviews as r')
      .join('customers as c', 'c.id', 'r.customer_id')
      .select('r.id', 'r.rating', 'r.status', 'r.bookable_type', 'r.created_at', 'c.first_name', 'c.last_name')
      .orderBy('r.created_at', 'desc')
      .limit(limit),
  ]);

  return [
    ...bookings.map((b) => ({
      type: 'booking',
      id: b.id,
      label: `${b.first_name} ${b.last_name} booked ${b.booking_number}`,
      status: b.status,
      amount: Number(b.total_price),
      created_at: b.created_at,
    })),
    ...reviews.map((r) => ({
      type: 'review',
      id: r.id,
      label: `${r.first_name} ${r.last_name} left a ${r.rating}★ review`,
      status: r.status,
      created_at: r.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

/** Revenue grouped by day for the last N days, for chart rendering. */
async function getRevenueChart({ days = 30 } = {}) {
  const rows = await db('payments')
    .where('status', 'paid')
    .andWhere('paid_at', '>=', db.raw(`NOW() - INTERVAL '${Number(days)} days'`))
    .select(db.raw("TO_CHAR(paid_at, 'YYYY-MM-DD') as date"))
    .sum('amount as total')
    .groupBy('date')
    .orderBy('date');

  return rows.map((r) => ({ date: r.date, total: Number(r.total) }));
}

/** Booking counts grouped by status, for a pie/bar chart. */
async function getBookingsByStatus() {
  const rows = await db('bookings').select('status').count('* as count').groupBy('status');
  return rows.map((r) => ({ status: r.status, count: Number(r.count) }));
}

/** Occupancy rate: booked room-nights vs total available room-nights over a period. */
async function getOccupancyRate({ days = 30 } = {}) {
  const totalRoomsRow = await db('rooms').sum('quantity as total').first();
  const totalRooms = Number(totalRoomsRow.total) || 0;
  if (totalRooms === 0) return { occupancyRate: 0 };

  const bookedNightsRow = await db('bookings')
    .where('bookable_type', 'hotel')
    .andWhere('status', 'in', ['confirmed', 'completed'])
    .andWhere('check_in', '>=', db.raw(`NOW() - INTERVAL '${Number(days)} days'`))
    .select(db.raw('SUM(check_out - check_in) as nights'))
    .first();

  const bookedNights = Number(bookedNightsRow.nights) || 0;
  const availableNights = totalRooms * Number(days);
  const occupancyRate = availableNights > 0 ? Number(((bookedNights / availableNights) * 100).toFixed(2)) : 0;

  return { occupancyRate, bookedNights, availableNights };
}

/** Detailed booking report with optional date range filter, for CSV/PDF export. */
async function getBookingReport({ startDate, endDate } = {}) {
  const qb = db('bookings as b')
    .join('customers as c', 'c.id', 'b.customer_id')
    .select(
      'b.id',
      'b.booking_number',
      'b.bookable_type',
      'b.bookable_id',
      'b.check_in',
      'b.check_out',
      'b.status',
      'b.total_price',
      'b.currency',
      'c.first_name',
      'c.last_name',
      'c.email'
    );
  if (startDate) qb.where('b.created_at', '>=', startDate);
  if (endDate) qb.where('b.created_at', '<=', endDate);
  return qb.orderBy('b.created_at', 'desc');
}

/** Revenue report grouped by bookable type. */
async function getRevenueReport({ startDate, endDate } = {}) {
  const qb = db('bookings as b')
    .join('payments as p', 'p.booking_id', 'b.id')
    .where('p.status', 'paid')
    .select('b.bookable_type')
    .sum('p.amount as total')
    .count('p.id as paymentCount')
    .groupBy('b.bookable_type');
  if (startDate) qb.where('p.paid_at', '>=', startDate);
  if (endDate) qb.where('p.paid_at', '<=', endDate);
  const rows = await qb;
  return rows.map((r) => ({ bookableType: r.bookable_type, total: Number(r.total), paymentCount: Number(r.paymentCount) }));
}

module.exports = {
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
