exports.up = function (knex) {
  return knex.schema.createTable('chalet_amenities', (table) => {
    table.increments('id').primary();
    table.integer('chalet_id').unsigned().notNullable()
      .references('id').inTable('chalets').onDelete('CASCADE');
    table.integer('amenity_id').unsigned().notNullable()
      .references('id').inTable('amenities').onDelete('CASCADE');
    table.unique(['chalet_id', 'amenity_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('chalet_amenities');
};
