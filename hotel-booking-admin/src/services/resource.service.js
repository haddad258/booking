import api from './api';

/**
 * Builds a standard set of CRUD methods for a REST resource.
 * @param {string} basePath - e.g. '/hotels', '/admin/customers'
 */
export function createResourceService(basePath) {
  return {
    list: async (params) => {
      const { data } = await api.get(basePath, { params });
      return data; // { success, data, meta }
    },
    getById: async (id) => {
      const { data } = await api.get(`${basePath}/${id}`);
      return data.data;
    },
    create: async (payload) => {
      const { data } = await api.post(basePath, payload);
      return data.data;
    },
    update: async (id, payload) => {
      const { data } = await api.patch(`${basePath}/${id}`, payload);
      return data.data;
    },
    remove: async (id) => {
      const { data } = await api.delete(`${basePath}/${id}`);
      return data;
    },
  };
}

export default createResourceService;
