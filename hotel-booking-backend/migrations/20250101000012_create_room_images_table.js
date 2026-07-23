exports.up = function (knex) {
  return knex.schema.createTable('room_images', (table) => {
    table.increments('id').primary();
    table.integer('room_id').unsigned().notNullable()
      .references('id').inTable('rooms').onDelete('CASCADE');
    table.string('url', 500).notNullable();
    table.integer('sort_order').unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('room_images');
};
