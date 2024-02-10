const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingle, uploadMany } = require("../libs/cloudinary");
const { groupService } = require("../services");
const pick = require("../utils/pick");
const { MESSAGES } = require("../constants/responseMessages");

const createGroup = catchAsync(async (req, res) => {
  const { file, body } = req;

  let data = {
    members: body.members || [],
    admins: [req.user._id],
    name: body.name,
  };
  data.members.push(req.user._id);

  if (file) {
    const { publicId, url } = await uploadSingle(file.path);

    let fileData = {};
    Object.assign(fileData, data, { logo: { publicId, url } });
    data = fileData;
  }
  const result = await groupService.initiateGroup(data);
  if (!result)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(201).json(result);
});

const getGroupById = catchAsync(async (req, res) => {
  const group = await groupService.findGroupById(req.params.id);
  if (!group)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json(group);
});

const getGroupByName = catchAsync(async (req, res) => {
  const group = await groupService.getGroupByName(req.params.name, req.user.id);
  if (!group)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(group);
});

module.exports = { createGroup, getGroupById, getGroupNByName };
