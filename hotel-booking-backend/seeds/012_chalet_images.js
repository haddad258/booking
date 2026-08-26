exports.seed = async function (knex) {
  await knex('chalet_images').del();

  const chalets = await knex('chalets').select('id', 'slug');

  const rows = [];
  chalets.forEach((chalet) => {
    rows.push(
      { chalet_id: chalet.id, url: `https://picsum.photos/seed/${chalet.slug}-1/1200/800`, is_cover: true, sort_order: 0 },
      { chalet_id: chalet.id, url: `https://picsum.photos/seed/${chalet.slug}-2/1200/800`, is_cover: false, sort_order: 1 },
      { chalet_id: chalet.id, url: `https://picsum.photos/seed/${chalet.slug}-3/1200/800`, is_cover: false, sort_order: 2 }
    );
  });

  await knex('chalet_images').insert(rows);
};
