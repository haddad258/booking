exports.up = function (knex) {
  return knex.schema.createTable('reviews', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable()
      .references('id').inTable('customers').onDelete('CASCADE');
    table.enu('bookable_type', ['hotel', 'chalet']).notNullable();
    table.integer('bookable_id').unsigned().notNullable();
    table.integer('booking_id').unsigned().nullable()
      .references('id').inTable('bookings').onDelete('SET NULL');
    table.decimal('rating', 2, 1).notNullable(); // 0.0 - 5.0
    table.text('comment').nullable();
    table.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    table.timestamps(true, true);

    table.index(['bookable_type', 'bookable_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('reviews');
};
