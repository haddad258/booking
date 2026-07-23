const db = require('../config/database');

/** High-level KPI cards for the dashboard home page. */
async function getOverview() {
  const [hotels, chalets, customers, bookings, revenue, pendingReviews] = await Promise.all([
    db('hotels').count('* as c').first(),
    db('chalets').count('* as c').first(),
    db('customers').count('* as c').first(),
    db('bookings').count('* as c').first(),
    db('payments').where({ status: 'paid' }).sum('amount as total').first(),
    db('reviews').where({ status: 'pending' }).count('* as c').first(),
  ]);

  return {
    totalHotels: Number(hotels.c),
    totalChalets: Number(chalets.c),
    totalCustomers: Number(customers.c),
    totalBookings: Number(bookings.c),
    totalRevenue: Number(revenue.total) || 0,
    pendingReviews: Number(pendingReviews.c),
  };
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
  getRevenueChart,
  getBookingsByStatus,
  getOccupancyRate,
  getBookingReport,
  getRevenueReport,
};
