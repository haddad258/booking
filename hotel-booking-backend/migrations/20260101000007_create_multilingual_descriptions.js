/**
 * Multilingual descriptions (Requirement #3). A hotel/chalet can now have
 * one description per language (`fr`, `ar`, `en`, ...), instead of a
 * single plain-text `description` column. The old `description` column
 * on hotels/chalets is left in place untouched (nothing currently reading
 * it breaks), and is used below as the seed for an initial English
 * description row so existing content isn't lost.
 *
 * `is_default` marks which description the frontend should fall back to
 * when the site's current language has no matching row (Requirement #6) —
 * admin-manageable (Requirement #7), not automatically tied to any one
 * language. Enforced to have at most one default per property via a
 * partial unique index.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('hotel_descriptions', (table) => {
    table.increments('id').primary();
    table.integer('hotel_id').unsigned().notNullable()
      .references('id').inTable('hotels').onDelete('CASCADE');
    table.string('language', 10).notNullable();
    table.text('description').notNullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.unique(['hotel_id', 'language']);
  });

  await knex.schema.createTable('chalet_descriptions', (table) => {
    table.increments('id').primary();
    table.integer('chalet_id').unsigned().notNullable()
      .references('id').inTable('chalets').onDelete('CASCADE');
    table.string('language', 10).notNullable();
    table.text('description').notNullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.unique(['chalet_id', 'language']);
  });

  // At most one default description per property.
  await knex.raw('CREATE UNIQUE INDEX hotel_descriptions_one_default ON hotel_descriptions (hotel_id) WHERE is_default = true');
  await knex.raw('CREATE UNIQUE INDEX chalet_descriptions_one_default ON chalet_descriptions (chalet_id) WHERE is_default = true');

  // Backfill: turn each property's existing plain-text description into
  // an 'en' row marked as the default, so nothing is lost in the switch
  // to the multilingual model.
  const hotels = await knex('hotels').whereNotNull('description').andWhere('description', '!=', '').select('id', 'description');
  for (const h of hotels) {
    await knex('hotel_descriptions').insert({ hotel_id: h.id, language: 'en', description: h.description, is_default: true });
  }
  const chalets = await knex('chalets').whereNotNull('description').andWhere('description', '!=', '').select('id', 'description');
  for (const c of chalets) {
    await knex('chalet_descriptions').insert({ chalet_id: c.id, language: 'en', description: c.description, is_default: true });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('chalet_descriptions');
  await knex.schema.dropTableIfExists('hotel_descriptions');
};
