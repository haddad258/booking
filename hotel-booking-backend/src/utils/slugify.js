function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Appends a short random suffix to keep slugs unique on collision. */
function uniqueSlug(text) {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slugify(text)}-${suffix}`;
}

module.exports = { slugify, uniqueSlug };
