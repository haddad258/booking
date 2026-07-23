const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const amenityService = require('../services/amenity.service');

const list = catchAsync(async (req, res) => {
  const data = await amenityService.listAmenities(req.query.type);
  ApiResponse.send(res, { data });
});

const create = catchAsync(async (req, res) => {
  const amenity = await amenityService.createAmenity(req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Amenity created', data: amenity });
});

const update = catchAsync(async (req, res) => {
  const amenity = await amenityService.updateAmenity(req.params.id, req.body);
  ApiResponse.send(res, { message: 'Amenity updated', data: amenity });
});

const remove = catchAsync(async (req, res) => {
  await amenityService.deleteAmenity(req.params.id);
  ApiResponse.send(res, { message: 'Amenity deleted' });
});

module.exports = { list, create, update, remove };
