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

  const comment = await communityCommentService.createComment(
    body.postId,
    body.content,
    user._id,
    body.parentId || null
  );

  if (!comment)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE);

  notificationQueue.msg = `${req.user.username} commented on your post`;
  notificationQueue.type = "comment";
  notificationQueue.timestamp = new Date().toISOString();
  notificationQueue.senderId = comment.author;
});

const getComments = catchAsync(async (req, res) => {
  const { limit, page, sortBy, orderBy } = req.query;
  const comments = await communityCommentService.queryComments({
    postId: req.query.postId,
    limit,
    page,
    sortBy,
    orderBy,
  });
  if (!comments)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.RESOURCE_MISSING
    );
  res.status(200).json(comments);
});

const updateComment = catchAsync(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  if (!content)
    throw new ApiError(httpStatus.BAD_REQUEST, MESSAGES.PROVIDE_BODY);
  const comment = await communityCommentService.updateComment(
    content,
    commentId
  );
  if (comment.modifiedCount === 0)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.UPDATE_FAILED
    );
  res.status(200).json({ message: MESSAGES.UPDATED });
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await communityCommentService.deleteComment(commentId);
  if (comment.deletedCount === 0)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MESSAGES.DELETE_FAILED
    );
  res.status(200).json({ message: MESSAGES.DELETED });
});

module.exports = {
  submitComment,
  getComments,
  updateComment,
  deleteComment,
};
