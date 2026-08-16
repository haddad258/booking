import api from './api';
import createResourceService from './resource.service';

const base = createResourceService('/chalets');

async function uploadImages(chaletId, files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  const { data } = await api.post(`/chalets/${chaletId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

async function removeImage(chaletId, imageId) {
  const { data } = await api.delete(`/chalets/${chaletId}/images/${imageId}`);
  return data;
}

async function reorderImages(chaletId, imageIds) {
  const { data } = await api.put(`/chalets/${chaletId}/images/reorder`, { imageIds });
  return data.data;
}

async function setCoverImage(chaletId, imageId) {
  const { data } = await api.put(`/chalets/${chaletId}/images/${imageId}/cover`);
  return data.data;
}

async function setAvailability(chaletId, entries) {
  const { data } = await api.put(`/chalets/${chaletId}/availability`, { entries });
  return data.data;
}

export default { ...base, uploadImages, removeImage, reorderImages, setCoverImage, setAvailability };
