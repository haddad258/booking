exports.up = function (knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable()
      .references('id').inTable('customers').onDelete('CASCADE');
    table.enu('bookable_type', ['hotel', 'chalet']).notNullable();
    table.integer('bookable_id').unsigned().notNullable();
    table.timestamps(true, true);

    table.unique(['customer_id', 'bookable_type', 'bookable_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('favorites');
};
