const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../helpers/password.helper');
const {
  issueTokenPair,
  verifyRefreshToken,
  signResetToken,
  verifyResetToken,
} = require('../helpers/token.helper');
const { sendMail, passwordResetEmail } = require('../helpers/mailer.helper');
const { clientUrl, adminUrl } = require('../config/env');
const { generateUniqueUsername } = require('../helpers/username.helper');

const TABLES = { admin: 'admins', customer: 'customers' };
// Admins still authenticate by email (unchanged — they're internal staff
// accounts, out of scope for the "email/phone are not unique" change,
// which applies specifically to the Customer model per the booking/guest
// checkout requirements). Customers authenticate by their unique,
// system-generated username instead.
const LOOKUP_FIELD = { admin: 'email', customer: 'username' };

function sanitize(user) {
  if (!user) return user;
  const { password, refresh_token, ...safe } = user;
  return safe;
}

/**
 * Registers a new customer account (public self-signup / "create an
 * account" during checkout). Email is no longer checked for uniqueness —
 * multiple customers may share an email or phone (see migration
 * 20260101000004) — the unique login identifier is the auto-generated
 * `username`, derived from the email's local part (e.g. "john.doe").
 */
async function registerCustomer({ firstName, lastName, email, password, phone }) {
  const hashed = await hashPassword(password);
  const username = await generateUniqueUsername(email);

  const [customer] = await db('customers')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashed,
      phone: phone || null,
      username,
      is_guest: false,
    })
    .returning('*');

  const tokens = issueTokenPair({ id: customer.id, type: 'customer' });
  await db('customers').where({ id: customer.id }).update({ refresh_token: tokens.refreshToken });

  return { user: sanitize(customer), ...tokens };
}

/**
 * Shared login logic for both admins and customers. `identifier` is the
 * admin's email or the customer's username, depending on `type`.
 */
async function login({ identifier, password, type }) {
  const table = TABLES[type];
  const field = LOOKUP_FIELD[type];
  const user = await db(table).where({ [field]: identifier }).first();
  if (!user) throw ApiError.unauthorized(`Invalid ${field} or password`);

  // Guests have no password at all (see customer.service#createCustomerForBooking)
  // and no username, so this is mostly a defense-in-depth guard — a guest
  // can never actually reach this point since there's no username to look
  // up by — but it keeps the invariant explicit.
  if (type === 'customer' && (user.is_guest || !user.password)) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) throw ApiError.unauthorized(`Invalid ${field} or password`);

  if (user.status !== 'active') throw ApiError.forbidden('Account is suspended');

  const tokens = issueTokenPair({
    id: user.id,
    type,
    role: type === 'admin' ? (user.is_super_admin ? 'super_admin' : user.role_id) : null,
  });

  const updates = { refresh_token: tokens.refreshToken };
  if (type === 'admin') updates.last_login_at = db.fn.now();
  await db(table).where({ id: user.id }).update(updates);

  return { user: sanitize(user), ...tokens };
}

/** Issues a fresh access/refresh token pair given a valid, still-registered refresh token. */
async function refreshTokens({ refreshToken, type }) {
  const table = TABLES[type];
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await db(table).where({ id: payload.sub }).first();
  if (!user || user.refresh_token !== refreshToken) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  const tokens = issueTokenPair({
    id: user.id,
    type,
    role: type === 'admin' ? (user.is_super_admin ? 'super_admin' : user.role_id) : null,
  });
  await db(table).where({ id: user.id }).update({ refresh_token: tokens.refreshToken });

  return tokens;
}

/** Clears the stored refresh token, effectively logging the user out on the server. */
async function logout({ userId, type }) {
  const table = TABLES[type];
  await db(table).where({ id: userId }).update({ refresh_token: null });
}

/**
 * Sends a password reset email containing a short-lived signed token.
 * `identifier` is the admin's email or the customer's username.
 */
async function forgotPassword({ identifier, type }) {
  const table = TABLES[type];
  const field = LOOKUP_FIELD[type];
  const user = await db(table).where({ [field]: identifier }).first();
  // Always respond success-like to the caller to avoid leaking which
  // accounts exist; the controller decides the exact response message.
  // Guests (no username/password) can never match this lookup at all,
  // so they're naturally excluded — there's nothing to reset.
  if (!user) return;

  const pwv = user.password_changed_at ? new Date(user.password_changed_at).getTime() : 0;
  const token = signResetToken({ sub: user.id, type, pwv });
  const baseUrl = type === 'admin' ? adminUrl : clientUrl;
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: 'Reset your password',
    html: passwordResetEmail(resetUrl),
  });
}

/** Verifies the reset token and updates the user's password. */
async function resetPassword({ token, password, type }) {
  const table = TABLES[type];
  let payload;
  try {
    payload = verifyResetToken(token);
  } catch (err) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }
  if (payload.type !== type) throw ApiError.badRequest('Invalid reset token');

  const user = await db(table).where({ id: payload.sub }).first();
  if (!user) throw ApiError.badRequest('Invalid reset token');

  const currentPwv = user.password_changed_at ? new Date(user.password_changed_at).getTime() : 0;
  if (payload.pwv !== currentPwv) {
    throw ApiError.badRequest('This reset link has already been used. Please request a new one.');
  }

  const hashed = await hashPassword(password);
  await db(table)
    .where({ id: user.id })
    .update({ password: hashed, refresh_token: null, password_changed_at: db.fn.now() });
}

module.exports = {
  registerCustomer,
  login,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
  sanitize,
};
