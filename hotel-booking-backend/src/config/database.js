const knex = require('knex');
const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../../knexfile')[environment];

const db = knex(knexConfig);

module.exports = db;
