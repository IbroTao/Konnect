const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const likeSchema = require("../schemas/like.schema");
const shareSchema = require("../schemas/share.schema");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 1,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.group,
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
      ref: modelNames.user,
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
      ref: modelNames.group_posts,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

schema.statics.hasUserLiked = async function (commentId, userId) {
  const result = await this.findOne({
    $and: [{ _id: commentId }, { likes: { $in: { userId } } }],
  });
  return !!result;
};

schema.statics.hasUserDisliked = async function (commentId, userId) {
  const result = await this.findOne({
    $and: [{ _id: commentId }, { dislikes: { $in: { userId } } }],
  });
  return !!result;
};

const groupPosts = mongoose.model(modelNames.group_posts, schema);
module.exports = { groupPosts };