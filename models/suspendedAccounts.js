const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const httpStatus = require("http-status");
const modelNames = require("../constants/modelNames");
const toJSON = require("./plugins/toJSON.plugin");
const DateCreator = require("../utils/dateCreator");
const ApiError = require("../utils/ApiError");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.user,
    },
    reason: {
      type: String,
    },
    duration: {
      type: String,
      default: "0",
      enum: ["24hours", "7days", "14days", "1month", "6months"],
      required: true,
    },
    releaseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);
