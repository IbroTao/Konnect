const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { uploadSingle } = require("../libs/cloudinary");
const { userService, userFeed, notificationInfo } = require("../services");
const { MESSAGES } = require("../constants/responseMessages");
const otherConstants = require("../constants/others");

const comparePassword = catchAsync(async (req, res) => {
  if (!req.body.password)
    throw new ApiError(httpStatus.BAD_REQUEST, "provide password");
  const passwordMatch = await userService.comparePassword(
    req.body.password,
    req.user.id
  );
  if (!passwordMatch)
    throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.PASSWORD_NO_MATCH);
  res.status(204).json();
});

const getUsers = catchAsync(async (req, res) => {
  const { search } = req.query;
  const filter = pick(req.query, ["role"]);
  const result = await userService.queryUsers({ search, filter }, req.query);
  res.status(httpStatus.OK).json(result);
});

module.exports = {
  comparePassword,
  getUsers,
};
