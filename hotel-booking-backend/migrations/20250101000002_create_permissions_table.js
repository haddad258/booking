exports.up = function (knex) {
  return knex.schema.createTable('permissions', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique(); // e.g. 'hotels.create'
    table.string('module', 100).notNullable(); // e.g. 'hotels'
    table.string('description', 255).nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('permissions');
};
