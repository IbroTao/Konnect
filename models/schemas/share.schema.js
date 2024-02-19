const mongoose = require("mongoose");
const modelNames = require("../../constants/modelNames");

const shareSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
    },
  },
  { _id: false }
);

module.exports = shareSchema;
