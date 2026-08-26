exports.seed = async function (knex) {
  await knex('settings').del();

  await knex('settings').insert([
    {
      key: 'website.name',
      group: 'website',
      value: JSON.stringify({ name: 'HotelBooking', tagline: 'Hôtels & chalets, réservés simplement' }),
    },
    {
      key: 'website.contact',
      group: 'website',
      value: JSON.stringify({ email: 'contact@hotelbooking.com', phone: '+21671234567' }),
    },
    {
      key: 'smtp.default',
      group: 'smtp',
      value: JSON.stringify({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        from: 'no-reply@hotelbooking.com',
      }),
    },
    {
      key: 'languages.available',
      group: 'languages',
      value: JSON.stringify({ default: 'fr', supported: ['fr', 'en', 'ar'] }),
    },
    {
      key: 'currency.default',
      group: 'currency',
      value: JSON.stringify({ default: 'TND', supported: ['TND', 'EUR', 'USD'] }),
    },
    {
      key: 'taxes.vat',
      group: 'taxes',
      value: JSON.stringify({ rate: 7, label: 'TVA' }),
    },
    {
      key: 'seo.default',
      group: 'seo',
      value: JSON.stringify({
        title: 'HotelBooking — Réservez hôtels et chalets',
        description: "Trouvez et réservez le meilleur hôtel ou chalet pour votre séjour.",
      }),
    },
  ]);
};
