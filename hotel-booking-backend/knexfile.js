require('dotenv').config();

const base = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'hotel_booking',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN) || 2,
    max: Number(process.env.DB_POOL_MAX) || 10,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

module.exports = {
  development: base,
  test: {
    ...base,
    connection: {
      ...base.connection,
      database: (process.env.DB_NAME || 'hotel_booking') + '_test',
    },
  },
  production: {
    ...base,
    connection: process.env.DATABASE_URL || base.connection,
    pool: { min: 2, max: 20 },
  },
};
