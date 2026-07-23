/**
 * Normalizes page/limit query params and returns knex-friendly offset/limit.
 */
function getPagination(query, defaults = { page: 1, limit: 20, maxLimit: 100 }) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = defaults.page;
  if (!Number.isFinite(limit) || limit < 1) limit = defaults.limit;
  if (limit > defaults.maxLimit) limit = defaults.maxLimit;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

module.exports = { getPagination };
