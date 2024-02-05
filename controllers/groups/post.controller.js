const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { groupPostService } = require("../../services");
const { uploadSingle, uploadMany } = require("../../libs/cloudinary");
const { MESSAGES } = require("../../constants/responseMessages");
const { notificationQueue } = require("../../schemas");

const createPost = catchAsync(async (req, res) => {
  const { files, body } = req;
  const data = {
    content: body.content,
    author: req.user._id,
    groupId: body.groupId,
  };

  if (files.length) {
    const filePaths = files.map((file) => file.path);
    const result = await uploadMany(filePaths);
  }
});
