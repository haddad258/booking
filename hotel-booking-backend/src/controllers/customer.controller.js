const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const customerService = require('../services/customer.service');

// --- Admin-side management ---

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await customerService.listCustomers(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getById = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  ApiResponse.send(res, { data: customer });
});

const updateStatus = catchAsync(async (req, res) => {
  const customer = await customerService.updateStatus(req.params.id, req.body.status);
  ApiResponse.send(res, { message: 'Customer status updated', data: customer });
});

const remove = catchAsync(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  ApiResponse.send(res, { message: 'Customer deleted' });
});

// --- Self-service (customer-facing) ---

const me = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.customer.id);
  ApiResponse.send(res, { data: customer });
});

const updateProfile = catchAsync(async (req, res) => {
  const customer = await customerService.updateProfile(req.customer.id, req.body);
  ApiResponse.send(res, { message: 'Profile updated', data: customer });
});

const changePassword = catchAsync(async (req, res) => {
  await customerService.changePassword(req.customer.id, req.body.currentPassword, req.body.newPassword);
  ApiResponse.send(res, { message: 'Password changed successfully' });
});

const addAddress = catchAsync(async (req, res) => {
  const address = await customerService.addAddress(req.customer.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Address added', data: address });
});

const removeAddress = catchAsync(async (req, res) => {
  await customerService.removeAddress(req.customer.id, req.params.id);
  ApiResponse.send(res, { message: 'Address removed' });
});

const addFavorite = catchAsync(async (req, res) => {
  const favorite = await customerService.addFavorite(req.customer.id, req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Added to favorites', data: favorite });
});

const removeFavorite = catchAsync(async (req, res) => {
  await customerService.removeFavorite(req.customer.id, req.params.type, req.params.id);
  ApiResponse.send(res, { message: 'Removed from favorites' });
});

const listFavorites = catchAsync(async (req, res) => {
  const favorites = await customerService.listFavorites(req.customer.id);
  ApiResponse.send(res, { data: favorites });
});

const bookingHistory = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await customerService.getBookingHistory(req.customer.id, req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

module.exports = {
  list,
  getById,
  updateStatus,
  remove,
  me,
  updateProfile,
  changePassword,
  addAddress,
  removeAddress,
  addFavorite,
  removeFavorite,
  listFavorites,
  bookingHistory,
};
