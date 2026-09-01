const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { slugify, uniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');

async function generateUniqueSlug(name) {
  const base = slugify(name);
  const existing = await db('hotels').where({ slug: base }).first();
  return existing ? uniqueSlug(name) : base;
}

async function createHotel(payload, adminId) {
  const slug = await generateUniqueSlug(payload.name);

  const [hotel] = await db('hotels')
    .insert({
      name: payload.name,
      slug,
      description: payload.description || null,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      latitude: payload.latitude || null,
      longitude: payload.longitude || null,
      star_rating: payload.starRating || null,
      base_price: payload.basePrice,
      currency: payload.currency || 'USD',
      services: payload.services ? JSON.stringify(payload.services) : null,
      status: payload.status || 'draft',
      important: payload.important === true,
      created_by: adminId,
    })
    .returning('*');

  if (Array.isArray(payload.amenityIds) && payload.amenityIds.length) {
    await attachAmenities(hotel.id, payload.amenityIds);
  }

  return getHotelById(hotel.id);
}

async function attachAmenities(hotelId, amenityIds) {
  const rows = amenityIds.map((amenity_id) => ({ hotel_id: hotelId, amenity_id }));
  await db('hotel_amenities').insert(rows).onConflict(['hotel_id', 'amenity_id']).ignore();
}

async function listHotels(query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('hotels').select('*');

  if (query.city) qb.where('city', 'ilike', `%${query.city}%`);
  if (query.country) qb.where('country', 'ilike', `%${query.country}%`);
  if (query.status) qb.where('status', query.status);
  else qb.where('status', 'published'); // public listing defaults to published only
  if (query.minPrice) qb.where('base_price', '>=', query.minPrice);
  if (query.maxPrice) qb.where('base_price', '<=', query.maxPrice);
  if (query.rating) qb.where('star_rating', '>=', query.rating);
  if (query.search) qb.where('name', 'ilike', `%${query.search}%`);
  // Used by the public site's "Les plus demandés" (Most Requested) home
  // page section to fetch only featured properties: GET /hotels?important=true
  if (query.important !== undefined) {
    qb.where('important', query.important === 'true' || query.important === true);
  }

  const totalQuery = qb.clone().clearSelect().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);

  const [{ count }, hotels] = await Promise.all([totalQuery, rowsQuery]);

  return { data: hotels, page, limit, total: Number(count) };
}

async function getHotelById(id) {
  const hotel = await db('hotels').where({ id }).first();
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const [images, amenities, rooms] = await Promise.all([
    db('hotel_images').where({ hotel_id: id }).orderBy('sort_order'),
    db('hotel_amenities as ha')
      .join('amenities as a', 'a.id', 'ha.amenity_id')
      .where('ha.hotel_id', id)
      .select('a.*'),
    db('rooms').where({ hotel_id: id }),
  ]);

  return { ...hotel, images, amenities, rooms };
}

async function updateHotel(id, payload) {
  const hotel = await db('hotels').where({ id }).first();
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const updates = {};
  const map = {
    name: 'name',
    description: 'description',
    address: 'address',
    city: 'city',
    country: 'country',
    latitude: 'latitude',
    longitude: 'longitude',
    starRating: 'star_rating',
    basePrice: 'base_price',
    currency: 'currency',
    status: 'status',
    important: 'important',
  };
  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) updates[column] = payload[key];
  }
  if (payload.services !== undefined) updates.services = JSON.stringify(payload.services);
  if (payload.name && payload.name !== hotel.name) {
    updates.slug = await generateUniqueSlug(payload.name);
  }
  updates.updated_at = db.fn.now();

  await db('hotels').where({ id }).update(updates);

  if (Array.isArray(payload.amenityIds)) {
    await db('hotel_amenities').where({ hotel_id: id }).del();
    if (payload.amenityIds.length) await attachAmenities(id, payload.amenityIds);
  }

  return getHotelById(id);
}

async function deleteHotel(id) {
  const deleted = await db('hotels').where({ id }).del();
  if (!deleted) throw ApiError.notFound('Hotel not found');
}

async function addImages(hotelId, files) {
  const hotel = await db('hotels').where({ id: hotelId }).first();
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const existingCount = await db('hotel_images').where({ hotel_id: hotelId }).count('* as c').first();
  const isFirstBatch = Number(existingCount.c) === 0;
  const rows = files.map((file, idx) => ({
    hotel_id: hotelId,
    url: `/uploads/hotels/${file.filename}`,
    is_cover: isFirstBatch && idx === 0,
    sort_order: Number(existingCount.c) + idx,
  }));
  const inserted = await db('hotel_images').insert(rows).returning('*');

  // Keep the denormalized cover_image_url on the hotel row in sync — see
  // migration 20260101000005_add_cover_image_url.
  if (isFirstBatch && inserted.length > 0) {
    await db('hotels').where({ id: hotelId }).update({ cover_image_url: inserted[0].url });
  }

  return inserted;
}

async function removeImage(hotelId, imageId) {
  const image = await db('hotel_images').where({ id: imageId, hotel_id: hotelId }).first();
  if (!image) throw ApiError.notFound('Image not found');

  await db('hotel_images').where({ id: imageId, hotel_id: hotelId }).del();

  if (image.is_cover) {
    // The cover image was removed — promote the next remaining image (by
    // sort order) to cover, or clear cover_image_url if none are left.
    const nextCover = await db('hotel_images').where({ hotel_id: hotelId }).orderBy('sort_order').first();
    if (nextCover) {
      await db('hotel_images').where({ id: nextCover.id }).update({ is_cover: true });
    }
    await db('hotels').where({ id: hotelId }).update({ cover_image_url: nextCover ? nextCover.url : null });
  }
}

/**
 * Fix (AUDIT-PHASE-1.md, API gap): hotel_images.sort_order and is_cover
 * existed in the schema but had no route to update them after the initial
 * upload — is_cover was only ever set automatically on the first image.
 * `imageIds` is the full ordered list of image IDs for this hotel; their
 * position in the array becomes their new sort_order.
 */
async function reorderImages(hotelId, imageIds) {
  const images = await db('hotel_images').where({ hotel_id: hotelId }).whereIn('id', imageIds);
  if (images.length !== imageIds.length) throw ApiError.badRequest('One or more image ids do not belong to this hotel');

  await db.transaction(async (trx) => {
    await Promise.all(
      imageIds.map((id, index) => trx('hotel_images').where({ id, hotel_id: hotelId }).update({ sort_order: index }))
    );
  });
  return db('hotel_images').where({ hotel_id: hotelId }).orderBy('sort_order');
}

async function setCoverImage(hotelId, imageId) {
  const image = await db('hotel_images').where({ id: imageId, hotel_id: hotelId }).first();
  if (!image) throw ApiError.notFound('Image not found');

  await db.transaction(async (trx) => {
    await trx('hotel_images').where({ hotel_id: hotelId }).update({ is_cover: false });
    await trx('hotel_images').where({ id: imageId }).update({ is_cover: true });
    await trx('hotels').where({ id: hotelId }).update({ cover_image_url: image.url });
  });
  return db('hotel_images').where({ hotel_id: hotelId }).orderBy('sort_order');
}

async function addRoom(hotelId, payload) {
  const hotel = await db('hotels').where({ id: hotelId }).first();
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const [room] = await db('rooms')
    .insert({
      hotel_id: hotelId,
      name: payload.name,
      type: payload.type || null,
      capacity_adults: payload.capacityAdults || 2,
      capacity_children: payload.capacityChildren || 0,
      price: payload.price,
      quantity: payload.quantity || 1,
      description: payload.description || null,
    })
    .returning('*');
  return room;
}

async function updateRoom(hotelId, roomId, payload) {
  const room = await db('rooms').where({ id: roomId, hotel_id: hotelId }).first();
  if (!room) throw ApiError.notFound('Room not found');

  const updates = {};
  const map = {
    name: 'name',
    type: 'type',
    capacityAdults: 'capacity_adults',
    capacityChildren: 'capacity_children',
    price: 'price',
    quantity: 'quantity',
    description: 'description',
  };
  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) updates[column] = payload[key];
  }
  updates.updated_at = db.fn.now();
  await db('rooms').where({ id: roomId }).update(updates);
  return db('rooms').where({ id: roomId }).first();
}

async function deleteRoom(hotelId, roomId) {
  const deleted = await db('rooms').where({ id: roomId, hotel_id: hotelId }).del();
  if (!deleted) throw ApiError.notFound('Room not found');
}

/**
 * Checks room availability for a date range by comparing total room quantity
 * against overlapping confirmed/pending bookings for that room.
 */
async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const room = await db('rooms').where({ id: roomId }).first();
  if (!room) throw ApiError.notFound('Room not found');

  const overlapping = await db('bookings')
    .where({ room_id: roomId })
    .whereIn('status', ['pending', 'confirmed'])
    .where('check_in', '<', checkOut)
    .where('check_out', '>', checkIn)
    .count('* as c')
    .first();

  const bookedUnits = Number(overlapping.c);
  return { room, availableUnits: Math.max(room.quantity - bookedUnits, 0) };
}

async function setAvailability(hotelId, roomId, entries) {
  const room = await db('rooms').where({ id: roomId, hotel_id: hotelId }).first();
  if (!room) throw ApiError.notFound('Room not found');

  const rows = entries.map((e) => ({
    hotel_id: hotelId,
    room_id: roomId,
    date: e.date,
    available_units: e.availableUnits,
    price_override: e.priceOverride || null,
  }));

  await db('hotel_availability')
    .insert(rows)
    .onConflict(['room_id', 'date'])
    .merge(['available_units', 'price_override']);

  return db('hotel_availability').where({ room_id: roomId }).orderBy('date');
}

module.exports = {
  createHotel,
  listHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  addImages,
  removeImage,
  reorderImages,
  setCoverImage,
  addRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
  setAvailability,
};
