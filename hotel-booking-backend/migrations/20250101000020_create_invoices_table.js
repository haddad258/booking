exports.up = function (knex) {
  return knex.schema.createTable('invoices', (table) => {
    table.increments('id').primary();
    table.integer('booking_id').unsigned().notNullable()
      .references('id').inTable('bookings').onDelete('CASCADE');
    table.string('invoice_number', 30).notNullable().unique();
    table.decimal('amount', 10, 2).notNullable();
    table.decimal('tax', 10, 2).notNullable().defaultTo(0);
    table.decimal('total', 10, 2).notNullable();
    table.timestamp('issued_at').notNullable().defaultTo(knex.fn.now());
    table.string('pdf_url', 500).nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('invoices');
};
