exports.up = function (knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('booking_id').unsigned().notNullable()
      .references('id').inTable('bookings').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('USD');
    table.string('method', 50).notNullable().defaultTo('card'); // card, paypal, cash, bank_transfer
    table.enu('status', ['pending', 'paid', 'failed', 'refunded']).notNullable().defaultTo('pending');
    table.string('transaction_ref', 150).nullable();
    table.timestamp('paid_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payments');
};
