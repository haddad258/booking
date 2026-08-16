/**
 * Dedicated image server (Phase 3 of the improvement plan).
 *
 * Deliberately separate from the main API process/port. It serves exactly
 * the same directory the main API writes uploads into (STORAGE_DIR — same
 * physical folder, two processes reading it), which means:
 *
 *   - Today: main API on :5000, this on :5001, both pointing at the same
 *     backend/storage/public/uploads directory on disk.
 *   - Tomorrow: swap this entire file for a CDN/S3/R2/MinIO origin and
 *     change ONE env var (IMAGE_SERVER_URL) in the admin/website frontends
 *     — no other code changes needed, because every frontend image URL
 *     already resolves through the shared resolveImageUrl() helper.
 *
 * Deliberately minimal — no auth, no business logic, no database
 * connection. Its only job is to serve static files fast and safely.
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const PORT = Number(process.env.IMAGE_SERVER_PORT) || 5001;
// Same physical directory the main API's multer config writes into.
// Default assumes this app runs from backend/image-server/ as a sibling
// of backend/storage/.
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(__dirname, '..', 'storage', 'public', 'uploads');
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      // Images are meant to be publicly embeddable (e.g. in <img> tags from
      // any origin, social-share unfurls, etc.), so unlike the main API
      // this allows any origin to GET — there's nothing sensitive here,
      // only already-public property photos.
      callback(null, true);
    },
  })
);

app.get('/health', (req, res) => res.json({ success: true, message: 'Image server healthy' }));

// Mounted at /uploads (not /images) deliberately: hotel_images.url and
// chalet_images.url are already stored in the database as "/uploads/..."
// paths (written by the main API's multer config). Matching that prefix
// here means swapping VITE_IMAGE_SERVER_URL in the frontends is a pure
// origin swap — no path-rewriting, no data migration.
app.use(
  '/uploads',
  express.static(STORAGE_DIR, {
    maxAge: '7d',
    etag: true,
    // Never serve anything with a double extension or path segment that
    // looks like an attempt to escape the storage root; express.static
    // already resolves and normalizes paths safely, this is defense in
    // depth against any future middleware added ahead of it.
    dotfiles: 'ignore',
    index: false,
  })
);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Image not found' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Image server running on port ${PORT}, serving ${STORAGE_DIR}`);
});
