exports.up = function (knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.string('key', 150).notNullable().unique();
    table.string('group', 50).notNullable().defaultTo('general'); // website, smtp, languages, currency, taxes, seo
    table.json('value').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('settings');
};
