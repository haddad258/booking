exports.seed = async function (knex) {
  await knex('payments').del();

  const bookings = await knex('bookings').select('id', 'booking_number', 'status', 'total_price', 'currency');

  const rows = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => {
      const isSettled = b.status === 'completed' || b.status === 'confirmed';
      return {
        booking_id: b.id,
        amount: b.total_price,
        currency: b.currency,
        method: b.booking_number.endsWith('2') ? 'paypal' : 'card',
        status: isSettled ? 'paid' : 'pending',
        transaction_ref: isSettled ? `TXN-${b.booking_number}` : null,
        paid_at: isSettled ? knex.fn.now() : null,
      };
    });

  // Add one refunded payment for the cancelled booking, to illustrate the flow.
  const cancelled = bookings.find((b) => b.status === 'cancelled');
  if (cancelled) {
    rows.push({
      booking_id: cancelled.id,
      amount: cancelled.total_price,
      currency: cancelled.currency,
      method: 'card',
      status: 'refunded',
      transaction_ref: `TXN-${cancelled.booking_number}`,
      paid_at: knex.fn.now(),
    });
  }

  await knex('payments').insert(rows);
};
