# Image Server

A small, dedicated Express app whose only job is serving property images —
kept separate from the main API (`backend/`) so it can be scaled, cached, or
eventually replaced by a CDN/object-storage origin (S3, R2, MinIO) without
touching the API or either frontend beyond one environment variable.

## Why this exists

See `AUDIT-PHASE-1.md` / Phase 3 of the improvement plan: previously every
uploaded image was served by the same Express process handling API
requests, with no separation of concerns and no path toward offloading
static-file serving to something better suited for it.

## Running it

```bash
cd backend/image-server
npm install
cp .env.example .env
npm start          # http://localhost:5001
```

It reads from the **same** `backend/storage/public/uploads` directory the
main API's upload endpoints write into — both processes share one folder on
disk. Nothing needs to be copied or synced between them.

## Wiring it up to the frontends

Once running, point both frontends at it:

```env
# admin/.env and website/.env
VITE_IMAGE_SERVER_URL=http://localhost:5001
```

Every image URL in both apps already resolves through a single shared
helper (`src/lib/media.js` in each app), so this one variable is the only
change needed — no component code changes anywhere.

If `VITE_IMAGE_SERVER_URL` is left unset, both frontends fall back to
resolving images against the main API's own origin (which still serves
`/uploads` itself) exactly as before — this image server is additive, not
a breaking requirement.

## Moving to a real CDN/object store later

When ready, this whole app can be replaced by:
1. Uploading files to S3/R2/MinIO instead of local disk in the main API's
   upload middleware (`backend/src/middleware/upload.middleware.js`), and
2. Pointing `IMAGE_SERVER_URL` at the CDN/bucket's public URL instead of
   this app's `http://localhost:5001`.

No frontend code changes required either way.
