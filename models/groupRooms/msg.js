const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");
const toJSON = require("../plugins/toJSON.plugin");

const readBy = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const schema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.chat_groups,
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.Mixed,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
      required: true,
    },
    readBy: [readBy],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
