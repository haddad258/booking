const db = require('../config/database');

/**
 * Derives a username base from an email's local part, e.g.
 * "John.Doe+bookings@example.com" -> "john.doe.bookings".
 * Lowercased, restricted to [a-z0-9.], collapsed/trimmed dots.
 */
function baseUsernameFromEmail(email) {
  const local = String(email).split('@')[0] || 'user';
  const cleaned = local
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');
  return cleaned || 'user';
}

/**
 * Generates a unique customer username from an email address, e.g.
 * "john.doe" — appending "2", "3", etc. if already taken. Used both for
 * normal registration and for guest checkouts that opt to create an
 * account.
 */
async function generateUniqueUsername(email) {
  const base = baseUsernameFromEmail(email);
  let candidate = base;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await db('customers').where({ username: candidate }).first()) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

module.exports = { baseUsernameFromEmail, generateUniqueUsername };
