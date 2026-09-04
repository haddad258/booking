const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const hotelService = require('../services/hotel.service');
const reviewService = require('../services/review.service');

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await hotelService.listHotels(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getById = catchAsync(async (req, res) => {
  const hotel = await hotelService.getHotelById(req.params.id);
  const rating = await reviewService.getAverageRating('hotel', req.params.id);
  ApiResponse.send(res, { data: { ...hotel, ...rating } });
});

const create = catchAsync(async (req, res) => {
  const hotel = await hotelService.createHotel(req.body, req.admin.id);
  ApiResponse.send(res, { statusCode: 201, message: 'Hotel created', data: hotel });
});

const update = catchAsync(async (req, res) => {
  const hotel = await hotelService.updateHotel(req.params.id, req.body);
  ApiResponse.send(res, { message: 'Hotel updated', data: hotel });
});

const remove = catchAsync(async (req, res) => {
  await hotelService.deleteHotel(req.params.id);
  ApiResponse.send(res, { message: 'Hotel deleted' });
});

const uploadImages = catchAsync(async (req, res) => {
  const images = await hotelService.addImages(req.params.id, req.files || []);
  ApiResponse.send(res, { statusCode: 201, message: 'Images uploaded', data: images });
});

const removeImage = catchAsync(async (req, res) => {
  await hotelService.removeImage(req.params.id, req.params.imageId);
  ApiResponse.send(res, { message: 'Image removed' });
});

const reorderImages = catchAsync(async (req, res) => {
  const images = await hotelService.reorderImages(req.params.id, req.body.imageIds);
  ApiResponse.send(res, { message: 'Image order updated', data: images });
});

const setCoverImage = catchAsync(async (req, res) => {
  const images = await hotelService.setCoverImage(req.params.id, req.params.imageId);
  ApiResponse.send(res, { message: 'Cover image updated', data: images });
});

const addRoom = catchAsync(async (req, res) => {
  const room = await hotelService.addRoom(req.params.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Room created', data: room });
});

const updateRoom = catchAsync(async (req, res) => {
  const room = await hotelService.updateRoom(req.params.id, req.params.roomId, req.body);
  ApiResponse.send(res, { message: 'Room updated', data: room });
});

const deleteRoom = catchAsync(async (req, res) => {
  await hotelService.deleteRoom(req.params.id, req.params.roomId);
  ApiResponse.send(res, { message: 'Room deleted' });
});

const checkAvailability = catchAsync(async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;
  const result = await hotelService.checkRoomAvailability(roomId, checkIn, checkOut);
  ApiResponse.send(res, { data: result });
});

const setAvailability = catchAsync(async (req, res) => {
  const availability = await hotelService.setAvailability(req.params.id, req.params.roomId, req.body.entries);
  ApiResponse.send(res, { message: 'Availability updated', data: availability });
});

// --- Multilingual descriptions (Requirement #7) ---
const listDescriptions = catchAsync(async (req, res) => {
  const descriptions = await hotelService.listDescriptions(req.params.id);
  ApiResponse.send(res, { data: descriptions });
});

const upsertDescription = catchAsync(async (req, res) => {
  const description = await hotelService.upsertDescription(req.params.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Description saved', data: description });
});

const setDefaultDescription = catchAsync(async (req, res) => {
  const descriptions = await hotelService.setDefaultDescription(req.params.id, req.params.descriptionId);
  ApiResponse.send(res, { message: 'Default description updated', data: descriptions });
});

const deleteDescription = catchAsync(async (req, res) => {
  const descriptions = await hotelService.deleteDescription(req.params.id, req.params.descriptionId);
  ApiResponse.send(res, { message: 'Description deleted', data: descriptions });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadImages,
  removeImage,
  reorderImages,
  setCoverImage,
  addRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  setAvailability,
  listDescriptions,
  upsertDescription,
  setDefaultDescription,
  deleteDescription,
};
