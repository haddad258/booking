const DAYS_AHEAD = 14;

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

exports.seed = async function (knex) {
  await knex('hotel_availability').del();

  const rooms = await knex('rooms').select('id', 'hotel_id', 'quantity');

  const rows = [];
  const today = new Date();

  rooms.forEach((room) => {
    for (let i = 0; i < DAYS_AHEAD; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Weekends are busier: fewer available units.
      const isWeekend = [0, 6].includes(date.getDay());
      const availableUnits = isWeekend
        ? Math.max(0, room.quantity - Math.ceil(room.quantity * 0.6))
        : room.quantity;

      rows.push({
        hotel_id: room.hotel_id,
        room_id: room.id,
        date: toDateString(date),
        available_units: availableUnits,
      });
    }
  });

  await knex('hotel_availability').insert(rows);
};
