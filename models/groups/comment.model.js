const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const schema = new mongoose.Schema({
  commenter: {
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
    ref: modelNames.group_comment,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.group_posts,
  },
});
