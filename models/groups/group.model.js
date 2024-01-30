const mongoose = require("mongoose");
const { toJSON } = require("../plugins");
const mongoosePaginate = require("mongoose-paginate-v2");
const modelNames = require("../../constants/modelNames");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
    },
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    id: false,
    _id: false,
  }
);
