import api from './api';

async function create(payload) {
  const { data } = await api.post('/bookings', payload);
  return data.data;
}

async function myBookings(params) {
  const { data } = await api.get('/bookings/my', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/bookings/my/${id}`);
  return data.data;
}

async function cancel(id) {
  const { data } = await api.post(`/bookings/my/${id}/cancel`);
  return data.data;
}

export default { create, myBookings, getById, cancel };
