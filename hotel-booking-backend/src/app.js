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
const { clientUrl, adminUrl, uploads } = require('./config/env');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [clientUrl, adminUrl, 'http://localhost:3000', 'http://localhost:3001',"http://51.178.138.19:4006","http://51.178.138.19:4007","http://51.178.138.19:4008"],
    credentials: true,
  })
);
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
