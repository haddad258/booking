const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploads } = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Security fix (see AUDIT-PHASE-1.md, Critical #2): the previous version
 * only checked the client-supplied `file.mimetype` header — which the
 * client fully controls — and separately trusted whatever extension the
 * client's `originalname` happened to have, with no cross-check between
 * the two. A request could claim `Content-Type: image/jpeg` while naming
 * the file `payload.svg`; the mimetype check would pass, and the file
 * would be saved as `<uuid>.svg` and later served back by Express's static
 * handler with `Content-Type: image/svg+xml` — a realistic stored-XSS
 * path, since SVG can embed <script>.
 *
 * This is now a two-layer defense:
 *   1. fileFilter cross-checks the claimed mimetype against the claimed
 *      extension — a mismatch (e.g. image/jpeg + .svg) is rejected
 *      immediately, before anything is written to disk.
 *   2. verifyMagicBytes runs AFTER multer has written the file, and reads
 *      the first few bytes of the actual file content to confirm it
 *      really is what it claims to be (magic-number sniffing), deleting
 *      and rejecting anything that doesn't match. This closes the gap
 *      even if someone spoofs both the mimetype header AND the filename.
 */

// Only these four types are accepted anywhere in the app.
const MIME_TO_EXTENSIONS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};
const ALLOWED_MIME = Object.keys(MIME_TO_EXTENSIONS);

// Magic-number signatures for the same four types, used for the
// post-write content sniff. No extra dependency needed for four formats.
const MAGIC_SIGNATURES = {
  '.jpg': [[0xff, 0xd8, 0xff]],
  '.jpeg': [[0xff, 0xd8, 0xff]],
  '.png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  '.gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  // WEBP: bytes 0-3 "RIFF", bytes 8-11 "WEBP" — checked separately below.
};

function bytesStartWith(buffer, signature) {
  if (buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

function matchesExpectedContent(buffer, ext) {
  if (ext === '.webp') {
    if (buffer.length < 12) return false;
    const riff = buffer.slice(0, 4).toString('ascii');
    const webp = buffer.slice(8, 12).toString('ascii');
    return riff === 'RIFF' && webp === 'WEBP';
  }
  const signatures = MAGIC_SIGNATURES[ext];
  if (!signatures) return false;
  return signatures.some((sig) => bytesStartWith(buffer, sig));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.uploadSubDir || 'misc';
    const dest = path.join(process.cwd(), uploads.dir, subDir);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Extension is taken from the (now-validated, see fileFilter) claimed
    // mimetype's canonical extension list rather than trusted verbatim
    // from the client filename, so it's always one of a known-safe set.
    const ext = MIME_TO_EXTENSIONS[file.mimetype]?.[0] || path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Only image files (jpeg, png, webp, gif) are allowed'));
  }
  const claimedExt = path.extname(file.originalname).toLowerCase();
  const expectedExts = MIME_TO_EXTENSIONS[file.mimetype];
  if (claimedExt && !expectedExts.includes(claimedExt)) {
    return cb(new ApiError(400, 'File extension does not match its declared type'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: uploads.maxFileSizeMb * 1024 * 1024 },
});

/** Sets the upload subdirectory before multer processes the request. */
const uploadTo = (subDir) => (req, res, next) => {
  req.uploadSubDir = subDir;
  next();
};

/**
 * Post-upload content verification. Must run AFTER `upload.array(...)` /
 * `upload.single(...)` in the route chain — multer has already written the
 * file(s) to disk by then, so this reads the real bytes back and confirms
 * they match the claimed type, deleting anything that doesn't.
 */
function verifyMagicBytes(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) return next();

  try {
    for (const file of files) {
      const ext = path.extname(file.filename).toLowerCase();
      const fd = fs.openSync(file.path, 'r');
      const buffer = Buffer.alloc(16);
      fs.readSync(fd, buffer, 0, 16, 0);
      fs.closeSync(fd);

      if (!matchesExpectedContent(buffer, ext)) {
        // Clean up every file from this request, not just the bad one,
        // so a rejected batch doesn't leave orphaned files behind.
        for (const f of files) {
          fs.unlink(f.path, () => {});
        }
        logger.warn(`Rejected upload: content did not match declared type (${file.originalname})`);
        throw ApiError.badRequest('One of the uploaded files does not match its declared image type');
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, uploadTo, verifyMagicBytes };
