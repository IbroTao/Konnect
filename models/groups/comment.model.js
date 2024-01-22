const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema.Types({
  author: {
    type: String,
    required: true,
    ref: "users",
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group_comments",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group_posts",
  },
  replyCount: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
});

const GroupComments = mongoose.model("group_comments", commentSchema);
module.exports = { GroupComments };
