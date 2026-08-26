const ROOM_TEMPLATES = [
  { name: 'Chambre Simple', type: 'single', capacity_adults: 1, capacity_children: 0, priceFactor: 1.0, quantity: 8 },
  { name: 'Chambre Double', type: 'double', capacity_adults: 2, capacity_children: 1, priceFactor: 1.5, quantity: 10 },
  { name: 'Suite Junior', type: 'suite', capacity_adults: 2, capacity_children: 2, priceFactor: 2.4, quantity: 4 },
];

exports.seed = async function (knex) {
  await knex('rooms').del();

  const hotels = await knex('hotels').select('id', 'base_price', 'name');

  const rows = [];
  hotels.forEach((hotel) => {
    ROOM_TEMPLATES.forEach((template) => {
      rows.push({
        hotel_id: hotel.id,
        name: `${template.name} - ${hotel.name}`,
        type: template.type,
        capacity_adults: template.capacity_adults,
        capacity_children: template.capacity_children,
        price: Number((hotel.base_price * template.priceFactor).toFixed(2)),
        quantity: template.quantity,
        description: `${template.name} confortable avec toutes les commodités essentielles.`,
      });
    });
  });

  await knex('rooms').insert(rows);
};
