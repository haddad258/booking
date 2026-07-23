const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../helpers/password.helper');
const { getPagination } = require('../utils/pagination');

function sanitize(customer) {
  if (!customer) return customer;
  const { password, refresh_token, ...safe } = customer;
  return safe;
}

async function listCustomers(query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('customers').select('*');
  if (query.status) qb.where('status', query.status);
  if (query.search) {
    qb.where((b) =>
      b.where('first_name', 'ilike', `%${query.search}%`)
        .orWhere('last_name', 'ilike', `%${query.search}%`)
        .orWhere('email', 'ilike', `%${query.search}%`)
    );
  }

  const totalQuery = qb.clone().clearSelect().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);
  const [{ count }, customers] = await Promise.all([totalQuery, rowsQuery]);

  return { data: customers.map(sanitize), page, limit, total: Number(count) };
}

async function getCustomerById(id) {
  const customer = await db('customers').where({ id }).first();
  if (!customer) throw ApiError.notFound('Customer not found');
  const addresses = await db('customer_addresses').where({ customer_id: id });
  return { ...sanitize(customer), addresses };
}

async function updateProfile(id, payload) {
  const updates = {};
  const map = { firstName: 'first_name', lastName: 'last_name', phone: 'phone' };
  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) updates[column] = payload[key];
  }
  updates.updated_at = db.fn.now();
  await db('customers').where({ id }).update(updates);
  return getCustomerById(id);
}

async function changePassword(id, currentPassword, newPassword) {
  const customer = await db('customers').where({ id }).first();
  if (!customer) throw ApiError.notFound('Customer not found');

  const valid = await comparePassword(currentPassword, customer.password);
  if (!valid) throw ApiError.badRequest('Current password is incorrect');

  const hashed = await hashPassword(newPassword);
  await db('customers').where({ id }).update({ password: hashed, refresh_token: null });
}

async function updateStatus(id, status) {
  const updated = await db('customers').where({ id }).update({ status, updated_at: db.fn.now() });
  if (!updated) throw ApiError.notFound('Customer not found');
  return getCustomerById(id);
}

async function deleteCustomer(id) {
  const deleted = await db('customers').where({ id }).del();
  if (!deleted) throw ApiError.notFound('Customer not found');
}

// --- Addresses ---

async function addAddress(customerId, payload) {
  if (payload.isDefault) {
    await db('customer_addresses').where({ customer_id: customerId }).update({ is_default: false });
  }
  const [address] = await db('customer_addresses')
    .insert({
      customer_id: customerId,
      label: payload.label || null,
      address_line1: payload.addressLine1,
      address_line2: payload.addressLine2 || null,
      city: payload.city,
      state: payload.state || null,
      country: payload.country,
      postal_code: payload.postalCode || null,
      is_default: payload.isDefault || false,
    })
    .returning('*');
  return address;
}

async function removeAddress(customerId, addressId) {
  const deleted = await db('customer_addresses').where({ id: addressId, customer_id: customerId }).del();
  if (!deleted) throw ApiError.notFound('Address not found');
}

// --- Favorites ---

async function addFavorite(customerId, { bookableType, bookableId }) {
  const [favorite] = await db('favorites')
    .insert({ customer_id: customerId, bookable_type: bookableType, bookable_id: bookableId })
    .onConflict(['customer_id', 'bookable_type', 'bookable_id'])
    .ignore()
    .returning('*');
  return favorite || { customer_id: customerId, bookable_type: bookableType, bookable_id: bookableId };
}

async function removeFavorite(customerId, bookableType, bookableId) {
  await db('favorites')
    .where({ customer_id: customerId, bookable_type: bookableType, bookable_id: bookableId })
    .del();
}

async function listFavorites(customerId) {
  return db('favorites').where({ customer_id: customerId });
}

// --- Booking history ---

async function getBookingHistory(customerId, query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('bookings').where({ customer_id: customerId });
  if (query.status) qb.where('status', query.status);

  const totalQuery = qb.clone().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);
  const [{ count }, bookings] = await Promise.all([totalQuery, rowsQuery]);

  return { data: bookings, page, limit, total: Number(count) };
}

module.exports = {
  listCustomers,
  getCustomerById,
  updateProfile,
  changePassword,
  updateStatus,
  deleteCustomer,
  addAddress,
  removeAddress,
  addFavorite,
  removeFavorite,
  listFavorites,
  getBookingHistory,
  sanitize,
};
