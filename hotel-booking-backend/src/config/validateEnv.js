/**
 * Fail-fast startup validation.
 *
 * Problem this fixes: every secret in env.js had a hardcoded fallback
 * ('access_secret', 'postgres', etc.), so a misconfigured deployment — an
 * unset .env, a typo'd variable name, a fresh server with no .env file at
 * all — would boot successfully and serve traffic with publicly-guessable
 * JWT secrets. There was no signal anywhere that this had happened.
 *
 * This runs once at process startup (see server.js). In production it
 * refuses to boot if a required secret is missing or still equals one of
 * its known-weak fallback values. In development it boots but logs a loud
 * warning, so the gap is visible instead of silent.
 */
const logger = require('../utils/logger');
const env = require('./env');

const REQUIRED_IN_PRODUCTION = [
  { key: 'JWT_ACCESS_SECRET', value: process.env.JWT_ACCESS_SECRET },
  { key: 'JWT_REFRESH_SECRET', value: process.env.JWT_REFRESH_SECRET },
  { key: 'JWT_RESET_SECRET', value: process.env.JWT_RESET_SECRET },
  { key: 'DB_PASSWORD', value: process.env.DB_PASSWORD },
];

function validateEnv() {
  const isProduction = env.env === 'production';
  const problems = [];

  for (const { key, value } of REQUIRED_IN_PRODUCTION) {
    if (!value) {
      problems.push(`${key} is not set`);
    } else if (env.isKnownWeakSecret(value) || value === 'postgres') {
      problems.push(`${key} is still set to its insecure default value`);
    }
  }

  if (problems.length === 0) return;

  const message = [
    '⚠️  Insecure environment configuration detected:',
    ...problems.map((p) => `   - ${p}`),
  ].join('\n');

  if (isProduction) {
    // Refuse to boot rather than silently serve traffic with guessable secrets.
    logger.error(`${message}\n\nRefusing to start in production. Set these in your .env and restart.`);
    process.exit(1);
  } else {
    logger.warn(`${message}\n   (Continuing since NODE_ENV=${env.env}, but this MUST be fixed before deploying.)`);
  }
}

module.exports = validateEnv;
