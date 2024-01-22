const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    likedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    _id: false,
  }
);

module.exports = likeSchema;
