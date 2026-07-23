const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { slugify, uniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');

async function generateUniqueSlug(name) {
  const base = slugify(name);
  const existing = await db('chalets').where({ slug: base }).first();
  return existing ? uniqueSlug(name) : base;
}

async function attachAmenities(chaletId, amenityIds) {
  const rows = amenityIds.map((amenity_id) => ({ chalet_id: chaletId, amenity_id }));
  await db('chalet_amenities').insert(rows).onConflict(['chalet_id', 'amenity_id']).ignore();
}

async function createChalet(payload, adminId) {
  const slug = await generateUniqueSlug(payload.name);

  const [chalet] = await db('chalets')
    .insert({
      name: payload.name,
      slug,
      description: payload.description || null,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      latitude: payload.latitude || null,
      longitude: payload.longitude || null,
      capacity: payload.capacity,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms || 1,
      base_price: payload.basePrice,
      currency: payload.currency || 'USD',
      status: payload.status || 'draft',
      created_by: adminId,
    })
    .returning('*');

  if (Array.isArray(payload.amenityIds) && payload.amenityIds.length) {
    await attachAmenities(chalet.id, payload.amenityIds);
  }

  return getChaletById(chalet.id);
}

async function listChalets(query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('chalets').select('*');

  if (query.city) qb.where('city', 'ilike', `%${query.city}%`);
  if (query.status) qb.where('status', query.status);
  else qb.where('status', 'published');
  if (query.minCapacity) qb.where('capacity', '>=', query.minCapacity);
  if (query.minPrice) qb.where('base_price', '>=', query.minPrice);
  if (query.maxPrice) qb.where('base_price', '<=', query.maxPrice);
  if (query.search) qb.where('name', 'ilike', `%${query.search}%`);

  const totalQuery = qb.clone().clearSelect().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);

  const [{ count }, chalets] = await Promise.all([totalQuery, rowsQuery]);
  return { data: chalets, page, limit, total: Number(count) };
}

async function getChaletById(id) {
  const chalet = await db('chalets').where({ id }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const [images, amenities] = await Promise.all([
    db('chalet_images').where({ chalet_id: id }).orderBy('sort_order'),
    db('chalet_amenities as ca')
      .join('amenities as a', 'a.id', 'ca.amenity_id')
      .where('ca.chalet_id', id)
      .select('a.*'),
  ]);

  return { ...chalet, images, amenities };
}

async function updateChalet(id, payload) {
  const chalet = await db('chalets').where({ id }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const updates = {};
  const map = {
    name: 'name',
    description: 'description',
    address: 'address',
    city: 'city',
    country: 'country',
    latitude: 'latitude',
    longitude: 'longitude',
    capacity: 'capacity',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    basePrice: 'base_price',
    currency: 'currency',
    status: 'status',
  };
  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) updates[column] = payload[key];
  }
  if (payload.name && payload.name !== chalet.name) {
    updates.slug = await generateUniqueSlug(payload.name);
  }
  updates.updated_at = db.fn.now();

  await db('chalets').where({ id }).update(updates);

  if (Array.isArray(payload.amenityIds)) {
    await db('chalet_amenities').where({ chalet_id: id }).del();
    if (payload.amenityIds.length) await attachAmenities(id, payload.amenityIds);
  }

  return getChaletById(id);
}

async function deleteChalet(id) {
  const deleted = await db('chalets').where({ id }).del();
  if (!deleted) throw ApiError.notFound('Chalet not found');
}

async function addImages(chaletId, files) {
  const chalet = await db('chalets').where({ id: chaletId }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const existingCount = await db('chalet_images').where({ chalet_id: chaletId }).count('* as c').first();
  const rows = files.map((file, idx) => ({
    chalet_id: chaletId,
    url: `/uploads/chalets/${file.filename}`,
    is_cover: Number(existingCount.c) === 0 && idx === 0,
    sort_order: Number(existingCount.c) + idx,
  }));
  return db('chalet_images').insert(rows).returning('*');
}

async function removeImage(chaletId, imageId) {
  const deleted = await db('chalet_images').where({ id: imageId, chalet_id: chaletId }).del();
  if (!deleted) throw ApiError.notFound('Image not found');
}

/** A chalet is booked as a whole unit per night, so availability is a simple boolean per date. */
async function checkAvailability(chaletId, checkIn, checkOut) {
  const chalet = await db('chalets').where({ id: chaletId }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const overlapping = await db('bookings')
    .where({ bookable_type: 'chalet', bookable_id: chaletId })
    .whereIn('status', ['pending', 'confirmed'])
    .where('check_in', '<', checkOut)
    .where('check_out', '>', checkIn)
    .first();

  return { available: !overlapping };
}

async function setAvailability(chaletId, entries) {
  const chalet = await db('chalets').where({ id: chaletId }).first();
  if (!chalet) throw ApiError.notFound('Chalet not found');

  const rows = entries.map((e) => ({
    chalet_id: chaletId,
    date: e.date,
    is_available: e.isAvailable !== undefined ? e.isAvailable : true,
    price_override: e.priceOverride || null,
  }));

  await db('chalet_availability')
    .insert(rows)
    .onConflict(['chalet_id', 'date'])
    .merge(['is_available', 'price_override']);

  return db('chalet_availability').where({ chalet_id: chaletId }).orderBy('date');
}

module.exports = {
  createChalet,
  listChalets,
  getChaletById,
  updateChalet,
  deleteChalet,
  addImages,
  removeImage,
  checkAvailability,
  setAvailability,
};
