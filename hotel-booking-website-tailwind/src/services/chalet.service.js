import api from './api';

async function list(params) {
  const { data } = await api.get('/chalets', { params: { status: 'published', ...params } });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/chalets/${id}`);
  return data.data;
}

async function checkAvailability(chaletId, checkIn, checkOut) {
  const { data } = await api.get(`/chalets/${chaletId}/availability`, { params: { checkIn, checkOut } });
  return data.data;
}

export default { list, getById, checkAvailability };
