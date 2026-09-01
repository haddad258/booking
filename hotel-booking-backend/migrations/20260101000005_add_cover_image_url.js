/**
 * Adds an explicit `cover_image_url` column to hotels and chalets. Until
 * now the "cover" image was only tracked implicitly via `is_cover` on the
 * hotel_images/chalet_images pivot tables, requiring a join to know a
 * property's cover photo. This denormalizes the current cover's URL
 * directly onto the property row — kept in sync by the
 * addImages/setCoverImage/removeImage service functions — so the public
 * site and any listing query can read it with zero extra joins.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.string('cover_image_url', 500).nullable();
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.string('cover_image_url', 500).nullable();
  });

  // Backfill from any already-existing cover images so current data stays
  // consistent with the new column immediately after migrating.
  const hotelCovers = await knex('hotel_images').where({ is_cover: true }).select('hotel_id', 'url');
  for (const row of hotelCovers) {
    await knex('hotels').where({ id: row.hotel_id }).update({ cover_image_url: row.url });
  }
  const chaletCovers = await knex('chalet_images').where({ is_cover: true }).select('chalet_id', 'url');
  for (const row of chaletCovers) {
    await knex('chalets').where({ id: row.chalet_id }).update({ cover_image_url: row.url });
  }
};

exports.down = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.dropColumn('cover_image_url');
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.dropColumn('cover_image_url');
  });
};
