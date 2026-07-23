exports.up = function (knex) {
  return knex.schema.createTable('rooms', (table) => {
    table.increments('id').primary();
    table.integer('hotel_id').unsigned().notNullable()
      .references('id').inTable('hotels').onDelete('CASCADE');
    table.string('name', 150).notNullable();
    table.string('type', 100).nullable(); // single, double, suite...
    table.integer('capacity_adults').unsigned().notNullable().defaultTo(2);
    table.integer('capacity_children').unsigned().notNullable().defaultTo(0);
    table.decimal('price', 10, 2).notNullable();
    table.integer('quantity').unsigned().notNullable().defaultTo(1);
    table.text('description').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rooms');
};
