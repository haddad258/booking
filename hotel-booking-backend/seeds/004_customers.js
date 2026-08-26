const bcrypt = require('bcrypt');

const CUSTOMERS = [
  { first_name: 'Amine', last_name: 'Ben Salah', email: 'amine.bensalah@example.com', phone: '+21620123456' },
  { first_name: 'Sarra', last_name: 'Khemiri', email: 'sarra.khemiri@example.com', phone: '+21622334455' },
  { first_name: 'Youssef', last_name: 'Trabelsi', email: 'youssef.trabelsi@example.com', phone: '+21698765432' },
  { first_name: 'Lina', last_name: 'Gharbi', email: 'lina.gharbi@example.com', phone: '+33612345678' },
  { first_name: 'Karim', last_name: 'Fersi', email: 'karim.fersi@example.com', phone: '+21655667788' },
  { first_name: 'Nour', last_name: 'Mansour', email: 'nour.mansour@example.com', phone: null },
];

exports.seed = async function (knex) {
  await knex('customers').del();

  const hashed = await bcrypt.hash('Password123!', 12);

  const rows = CUSTOMERS.map((c) => ({
    ...c,
    password: hashed,
    status: 'active',
    email_verified_at: knex.fn.now(),
  }));

  const customers = await knex('customers').insert(rows).returning('*');
  const byEmail = Object.fromEntries(customers.map((c) => [c.email, c.id]));

  await knex('customer_addresses').insert([
    {
      customer_id: byEmail['amine.bensalah@example.com'],
      label: 'Domicile',
      address_line1: '12 Rue de Marseille',
      city: 'Tunis',
      state: 'Tunis',
      country: 'Tunisie',
      postal_code: '1000',
      is_default: true,
    },
    {
      customer_id: byEmail['sarra.khemiri@example.com'],
      label: 'Domicile',
      address_line1: '45 Avenue Habib Bourguiba',
      city: 'Sousse',
      state: 'Sousse',
      country: 'Tunisie',
      postal_code: '4000',
      is_default: true,
    },
    {
      customer_id: byEmail['youssef.trabelsi@example.com'],
      label: 'Bureau',
      address_line1: '3 Rue de Palestine',
      address_line2: 'Bloc B, 2ème étage',
      city: 'Sfax',
      state: 'Sfax',
      country: 'Tunisie',
      postal_code: '3000',
      is_default: true,
    },
    {
      customer_id: byEmail['lina.gharbi@example.com'],
      label: 'Domicile',
      address_line1: '8 Rue de Rivoli',
      city: 'Paris',
      country: 'France',
      postal_code: '75004',
      is_default: true,
    },
    {
      customer_id: byEmail['lina.gharbi@example.com'],
      label: 'Résidence secondaire',
      address_line1: '22 Avenue Taïeb Mhiri',
      city: 'Hammamet',
      country: 'Tunisie',
      postal_code: '8050',
      is_default: false,
    },
  ]);
};
