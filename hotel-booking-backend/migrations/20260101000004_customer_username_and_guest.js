/**
 * Restructures customer authentication per new requirements:
 *   - email/phone are contact info only, no longer unique — many customers
 *     (e.g. repeat guest checkouts) can share the same email or phone.
 *   - `username` becomes the unique login identifier, auto-generated from
 *     the email at account-creation time (see helpers/username.helper.js),
 *     e.g. "john.doe". Nullable, because guest customers (no account) have
 *     no username at all.
 *   - `password` becomes nullable: a guest customer created during
 *     checkout without ticking "create an account" has a Customer row but
 *     no login credentials whatsoever.
 *   - `is_guest` explicitly flags that case, so it never has to be inferred
 *     from password/username being null.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('customers', (table) => {
    table.string('username', 100).nullable();
    table.boolean('is_guest').notNullable().defaultTo(false);
  });

  // Drop the old unique constraint on email — same migration, single pass,
  // since Postgres needs the constraint name to drop it and Knex's
  // `unique()` migration originally created it as customers_email_unique.
  await knex.schema.alterTable('customers', (table) => {
    table.dropUnique(['email']);
  });

  // password was NOT NULL; guests need to be insertable with no password.
  await knex.raw('ALTER TABLE customers ALTER COLUMN password DROP NOT NULL');

  // Backfill: every pre-existing customer has a password (they all
  // predate the guest-checkout feature), so they all get a generated
  // username to keep their existing login working — login switches from
  // email to username for everyone going forward.
  const existing = await knex('customers').whereNotNull('password').select('id', 'email');
  const usedUsernames = new Set();
  for (const row of existing) {
    const local = (row.email.split('@')[0] || 'user').toLowerCase();
    let base = local.replace(/[^a-z0-9.]+/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '') || 'user';
    let candidate = base;
    let suffix = 1;
    while (usedUsernames.has(candidate)) {
      suffix += 1;
      candidate = `${base}${suffix}`;
    }
    usedUsernames.add(candidate);
    await knex('customers').where({ id: row.id }).update({ username: candidate });
  }

  // Now that every credentialed customer has a username, enforce
  // uniqueness (guests keep username = NULL, which Postgres allows
  // multiple of under a standard unique index).
  await knex.schema.alterTable('customers', (table) => {
    table.unique(['username']);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('customers', (table) => {
    table.dropUnique(['username']);
    table.dropColumn('username');
    table.dropColumn('is_guest');
  });
  await knex.raw('ALTER TABLE customers ALTER COLUMN password SET NOT NULL');
  await knex.schema.alterTable('customers', (table) => {
    table.unique(['email']);
  });
};
