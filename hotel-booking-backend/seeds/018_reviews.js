const COMMENTS = [
  { rating: 4.5, comment: 'Séjour très agréable, personnel accueillant et chambre impeccable.', status: 'approved' },
  { rating: 5.0, comment: "Excellent rapport qualité-prix, on reviendra sans hésiter.", status: 'approved' },
  { rating: 3.5, comment: 'Bien situé mais un peu bruyant la nuit.', status: 'pending' },
];

exports.seed = async function (knex) {
  await knex('reviews').del();

  const completedBookings = await knex('bookings')
    .where({ status: 'completed' })
    .select('id', 'customer_id', 'bookable_type', 'bookable_id');

  const rows = completedBookings.map((booking, index) => {
    const template = COMMENTS[index % COMMENTS.length];
    return {
      customer_id: booking.customer_id,
      bookable_type: booking.bookable_type,
      bookable_id: booking.bookable_id,
      booking_id: booking.id,
      rating: template.rating,
      comment: template.comment,
      status: template.status,
    };
  });

  await knex('reviews').insert(rows);
};
