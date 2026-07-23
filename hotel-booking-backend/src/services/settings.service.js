const db = require('../config/database');

const DEFAULTS = {
  website: { siteName: 'Hotel Booking Platform', logoUrl: null, favicon: null, contactEmail: null, contactPhone: null },
  smtp: { host: null, port: 587, secure: false, user: null, from: null },
  languages: { default: 'en', enabled: ['en', 'fr', 'ar'] },
  currency: { default: 'USD', enabled: ['USD', 'EUR'] },
  taxes: { rate: 0, inclusive: false },
  seo: { metaTitle: null, metaDescription: null, ogImage: null },
};

/** Returns all settings grouped by their `group` (website, smtp, languages, currency, taxes, seo). */
/** Strips the `group.` prefix off a stored settings key, e.g. 'website.siteName' -> 'siteName'. */
function shortKey(group, fullKey) {
  return fullKey.startsWith(`${group}.`) ? fullKey.slice(group.length + 1) : fullKey;
}

async function getAllSettings() {
  const rows = await db('settings').select('*');
  const grouped = { ...DEFAULTS };
  for (const row of rows) {
    grouped[row.group] = { ...(grouped[row.group] || {}), [shortKey(row.group, row.key)]: row.value };
  }
  return grouped;
}

async function getGroup(group) {
  const rows = await db('settings').where({ group });
  const result = { ...(DEFAULTS[group] || {}) };
  for (const row of rows) result[shortKey(group, row.key)] = row.value;
  return result;
}

/** Upserts each key in `values` under the given group. */
async function updateGroup(group, values) {
  const entries = Object.entries(values);
  await db.transaction(async (trx) => {
    for (const [key, value] of entries) {
      const fullKey = `${group}.${key}`;
      await trx('settings')
        .insert({ key: fullKey, group, value: JSON.stringify(value) })
        .onConflict('key')
        .merge({ value: JSON.stringify(value), updated_at: trx.fn.now() });
    }
  });
  return getGroup(group);
}

module.exports = { getAllSettings, getGroup, updateGroup };
