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

const TABLES = { admin: 'admins', customer: 'customers' };

function sanitize(user) {
  if (!user) return user;
  const { password, refresh_token, ...safe } = user;
  return safe;
}

/** Registers a new customer account (public self-signup). Admins are created via the admin management API only. */
async function registerCustomer({ firstName, lastName, email, password, phone }) {
  const existing = await db('customers').where({ email }).first();
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const hashed = await hashPassword(password);
  const [customer] = await db('customers')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashed,
      phone: phone || null,
    })
    .returning('*');

  const tokens = issueTokenPair({ id: customer.id, type: 'customer' });
  await db('customers').where({ id: customer.id }).update({ refresh_token: tokens.refreshToken });

  return { user: sanitize(customer), ...tokens };
}

/** Shared login logic for both admins and customers. */
async function login({ email, password, type }) {
  const table = TABLES[type];
  const user = await db(table).where({ email }).first();
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

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

/** Sends a password reset email containing a short-lived signed token. */
async function forgotPassword({ email, type }) {
  const table = TABLES[type];
  const user = await db(table).where({ email }).first();
  // Always respond success-like to the caller to avoid leaking which emails exist;
  // the controller decides the exact response message.
  if (!user) return;

  const token = signResetToken({ sub: user.id, type });
  const baseUrl = type === 'admin' ? adminUrl : clientUrl;
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendMail({
    to: email,
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

  const hashed = await hashPassword(password);
  await db(table).where({ id: user.id }).update({ password: hashed, refresh_token: null });
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
