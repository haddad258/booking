/**
 * Fix (see AUDIT-PHASE-1.md, Medium #9): this same origin-derivation regex
 * used to be copy-pasted independently in 4 different files across the
 * admin and website apps, with no single source of truth. Centralizing it
 * here also sets up the seam for Phase 3's dedicated image server: once
 * VITE_IMAGE_SERVER_URL is set, every image in the app switches to it with
 * zero component changes.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL || null;
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Resolves a relative image path (e.g. "/uploads/hotels/x.jpg") returned by
 * the API into a full URL the browser can load.
 * @param {string|null|undefined} path
 * @param {string|null} fallback - returned if path is empty
 */
export function resolveImageUrl(path, fallback = null) {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path; // already absolute, leave as-is
  const origin = IMAGE_SERVER_URL || API_ORIGIN;
  return `${origin}${path}`;
}

export default resolveImageUrl;
