import api, { tokenStorage } from './api';

async function login(email, password) {
  const { data } = await api.post('/auth/admin/login', { email, password });
  tokenStorage.set(data.data);
  return data.data.user;
}

async function logout() {
  try {
    await api.post('/auth/admin/logout');
  } finally {
    tokenStorage.clear();
  }
}

async function forgotPassword(email) {
  const { data } = await api.post('/auth/admin/forgot-password', { email });
  return data;
}

async function resetPassword(token, password) {
  const { data } = await api.post('/auth/admin/reset-password', { token, password });
  return data;
}

async function fetchMe() {
  const { data } = await api.get('/admin/admins/me');
  return data.data;
}

export default { login, logout, forgotPassword, resetPassword, fetchMe };
