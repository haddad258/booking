import api from './api';

async function list(params) {
  const { data } = await api.get('/bookings', { params });
  return data;
}

async function getById(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data.data;
}

async function updateStatus(id, status) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data.data;
}

async function recordPayment(bookingId, payload) {
  const { data } = await api.post(`/bookings/${bookingId}/payments`, payload);
  return data.data;
}

async function listPayments(bookingId) {
  const { data } = await api.get(`/bookings/${bookingId}/payments`);
  return data.data;
}

async function refundPayment(paymentId) {
  const { data } = await api.post(`/payments/${paymentId}/refund`);
  return data.data;
}

export default { list, getById, updateStatus, recordPayment, listPayments, refundPayment };
