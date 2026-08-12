require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const apiRoutes = require('./routes');
const { clientUrl, adminUrl, uploads, corsOrigins, trustProxy } = require('./config/env');
const logger = require('./utils/logger');

const app = express();

// Fix (see AUDIT-PHASE-1.md, High #3): CORS origins were a hardcoded array
// literal in source, including a raw production IP over plain HTTP. Any new
// environment (staging domain, HTTPS migration, a new deploy target) needed
// a code change + redeploy. Now driven entirely by env vars: CLIENT_URL,
// ADMIN_URL, and an optional comma-separated CORS_ORIGINS for anything else
// (see .env.example). Local dev ports are still allowed by default so
// `npm run dev` keeps working with zero config.
const DEV_ORIGINS = ['http://localhost:3000','http://localhost:5000', 'http://localhost:3001', 'http://localhost:5173'];
const allowedOrigins = [...new Set([clientUrl, adminUrl, ...DEV_ORIGINS, ...corsOrigins])];

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, server-to-server, health checks)
      // which don't send an Origin header at all.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      logger.warn(`Blocked CORS request from unrecognized origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Fix (Medium #12): required when running behind a reverse proxy / load
// balancer (the deployed setup appears to be one, given the non-standard
// ports in use) — without this, express-rate-limit and req.ip see the
// proxy's IP for every request instead of the real client IP, making
// rate limiting either useless or wrongly shared across all users.
// Set TRUST_PROXY=1 in .env when deployed behind nginx/Caddy/a load balancer.
if (trustProxy) {
  app.set('trust proxy', 1);
}

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(process.cwd(), uploads.dir)));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use('/api/v1', generalLimiter, apiRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hotel Booking Platform API', docs: '/api-docs' });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
