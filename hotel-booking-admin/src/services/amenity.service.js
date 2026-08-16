import api from './api';
import createResourceService from './resource.service';

const base = createResourceService('/amenities');

/** Pass force=true after the user has confirmed the usage-count warning. */
async function remove(id, force = false) {
  const { data } = await api.delete(`/amenities/${id}`, { params: force ? { force: true } : undefined });
  return data;
}

export default { ...base, remove };
