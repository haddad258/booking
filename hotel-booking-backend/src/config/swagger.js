const swaggerJsdoc = require('swagger-jsdoc');
const { apiUrl } = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel & Chalet Booking Platform API',
      version: '1.0.0',
      description:
        'REST API for the Hotel Booking Platform: authentication, admin management, ' +
        'customer management, hotels, chalets, bookings, reviews, dashboard analytics and settings.',
    },
    servers: [{ url: `${apiUrl}`, description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth - Customer', description: 'Customer authentication' },
      { name: 'Auth - Admin', description: 'Admin authentication' },
      { name: 'Admins', description: 'Admin, role & permission management' },
      { name: 'Customers', description: 'Customer management & self-service' },
      { name: 'Hotels', description: 'Hotel, room & availability management' },
      { name: 'Chalets', description: 'Chalet management' },
      { name: 'Bookings', description: 'Reservation lifecycle' },
      { name: 'Payments', description: 'Payments, invoices & refunds' },
      { name: 'Reviews', description: 'Ratings & moderation' },
      { name: 'Dashboard', description: 'Statistics, charts & reports' },
      { name: 'Settings', description: 'Site-wide configuration' },
      { name: 'Amenities', description: 'Shared amenities list' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
