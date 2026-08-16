const db = require('../config/database');
const ApiError = require('../utils/ApiError');

/**
 * Fix (AUDIT-PHASE-1.md, Medium #8): listAmenities now returns how many
 * hotels + chalets currently use each amenity, so the admin UI can warn
 * "used by N properties" before a delete, instead of silently cascading.
 */
async function listAmenities(type) {
  const qb = db('amenities as a').select('a.*');
  if (type) qb.where((b) => b.where('a.type', type).orWhere('a.type', 'both'));

  const amenities = await qb.orderBy('a.name');
  if (amenities.length === 0) return amenities;

  const ids = amenities.map((a) => a.id);
  const [hotelCounts, chaletCounts] = await Promise.all([
    db('hotel_amenities').whereIn('amenity_id', ids).groupBy('amenity_id').select('amenity_id').count('* as count'),
    db('chalet_amenities').whereIn('amenity_id', ids).groupBy('amenity_id').select('amenity_id').count('* as count'),
  ]);
  const hotelMap = Object.fromEntries(hotelCounts.map((r) => [r.amenity_id, Number(r.count)]));
  const chaletMap = Object.fromEntries(chaletCounts.map((r) => [r.amenity_id, Number(r.count)]));

  return amenities.map((a) => ({
    ...a,
    hotelUsageCount: hotelMap[a.id] || 0,
    chaletUsageCount: chaletMap[a.id] || 0,
    usageCount: (hotelMap[a.id] || 0) + (chaletMap[a.id] || 0),
  }));
}

async function createAmenity({ name, icon, type }) {
  const existing = await db('amenities').whereRaw('LOWER(name) = LOWER(?)', [name]).first();
  if (existing) throw ApiError.conflict('An amenity with this name already exists');

  const [amenity] = await db('amenities')
    .insert({ name, icon: icon || null, type: type || 'both' })
    .returning('*');
  return amenity;
}

async function updateAmenity(id, payload) {
  if (payload.name !== undefined) {
    const existing = await db('amenities').whereRaw('LOWER(name) = LOWER(?)', [payload.name]).whereNot({ id }).first();
    if (existing) throw ApiError.conflict('An amenity with this name already exists');
  }

  const updates = {};
  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.icon !== undefined) updates.icon = payload.icon;
  if (payload.type !== undefined) updates.type = payload.type;
  updates.updated_at = db.fn.now();

  const updated = await db('amenities').where({ id }).update(updates);
  if (!updated) throw ApiError.notFound('Amenity not found');
  return db('amenities').where({ id }).first();
}

/**
 * `force` must be explicitly passed once the admin has seen the usage
 * count and confirmed — without it, deleting an amenity that's still
 * attached to any hotel/chalet is rejected instead of silently cascading.
 */
async function deleteAmenity(id, force = false) {
  const amenity = await db('amenities').where({ id }).first();
  if (!amenity) throw ApiError.notFound('Amenity not found');

  if (!force) {
    const [hotelCount, chaletCount] = await Promise.all([
      db('hotel_amenities').where({ amenity_id: id }).count('* as c').first(),
      db('chalet_amenities').where({ amenity_id: id }).count('* as c').first(),
    ]);
    const usageCount = Number(hotelCount.c) + Number(chaletCount.c);
    if (usageCount > 0) {
      throw new ApiError(
        409,
        `This amenity is used by ${usageCount} propert${usageCount === 1 ? 'y' : 'ies'}. Pass force=true to remove it anyway.`,
        { usageCount }
      );
    }
  }

  await db('amenities').where({ id }).del();
}

module.exports = { listAmenities, createAmenity, updateAmenity, deleteAmenity };
