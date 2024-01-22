const mongoose = require("mongoose");
const likeSchema = require("./likes.model");
const shareSchema = require("./share.model");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 1,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      required: true,
    },
    file: {
      type: mongoose.Schema.Types.Mixed,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    likes: [likeSchema],
    shares: [shareSchema],
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalShares: {
      type: Number,
      default: 0,
    },
    sharedPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group_posts",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.statics.hasUserLiked = async function (commentId, userId) {
  const result = await this.findOne({
    $and: [{ _id: commentId }, { likes: { $in: { userId } } }],
  });
  return !!result;
};

postSchema.statics.hasUserDisLiked = async function (commentId, userId) {
  const result = await this.findOne({
    $and: [{ _id: commentId }, { dislikes: { $in: { userID } } }],
  });
  return !!result;
};

const GroupPosts = mongoose.model("group_posts", postSchema);
module.exports = { GroupPosts };
