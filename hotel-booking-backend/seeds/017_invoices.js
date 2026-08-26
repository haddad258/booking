exports.seed = async function (knex) {
  await knex('invoices').del();

  const bookings = await knex('bookings')
    .whereIn('status', ['completed', 'confirmed'])
    .select('id', 'booking_number', 'total_price');

  const rows = bookings.map((b, index) => {
    const tax = Number((b.total_price * 0.07).toFixed(2)); // 7% TVA
    return {
      booking_id: b.id,
      invoice_number: `INV-2026-${String(index + 1).padStart(4, '0')}`,
      amount: b.total_price,
      tax,
      total: Number((Number(b.total_price) + tax).toFixed(2)),
      pdf_url: `https://files.hotelbooking.com/invoices/${b.booking_number}.pdf`,
    };
  });

  await knex('invoices').insert(rows);
};
