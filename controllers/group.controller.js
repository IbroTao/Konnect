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

const uploadLogo = catchAsync(async (req, res) => {
  if (!req.file)
    throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.PROVIDE_IMAGE);
  const { url, publicId } = await uploadSingle(file.path);

  const group = await groupService.updateGroupById(req.params.groupId, {
    logo: { url, publicId },
  });
  if (!group)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.UPDATED });
});

const sendMessage = catchAsync(async (req, res) => {
  const { groupId, text } = req.body;
  const { user, files } = req;

  let message;
  if (text && files.length) {
    const filePaths = files.map((file) => file.path);
    const response = await uploadMany(filePaths);
    const fileData = response.map((file) => ({
      url: file.url,
      publicId: file.publicId,
    }));
  }
});

module.exports = {
  createGroup,
  getGroupById,
  getGroupByName,
  uploadLogo,
  sendMessage,
};
