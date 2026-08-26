exports.seed = async function (knex) {
  await knex('hotel_amenities').del();

  const hotels = await knex('hotels').select('id');
  const amenities = await knex('amenities')
    .whereIn('type', ['hotel', 'both'])
    .select('id');

  const rows = [];
  hotels.forEach((hotel, hIndex) => {
    // Give each hotel a varied but deterministic subset of amenities.
    amenities.forEach((amenity, aIndex) => {
      if ((hIndex + aIndex) % 3 !== 0) {
        rows.push({ hotel_id: hotel.id, amenity_id: amenity.id });
      }
    });
  });

  await knex('hotel_amenities').insert(rows);
};
