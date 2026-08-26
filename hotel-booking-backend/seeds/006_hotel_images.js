exports.seed = async function (knex) {
  await knex('hotel_images').del();

  const hotels = await knex('hotels').select('id', 'slug');

  const rows = [];
  hotels.forEach((hotel) => {
    rows.push(
      { hotel_id: hotel.id, url: `https://picsum.photos/seed/${hotel.slug}-1/1200/800`, is_cover: true, sort_order: 0 },
      { hotel_id: hotel.id, url: `https://picsum.photos/seed/${hotel.slug}-2/1200/800`, is_cover: false, sort_order: 1 },
      { hotel_id: hotel.id, url: `https://picsum.photos/seed/${hotel.slug}-3/1200/800`, is_cover: false, sort_order: 2 }
    );
  });

  await knex('hotel_images').insert(rows);
};
