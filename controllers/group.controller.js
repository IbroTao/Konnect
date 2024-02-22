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

    message = { fileData };
  } else if (text) {
    message = { fileData };
  } else throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.PROVIDE_BODY);

  const msg = await groupService.postMessage({
    message,
    groupId,
    sender: user.id,
    readBy: { userId: user.id },
  });
  res.status(201).json(msg);
});

const addMembers = catchAsync(async (req, res) => {
  const { body, params } = req;
  const group = await groupService.addMembers(params.groupId, body.members);
  if (!group)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const addAdmins = catchAsync(async (req, res) => {
  const { body, params } = req;
  const group = await groupService.addAdmins(params.groupId, body.admins);
  if (!group)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const removeMembers = catchAsync(async (req, res) => {
  const { body, params } = req;
  const group = await groupService.removeMembers(params.groupId, body.members);
  if (!group)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const removeAdmins = catchAsync(async (req, res) => {
  const { body, params } = req;
  const group = await groupService.removeAdmins(params.groupId, body.admins);
  if (!group)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const markMessagesSeen = catchAsync(async (req, res) => {
  const msg = await groupService.markMessagesSeen(
    req.params.groupId,
    req.user.id
  );
  if (!msg)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const deleteMessage = catchAsync(async (req, res) => {
  await groupService.markMsgDeleted(req.params.msgId);
  res.status(200).json({ message: MESSAGES.DELETED });
});

const getGroupRecentMsgs = catchAsync(async (req, res) => {
  const groups = await groupService.getGroupsByUserId(req.user.id);
  if (!groups.length)
    throw new ApiError(httpStatus.NOT_FOUND, "user is in no group");

  const groupIds = groups.map((group) => group._id);
  const recentConversations = await groupService.getR;
});

module.exports = {
  createGroup,
  getGroupById,
  addMembers,
  getGroupRecentMsgs,
  addAdmins,
  removeMembers,
  removeAdmins,
  getGroupByName,
  uploadLogo,
  sendMessage,
  deleteMessage,
  markMessagesSeen,
};
