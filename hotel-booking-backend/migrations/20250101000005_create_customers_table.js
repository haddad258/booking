exports.up = function (knex) {
  return knex.schema.createTable('customers', (table) => {
    table.increments('id').primary();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('phone', 30).nullable();
    table.string('avatar', 255).nullable();
    table.enu('status', ['active', 'suspended']).notNullable().defaultTo('active');
    table.string('refresh_token', 500).nullable();
    table.timestamp('email_verified_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('customers');
};
