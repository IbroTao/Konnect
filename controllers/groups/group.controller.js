const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { MESSAGES } = require("../../constants/responseMessages");
const { uploadSingle, deleteSingle } = require("../../libs/cloudinary");
const { groupService, notificationInfo } = require("../../services");
const { notificationQueue } = require("../../schemas");

const createGroup = catchAsync(async (req, res) => {
  const { body } = req;
  const isName = await groupService.getGroupByName(body.name);
  if (isName) throw new ApiError(httpStatus.BAD_REQUEST, "name already taken");

  await groupService.createGroup({
    ...body,
    admins: { id: [req.user._id] },
    adminCount: 1,
  });
  if (!body)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const queryGroups = catchAsync(async (req, res) => {
  const { search, limit, page, filter, sortedBy, orderBy } = req.query;
  const groups = await groupService.queryGroups(
    { page, limit, orderBy, sortedBy },
    { search, filter }
  );
  if (!groups)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.RESOURCE_MISSING
    );
  res.status(200).json(groups);
});

const uploadImage = catchAsync(async (req, res) => {
  const { file } = req;
  const { publicId, url } = await uploadSingle(file.path);
  const group = await groupService.uploadImage(req.params.id, url, publicId);
  if (group.modifiedCount !== 1)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const updateInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const group = await groupService.updateGroup(id, { info: req.body.info });
  if (!group)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.UPDATED });
});

const updateRulesAndType = catchAsync(async (req, res) => {
  const { id } = req.params;

  let group;

  if (req.body.rules && req.body.type) {
    group = await groupService.updateGroup(id, {
      rules: req.body.rules,
      type: req.body.type,
    });
  } else if (req.body.rules) {
    group = await groupService.updateGroup(id, { rules: req.body.rules });
  } else if (req.body.type) {
    group = await groupService.updateGroup(id, { type: req.body.type });
  }

  if (!group)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const getGroupByName = catchAsync(async (req, res) => {
  const { name } = req.params;
  const group = await groupService.getGroupByName(name);
  if (!group)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(group);
});

const getGroupById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const group = await groupService.getAGroupById(id);
  if (!group)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(group);
});

const addMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const group = await groupService.updateGroup(id, {
    $addToSet: { members: { id: req.body.member } },
    $inc: { membersCount: 1 },
  });
  if (!group)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const removeMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const group = await groupService.updateGroup(id, {
    $pull: { members: { id: req.body.member } },
    $inc: { membersCount: -1 },
  });
  if (!group)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

// UNFINISHED
const addAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admins = [];

  re.body.admin.map((id) => {
    admins.push({ id });
  });

  const group = await groupService.updateGroup(id, {
    $push: { admins },
    $inc: { adminCount: admins.length },
  });

  if (!group) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.NOT_FOUND);
});

module.exports = {
  createGroup,
  queryGroups,
  uploadImage,
  updateInfo,
  updateRulesAndType,
  getGroupByName,
  getGroupById,
  addMember,
  removeMember,
};
