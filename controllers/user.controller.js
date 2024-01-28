const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { uploadSingle } = require("../libs/cloudinary");
const {
  userService,
  userFeed,
  notificationInfo,
  postService,
} = require("../services");
const { MESSAGES } = require("../constants/responseMessages");
const { notificationQueue } = require("../schemas/notificationQueue");
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

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  user.password = "";
  res.status(httpStatus.OK).json(user);
});

const getUserByUsername = catchAsync(async (req, res) => {
  let { username } = req.params;
  if (username.at(0) !== "@") {
    username = `@${username}`;
  }
  const user = await userService.getUserByUsername(username);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  res.status(httpStatus.OK).json(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).json({
    _id: user._id,
    username: user.username,
    updatedAt: user.updatedAt,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteAccount({
    userId: req.user.id,
    email: req.user.email,
    reason: req.body.reason,
  });
  res.status(httpStatus.OK).json({ message: MESSAGES.DELETED });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  res.status(httpStatus.OK).json({
    _id: user._id,
    username: user.username,
    updatedAt: user.updatedAt,
  });
});

const updateAvatar = catchAsync(async (req, res) => {
  if (!req.file)
    throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.PROVIDE_IMAGE);
  const { publicId, url } = await uploadSingle(req.file.path);

  req.user.avatar = {
    publicId,
    url,
  };
  await user.save();
  res.status(httpStatus.OK).json({ message: MESSAGES.SUCCESS });
});

const followUser = catchAsync(async (req, res) => {
  const result = await userService.followUser(req.user._id, req.params.userId);
  if (result === false)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);

  notificationQueue.msg = `${result.username} now follows you`;
  notificationQueue.link = `http://localhost:9090/konnect/users/${result.username}`;
  notificationQueue.type = "follow";
  notificationQueue.timestamp = new Date().toISOString();
  notificationQueue.recipientId = req.params.userId;
});

const isUserFollowing = catchAsync(async (req, res) => {
  const result = await userService.isUserFollowing(
    req.params.userId,
    req.user._id
  );
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "you are not following this user");
  res.status(httpStatus.OK).json({ message: "following" });
});

const unfollowUser = catchAsync(async (req, res) => {
  const result = await userService.unfollowUser(
    req.user._id,
    req.params.userId
  );
  if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);
  res.status(httpStatus.OK).json({ message: MESSAGES.UNFOLLOWED });
});

const getUserPosts = catchAsync(async (req, res) => {
  const result = await postService.getUserPosts(req.user._id);
  if (result.no === 0)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(httpStatus.OK).json(result);
});

const getPostsByUserId = catchAsync(async (req, res) => {
  const result = await postService.getUserPosts(req.params.postId);
  if (result.no === 0)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(httpStatus.OK).json(result);
});

const getUserFollowers = catchAsync(async (req, res) => {});

module.exports = {
  comparePassword,
  getUsers,
  getUser,
  getPostsByUserId,
  getUserByUsername,
  updateUser,
  deleteUser,
  updateProfile,
  updateAvatar,
  followUser,
  unfollowUser,
  isUserFollowing,
  getUserPosts,
};
