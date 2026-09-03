import api, { tokenStorage } from './api';

async function register({ firstName, lastName, email, password, phone }) {
  const { data } = await api.post('/auth/customer/register', { firstName, lastName, email, password, phone });
  tokenStorage.set(data.data);
  return data.data.user;
}

// Customer login now uses a system-generated unique username rather than
// email (email/phone are contact info only and are not unique — see the
// guest-checkout feature).
async function login(username, password) {
  const { data } = await api.post('/auth/customer/login', { username, password });
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

async function forgotPassword(username) {
  const { data } = await api.post('/auth/customer/forgot-password', { username });
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
