/**
 * Site-wide quotation currency (Requirement #2: changed from USD to KWD).
 * Kuwaiti Dinar conventionally displays 3 decimal places (subdivided into
 * 1000 fils), unlike USD's 2 — this is a real formatting difference, not
 * just a symbol swap, so the helper below reflects it everywhere prices
 * are shown on the site.
 */
export const CURRENCY = 'KWD';
export const CURRENCY_DECIMALS = 3;

export function formatPrice(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return `— ${CURRENCY}`;
  return `${n.toFixed(CURRENCY_DECIMALS)} ${CURRENCY}`;
}
