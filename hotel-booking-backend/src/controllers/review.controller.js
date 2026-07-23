const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const reviewService = require('../services/review.service');

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await reviewService.listReviews(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const create = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.customer.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Review submitted for moderation', data: review });
});

const update = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.customer.id, req.body);
  ApiResponse.send(res, { message: 'Review updated and resubmitted for moderation', data: review });
});

const remove = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.customer.id);
  ApiResponse.send(res, { message: 'Review deleted' });
});

// Admin moderation

const listForModeration = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await reviewService.listReviews({ ...req.query, includeAll: true });
  ApiResponse.paginated(res, { data, page, limit, total });
});

const moderate = catchAsync(async (req, res) => {
  const review = await reviewService.moderateReview(req.params.id, req.body.status);
  ApiResponse.send(res, { message: 'Review moderated', data: review });
});

module.exports = { list, create, update, remove, listForModeration, moderate };
