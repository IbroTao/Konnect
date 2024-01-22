const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    _id: false,
  }
);

module.exports = shareSchema;
