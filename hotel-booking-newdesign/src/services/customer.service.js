import api from './api';

async function me() {
  const { data } = await api.get('/customers/me');
  return data.data;
}

async function updateProfile(payload) {
  const { data } = await api.patch('/customers/me', payload);
  return data.data;
}

async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post('/customers/me/change-password', { currentPassword, newPassword });
  return data;
}

async function addAddress(payload) {
  const { data } = await api.post('/customers/me/addresses', payload);
  return data.data;
}

async function removeAddress(id) {
  const { data } = await api.delete(`/customers/me/addresses/${id}`);
  return data;
}

async function listFavorites() {
  const { data } = await api.get('/customers/me/favorites');
  return data.data;
}

async function addFavorite(bookableType, bookableId) {
  const { data } = await api.post('/customers/me/favorites', { bookableType, bookableId });
  return data.data;
}

async function removeFavorite(bookableType, bookableId) {
  const { data } = await api.delete(`/customers/me/favorites/${bookableType}/${bookableId}`);
  return data;
}

export default { me, updateProfile, changePassword, addAddress, removeAddress, listFavorites, addFavorite, removeFavorite };
