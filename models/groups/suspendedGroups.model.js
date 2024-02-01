const mongoose = require("mongoose");
const modelNames = require("../../constants/modelNames");
const mongoosePaginate = require("mongoose-paginate-v2");
const toJSON = require("../plugins/toJSON.plugin");
const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { toJSON } = require("../plugins");
const DateCreator = require("../../utils/dateCreator");

const schema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.group,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      enum: ["24hours", "7days", "1month", "6months"],
      default: "24hours",
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

schema.pre("save", async function (next) {
  const user = this;
  if (user.duration === "24hours") {
    const releaseDate = DateCreator.add24hours(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "7days") {
    const releaseDate = DateCreator.add7days(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "1month") {
    const releaseDate = DateCreator.add1month(new Date());
  }
});
