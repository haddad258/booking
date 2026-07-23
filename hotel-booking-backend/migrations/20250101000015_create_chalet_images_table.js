exports.up = function (knex) {
  return knex.schema.createTable('chalet_images', (table) => {
    table.increments('id').primary();
    table.integer('chalet_id').unsigned().notNullable()
      .references('id').inTable('chalets').onDelete('CASCADE');
    table.string('url', 500).notNullable();
    table.boolean('is_cover').notNullable().defaultTo(false);
    table.integer('sort_order').unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('chalet_images');
};
