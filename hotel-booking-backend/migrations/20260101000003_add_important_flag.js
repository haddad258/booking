/**
 * Adds a boolean `important` flag to hotels and chalets, used to mark a
 * property as "featured" / "à la une" for the public site's "Les plus
 * demandés" (Most Requested) home page section. Indexed since the public
 * listing endpoints filter on it directly (?important=true).
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.boolean('important').notNullable().defaultTo(false);
    table.index(['important']);
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.boolean('important').notNullable().defaultTo(false);
    table.index(['important']);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.dropColumn('important');
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.dropColumn('important');
  });
};
