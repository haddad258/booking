import api from './api';

async function listReviews(params) {
  const { data } = await api.get('/reviews/admin/all', { params });
  return data;
}

async function moderateReview(id, status) {
  const { data } = await api.patch(`/reviews/${id}/moderate`, { status });
  return data.data;
}

export default { listReviews, moderateReview };
