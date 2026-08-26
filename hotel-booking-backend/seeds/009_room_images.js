exports.seed = async function (knex) {
  await knex('room_images').del();

  const rooms = await knex('rooms').select('id');

  const rows = [];
  rooms.forEach((room) => {
    rows.push(
      { room_id: room.id, url: `https://picsum.photos/seed/room-${room.id}-1/900/600`, sort_order: 0 },
      { room_id: room.id, url: `https://picsum.photos/seed/room-${room.id}-2/900/600`, sort_order: 1 }
    );
  });

  await knex('room_images').insert(rows);
};
