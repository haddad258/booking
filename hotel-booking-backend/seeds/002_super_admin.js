const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('admins').where({ email: 'admin@hotelbooking.com' }).del();

  const hashed = await bcrypt.hash('admin@hotelbooking.com', 12);

  await knex('admins').insert({
    first_name: 'Super',
    last_name: 'Admin',
    email: 'admin@hotelbooking.com',
    password: hashed,
    is_super_admin: true,
    status: 'active',
  });

  // eslint-disable-next-line no-console
  console.log('Seeded super admin -> email: admin@hotelbooking.com | password: ChangeMe123! (change immediately)');
};
