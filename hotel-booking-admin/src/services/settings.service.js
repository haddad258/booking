import api from './api';

async function getAll() {
  const { data } = await api.get('/settings');
  return data.data;
}

async function getGroup(group) {
  const { data } = await api.get(`/settings/${group}`);
  return data.data;
}

async function updateGroup(group, values) {
  const { data } = await api.put(`/settings/${group}`, values);
  return data.data;
}

export default { getAll, getGroup, updateGroup };
