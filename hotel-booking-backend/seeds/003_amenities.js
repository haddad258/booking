exports.seed = async function (knex) {
  await knex('amenities').del();

  await knex('amenities').insert([
    { name: 'Free WiFi', icon: 'wifi', type: 'both' },
    { name: 'Swimming Pool', icon: 'pool', type: 'both' },
    { name: 'Parking', icon: 'parking', type: 'both' },
    { name: 'Air Conditioning', icon: 'ac-unit', type: 'both' },
    { name: 'Kitchen', icon: 'kitchen', type: 'chalet' },
    { name: 'Fireplace', icon: 'fireplace', type: 'chalet' },
    { name: 'BBQ Area', icon: 'bbq', type: 'chalet' },
    { name: 'Spa', icon: 'spa', type: 'hotel' },
    { name: 'Gym', icon: 'fitness-center', type: 'hotel' },
    { name: 'Restaurant', icon: 'restaurant', type: 'hotel' },
    { name: 'Room Service', icon: 'room-service', type: 'hotel' },
    { name: 'Pet Friendly', icon: 'pets', type: 'both' },
    { name: 'Mountain View', icon: 'landscape', type: 'chalet' },
    { name: 'Sea View', icon: 'waves', type: 'hotel' },
    { name: 'Breakfast Included', icon: 'free-breakfast', type: 'hotel' },
  ]);
};
