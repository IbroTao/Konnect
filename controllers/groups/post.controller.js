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
    const multipleFiles = result.map((file) => ({
      url: file.url,
      publicId: file.publicId,
    }));
    Object.assign(data, { file: multipleFiles });
  }
  const post = await groupPostService.createPost(data);
  if (!post)
    throw new ApiError(httpStatus.EXPECTATION_FAILED, MESSAGES.FAILURE);
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const queryPosts = catchAsync(async (req, res) => {
  const { search, limit, page, filter, sortedBy, orderBy } = req.query;
  const { groupId } = req.params;
  const posts = await groupPostService.getPosts(
    { search, filter, groupId },
    { limit, page, sortedBy, orderBy }
  );
  if (!posts)
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      MESSAGES.RESOURCE_MISSING
    );
  res.status(201).json({ message: MESSAGES.SUCCESS });
});

const getPostsById = catchAsync(async (req, res) => {
  const post = await groupPostService.getPostById(req.params.id);
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.MISSING);
  res.status(200).json(post);
});

const updatePosts = catchAsync(async (req, res) => {
  const post = await groupPostService.updatePost(
    { content: req.body.content },
    req.params.id
  );
  if (post.modifiedCount === 0)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const deletePost = catchAsync(async (req, res) => {
  const post = await groupPostService.deletePost(req.params.id);
  if (post.deletedCount !== 1)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.DELETE_FAILED
    );
  res.status(200).json({ message: MESSAGES.DELETED });
});

// UNFINISHED
const likePost = catchAsync(async (req, res) => {
  const { user } = req;
  const isPost = await groupPostService.isPostLikedByUser(
    user._id,
    req.params.id
  );
  if (isPost) throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.FAILURE);

  const opts = {
    $addToSet: { likes: { userId: user._id } },
    $inc: { totalLikes: 1 },
  };

  const post = await groupPostService.updatePostAndReturn(opts, req.params.id);
  if (!post)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
});

const unlikePost = catchAsync(async (req, res) => {
  const { user } = req;
  const isPost = await groupPostService.isPostLikedByUser(
    user._id,
    req.params.id
  );
  if (!isPost)
    throw new ApiError(httpStatus.BAD_REQUEST, "user has not like this post");

  const post = await groupPostService.updatePost(
    {
      $pull: { likes: { userId: user._id } },
      $inc: { totalLikes: -1 },
    },
    req.params.id
  );

  if (post.modifiedCount === 0)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);
  res.status(200).json({ message: MESSAGES.SUCCESS });
});

const getPostLikes = catchAsync(async (req, res) => {
  const likes = await groupPostService.getPostLikes(req.params.id);
  if (!likes)
    throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.RESOURCE_MISSING);
  res.status(200).json(likes);
});

module.exports = {
  createPost,
  queryPosts,
  updatePosts,
  getPostsById,
  deletePost,
  unlikePost,
  getPostLikes,
};
