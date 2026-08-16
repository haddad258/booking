/**
 * Fix (AUDIT-PHASE-1.md, Low #14): amenities.name had no uniqueness
 * constraint, so "WiFi", "Wifi", and "wifi" could all exist as separate
 * rows with no protection against accidental duplicates.
 */
exports.up = async function (knex) {
  // Deduplicate any existing case-insensitive duplicates before adding the
  // constraint, keeping the lowest id of each group and re-pointing any
  // pivot rows to it, so the migration is safe to run against real data.
  const duplicates = await knex.raw(`
    SELECT LOWER(name) AS lname, ARRAY_AGG(id ORDER BY id) AS ids
    FROM amenities
    GROUP BY LOWER(name)
    HAVING COUNT(*) > 1
  `);

  for (const row of duplicates.rows) {
    const [keepId, ...dropIds] = row.ids;
    if (dropIds.length === 0) continue;

    // Remove pivot rows for the duplicate ids that would collide with an
    // existing (hotel_id/chalet_id, keepId) pair once repointed.
    await knex('hotel_amenities')
      .whereIn('amenity_id', dropIds)
      .whereIn('hotel_id', knex('hotel_amenities').select('hotel_id').where({ amenity_id: keepId }))
      .del();
    await knex('chalet_amenities')
      .whereIn('amenity_id', dropIds)
      .whereIn('chalet_id', knex('chalet_amenities').select('chalet_id').where({ amenity_id: keepId }))
      .del();

    // Repoint whatever's left to the surviving amenity, then remove the duplicates.
    await knex('hotel_amenities').whereIn('amenity_id', dropIds).update({ amenity_id: keepId });
    await knex('chalet_amenities').whereIn('amenity_id', dropIds).update({ amenity_id: keepId });
    await knex('amenities').whereIn('id', dropIds).del();
  }

  // Case-insensitive uniqueness: a plain UNIQUE(name) would still allow
  // "WiFi" and "wifi" to coexist as separate rows, which was the exact
  // problem flagged in the audit.
  await knex.raw('CREATE UNIQUE INDEX amenities_name_lower_unique ON amenities (LOWER(name))');
};

exports.down = async function (knex) {
  await knex.raw('DROP INDEX IF EXISTS amenities_name_lower_unique');
};
