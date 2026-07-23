exports.up = function (knex) {
  return knex.schema.createTable('hotels', (table) => {
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.string('slug', 220).notNullable().unique();
    table.text('description').nullable();
    table.string('address', 255).notNullable();
    table.string('city', 100).notNullable();
    table.string('country', 100).notNullable();
    table.decimal('latitude', 10, 7).nullable();
    table.decimal('longitude', 10, 7).nullable();
    table.integer('star_rating').unsigned().nullable();
    table.decimal('base_price', 10, 2).notNullable().defaultTo(0);
    table.string('currency', 10).notNullable().defaultTo('USD');
    table.json('services').nullable(); // e.g. ["breakfast","spa","gym"]
    table.enu('status', ['draft', 'published', 'archived']).notNullable().defaultTo('draft');
    table.integer('created_by').unsigned().nullable()
      .references('id').inTable('admins').onDelete('SET NULL');
    table.timestamps(true, true);

    table.index(['city']);
    table.index(['status']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('hotels');
};
