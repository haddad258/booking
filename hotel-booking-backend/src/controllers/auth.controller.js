const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

const register = catchAsync(async (req, res) => {
  const result = await authService.registerCustomer(req.body);
  ApiResponse.send(res, {
    statusCode: 201,
    message: `Registration successful. Your username is "${result.user.username}" — you'll need it to log in.`,
    data: result,
  });
});

const customerLogin = catchAsync(async (req, res) => {
  const result = await authService.login({ identifier: req.body.username, password: req.body.password, type: 'customer' });
  ApiResponse.send(res, { message: 'Login successful', data: result });
});

const adminLogin = catchAsync(async (req, res) => {
  const result = await authService.login({ identifier: req.body.email, password: req.body.password, type: 'admin' });
  ApiResponse.send(res, { message: 'Login successful', data: result });
});

const refreshCustomerToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshTokens({ refreshToken: req.body.refreshToken, type: 'customer' });
  ApiResponse.send(res, { message: 'Token refreshed', data: tokens });
});

const refreshAdminToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshTokens({ refreshToken: req.body.refreshToken, type: 'admin' });
  ApiResponse.send(res, { message: 'Token refreshed', data: tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout({ userId: req.user.id, type: req.user.type });
  ApiResponse.send(res, { message: 'Logged out successfully' });
});

const forgotPassword = catchAsync(async (req, res) => {
  const type = req.baseUrl.includes('admin') ? 'admin' : 'customer';
  const identifier = type === 'admin' ? req.body.email : req.body.username;
  await authService.forgotPassword({ identifier, type });
  ApiResponse.send(res, { message: 'If that account exists, a reset link has been sent' });
});

const resetPassword = catchAsync(async (req, res) => {
  const type = req.baseUrl.includes('admin') ? 'admin' : 'customer';
  await authService.resetPassword({ token: req.body.token, password: req.body.password, type });
  ApiResponse.send(res, { message: 'Password has been reset successfully' });
});

module.exports = {
  register,
  customerLogin,
  adminLogin,
  refreshCustomerToken,
  refreshAdminToken,
  logout,
  forgotPassword,
  resetPassword,
};
