exports.up = function (knex) {
  return knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.string('booking_number', 30).notNullable().unique();
    table.integer('customer_id').unsigned().notNullable()
      .references('id').inTable('customers').onDelete('CASCADE');
    table.enu('bookable_type', ['hotel', 'chalet']).notNullable();
    table.integer('bookable_id').unsigned().notNullable(); // hotel_id or chalet_id
    table.integer('room_id').unsigned().nullable()
      .references('id').inTable('rooms').onDelete('SET NULL');
    table.date('check_in').notNullable();
    table.date('check_out').notNullable();
    table.integer('guests_adults').unsigned().notNullable().defaultTo(1);
    table.integer('guests_children').unsigned().notNullable().defaultTo(0);
    table.enu('status', ['pending', 'confirmed', 'cancelled', 'completed'])
      .notNullable().defaultTo('pending');
    table.decimal('total_price', 10, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('USD');
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.index(['bookable_type', 'bookable_id']);
    table.index(['customer_id']);
    table.index(['status']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('bookings');
};
