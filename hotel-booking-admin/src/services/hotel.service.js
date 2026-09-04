import api from './api';
import createResourceService from './resource.service';

const base = createResourceService('/hotels');

async function uploadImages(hotelId, files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  const { data } = await api.post(`/hotels/${hotelId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

async function removeImage(hotelId, imageId) {
  const { data } = await api.delete(`/hotels/${hotelId}/images/${imageId}`);
  return data;
}

async function reorderImages(hotelId, imageIds) {
  const { data } = await api.put(`/hotels/${hotelId}/images/reorder`, { imageIds });
  return data.data;
}

async function setCoverImage(hotelId, imageId) {
  const { data } = await api.put(`/hotels/${hotelId}/images/${imageId}/cover`);
  return data.data;
}

async function addRoom(hotelId, payload) {
  const { data } = await api.post(`/hotels/${hotelId}/rooms`, payload);
  return data.data;
}

async function updateRoom(hotelId, roomId, payload) {
  const { data } = await api.patch(`/hotels/${hotelId}/rooms/${roomId}`, payload);
  return data.data;
}

async function deleteRoom(hotelId, roomId) {
  const { data } = await api.delete(`/hotels/${hotelId}/rooms/${roomId}`);
  return data;
}

async function setAvailability(hotelId, roomId, entries) {
  const { data } = await api.put(`/hotels/${hotelId}/rooms/${roomId}/availability`, { entries });
  return data.data;
}

async function listDescriptions(hotelId) {
  const { data } = await api.get(`/hotels/${hotelId}/descriptions`);
  return data.data;
}

async function saveDescription(hotelId, payload) {
  const { data } = await api.post(`/hotels/${hotelId}/descriptions`, payload);
  return data.data;
}

async function setDefaultDescription(hotelId, descriptionId) {
  const { data } = await api.put(`/hotels/${hotelId}/descriptions/${descriptionId}/default`);
  return data.data;
}

async function deleteDescription(hotelId, descriptionId) {
  const { data } = await api.delete(`/hotels/${hotelId}/descriptions/${descriptionId}`);
  return data.data;
}

export default {
  ...base,
  uploadImages,
  removeImage,
  reorderImages,
  setCoverImage,
  addRoom,
  updateRoom,
  deleteRoom,
  setAvailability,
  listDescriptions,
  saveDescription,
  setDefaultDescription,
  deleteDescription,
};
