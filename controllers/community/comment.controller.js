const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { uploadMany, uploadSingle } = require("../../libs/cloudinary");
const { MESSAGES } = require("../../constants/responseMessages");
const { notificationInfo, communityCommentService } = require("../../services");
const otherConstants = require("../../constants/others");
const { notificationQueue } = require("../../schemas");

const submitComment = catchAsync(async (req, res) => {
  const { body, user } = req;
});

module.exports = {
  submitComment,
};
