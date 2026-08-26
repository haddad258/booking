import api, { tokenStorage } from './api';

async function register({ firstName, lastName, email, password, phone }) {
  const { data } = await api.post('/auth/customer/register', { firstName, lastName, email, password, phone });
  tokenStorage.set(data.data);
  return data.data.user;
}

async function login(email, password) {
  const { data } = await api.post('/auth/customer/login', { email, password });
  tokenStorage.set(data.data);
  return data.data.user;
}

async function logout() {
  try {
    await api.post('/auth/customer/logout');
  } finally {
    tokenStorage.clear();
  }
}

async function forgotPassword(email) {
  const { data } = await api.post('/auth/customer/forgot-password', { email });
  return data;
}

async function resetPassword(token, password) {
  const { data } = await api.post('/auth/customer/reset-password', { token, password });
  return data;
}

async function fetchMe() {
  const { data } = await api.get('/customers/me');
  return data.data;
}

export default { register, login, logout, forgotPassword, resetPassword, fetchMe };
