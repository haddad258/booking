/**
 * Fix (see AUDIT-PHASE-1.md, Medium #7): password-reset tokens are signed
 * JWTs with no server-side "consumed" tracking, so a leaked reset link
 * stays valid to reset the password again and again until it naturally
 * expires (up to 1 hour). This adds a `password_changed_at` timestamp that
 * gets embedded in every reset token at issuance and re-checked at
 * verification time — once a password actually changes (via reset OR the
 * normal change-password flow), every previously issued reset token for
 * that account becomes invalid immediately, not just at its 1h expiry.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('admins', (table) => {
    table.timestamp('password_changed_at').nullable();
  });
  await knex.schema.alterTable('customers', (table) => {
    table.timestamp('password_changed_at').nullable();
  });

  // Backfill existing rows so the check has a baseline value instead of NULL.
  await knex('admins').update({ password_changed_at: knex.fn.now() });
  await knex('customers').update({ password_changed_at: knex.fn.now() });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('admins', (table) => {
    table.dropColumn('password_changed_at');
  });
  await knex.schema.alterTable('customers', (table) => {
    table.dropColumn('password_changed_at');
  });
};
