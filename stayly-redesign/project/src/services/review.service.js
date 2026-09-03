import api from './api';

async function listForBookable(bookableType, bookableId, params) {
  const { data } = await api.get('/reviews', { params: { bookableType, bookableId, ...params } });
  return data;
}

async function create(payload) {
  const { data } = await api.post('/reviews', payload);
  return data.data;
}

async function update(id, payload) {
  const { data } = await api.patch(`/reviews/${id}`, payload);
  return data.data;
}

async function remove(id) {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
}

export default { listForBookable, create, update, remove };
