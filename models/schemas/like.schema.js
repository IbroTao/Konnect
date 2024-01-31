const mongoose = require("mongoose");
const modelNames = require("../../constants/modelNames");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
    },
    likedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { _id: false }
);

module.exports = likeSchema;
