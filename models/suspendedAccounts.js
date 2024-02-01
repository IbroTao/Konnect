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

schema.pre("save", async function (next) {
  const user = this;
  if (user.duration === "24hours") {
    const releaseDate = DateCreator.add24hours(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "7days") {
    const releaseDate = DateCreator.add7days(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "14days") {
    const releaseDate = DateCreator.add14days(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "1month") {
    const releaseDate = DateCreator.add1month(new Date());
    user.releaseDate = releaseDate;
  } else if (user.duration === "6months") {
    const releaseDate = DateCreator.add6months(new Date());
    user.releaseDate = releaseDate;
  } else {
    next(
      ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "duration can only be ['24hours', '7days', '14days', '1month', '6months']"
      )
    );
  }
  next();
});

const suspendedAccounts = mongoose.model(modelNames.suspendedAccount);
module.exports = { suspendedAccounts };
