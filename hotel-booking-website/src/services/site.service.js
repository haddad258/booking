import api from './api';

async function getAllSettings() {
  const { data } = await api.get('/settings');
  return data.data;
}

async function listAmenities(type) {
  const { data } = await api.get('/amenities', { params: { type } });
  return data.data;
}

export default { getAllSettings, listAmenities };
