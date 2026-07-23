const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.accessSecret, { expiresIn: jwtConfig.accessExpiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
}

function signResetToken(payload) {
  return jwt.sign(payload, jwtConfig.resetSecret, { expiresIn: jwtConfig.resetExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret);
}

function verifyResetToken(token) {
  return jwt.verify(token, jwtConfig.resetSecret);
}

/**
 * Issues a matched access/refresh token pair for a user of a given type
 * (admin | customer), embedding role/permissions where relevant.
 */
function issueTokenPair({ id, type, role = null }) {
  const payload = { sub: id, type, role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  signResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  issueTokenPair,
};
