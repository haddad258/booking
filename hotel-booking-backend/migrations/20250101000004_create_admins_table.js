exports.up = function (knex) {
  return knex.schema.createTable('admins', (table) => {
    table.increments('id').primary();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('avatar', 255).nullable();
    table.integer('role_id').unsigned().nullable()
      .references('id').inTable('roles').onDelete('SET NULL');
    table.boolean('is_super_admin').notNullable().defaultTo(false);
    table.enu('status', ['active', 'suspended']).notNullable().defaultTo('active');
    table.string('refresh_token', 500).nullable();
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('admins');
};
