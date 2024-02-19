const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: modelNames.user,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.community_comment,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.community_posts,
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
        ref: modelNames.user,
      },
    },
  ],
});

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const CommunityComment = mongoose.model(modelNames.community_comment, schema);
module.exports = { CommunityComment };
