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
};
