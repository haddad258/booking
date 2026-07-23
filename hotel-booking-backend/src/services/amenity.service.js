const db = require('../config/database');
const ApiError = require('../utils/ApiError');

async function listAmenities(type) {
  const qb = db('amenities').select('*');
  if (type) qb.where((b) => b.where('type', type).orWhere('type', 'both'));
  return qb.orderBy('name');
}

async function createAmenity({ name, icon, type }) {
  const [amenity] = await db('amenities')
    .insert({ name, icon: icon || null, type: type || 'both' })
    .returning('*');
  return amenity;
}

async function updateAmenity(id, payload) {
  const updates = {};
  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.icon !== undefined) updates.icon = payload.icon;
  if (payload.type !== undefined) updates.type = payload.type;
  updates.updated_at = db.fn.now();

  const updated = await db('amenities').where({ id }).update(updates);
  if (!updated) throw ApiError.notFound('Amenity not found');
  return db('amenities').where({ id }).first();
}

async function deleteAmenity(id) {
  const deleted = await db('amenities').where({ id }).del();
  if (!deleted) throw ApiError.notFound('Amenity not found');
}

module.exports = { listAmenities, createAmenity, updateAmenity, deleteAmenity };
