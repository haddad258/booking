const CHALETS = [
  {
    name: 'Chalet Ain Draham',
    slug: 'chalet-ain-draham',
    description: "Chalet en bois niché dans les forêts de chênes-lièges du nord-ouest tunisien.",
    address: 'Route de la Forêt',
    city: 'Ain Draham',
    country: 'Tunisie',
    latitude: 36.7758,
    longitude: 8.6858,
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    base_price: 180.0,
    currency: 'TND',
    status: 'published',
    important: true,
  },
  {
    name: 'Chalet Djerba Palmeraie',
    slug: 'chalet-djerba-palmeraie',
    description: 'Chalet traditionnel au milieu de la palmeraie, calme et authentique.',
    address: 'Route de la Palmeraie',
    city: 'Djerba',
    country: 'Tunisie',
    latitude: 33.8869,
    longitude: 10.8451,
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    base_price: 140.0,
    currency: 'TND',
    status: 'published',
    important: false,
  },
  {
    name: 'Chalet Nabeul Jardin',
    slug: 'chalet-nabeul-jardin',
    description: 'Petit chalet familial avec jardin privé, proche des plages du Cap Bon.',
    address: '10 Route de Hammamet',
    city: 'Nabeul',
    country: 'Tunisie',
    latitude: 36.4561,
    longitude: 10.7376,
    capacity: 5,
    bedrooms: 2,
    bathrooms: 2,
    base_price: 130.0,
    currency: 'TND',
    status: 'published',
    important: false,
  },
  {
    name: 'Chalet Chamonix Alpin',
    slug: 'chalet-chamonix-alpin',
    description: 'Chalet de montagne avec vue sur le Mont Blanc, cheminée et sauna.',
    address: '25 Route des Praz',
    city: 'Chamonix',
    country: 'France',
    latitude: 45.9237,
    longitude: 6.8694,
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    base_price: 320.0,
    currency: 'EUR',
    status: 'draft',
    important: true,
  },
];

exports.seed = async function (knex) {
  await knex('chalets').del();

  const admin = await knex('admins').where({ email: 'admin@hotelbooking.com' }).first();

  await knex('chalets').insert(
    CHALETS.map((c) => ({ ...c, created_by: admin ? admin.id : null }))
  );
};
