const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const likeSchema = require("../schemas/like.schema");
const shareSchema = require("../schemas/share.schema");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const schema = new mongoose.Schema({
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
});
