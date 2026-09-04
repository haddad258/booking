/**
 * Multilingual description selection logic (Requirements #5 and #6).
 *
 * The API always returns every available description for a property; the
 * frontend is responsible for picking the right one to display:
 *   1. Exact match for the site's currently selected language.
 *   2. Otherwise, the description explicitly marked as default by the
 *      admin (`is_default: true` — see the admin Descriptions manager).
 *   3. Otherwise, the first available description of any language, so
 *      something sensible is always shown rather than nothing.
 *   4. Otherwise, the property's legacy plain-text `description` column
 *      (pre-multilingual properties, or as a last-resort fallback).
 *
 * @param {{ descriptions?: Array<{language: string, description: string, is_default: boolean}>, description?: string }} property
 * @param {string} currentLanguage - e.g. 'fr', 'ar', 'en'
 * @returns {string} the description text to display, or '' if none exists at all
 */
export function getLocalizedDescription(property, currentLanguage) {
  const descriptions = property?.descriptions;
  if (Array.isArray(descriptions) && descriptions.length > 0) {
    const exactMatch = descriptions.find((d) => d.language === currentLanguage);
    if (exactMatch) return exactMatch.description;

    const defaultDescription = descriptions.find((d) => d.is_default);
    if (defaultDescription) return defaultDescription.description;

    return descriptions[0].description;
  }

  return property?.description || '';
}
