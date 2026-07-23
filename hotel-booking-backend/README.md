# Hotel Booking Platform — Backend API (Phase 1)

REST API for the Hotel & Chalet Booking Platform, built with Node.js, Express, PostgreSQL and Knex.

## Tech Stack

- **Runtime**: Node.js 18+, Express.js
- **Database**: PostgreSQL, Knex.js (query builder + migrations)
- **Auth**: JWT (access + refresh tokens), bcrypt
- **Uploads**: Multer
- **Security**: Helmet, express-rate-limit, express-validator, CORS
- **Docs**: Swagger (OpenAPI 3) via swagger-jsdoc + swagger-ui-express

## Getting Started

```bash
cd backend
cp .env.example .env      # then edit DB credentials, JWT secrets, SMTP, etc.
npm install

# create the database (name from .env DB_NAME) in PostgreSQL first, then:
npm run migrate
npm run seed

npm run dev                # nodemon, http://localhost:5000
```

Swagger docs: `http://localhost:5000/api-docs`

Default super admin (from seeds — **change the password immediately**):
- email: `admin@hotelbooking.com`
- password: `ChangeMe123!`

## Project Structure

```
backend/
  src/
    config/       # env, database, swagger
    controllers/   # request/response handling
    middleware/    # auth, rbac, error handling, rate limiting, upload, validation
    models/        # (Knex is used directly via query builder in services)
    routes/        # Express routers per resource
    services/      # business logic / data access
    validators/    # express-validator rule sets
    helpers/       # password, JWT, mailer helpers
    utils/         # ApiError, ApiResponse, catchAsync, logger, pagination, slugify
    uploads/        # uploaded images (served at /uploads)
  migrations/       # Knex migrations (23 tables)
  seeds/            # roles/permissions, super admin, amenities
  server.js
```

## Core Modules

- **Auth**: separate customer & admin login/register/refresh/forgot-reset password flows, JWT access + refresh tokens.
- **Admin management**: admins CRUD, roles, and a full CRUD permission matrix per module (RBAC). Super admins bypass permission checks.
- **Customer management**: profile, addresses, favorites, booking history (self-service) + admin CRUD/status control.
- **Hotel management**: hotels, rooms, images, amenities, pricing, per-room-per-date availability.
- **Chalet management**: chalets, images, amenities, pricing, per-date availability (whole-unit booking).
- **Booking management**: creation with live availability + price calculation, status lifecycle (pending → confirmed/cancelled → completed), cancellation.
- **Payments & Invoices**: record payments against a booking, auto-generates an invoice on success, refunds.
- **Reviews**: customer-submitted, admin moderation workflow (pending/approved/rejected), average rating aggregation.
- **Dashboard API**: KPI overview, revenue chart, bookings-by-status, occupancy rate, booking/revenue reports.
- **Settings**: key-value store grouped by website/SMTP/languages/currency/taxes/SEO.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm start` | Start in production mode |
| `npm run migrate` | Run pending migrations |
| `npm run migrate:rollback` | Roll back the last migration batch |
| `npm run seed` | Run all seed files |

## Notes for Phase 2 / 3 integration

- All endpoints are namespaced under `/api/v1`.
- Customer-facing and admin-facing auth are fully separate (`/api/v1/auth/customer/*` vs `/api/v1/auth/admin/*`), each issuing their own JWTs with a `type` claim (`customer` | `admin`) so tokens can't be swapped between panels.
- Public read endpoints (hotels, chalets, amenities, settings, approved reviews) require no auth, ready for the Phase 3 public website.
- Admin-only write endpoints are protected by `authenticate` + `requireAdmin` + `requirePermission('<module>.<action>')`, ready for the Phase 2 dashboard's role-based UI.
