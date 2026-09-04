/**
 * Adds two simple editorial attributes to both hotels and chalets:
 *   - `rating`: a manually curated quality score (0.0–5.0, one decimal),
 *     independent from hotels' existing `star_rating` (an official star
 *     classification) and from the customer-review-derived average —
 *     this is a separate, admin-set value, and chalets had no rating
 *     field at all until now.
 *   - `rated_price`: an optional secondary reference price shown
 *     alongside the base price (e.g. a weekend price including fees),
 *     per the requirement's example: "Base price: €100, Weekend price
 *     including fees: €120".
 * Both are nullable — displayed on the site only when actually set.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.decimal('rating', 2, 1).nullable();
    table.decimal('rated_price', 10, 2).nullable();
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.decimal('rating', 2, 1).nullable();
    table.decimal('rated_price', 10, 2).nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('hotels', (table) => {
    table.dropColumn('rating');
    table.dropColumn('rated_price');
  });
  await knex.schema.alterTable('chalets', (table) => {
    table.dropColumn('rating');
    table.dropColumn('rated_price');
  });
};
