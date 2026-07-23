exports.up = function (knex) {
  return knex.schema.createTable('hotel_amenities', (table) => {
    table.increments('id').primary();
    table.integer('hotel_id').unsigned().notNullable()
      .references('id').inTable('hotels').onDelete('CASCADE');
    table.integer('amenity_id').unsigned().notNullable()
      .references('id').inTable('amenities').onDelete('CASCADE');
    table.unique(['hotel_id', 'amenity_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('hotel_amenities');
};
