const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { MESSAGES } = require("../../constants/responseMessages");
const { uploadSingle, deleteSingle } = require("../../libs/cloudinary");
const { groupService, notificationInfo } = require("../../services");

const createGroup = catchAsync(async (req, res) => {
  const { body } = req;
  const isName = await groupService.getGroupByName(body.name);
  if (isName) throw new ApiError(httpStatus);
});
