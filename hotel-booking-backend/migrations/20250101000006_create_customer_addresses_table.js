exports.up = function (knex) {
  return knex.schema.createTable('customer_addresses', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable()
      .references('id').inTable('customers').onDelete('CASCADE');
    table.string('label', 50).nullable();
    table.string('address_line1', 255).notNullable();
    table.string('address_line2', 255).nullable();
    table.string('city', 100).notNullable();
    table.string('state', 100).nullable();
    table.string('country', 100).notNullable();
    table.string('postal_code', 20).nullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('customer_addresses');
};
