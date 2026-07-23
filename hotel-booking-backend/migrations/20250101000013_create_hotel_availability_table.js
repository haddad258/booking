exports.up = function (knex) {
  return knex.schema.createTable('hotel_availability', (table) => {
    table.increments('id').primary();
    table.integer('hotel_id').unsigned().notNullable()
      .references('id').inTable('hotels').onDelete('CASCADE');
    table.integer('room_id').unsigned().notNullable()
      .references('id').inTable('rooms').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('available_units').unsigned().notNullable();
    table.decimal('price_override', 10, 2).nullable();
    table.timestamps(true, true);

    table.unique(['room_id', 'date']);
    table.index(['hotel_id', 'date']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('hotel_availability');
};
