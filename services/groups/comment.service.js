const myCustomLabels = require("../../utils/myCustomLabels");
const { GroupComment, GroupPosts } = require("../../models");

const createComment = async (postId, content, userId, parentId) => {
  let newComment = new GroupComment({
    author: userId,
    content,
    postId,
  });

  if (parentId) {
    const parentComment = await GroupComment.findOne({
      _id: userId,
      comments: parentId,
    });
    if (!parentComment) throw new Error("parent comment not found");

    newComment.parentId = parentId;

    await GroupComment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
    });
  }

  newComment = await newComment.save;

  await GroupComment.updateOne(
    { _id: postId },
    {
      $inc: { commentCount: 1 },
    }
  );
  return GroupPosts.findById(postId).select(["author"]);
};

const queryComments = async ({ postId, limit, page, orderBy, sortedBy }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const comments = await GroupComment.paginate(
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
  const comment = await GroupComment.updateOne(
    { _id: id },
    { content },
    { new: true }
  );
  return comment;
};

const deleteComment = async (commentId) => {
  const comment = await GroupComment.findById(commentId);
  if (!comment) throw new Error("comment not found");

  const { parentId, postId } = comment;

  const post = await GroupPosts.findById(postId);

  const { commentCount } = post;
  if (commentCount < 1) throw new Error("no comments");

  if (parentId) {
    await GroupComment.findByIdAndUpdate(parentId, {
      $pull: { replies: comment._id },
      $inc: { replyCount: -1 },
    });
  }
  await GroupPosts.findByIdAndUpdate(comment.postId, {
    $inc: { commentCount: -1 },
  }).lean();
  return GroupComment.deleteOne({ _id: commentId });
};

module.exports = {
  createComment,
  queryComments,
  updateComment,
  deleteComment,
};
