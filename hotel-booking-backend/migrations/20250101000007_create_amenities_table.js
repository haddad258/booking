exports.up = function (knex) {
  return knex.schema.createTable('amenities', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('icon', 100).nullable();
    table.enu('type', ['hotel', 'chalet', 'both']).notNullable().defaultTo('both');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('amenities');
};
