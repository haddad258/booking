const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const settingsService = require('../services/settings.service');

const getAll = catchAsync(async (req, res) => {
  const data = await settingsService.getAllSettings();
  ApiResponse.send(res, { data });
});

const getGroup = catchAsync(async (req, res) => {
  const data = await settingsService.getGroup(req.params.group);
  ApiResponse.send(res, { data });
});

const updateGroup = catchAsync(async (req, res) => {
  const data = await settingsService.updateGroup(req.params.group, req.body);
  ApiResponse.send(res, { message: 'Settings updated', data });
});

module.exports = { getAll, getGroup, updateGroup };
