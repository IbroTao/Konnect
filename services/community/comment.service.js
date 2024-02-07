const myCustomLabels = require("../../utils/myCustomLabels");
const { CommunityComment, CommunityPosts } = require("../../models");

const createComment = async (postId, content, userId, parentId) => {
  let newComment = new CommunityComment({
    author: userId,
    content,
    postId,
  });

  if (parentId) {
    const parentComment = await CommunityComment.findOne({
      _id: userId,
      comments: parentId,
    });
    if (!parentComment) throw new Error("parent comment not found");

    newComment.parentId = parentId;

    await CommunityComment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
    });
  }

  newComment = await newComment.save;

  await CommunityComment.updateOne(
    { _id: postId },
    {
      $inc: { commentCount: 1 },
    }
  );
  return CommunityPosts.findById(postId).select(["author"]);
};

const queryComments = async ({ postId, limit, page, orderBy, sortedBy }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const comments = await CommunityComment.paginate(
    { postId },
    {
      ...(limit ? { limit } : { limit: 20 }),
      page,
      sort: { [orderBy]: sortedBy === "asc" ? 1 : -1 },
      ...options,
      populate: { path: "author", select: "_id username avatar name" },
    }
  );
  return comments;
};

const updateComment = async (id, content) => {
  const comment = await CommunityComment.updateOne(
    { _id: id },
    { content },
    { new: true }
  );
  return comment;
};

const deleteComment = async (commentId) => {
  const comment = await CommunityComment.findById(commentId);
  if (!comment) throw new Error("comment not found");

  const { parentId, postId } = comment;

  const post = await CommunityPosts.findById(postId);

  const { commentCount } = post;
  if (commentCount < 1) throw new Error("no comments");

  if (parentId) {
    await CommunityComment.findByIdAndUpdate(parentId, {
      $pull: { replies: comment._id },
      $inc: { replyCount: -1 },
    });
  }
  await CommunityPosts.findByIdAndUpdate(comment.postId, {
    $inc: { commentCount: -1 },
  }).lean();
  return CommunityComment.deleteOne({ _id: commentId });
};

module.exports = {
  createComment,
  queryComments,
  updateComment,
  deleteComment,
};
