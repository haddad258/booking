const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const chaletService = require('../services/chalet.service');
const reviewService = require('../services/review.service');

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await chaletService.listChalets(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getById = catchAsync(async (req, res) => {
  const chalet = await chaletService.getChaletById(req.params.id);
  const rating = await reviewService.getAverageRating('chalet', req.params.id);
  ApiResponse.send(res, { data: { ...chalet, ...rating } });
});

const create = catchAsync(async (req, res) => {
  const chalet = await chaletService.createChalet(req.body, req.admin.id);
  ApiResponse.send(res, { statusCode: 201, message: 'Chalet created', data: chalet });
});

const update = catchAsync(async (req, res) => {
  const chalet = await chaletService.updateChalet(req.params.id, req.body);
  ApiResponse.send(res, { message: 'Chalet updated', data: chalet });
});

const remove = catchAsync(async (req, res) => {
  await chaletService.deleteChalet(req.params.id);
  ApiResponse.send(res, { message: 'Chalet deleted' });
});

const uploadImages = catchAsync(async (req, res) => {
  const images = await chaletService.addImages(req.params.id, req.files || []);
  ApiResponse.send(res, { statusCode: 201, message: 'Images uploaded', data: images });
});

const removeImage = catchAsync(async (req, res) => {
  await chaletService.removeImage(req.params.id, req.params.imageId);
  ApiResponse.send(res, { message: 'Image removed' });
});

const checkAvailability = catchAsync(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  const result = await chaletService.checkAvailability(req.params.id, checkIn, checkOut);
  ApiResponse.send(res, { data: result });
});

const setAvailability = catchAsync(async (req, res) => {
  const availability = await chaletService.setAvailability(req.params.id, req.body.entries);
  ApiResponse.send(res, { message: 'Availability updated', data: availability });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadImages,
  removeImage,
  checkAvailability,
  setAvailability,
};
