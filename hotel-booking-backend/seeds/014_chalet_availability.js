const DAYS_AHEAD = 14;

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

exports.seed = async function (knex) {
  await knex('chalet_availability').del();

  const chalets = await knex('chalets').select('id');

  const rows = [];
  const today = new Date();

  chalets.forEach((chalet, cIndex) => {
    for (let i = 0; i < DAYS_AHEAD; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // A couple of days per chalet are already booked out, for realism.
      const isUnavailable = (cIndex + i) % 7 === 0;

      rows.push({
        chalet_id: chalet.id,
        date: toDateString(date),
        is_available: !isUnavailable,
      });
    }
  });

  await knex('chalet_availability').insert(rows);
};
