exports.seed = async function (knex) {
  await knex('favorites').del();

  const customers = await knex('customers').select('id').orderBy('id');
  const hotels = await knex('hotels').select('id').orderBy('id');
  const chalets = await knex('chalets').select('id').orderBy('id');

  const rows = [];

  customers.forEach((customer, index) => {
    // Each customer favorites one hotel and one chalet, spread across the catalog.
    const hotel = hotels[index % hotels.length];
    const chalet = chalets[index % chalets.length];

    rows.push(
      { customer_id: customer.id, bookable_type: 'hotel', bookable_id: hotel.id },
      { customer_id: customer.id, bookable_type: 'chalet', bookable_id: chalet.id }
    );
  });

  await knex('favorites').insert(rows);
};
