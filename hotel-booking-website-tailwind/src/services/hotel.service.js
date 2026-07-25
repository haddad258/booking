import api from './api';

async function list(params) {
  const { data } = await api.get('/hotels', { params: { status: 'published', ...params } });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/hotels/${id}`);
  return data.data;
}

async function checkAvailability(hotelId, roomId, checkIn, checkOut) {
  const { data } = await api.get(`/hotels/${hotelId}/availability`, { params: { roomId, checkIn, checkOut } });
  return data.data;
}

export default { list, getById, checkAvailability };
