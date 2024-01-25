const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../configs/tokenTypes");
const modelNames = require("../constants/modelNames");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: modelNames.user,
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.ACCESS,
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugins to convert mongoose to json
tokenSchema.plugin(toJSON);

const Token = mongoose.model(modelNames.token, tokenSchema);
module.exports = Token;
