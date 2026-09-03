import api, { tokenStorage } from './api';

async function create(payload) {
  const { data } = await api.post('/bookings', payload);
  return data.data;
}

/**
 * Public checkout — no login required. Always creates a Customer record
 * server-side; if `payload.createAccount` is true, the response includes
 * a token pair the caller should store (via tokenStorage) to log the new
 * user in immediately.
 */
async function createGuest(payload) {
  const { data } = await api.post('/bookings/guest', payload);
  if (data.data.tokens) {
    tokenStorage.set(data.data.tokens);
  }
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

export default { create, createGuest, myBookings, getById, cancel };
