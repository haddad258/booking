const bcrypt = require('bcrypt');
const { bcrypt: bcryptConfig } = require('../config/env');

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, bcryptConfig.saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
