function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

exports.seed = async function (knex) {
  await knex('bookings').del();

  const customers = await knex('customers').select('id', 'email').orderBy('id');
  const hotels = await knex('hotels').select('id', 'slug').orderBy('id');
  const chalets = await knex('chalets').select('id', 'slug').orderBy('id');
  const rooms = await knex('rooms').select('id', 'hotel_id', 'price').orderBy('id');

  const roomsByHotel = (hotelId) => rooms.filter((r) => r.hotel_id === hotelId);
  const today = new Date();

  const bookingsInput = [
    {
      booking_number: 'BKG-0001',
      customer: customers[0],
      bookable_type: 'hotel',
      bookable: hotels[0],
      checkInOffset: -20,
      nights: 3,
      status: 'completed',
      guests_adults: 2,
      guests_children: 0,
    },
    {
      booking_number: 'BKG-0002',
      customer: customers[1],
      bookable_type: 'hotel',
      bookable: hotels[1],
      checkInOffset: -10,
      nights: 5,
      status: 'completed',
      guests_adults: 2,
      guests_children: 1,
    },
    {
      booking_number: 'BKG-0003',
      customer: customers[2],
      bookable_type: 'chalet',
      bookable: chalets[0],
      checkInOffset: 5,
      nights: 4,
      status: 'confirmed',
      guests_adults: 4,
      guests_children: 2,
    },
    {
      booking_number: 'BKG-0004',
      customer: customers[3],
      bookable_type: 'hotel',
      bookable: hotels[2],
      checkInOffset: 12,
      nights: 2,
      status: 'confirmed',
      guests_adults: 2,
      guests_children: 0,
    },
    {
      booking_number: 'BKG-0005',
      customer: customers[4],
      bookable_type: 'chalet',
      bookable: chalets[1],
      checkInOffset: 25,
      nights: 3,
      status: 'pending',
      guests_adults: 3,
      guests_children: 0,
    },
    {
      booking_number: 'BKG-0006',
      customer: customers[5],
      bookable_type: 'hotel',
      bookable: hotels[3],
      checkInOffset: -5,
      nights: 2,
      status: 'cancelled',
      guests_adults: 1,
      guests_children: 0,
    },
  ];

  const rows = bookingsInput.map((b) => {
    const checkIn = addDays(today, b.checkInOffset);
    const checkOut = addDays(checkIn, b.nights);
    const room = b.bookable_type === 'hotel' ? roomsByHotel(b.bookable.id)[0] : null;
    const pricePerNight = room ? Number(room.price) : 150.0;

    return {
      booking_number: b.booking_number,
      customer_id: b.customer.id,
      bookable_type: b.bookable_type,
      bookable_id: b.bookable.id,
      room_id: room ? room.id : null,
      check_in: toDateString(checkIn),
      check_out: toDateString(checkOut),
      guests_adults: b.guests_adults,
      guests_children: b.guests_children,
      status: b.status,
      total_price: Number((pricePerNight * b.nights).toFixed(2)),
      currency: 'TND',
      notes: null,
    };
  });

  await knex('bookings').insert(rows);
};
