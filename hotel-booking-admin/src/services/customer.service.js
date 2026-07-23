import api from './api';
import createResourceService from './resource.service';

const base = createResourceService('/admin/customers');

async function updateStatus(id, status) {
  const { data } = await api.patch(`/admin/customers/${id}/status`, { status });
  return data.data;
}

export default { ...base, updateStatus };
