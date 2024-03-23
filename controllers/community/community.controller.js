const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { MESSAGES } = require("../../constants/responseMessages");
const { uploadSingle, deleteSingle } = require("../../libs/cloudinary");
const {
  groupService,
  notificationService,
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

const getMembers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.getMembers(id);
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(community);
});

const getRequests = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { limit, page } = req.query;
  const requests = await communityService.getAllRequests({ id, limit, page });
  if (!requests)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(requests);
});

const rejectRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const request = await communityService.deleteRequest(id);
  if (request.modifiedCount === 0)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.DELETE_FAILED
    );
  res.status(200).json({ message: MESSAGES.DELETED });
});

const deleteCommunity = catchAsync(async (req, res) => {
  const { id } = req.params;
  const community = await communityService.getACommunityById(id);
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  const result = await deleteSingle(community.coverImage.url);
  if (!result)
    throw new ApiError(httpStatus.EXPECTATION_FAILED, MESSAGES.DELETE_FAILED);
  await communityService.deleteCommunity(community._id);
  res.status(200).json({ message: MESSAGES.DELETED });
});

const addAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admins = [];

  req.body.admin.map((id) => {
    admins.push({ id });
  });

  const community = await communityService.updateCommunity(id, {
    $push: { admins },
    $inc: { adminCount: admins.length },
  });
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);

  const notificationData = [];
  req.body.admin.forEach((admin) => {
    notificationQueue.msg = `You have been made an admin in ${community.name}`;
    notificationQueue.link = `localhost:9090/konnect/community/${community._id}`;
    notificationQueue.type = "role-assign";
    notificationQueue.timestamp = new Date().toISOString();
    notificationQueue.recipientId = admin;
    notificationData.push(notificationQueue);
  });

  const notifications = [];
  notificationData.forEach((notification) => {
    const data = {
      image: notification.type,
      message: notification.msg,
      link: notification.link,
      userId: notification.recipientId,
    };
    notifications.push(data);
  });
  // <============ UNFINISHED ============>
  // <==== rabbitMqServer needs to be implemented ====>
});

const removeAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const community = await communityService.updateCommunity(id, {
    $pull: { admins: { id: req.body.admin } },
    $inc: { adminCount: -1 },
  });
  if (!community)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);

  const notificationData = [];
  req.body.admin.forEach((admin) => {
    notificationQueue.msg = `You have been removed as an admin from ${community.name}`;
    notificationQueue.link = `localhost:9090/konnect/community/${community._id}`;
    notificationQueue.type = "role-assign";
    notificationQueue.timestamp = new Date().toISOString();
    notificationQueue.recipientId = admin;
  });
  notificationData.push(notificationQueue);

  const notifications = [];
  notificationData.forEach((notification) => {
    const data = {
      image: notification.type,
      link: notification.link,
      message: notification.msg,
      userId: notification.recipientId,
    };
    notifications.push(data);
  });
  // <============ UNFINISHED ============>
  // <==== rabbitMqServer needs to be implemented ====>
});

const sendRequestToCommunity = catchAsync(async (req, res) => {
  const { communityId } = req.params;

  const request = await communityService.sendRequestTo(
    req.user._id,
    communityId
  );
  if (!request)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);

  const notificationData = [];
  req.body.admin.forEach((admin) => {
    notificationQueue.msg = `${req.user.username} has requested to join this community ${request.name}`;
    notificationQueue.link = `localhost:9090/konnect/community/${request._id}/requests`;
    notificationQueue.type = "community-requests";
    notificationQueue.timestamp = new Date().toISOString();
    notificationQueue.recipientId = admin;
  });
  notificationData.push(notificationQueue);

  const notifications = [];
  notificationData.forEach((notification) => {});
});

module.exports = {
  createCommunity,
  deleteCommunity,
  queryCommunities,
  uploadImage,
  rejectRequest,
  updateInfo,
  updateRulesAndType,
  getRequests,
  getCommunityByName,
  getCommunityById,
  addMember,
  removeMember,
  getMembers,
  addAdmin,
  removeAdmin,
  sendRequestToCommunity,
};
