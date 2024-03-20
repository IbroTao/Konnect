const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { MESSAGES } = require("../../constants/responseMessages");
const { uploadSingle, deleteSingle } = require("../../libs/cloudinary");
const {
  groupService,
  notificationInfo,
  communityService,
} = require("../../services");
const { notificationQueue } = require("../../schemas");

const createCommunity = catchAsync(async (req, res) => {
  const { body } = req;
  const isName = await communityService.createCommunity(body.name);
  if (isName) throw new ApiError(httpStatus.BAD_REQUEST, "name already taken");

  await communityService.createCommunity({
    ...body,
    admins: { id: [req.user._id] },
    adminCount: 1,
  });
  if (!body)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const queryCommunities = catchAsync(async (req, res) => {
  const { search, limit, page, filter, sortedBy, orderBy } = req.query;
  const communities = await communityService.queryCommunities(
    { page, limit, orderBy, sortedBy },
    { search, filter }
  );
  if (!communities)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.RESOURCE_MISSING
    );
  res.status(200).json(groups);
});

const uploadImage = catchAsync(async (req, res) => {
  const { file } = req;
  const { publicId, url } = await uploadSingle(file.path);
  const community = await communityService.uploadImage(
    req.params.id,
    url,
    publicId
  );
  if (community.modifiedCount !== 1)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const updateInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.updateCommunity(id, {
    info: req.body.info,
  });
  if (!community)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.UPDATED });
});

const updateRulesAndType = catchAsync(async (req, res) => {
  const { id } = req.params;

  let community;

  if (req.body.rules && req.body.type) {
    community = await communityService.updateCommunity(id, {
      rules: req.body.rules,
      type: req.body.type,
    });
  } else if (req.body.rules) {
    community = await communityService.updateCommunity(id, {
      rules: req.body.rules,
    });
  } else if (req.body.type) {
    community = await communityService.updateCommunity(id, {
      type: req.body.type,
    });
  }

  if (!community)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const getCommunityByName = catchAsync(async (req, res) => {
  const { name } = req.params;
  const community = await communityService.getCommunityByName(name);
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(community);
});

const getCommunityById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.getACommunityById(id);
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(community);
});

const addMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.updateCommunity(id, {
    $addToSet: { members: { id: req.body.member } },
    $inc: { membersCount: 1 },
  });
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const removeMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.updateCommunity(id, {
    $pull: { members: { id: req.body.member } },
    $inc: { membersCount: -1 },
  });
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

module.exports = {
  createCommunity,
  queryCommunities,
  uploadImage,
  updateInfo,
  updateRulesAndType,
  getCommunityByName,
  getCommunityById,
  addMember,
  removeMember,
};
