const MODULES = [
  'admins',
  'roles',
  'customers',
  'hotels',
  'chalets',
  'amenities',
  'bookings',
  'payments',
  'reviews',
  'dashboard',
  'settings',
];

const ACTIONS = ['view', 'create', 'update', 'delete'];

exports.seed = async function (knex) {
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('roles').del();

  // Build a full permission matrix, e.g. 'hotels.view', 'hotels.create', ...
  const permissionRows = [];
  for (const mod of MODULES) {
    for (const action of ACTIONS) {
      permissionRows.push({ name: `${mod}.${action}`, module: mod, description: `${action} ${mod}` });
    }
  }
  // A couple of special-purpose permissions that don't follow the CRUD pattern
  permissionRows.push(
    { name: 'reviews.moderate', module: 'reviews', description: 'Approve or reject reviews' },
    { name: 'payments.refund', module: 'payments', description: 'Issue refunds' },
    { name: 'amenities.manage', module: 'amenities', description: 'Create/update/delete amenities' }
  );

  const permissions = await knex('permissions').insert(permissionRows).returning('*');
  const byName = Object.fromEntries(permissions.map((p) => [p.name, p.id]));

  const [managerRole] = await knex('roles')
    .insert({ name: 'Manager', description: 'Manages hotels, chalets, bookings and reviews' })
    .returning('*');
  const [supportRole] = await knex('roles')
    .insert({ name: 'Support', description: 'Read-only access plus booking/review moderation' })
    .returning('*');

  const managerPermissions = [
    'hotels.view', 'hotels.create', 'hotels.update', 'hotels.delete',
    'chalets.view', 'chalets.create', 'chalets.update', 'chalets.delete',
    'amenities.view', 'amenities.manage',
    'bookings.view', 'bookings.update',
    'payments.view', 'payments.refund',
    'reviews.view', 'reviews.moderate',
    'dashboard.view',
    'customers.view',
  ].filter((n) => byName[n]);

  const supportPermissions = [
    'hotels.view', 'chalets.view', 'bookings.view', 'bookings.update',
    'customers.view', 'reviews.view', 'reviews.moderate', 'dashboard.view',
  ].filter((n) => byName[n]);

  await knex('role_permissions').insert(
    managerPermissions.map((name) => ({ role_id: managerRole.id, permission_id: byName[name] }))
  );
  await knex('role_permissions').insert(
    supportPermissions.map((name) => ({ role_id: supportRole.id, permission_id: byName[name] }))
  );
};
