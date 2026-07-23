exports.up = function (knex) {
  return knex.schema.createTable('chalet_availability', (table) => {
    table.increments('id').primary();
    table.integer('chalet_id').unsigned().notNullable()
      .references('id').inTable('chalets').onDelete('CASCADE');
    table.date('date').notNullable();
    table.boolean('is_available').notNullable().defaultTo(true);
    table.decimal('price_override', 10, 2).nullable();
    table.timestamps(true, true);

    table.unique(['chalet_id', 'date']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('chalet_availability');
};
