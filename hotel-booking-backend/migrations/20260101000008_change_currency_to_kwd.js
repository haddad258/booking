/**
 * Requirement #2: the site's quotation currency changes from USD to KWD
 * (Kuwaiti Dinar). Updates both the column defaults (for new rows) and
 * backfills existing rows — a single, consistent quotation currency
 * across the whole system rather than a mix of old USD and new KWD data.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.string('currency', 10).notNullable().defaultTo('KWD').alter();
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.string('currency', 10).notNullable().defaultTo('KWD').alter();
  });
  await knex.schema.alterTable('bookings', (table) => {
    table.string('currency', 10).notNullable().defaultTo('KWD').alter();
  });
  await knex.schema.alterTable('payments', (table) => {
    table.string('currency', 10).notNullable().defaultTo('KWD').alter();
  });

  await knex('hotels').where({ currency: 'USD' }).update({ currency: 'KWD' });
  await knex('chalets').where({ currency: 'USD' }).update({ currency: 'KWD' });
  await knex('bookings').where({ currency: 'USD' }).update({ currency: 'KWD' });
  await knex('payments').where({ currency: 'USD' }).update({ currency: 'KWD' });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.string('currency', 10).notNullable().defaultTo('USD').alter();
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.string('currency', 10).notNullable().defaultTo('USD').alter();
  });
  await knex.schema.alterTable('bookings', (table) => {
    table.string('currency', 10).notNullable().defaultTo('USD').alter();
  });
  await knex.schema.alterTable('payments', (table) => {
    table.string('currency', 10).notNullable().defaultTo('USD').alter();
  });

  await knex('hotels').where({ currency: 'KWD' }).update({ currency: 'USD' });
  await knex('chalets').where({ currency: 'KWD' }).update({ currency: 'USD' });
  await knex('bookings').where({ currency: 'KWD' }).update({ currency: 'USD' });
  await knex('payments').where({ currency: 'KWD' }).update({ currency: 'USD' });
};
