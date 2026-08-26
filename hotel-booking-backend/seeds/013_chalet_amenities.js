exports.seed = async function (knex) {
  await knex('chalet_amenities').del();

  const chalets = await knex('chalets').select('id');
  const amenities = await knex('amenities')
    .whereIn('type', ['chalet', 'both'])
    .select('id');

  const rows = [];
  chalets.forEach((chalet, cIndex) => {
    amenities.forEach((amenity, aIndex) => {
      if ((cIndex + aIndex) % 2 === 0) {
        rows.push({ chalet_id: chalet.id, amenity_id: amenity.id });
      }
    });
  });

  await knex('chalet_amenities').insert(rows);
};
