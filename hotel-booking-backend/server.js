require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');
const logger = require('./src/utils/logger');
const { port } = require('./src/config/env');

async function start() {
  try {
    await db.raw('SELECT 1'); // fail fast if the database is unreachable
    logger.info('Database connection established');

    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port} (${process.env.NODE_ENV || 'development'})`);
      logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await db.destroy();
        logger.info('Database connection closed. Bye!');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
