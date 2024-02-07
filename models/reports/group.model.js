const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");

const schema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.user,
    required: true,
  },
  reportedMsg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.chat_groups_msg,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelNames.chat_groups,
  },
});
